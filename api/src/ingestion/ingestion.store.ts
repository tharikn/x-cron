import { ImportBatch, ImportRecord } from './ingestion.types';

/**
 * Import-batch persistence contract (memory or Prisma via JOBS_STORE).
 */
export abstract class IngestionStore {
  abstract create(batch: ImportBatch): Promise<ImportBatch>;
  abstract get(id: string): Promise<ImportBatch | undefined>;
  abstract listByOwner(userId: string): Promise<ImportBatch[]>;
  abstract update(batch: ImportBatch): Promise<ImportBatch>;
  abstract newId(prefix: string): string;
  abstract findDuplicate(
    batch: ImportBatch,
    title: string,
    city?: string,
  ): ImportRecord | undefined;
}
