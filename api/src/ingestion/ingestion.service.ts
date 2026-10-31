import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { AuthStore } from '../auth/auth.store';
import type { AuthUser } from '../auth/auth.types';
import { JobsMemoryStore } from '../jobs/jobs.memory-store';
import { JobType } from '../jobs/job.types';
import { OpsService } from '../ops/ops.service';
import { ApproveRecordsDto, CreateImportBatchDto, TextUploadDto } from './dto/ingestion.dto';
import { IngestionStore } from './ingestion.store';
import { ImportBatch, ImportRecord } from './ingestion.types';
import { ParserRegistry } from './parsers/parser.registry';
import { SourceType } from './parsers/parser.types';

@Injectable()
export class IngestionService {
  constructor(
    private readonly store: IngestionStore,
    private readonly parsers: ParserRegistry,
    private readonly authStore: AuthStore,
    private readonly jobsStore: JobsMemoryStore,
    @Optional() private readonly ops?: OpsService,
  ) {}

  createBatch(user: AuthUser, dto: CreateImportBatchDto) {
    this.assertImportQuota();
    const employer = this.requireEmployer(user);
    const now = new Date().toISOString();
    const batch: ImportBatch = {
      id: this.store.newId('batch'),
      employerId: employer.id,
      ownerUserId: user.id,
      employerName: employer.name,
      status: 'queued',
      sourceType: dto.sourceType || 'unknown',
      filename: '',
      totalRecords: 0,
      processedRecords: 0,
      errorCount: 0,
      warnings: [],
      createdAt: now,
      updatedAt: now,
      records: [],
    };
    const created = this.store.create(batch);
    this.ops?.recordImport(0);
    return this.toPublicBatch(created);
  }

  listMine(user: AuthUser) {
    return { items: this.store.listByOwner(user.id).map((b) => this.toPublicBatch(b)) };
  }

  getBatch(user: AuthUser, id: string) {
    return this.toPublicBatch(this.requireOwnedBatch(user, id));
  }

  getRecords(user: AuthUser, id: string) {
    const batch = this.requireOwnedBatch(user, id);
    return {
      items: batch.records.map((record) => this.toPublicRecord(record)),
    };
  }

  async uploadText(user: AuthUser, id: string, dto: TextUploadDto) {
    const batch = this.requireOwnedBatch(user, id);
    batch.status = 'processing';
    this.store.update(batch);

    const sourceType = dto.sourceType || 'whatsapp';
    const filename = dto.filename || 'paste.txt';
    const parsed = await this.parsers.parse({
      sourceType,
      filename,
      text: dto.text,
    });

    this.applyParseResult(batch, sourceType, filename, parsed.drafts, parsed.warnings);
    if (parsed.pagesProcessed) this.ops?.recordOcrPages(parsed.pagesProcessed);
    return this.toPublicBatch(batch);
  }

  async uploadFile(
    user: AuthUser,
    id: string,
    file?: Express.Multer.File,
    sourceTypeHint?: string,
  ) {
    if (!file) {
      throw new BadRequestException('file is required');
    }
    const batch = this.requireOwnedBatch(user, id);
    batch.status = 'processing';
    this.store.update(batch);

    const sourceType = this.detectSourceType(file, sourceTypeHint);
    const text =
      sourceType === 'csv' || sourceType === 'text'
        ? file.buffer.toString('utf8')
        : undefined;

    const parsed = await this.parsers.parse({
      sourceType,
      filename: file.originalname || 'upload.bin',
      mimeType: file.mimetype,
      text,
      buffer: file.buffer,
    });

    this.applyParseResult(
      batch,
      sourceType,
      file.originalname || 'upload.bin',
      parsed.drafts,
      parsed.warnings,
    );
    if (parsed.pagesProcessed) this.ops?.recordOcrPages(parsed.pagesProcessed);
    return this.toPublicBatch(batch);
  }

  approve(user: AuthUser, id: string, dto: ApproveRecordsDto) {
    const batch = this.requireOwnedBatch(user, id);
    if (!dto.recordIds?.length) {
      throw new BadRequestException('recordIds required');
    }

    batch.status = 'publishing';
    this.store.update(batch);

    let published = 0;
    let failed = 0;

    for (const recordId of dto.recordIds) {
      const record = batch.records.find((item) => item.id === recordId);
      if (!record) {
        failed += 1;
        continue;
      }
      if (record.reviewStatus === 'duplicate') {
        record.error = 'Duplicate within batch';
        failed += 1;
        continue;
      }
      if (record.confidence < 0.35 && !record.extraction.title) {
        record.reviewStatus = 'needs_review';
        record.error = 'Confidence too low';
        failed += 1;
        continue;
      }

      const title = record.extraction.title || 'Untitled role';
      const locationCity = record.extraction.locationCity || 'Palani';
      const existing = this.jobsStore.findActiveDuplicate(title, locationCity);
      if (existing) {
        record.jobId = existing.id;
        record.dedupeStatus = 'duplicate';
        record.reviewStatus = 'duplicate';
        record.error = 'Duplicate of existing job';
        failed += 1;
        continue;
      }

      try {
        const job = this.jobsStore.createAndPublish({
          title,
          employerName:
            record.extraction.employerName || batch.employerName || 'Employer',
          locationCity,
          jobType: (record.extraction.jobType as JobType) || 'full-time',
          salaryText: record.extraction.salaryText,
          description: record.extraction.description || 'Not provided',
          contentLanguage: record.extraction.contentLanguage || 'en',
          contactPhone: record.extraction.contactPhone,
          contactEmail: record.extraction.contactEmail,
          contactWebsite: record.extraction.contactWebsite,
          employerId: batch.employerId,
          ownerUserId: batch.ownerUserId,
          status: 'needs-review',
        });
        record.jobId = job.id;
        record.reviewStatus = 'published';
        published += 1;
      } catch (error) {
        if (error instanceof Error && error.message === 'DUPLICATE_JOB') {
          record.dedupeStatus = 'duplicate';
          record.reviewStatus = 'duplicate';
          record.error = 'Duplicate of existing job';
        } else {
          record.error = error instanceof Error ? error.message : 'publish_failed';
        }
        failed += 1;
      }
    }

    batch.errorCount += failed;
    batch.status =
      failed && published
        ? 'partially_failed'
        : failed && !published
          ? 'failed'
          : 'completed';
    this.store.update(batch);

    return {
      batch: this.toPublicBatch(batch),
      published,
      failed,
    };
  }

  private applyParseResult(
    batch: ImportBatch,
    sourceType: SourceType,
    filename: string,
    drafts: ImportRecord['extraction'][],
    warnings: string[],
  ) {
    batch.sourceType = sourceType;
    batch.filename = filename;
    batch.warnings = [...batch.warnings, ...warnings];

    const records: ImportRecord[] = [];
    for (const draft of drafts) {
      const probeBatch = { ...batch, records: [...batch.records, ...records] };
      const title = draft.title || '';
      const city = draft.locationCity;
      const duplicateInBatch = this.store.findDuplicate(probeBatch, title, city);
      const duplicateJob = this.jobsStore.findActiveDuplicate(
        title || 'Untitled role',
        city || 'Palani',
      );
      const duplicate = duplicateInBatch || duplicateJob;
      records.push({
        id: this.store.newId('rec'),
        batchId: batch.id,
        sourceLocator: draft.sourceLocator,
        extraction: {
          ...draft,
          employerName: draft.employerName || batch.employerName,
        },
        confidence: draft.confidence,
        dedupeStatus: duplicate ? 'duplicate' : 'unique',
        reviewStatus: duplicate ? 'duplicate' : 'needs_review',
        jobId: duplicateJob?.id,
        createdAt: new Date().toISOString(),
        ...(duplicateJob
          ? { error: 'Duplicate of existing job' }
          : duplicateInBatch
            ? { error: 'Duplicate within batch' }
            : {}),
      });
    }

    batch.records = [...batch.records, ...records];
    batch.totalRecords = batch.records.length;
    batch.processedRecords = batch.records.length;
    batch.status = batch.records.length ? 'needs_review' : 'failed';
    if (!batch.records.length) {
      batch.warnings.push('No job records extracted');
    }
    this.store.update(batch);
  }

  private detectSourceType(
    file: Express.Multer.File,
    hint?: string,
  ): SourceType {
    if (hint && ['csv', 'text', 'image', 'pdf', 'docx', 'whatsapp', 'telegram'].includes(hint)) {
      return hint as SourceType;
    }
    const name = (file.originalname || '').toLowerCase();
    if (name.endsWith('.csv') || file.mimetype === 'text/csv') return 'csv';
    if (name.endsWith('.txt') || file.mimetype === 'text/plain') return 'text';
    if (name.endsWith('.pdf') || file.mimetype === 'application/pdf') return 'pdf';
    if (file.mimetype?.startsWith('image/') || /\.(png|jpe?g|webp|gif)$/i.test(name)) {
      return 'image';
    }
    return 'unknown';
  }

  private assertImportQuota() {
    if (!this.ops) return;
    const quotas = this.ops.quotas().items;
    const imports = quotas.find((q) => q.key === 'import_batches');
    if (imports && imports.used >= imports.limit) {
      throw new ForbiddenException('Daily import batch quota reached');
    }
  }

  private requireEmployer(user: AuthUser) {
    let employer = this.authStore.getEmployerByOwner(user.id);
    if (!employer) {
      if (!user.roles.includes('employer') && !user.roles.includes('admin')) {
        throw new ForbiddenException('Employer profile required');
      }
      employer = this.authStore.createEmployer(user.id, user.displayName || 'Employer');
    }
    return employer;
  }

  private requireOwnedBatch(user: AuthUser, id: string): ImportBatch {
    const batch = this.store.get(id);
    if (!batch) throw new NotFoundException('Batch not found');
    if (batch.ownerUserId !== user.id && !user.roles.includes('admin')) {
      throw new ForbiddenException('Not your import batch');
    }
    return batch;
  }

  private toPublicBatch(batch: ImportBatch) {
    return {
      id: batch.id,
      employerId: batch.employerId,
      status: batch.status,
      sourceType: batch.sourceType,
      filename: batch.filename,
      totalRecords: batch.totalRecords,
      processedRecords: batch.processedRecords,
      errorCount: batch.errorCount,
      warnings: batch.warnings,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
    };
  }

  private toPublicRecord(record: ImportRecord) {
    return {
      id: record.id,
      batchId: record.batchId,
      sourceLocator: record.sourceLocator,
      confidence: record.confidence,
      dedupeStatus: record.dedupeStatus,
      reviewStatus: record.reviewStatus,
      jobId: record.jobId,
      error: record.error,
      extraction: {
        title: record.extraction.title,
        employerName: record.extraction.employerName,
        locationCity: record.extraction.locationCity,
        jobType: record.extraction.jobType,
        salaryText: record.extraction.salaryText,
        description: record.extraction.description,
        contentLanguage: record.extraction.contentLanguage,
        hasPhone: !!record.extraction.contactPhone,
        hasEmail: !!record.extraction.contactEmail,
        hasWebsite: !!record.extraction.contactWebsite,
        notes: record.extraction.notes,
        // raw contact values stay server-side only
      },
      createdAt: record.createdAt,
    };
  }
}
