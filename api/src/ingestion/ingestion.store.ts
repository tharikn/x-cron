import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ImportBatch, ImportRecord } from './ingestion.types';

@Injectable()
export class IngestionStore {
  private readonly batches = new Map<string, ImportBatch>();

  create(batch: ImportBatch): ImportBatch {
    this.batches.set(batch.id, batch);
    return batch;
  }

  get(id: string): ImportBatch | undefined {
    return this.batches.get(id);
  }

  listByOwner(userId: string): ImportBatch[] {
    return [...this.batches.values()]
      .filter((batch) => batch.ownerUserId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  update(batch: ImportBatch): ImportBatch {
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
