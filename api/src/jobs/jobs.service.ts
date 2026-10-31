import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthStore } from '../auth/auth.store';
import { AuthUser } from '../auth/auth.types';
import { CreateJobDto, PasteJobDto } from './dto/create-job.dto';
import { ModerateJobDto, ReportJobDto } from './dto/moderation.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { toPublicJob } from './jobs.mapper';
import { JobsMemoryStore } from './jobs.memory-store';
import { JobType } from './job.types';

@Injectable()
export class JobsService {
  constructor(
    private readonly store: JobsMemoryStore,
    private readonly authStore: AuthStore,
  ) {}

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

  createQuick(user: AuthUser, dto: CreateJobDto) {
    const employer = this.requireEmployer(user);
    const job = this.store.createAndPublish({
      ...dto,
      employerName: dto.employerName || employer.name,
      employerId: employer.id,
      ownerUserId: user.id,
      status: 'needs-review',
    });
    return toPublicJob(job);
  }

  createFromPaste(user: AuthUser, dto: PasteJobDto) {
    const employer = this.requireEmployer(user);
    const job = this.store.createFromPaste(dto.text, dto.contentLanguage || 'en', {
      employerId: employer.id,
      ownerUserId: user.id,
      employerName: employer.name,
    });
    return toPublicJob(job);
  }

  myJobs(user: AuthUser) {
    return {
      items: this.store.listByOwner(user.id).map(toPublicJob),
    };
  }

  moderationQueue(status = 'needs-review') {
    return {
      items: this.store.listByStatus(status).map((job) => ({
        ...toPublicJob(job),
        reportCount: job.reportCount ?? 0,
        moderationNote: job.moderationNote,
        ownerUserId: job.ownerUserId,
      })),
    };
  }

  approve(id: string, dto: ModerateJobDto) {
    const job = this.store.setStatus(id, 'published', dto.note);
    if (!job) throw new NotFoundException('Job not found');
    return toPublicJob(job);
  }

  reject(id: string, dto: ModerateJobDto) {
    const job = this.store.setStatus(id, 'rejected', dto.note || 'Rejected by moderator');
    if (!job) throw new NotFoundException('Job not found');
    return toPublicJob(job);
  }

  report(id: string, dto: ReportJobDto) {
    const job = this.store.report(id, dto.reason);
    if (!job) throw new NotFoundException('Job not found');
    return {
      ok: true,
      reportCount: job.reportCount ?? 0,
      status: job.status,
    };
  }

  private requireEmployer(user: AuthUser) {
    let employer = this.authStore.getEmployerByOwner(user.id);
    if (!employer) {
      if (!user.roles.includes('employer') && !user.roles.includes('admin')) {
        throw new ForbiddenException(
          'Create an employer profile before posting jobs',
        );
      }
      employer = this.authStore.createEmployer(
        user.id,
        user.displayName || 'Employer',
      );
    }
    return employer;
  }
}
