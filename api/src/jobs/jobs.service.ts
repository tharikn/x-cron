import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
  forwardRef,
} from '@nestjs/common';
import { AdsService } from '../ads/ads.service';
import { AuthStore } from '../auth/auth.store';
import { AuthUser } from '../auth/auth.types';
import { NotificationsService } from '../notifications/notifications.service';
import { OpsService } from '../ops/ops.service';
import { SiteService } from '../site/site.service';
import {
  CreateJobDto,
  PasteJobDto,
  UpdateJobDto,
} from './dto/create-job.dto';
import { ModerateJobDto, ReportJobDto } from './dto/moderation.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { toPublicJob } from './jobs.mapper';
import { JobsMemoryStore } from './jobs.memory-store';
import { JobRecord, JobType } from './job.types';

@Injectable()
export class JobsService {
  constructor(
    private readonly store: JobsMemoryStore,
    private readonly authStore: AuthStore,
    private readonly site: SiteService,
    @Optional()
    @Inject(forwardRef(() => NotificationsService))
    private readonly notifications?: NotificationsService,
    @Optional()
    @Inject(forwardRef(() => AdsService))
    private readonly ads?: AdsService,
    @Optional() private readonly ops?: OpsService,
  ) {}

  /** Public DTO with live SiteConfig unlock price. */
  private publicJob(
    job: JobRecord,
    boost?: { badge: string; endsAt: string } | null,
  ) {
    return toPublicJob(job, boost, this.site.getUnlockPricePaise());
  }

  search(query: SearchJobsDto) {
    this.ops?.recordSearch();
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

    const boosts = this.ads?.activeBoosts() ?? new Map();
    let items = result.items.map((job) =>
      this.publicJob(job, boosts.get(job.id) ?? null),
    );
    if (query.sort === 'newest' || query.sort === 'relevance' || !query.sort) {
      items = [
        ...items.filter((j) => j.promoted),
        ...items.filter((j) => !j.promoted),
      ];
    }

    return {
      items,
      sponsored: items.filter((j) => j.promoted),
      nextCursor: result.nextCursor,
    };
  }

  getById(id: string) {
    const job = this.store.findById(id);
    if (!job || !this.isPubliclyListed(job)) {
      throw new NotFoundException('Job not found');
    }
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  getBySlug(slug: string) {
    const job = this.store.findBySlug(slug);
    if (!job || !this.isPubliclyListed(job)) {
      throw new NotFoundException('Job not found');
    }
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  related(id: string) {
    const job = this.store.findById(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    const boosts = this.ads?.activeBoosts() ?? new Map();
    return this.store
      .related(job)
      .map((item) => this.publicJob(item, boosts.get(item.id) ?? null));
  }

  categories() {
    return { items: this.store.categories() };
  }

  createQuick(user: AuthUser, dto: CreateJobDto) {
    const employer = this.requireEmployer(user);
    try {
      const job = this.store.createAndPublish({
        ...dto,
        employerName: dto.employerName || employer.name,
        employerId: employer.id,
        ownerUserId: user.id,
        status: 'needs-review',
      });
      return this.publicJob(job);
    } catch (error) {
      this.rethrowDuplicate(error);
    }
  }

  createFromPaste(user: AuthUser, dto: PasteJobDto) {
    const employer = this.requireEmployer(user);
    try {
      const job = this.store.createFromPaste(dto.text, dto.contentLanguage || 'en', {
        employerId: employer.id,
        ownerUserId: user.id,
        employerName: employer.name,
      });
      return this.publicJob(job);
    } catch (error) {
      this.rethrowDuplicate(error);
    }
  }

  myJobs(user: AuthUser, page = 1, limit = 10) {
    const result = this.store.listByOwnerPaged(user.id, page, limit);
    const boosts = this.ads?.activeBoosts() ?? new Map();
    return {
      items: result.items.map((job) =>
        this.publicJob(job, boosts.get(job.id) ?? null),
      ),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.max(1, Math.ceil(result.total / result.limit)),
    };
  }

  updateMyJob(user: AuthUser, id: string, dto: UpdateJobDto) {
    const job = this.store.updateOwned(id, user.id, dto);
    if (!job) throw new NotFoundException('Job not found');
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  activateMyJob(user: AuthUser, id: string) {
    const job = this.store.updateOwned(id, user.id, { status: 'published' });
    if (!job) throw new NotFoundException('Job not found');
    this.ops?.recordPublish();
    void this.notifications?.onJobPublished(job.id);
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  deactivateMyJob(user: AuthUser, id: string) {
    const job = this.store.updateOwned(id, user.id, { status: 'draft' });
    if (!job) throw new NotFoundException('Job not found');
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  hideMyJob(user: AuthUser, id: string) {
    const job = this.store.updateOwned(id, user.id, { status: 'removed' });
    if (!job) throw new NotFoundException('Job not found');
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  deleteMyJob(user: AuthUser, id: string) {
    const job = this.store.softRemoveOwned(id, user.id);
    if (!job) throw new NotFoundException('Job not found');
    return { ok: true, id: job.id, status: job.status };
  }

  moderationQueue(status = 'needs-review') {
    let jobs = this.store.listByStatus(status);
    if (status === 'needs-review') {
      jobs = this.collapseReviewDuplicates(jobs);
    }
    return {
      items: jobs.map((job) => ({
        ...this.publicJob(job),
        reportCount: job.reportCount ?? 0,
        moderationNote: job.moderationNote,
        ownerUserId: job.ownerUserId,
      })),
    };
  }

  approve(id: string, dto: ModerateJobDto) {
    const job = this.store.setStatus(id, 'published', dto.note);
    if (!job) throw new NotFoundException('Job not found');
    this.rejectSiblingDuplicates(job);
    this.ops?.recordPublish();
    void this.notifications?.onJobPublished(job.id);
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  reject(id: string, dto: ModerateJobDto) {
    const job = this.store.setStatus(id, 'rejected', dto.note || 'Rejected by moderator');
    if (!job) throw new NotFoundException('Job not found');
    return this.publicJob(job);
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

  private isPubliclyListed(job: {
    status: string;
    effectiveFrom?: string;
    publishedAt: string;
    expiresAt: string;
  }): boolean {
    if (job.status !== 'published') return false;
    const now = Date.now();
    const from = Date.parse(job.effectiveFrom || job.publishedAt);
    const until = Date.parse(job.expiresAt);
    if (Number.isFinite(from) && now < from) return false;
    if (Number.isFinite(until) && now > until) return false;
    return true;
  }

  private collapseReviewDuplicates(jobs: JobRecord[]): JobRecord[] {
    const seen = new Set<string>();
    const unique: JobRecord[] = [];
    for (const job of jobs) {
      const key = this.store.dedupeKey(job.title, job.location.city);
      if (seen.has(key)) {
        this.store.setStatus(job.id, 'rejected', 'Auto-rejected as duplicate');
        continue;
      }
      seen.add(key);
      unique.push(job);
    }
    return unique;
  }

  private rejectSiblingDuplicates(job: JobRecord): void {
    const key = this.store.dedupeKey(job.title, job.location.city);
    for (const other of this.store.listByStatus('needs-review')) {
      if (other.id === job.id) continue;
      if (this.store.dedupeKey(other.title, other.location.city) !== key) continue;
      this.store.setStatus(other.id, 'rejected', 'Auto-rejected as duplicate');
    }
  }

  private rethrowDuplicate(error: unknown): never {
    if (error instanceof Error && error.message === 'DUPLICATE_JOB') {
      throw new BadRequestException(
        'A similar job is already waiting for review or published.',
      );
    }
    throw error;
  }
}
