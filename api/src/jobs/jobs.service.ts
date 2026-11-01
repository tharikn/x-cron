import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
  forwardRef,
} from '@nestjs/common';
import { AiService } from '../ai/ai.service';
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
import { JobsStore } from './jobs.store';
import { JobRecord, JobType } from './job.types';

@Injectable()
export class JobsService {
  constructor(
    private readonly store: JobsStore,
    private readonly authStore: AuthStore,
    private readonly site: SiteService,
    private readonly ai: AiService,
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

  async search(query: SearchJobsDto) {
    this.ops?.recordSearch();
    const result = await this.store.search({
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

  async getById(id: string) {
    const job = await this.store.findById(id);
    if (!job || !this.isPubliclyListed(job)) {
      throw new NotFoundException('Job not found');
    }
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  async getBySlug(slug: string) {
    const job = await this.store.findBySlug(slug);
    if (!job || !this.isPubliclyListed(job)) {
      throw new NotFoundException('Job not found');
    }
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  async related(id: string) {
    const job = await this.store.findById(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    const boosts = this.ads?.activeBoosts() ?? new Map();
    const related = await this.store.related(job);
    return related.map((item) =>
      this.publicJob(item, boosts.get(item.id) ?? null),
    );
  }

  async categories() {
    return { items: await this.store.categories() };
  }

  async createQuick(user: AuthUser, dto: CreateJobDto) {
    const employer = this.requireEmployer(user);
    try {
      const enriched = await this.ai.enrichJob({
        title: dto.title,
        employerName: dto.employerName || employer.name,
        locationCity: dto.locationCity,
        jobType: dto.jobType,
        salaryText: dto.salaryText,
        description: dto.description,
        contentLanguage: dto.contentLanguage,
      });
      const job = await this.store.createAndPublish({
        ...dto,
        title: enriched.title || dto.title,
        employerName:
          enriched.employerName || dto.employerName || employer.name,
        locationCity: enriched.locationCity || dto.locationCity,
        jobType: (enriched.jobType as JobType) || dto.jobType,
        salaryText: enriched.salaryText || dto.salaryText,
        description: enriched.description || dto.description,
        contentLanguage: enriched.contentLanguage || dto.contentLanguage,
        employerId: employer.id,
        ownerUserId: user.id,
        status: 'needs-review',
      });
      return this.publicJob(job);
    } catch (error) {
      this.rethrowDuplicate(error);
    }
  }

  async createFromPaste(user: AuthUser, dto: PasteJobDto) {
    const employer = this.requireEmployer(user);
    try {
      const enriched = await this.ai.enrichJob({
        rawText: dto.text,
        description: dto.text,
        contentLanguage: dto.contentLanguage || 'en',
        employerName: employer.name,
      });
      const textForStore = enriched.cleaned
        ? [
            enriched.title,
            enriched.employerName,
            enriched.locationCity,
            enriched.salaryText,
            enriched.description,
          ]
            .filter(Boolean)
            .join('\n')
        : dto.text;
      const job = await this.store.createFromPaste(
        textForStore,
        enriched.contentLanguage || dto.contentLanguage || 'en',
        {
          employerId: employer.id,
          ownerUserId: user.id,
          employerName: enriched.employerName || employer.name,
        },
      );
      return this.publicJob(job);
    } catch (error) {
      this.rethrowDuplicate(error);
    }
  }

  async myJobs(user: AuthUser, page = 1, limit = 10) {
    const result = await this.store.listByOwnerPaged(user.id, page, limit);
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

  async updateMyJob(user: AuthUser, id: string, dto: UpdateJobDto) {
    const job = await this.store.updateOwned(id, user.id, dto);
    if (!job) throw new NotFoundException('Job not found');
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  async activateMyJob(user: AuthUser, id: string) {
    const job = await this.store.updateOwned(id, user.id, { status: 'published' });
    if (!job) throw new NotFoundException('Job not found');
    this.ops?.recordPublish();
    void this.notifications?.onJobPublished(job.id);
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  async deactivateMyJob(user: AuthUser, id: string) {
    const job = await this.store.updateOwned(id, user.id, { status: 'draft' });
    if (!job) throw new NotFoundException('Job not found');
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  async hideMyJob(user: AuthUser, id: string) {
    const job = await this.store.updateOwned(id, user.id, { status: 'removed' });
    if (!job) throw new NotFoundException('Job not found');
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  async deleteMyJob(user: AuthUser, id: string) {
    const job = await this.store.softRemoveOwned(id, user.id);
    if (!job) throw new NotFoundException('Job not found');
    return { ok: true, id: job.id, status: job.status };
  }

  async moderationQueue(status = 'needs-review') {
    let jobs = await this.store.listByStatus(status);
    if (status === 'needs-review') {
      jobs = await this.collapseReviewDuplicates(jobs);
    }
    return {
      items: jobs.map((job) => ({
        ...this.publicJob(job),
        contactWebsite: job.privateContact?.website || null,
        reportCount: job.reportCount ?? 0,
        moderationNote: job.moderationNote,
        ownerUserId: job.ownerUserId,
      })),
    };
  }

  /** Admin moderation edit — any needs-review (or owned) job, not only caller's posts. */
  async updateForModeration(id: string, dto: UpdateJobDto) {
    const existing = await this.store.findById(id);
    if (!existing?.ownerUserId) throw new NotFoundException('Job not found');
    const job = await this.store.updateOwned(id, existing.ownerUserId, dto);
    if (!job) throw new NotFoundException('Job not found');
    return {
      ...this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null),
      contactWebsite: job.privateContact?.website || null,
      reportCount: job.reportCount ?? 0,
      moderationNote: job.moderationNote,
      ownerUserId: job.ownerUserId,
    };
  }

  async approve(id: string, dto: ModerateJobDto) {
    const job = await this.store.setStatus(id, 'published', dto.note);
    if (!job) throw new NotFoundException('Job not found');
    await this.rejectSiblingDuplicates(job);
    this.ops?.recordPublish();
    void this.notifications?.onJobPublished(job.id);
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  async reject(id: string, dto: ModerateJobDto) {
    const job = await this.store.setStatus(
      id,
      'rejected',
      dto.note || 'Rejected by moderator',
    );
    if (!job) throw new NotFoundException('Job not found');
    return this.publicJob(job);
  }

  async report(id: string, dto: ReportJobDto) {
    const job = await this.store.report(id, dto.reason);
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

  private async collapseReviewDuplicates(jobs: JobRecord[]): Promise<JobRecord[]> {
    const seen = new Set<string>();
    const unique: JobRecord[] = [];
    for (const job of jobs) {
      const key = this.store.dedupeKey(job.title, job.location.city);
      if (seen.has(key)) {
        await this.store.setStatus(
          job.id,
          'rejected',
          'Auto-rejected as duplicate',
        );
        continue;
      }
      seen.add(key);
      unique.push(job);
    }
    return unique;
  }

  private async rejectSiblingDuplicates(job: JobRecord): Promise<void> {
    const key = this.store.dedupeKey(job.title, job.location.city);
    for (const other of await this.store.listByStatus('needs-review')) {
      if (other.id === job.id) continue;
      if (this.store.dedupeKey(other.title, other.location.city) !== key) continue;
      await this.store.setStatus(
        other.id,
        'rejected',
        'Auto-rejected as duplicate',
      );
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
