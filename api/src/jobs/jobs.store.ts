import {
  CreateJobInput,
  JobRecord,
  JobSearchQuery,
} from './job.types';

/**
 * Jobs persistence contract. Memory and Prisma implementations share this surface.
 * All methods are async so Prisma can be the live path under JOBS_STORE=prisma.
 */
export abstract class JobsStore {
  abstract listPublished(): Promise<JobRecord[]>;
  abstract findById(id: string): Promise<JobRecord | undefined>;
  abstract findBySlug(slug: string): Promise<JobRecord | undefined>;
  abstract search(
    query: JobSearchQuery,
  ): Promise<{ items: JobRecord[]; nextCursor?: string; total: number }>;
  abstract related(job: JobRecord, limit?: number): Promise<JobRecord[]>;
  abstract categories(): Promise<string[]>;
  abstract dedupeKey(title: string, city: string): string;
  abstract findActiveDuplicate(
    title: string,
    city: string,
  ): Promise<JobRecord | undefined>;
  abstract createAndPublish(input: CreateJobInput): Promise<JobRecord>;
  abstract createFromPaste(
    rawText: string,
    contentLanguage: string,
    meta?: { employerId?: string; ownerUserId?: string; employerName?: string },
  ): Promise<JobRecord>;
  abstract listByStatus(status?: string): Promise<JobRecord[]>;
  abstract listByOwner(userId: string): Promise<JobRecord[]>;
  abstract listAll(): Promise<JobRecord[]>;
  abstract listByOwnerPaged(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{ items: JobRecord[]; total: number; page: number; limit: number }>;
  abstract setStatus(
    id: string,
    status: JobRecord['status'],
    note?: string,
  ): Promise<JobRecord | undefined>;
  abstract updateOwned(
    id: string,
    ownerUserId: string,
    patch: Partial<CreateJobInput> & { status?: JobRecord['status'] },
  ): Promise<JobRecord | undefined>;
  abstract softRemoveOwned(
    id: string,
    ownerUserId: string,
  ): Promise<JobRecord | undefined>;
  abstract report(id: string, reason: string): Promise<JobRecord | undefined>;
}
