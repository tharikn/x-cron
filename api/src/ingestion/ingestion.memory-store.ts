import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ImportBatch, ImportRecord } from './ingestion.types';
import { IngestionStore } from './ingestion.store';

@Injectable()
export class IngestionMemoryStore extends IngestionStore {
  private readonly batches = new Map<string, ImportBatch>();

  async create(batch: ImportBatch): Promise<ImportBatch> {
    this.batches.set(batch.id, batch);
    return batch;
  }

  async get(id: string): Promise<ImportBatch | undefined> {
    return this.batches.get(id);
  }

  async listByOwner(userId: string): Promise<ImportBatch[]> {
    return [...this.batches.values()]
      .filter((batch) => batch.ownerUserId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async update(batch: ImportBatch): Promise<ImportBatch> {
    batch.updatedAt = new Date().toISOString();
    this.batches.set(batch.id, batch);
    return batch;
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
