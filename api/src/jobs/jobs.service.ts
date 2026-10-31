import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto, PasteJobDto } from './dto/create-job.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { toPublicJob } from './jobs.mapper';
import { JobsMemoryStore } from './jobs.memory-store';
import { JobType } from './job.types';

@Injectable()
export class JobsService {
  constructor(private readonly store: JobsMemoryStore) {}

  search(query: SearchJobsDto) {
    const result = this.store.search({
      keyword: query.keyword,
      locationText: query.location,
      jobType: (query.jobType as JobType | '') || '',
      category: query.category,
      language: query.language,
      salaryMin: query.salaryMin ?? null,
      sort: query.sort ?? 'newest',
      cursor: query.cursor,
      limit: query.limit,
    });

    return {
      items: result.items.map(toPublicJob),
      nextCursor: result.nextCursor,
    };
  }

  getById(id: string) {
    const job = this.store.findById(id);
    if (!job || job.status !== 'published') {
      throw new NotFoundException('Job not found');
    }
    return toPublicJob(job);
  }

  getBySlug(slug: string) {
    const job = this.store.findBySlug(slug);
    if (!job || job.status !== 'published') {
      throw new NotFoundException('Job not found');
    }
    return toPublicJob(job);
  }

  related(id: string) {
    const job = this.store.findById(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return this.store.related(job).map(toPublicJob);
  }

  categories() {
    return { items: this.store.categories() };
  }

  createQuick(dto: CreateJobDto) {
    const job = this.store.createAndPublish(dto);
    return toPublicJob(job);
  }

  createFromPaste(dto: PasteJobDto) {
    const job = this.store.createFromPaste(
      dto.text,
      dto.contentLanguage || 'en',
    );
    return toPublicJob(job);
  }

  /** Contact reveal — always denied in Step 1 without entitlement (AC-13/16). */
  getContact(_id: string) {
    return {
      allowed: false,
      reason: 'entitlement_required',
      message:
        'Contact details are private. A verified unlock or active subscription is required.',
    };
  }
}
