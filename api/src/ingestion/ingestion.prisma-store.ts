import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ExtractedJobDraft } from './parsers/parser.types';
import { ImportBatch, ImportRecord, BatchStatus, RecordReviewStatus } from './ingestion.types';
import { IngestionStore } from './ingestion.store';

type BatchRow = Prisma.ImportBatchGetPayload<{ include: { records: true } }>;

@Injectable()
export class IngestionPrismaStore extends IngestionStore {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private async ensureEmployer(batch: ImportBatch) {
    await this.prisma.user.upsert({
      where: { id: batch.ownerUserId },
      create: { id: batch.ownerUserId },
      update: {},
    });
    await this.prisma.employer.upsert({
      where: { id: batch.employerId },
      create: {
        id: batch.employerId,
        name: batch.employerName || 'Employer',
        ownerUserId: batch.ownerUserId,
      },
      update: {
        name: batch.employerName || 'Employer',
        ownerUserId: batch.ownerUserId,
      },
    });
  }

  private toRecord(row: BatchRow['records'][number]): ImportRecord {
    const extraction = (row.extractionJson ?? {}) as unknown as ExtractedJobDraft;
    return {
      id: row.id,
      batchId: row.batchId,
      sourceLocator: row.sourceLocator || '',
      extraction,
      confidence: row.confidence ?? 0,
      dedupeStatus: (row.dedupeStatus as ImportRecord['dedupeStatus']) || 'pending',
      reviewStatus: (row.reviewStatus as RecordReviewStatus) || 'needs_review',
      jobId: row.jobId || undefined,
      error: row.error || undefined,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private toBatch(row: BatchRow): ImportBatch {
    const warnings = Array.isArray(row.warningsJson)
      ? (row.warningsJson as string[])
      : [];
    return {
      id: row.id,
      employerId: row.employerId,
      ownerUserId: row.ownerUserId,
      employerName: row.employerName,
      status: row.status as BatchStatus,
      sourceType: row.sourceType as ImportBatch['sourceType'],
      filename: row.filename,
      totalRecords: row.totalRecords,
      processedRecords: row.processedRecords,
      errorCount: row.errorCount,
      warnings,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      records: row.records.map((record) => this.toRecord(record)),
    };
  }

  async create(batch: ImportBatch): Promise<ImportBatch> {
    await this.ensureEmployer(batch);
    const created = await this.prisma.importBatch.create({
      data: {
        id: batch.id,
        employerId: batch.employerId,
        ownerUserId: batch.ownerUserId,
        employerName: batch.employerName,
        status: batch.status,
        sourceType: batch.sourceType,
        filename: batch.filename,
        totalRecords: batch.totalRecords,
        processedRecords: batch.processedRecords,
        errorCount: batch.errorCount,
        warningsJson: batch.warnings,
      },
      include: { records: true },
    });
    return this.toBatch(created);
  }

  async get(id: string): Promise<ImportBatch | undefined> {
    const row = await this.prisma.importBatch.findUnique({
      where: { id },
      include: { records: { orderBy: { createdAt: 'asc' } } },
    });
    return row ? this.toBatch(row) : undefined;
  }

  async listByOwner(userId: string): Promise<ImportBatch[]> {
    const rows = await this.prisma.importBatch.findMany({
      where: { ownerUserId: userId },
      include: { records: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.toBatch(row));
  }

  async update(batch: ImportBatch): Promise<ImportBatch> {
    await this.ensureEmployer(batch);
    batch.updatedAt = new Date().toISOString();

    await this.prisma.$transaction(async (tx) => {
      await tx.importBatch.update({
        where: { id: batch.id },
        data: {
          status: batch.status,
          sourceType: batch.sourceType,
          filename: batch.filename,
          totalRecords: batch.totalRecords,
          processedRecords: batch.processedRecords,
          errorCount: batch.errorCount,
          warningsJson: batch.warnings,
          employerName: batch.employerName,
          ownerUserId: batch.ownerUserId,
        },
      });

      const existing = await tx.importRecord.findMany({
        where: { batchId: batch.id },
        select: { id: true },
      });
      const existingIds = new Set(existing.map((row) => row.id));
      const nextIds = new Set(batch.records.map((record) => record.id));

      const toDelete = [...existingIds].filter((id) => !nextIds.has(id));
      if (toDelete.length) {
        await tx.importRecord.deleteMany({
          where: { id: { in: toDelete } },
        });
      }

      for (const record of batch.records) {
        await tx.importRecord.upsert({
          where: { id: record.id },
          create: {
            id: record.id,
            batchId: batch.id,
            sourceLocator: record.sourceLocator,
            extractionJson: record.extraction as unknown as Prisma.InputJsonValue,
            confidence: record.confidence,
            dedupeStatus: record.dedupeStatus,
            reviewStatus: record.reviewStatus,
            jobId: record.jobId || null,
            error: record.error || null,
            createdAt: new Date(record.createdAt),
          },
          update: {
            sourceLocator: record.sourceLocator,
            extractionJson: record.extraction as unknown as Prisma.InputJsonValue,
            confidence: record.confidence,
            dedupeStatus: record.dedupeStatus,
            reviewStatus: record.reviewStatus,
            jobId: record.jobId || null,
            error: record.error || null,
          },
        });
      }
    });

    const refreshed = await this.get(batch.id);
    return refreshed ?? batch;
  }

  newId(prefix: string): string {
    return `${prefix}_${randomUUID().slice(0, 8)}`;
  }

  findDuplicate(
    batch: ImportBatch,
    title: string,
    city?: string,
  ): ImportRecord | undefined {
    const key = `${title.trim().toLowerCase()}|${(city || '').trim().toLowerCase()}`;
    return batch.records.find((record) => {
      const other = `${(record.extraction.title || '').trim().toLowerCase()}|${(
        record.extraction.locationCity || ''
      )
        .trim()
        .toLowerCase()}`;
      return other === key && record.reviewStatus !== 'rejected';
    });
  }
}
