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
import { ApplicationsService } from '../applications/applications.service';
import type { HiringActivitySummary } from '../applications/hiring-activity.util';
import { AuthStore } from '../auth/auth.store';
import { AuthUser } from '../auth/auth.types';
import { CompaniesService } from '../companies/companies.service';
import { ModerationService } from '../moderation/moderation.service';
import { NotificationsService } from '../notifications/notifications.service';
import { OpsService } from '../ops/ops.service';
import { CacheService } from '../redis/cache.service';
import { SeekerService } from '../seeker/seeker.service';
import { SiteService } from '../site/site.service';
import { TrackingService } from '../tracking/tracking.service';
import {
  CreateJobDto,
  PasteJobDto,
  UpdateJobDto,
} from './dto/create-job.dto';
import { ModerateJobDto, ReportJobDto } from './dto/moderation.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { JobAnalyticsService } from './analytics/job-analytics.service';
import { JobsLifecycleService } from './jobs.lifecycle';
import { attachMatchReasons, matchContextFromQuery } from './jobs-search.util';
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
    private readonly analytics: JobAnalyticsService,
    private readonly lifecycle: JobsLifecycleService,
    @Optional() private readonly cache?: CacheService,
    @Optional()
    @Inject(forwardRef(() => NotificationsService))
    private readonly notifications?: NotificationsService,
    @Optional()
    @Inject(forwardRef(() => AdsService))
    private readonly ads?: AdsService,
    @Optional()
    @Inject(forwardRef(() => ApplicationsService))
    private readonly applications?: ApplicationsService,
    @Optional()
    @Inject(forwardRef(() => CompaniesService))
    private readonly companies?: CompaniesService,
    @Optional()
    @Inject(forwardRef(() => SeekerService))
    private readonly seeker?: SeekerService,
    @Optional()
    @Inject(forwardRef(() => ModerationService))
    private readonly moderation?: ModerationService,
    @Optional() private readonly ops?: OpsService,
    @Optional() private readonly tracking?: TrackingService,
  ) {}

  private async bustJobCache(job: {
    id: string;
    slug?: string | null;
    employerId?: string | null;
  }) {
    await this.cache?.invalidateJobPublic(job);
  }

  /** Public DTO with live SiteConfig unlock price + optional hiring-activity badge. */
  private publicJob(
    job: JobRecord,
    boost?: { badge: string; endsAt: string } | null,
    hiring?: HiringActivitySummary | null,
  ) {
    return toPublicJob(
      job,
      boost,
      this.site.getUnlockPricePaise(),
      hiring ?? null,
    );
  }

  private async hiringMap(
    jobIds: string[],
  ): Promise<Map<string, HiringActivitySummary>> {
    if (!this.applications || jobIds.length === 0) {
      return new Map();
    }
    return this.applications.summarizeHiringActivityForJobs(jobIds);
  }

  async search(
    query: SearchJobsDto & { excludeJobIds?: string[] },
    user?: AuthUser | null,
  ) {
    this.ops?.recordSearch();
    if (user?.id) {
      void this.tracking?.record({
        type: 'search',
        userId: user.id,
        meta: {
          keyword: (query.keyword ?? query.q)?.trim() || undefined,
          location: query.location,
        },
      });
    }
    const sort =
      query.sort ??
      (query.nearLat != null && query.nearLng != null ? 'distance' : 'newest');
    const keyword = (query.keyword ?? query.q)?.trim() || undefined;

    let excludeJobIds = query.excludeJobIds ?? [];
    let seekerSkills: string[] | undefined;
    let preferredLocations: string[] | undefined;
    let remotePreferred: boolean | undefined;
    if (user && this.seeker) {
      const hints = await this.seeker.discoveryHints(user);
      excludeJobIds = [...new Set([...excludeJobIds, ...hints.hiddenJobIds])];
      seekerSkills = hints.skills.length ? hints.skills : undefined;
      preferredLocations = hints.preferredLocations.length
        ? hints.preferredLocations
        : undefined;
      remotePreferred = hints.remotePreferred || undefined;
    }

    const searchQuery: import('./job.types').JobSearchQuery = {
      keyword,
      locationText: query.location,
      jobType: (query.jobType as JobType | '') || '',
      category: query.category,
      language: query.language,
      salaryMin: query.salaryMin ?? null,
      remote: query.remote ?? null,
      postedWithin: query.postedWithin || null,
      nearLat: query.nearLat ?? null,
      nearLng: query.nearLng ?? null,
      radiusKm: query.radiusKm ?? null,
      walkInOnly: query.walkInOnly ?? null,
      skills: query.skills,
      verifiedEmployer: query.verifiedEmployer ?? null,
      fresher: query.fresher ?? null,
      easyApply: query.easyApply ?? null,
      seekerSkills,
      preferredLocations,
      remotePreferred: remotePreferred ?? query.remote ?? null,
      excludeJobIds,
      sort,
      cursor: query.cursor,
      limit: query.limit,
    };

    const result = await this.store.search(searchQuery);
    const matchCtx = matchContextFromQuery(searchQuery);
    const ranked = attachMatchReasons(result.items as never, matchCtx);

    const boosts = this.ads?.activeBoosts() ?? new Map();
    const hiring = await this.hiringMap(ranked.map((j) => j.id));
    let items = ranked.map((job) => {
      const dto = this.publicJob(
        job,
        boosts.get(job.id) ?? null,
        hiring.get(job.id) ?? null,
      );
      const distanceKm =
        'distanceKm' in job &&
        typeof (job as { distanceKm?: number }).distanceKm === 'number'
          ? (job as { distanceKm: number }).distanceKm
          : undefined;
      const matchReasons =
        'matchReasons' in job &&
        Array.isArray((job as { matchReasons?: string[] }).matchReasons)
          ? (job as { matchReasons: string[] }).matchReasons
          : undefined;
      return {
        ...dto,
        ...(distanceKm != null ? { distanceKm } : {}),
        ...(matchReasons?.length ? { matchReasons } : {}),
      };
    });
    if (sort === 'newest' || sort === 'relevance' || !query.sort) {
      items = [
        ...items.filter((j) => j.promoted),
        ...items.filter((j) => !j.promoted),
      ];
    }

    return {
      items,
      sponsored: items.filter((j) => j.promoted),
      nextCursor: result.nextCursor,
      total: result.total,
    };
  }

  async getById(id: string) {
    const cacheKey = this.cache?.jobPublicKey(id);
    if (cacheKey && this.cache?.active) {
      const hit = await this.cache.getJson<ReturnType<JobsService['publicJob']>>(
        cacheKey,
      );
      if (hit) return hit;
    }
    let job = await this.store.findById(id);
    job = (await this.expireIfDue(job)) ?? job;
    if (!job || !this.isPubliclyListed(job)) {
      throw new NotFoundException('Job not found');
    }
    const hiring = await this.hiringMap([job.id]);
    const dto = this.publicJob(
      job,
      this.ads?.activeBoosts().get(job.id) ?? null,
      hiring.get(job.id) ?? null,
    );
    if (cacheKey && this.cache) {
      await this.cache.setJson(cacheKey, dto, this.cache.ttl.jobPublic);
      if (job.slug) {
        await this.cache.setJson(
          this.cache.jobPublicSlugKey(job.slug),
          dto,
          this.cache.ttl.jobPublic,
        );
      }
    }
    return dto;
  }

  async getBySlug(slug: string) {
    const cacheKey = this.cache?.jobPublicSlugKey(slug);
    if (cacheKey && this.cache?.active) {
      const hit = await this.cache.getJson<ReturnType<JobsService['publicJob']>>(
        cacheKey,
      );
      if (hit) return hit;
    }
    let job = await this.store.findBySlug(slug);
    job = (await this.expireIfDue(job)) ?? job;
    if (!job || !this.isPubliclyListed(job)) {
      throw new NotFoundException('Job not found');
    }
    const hiring = await this.hiringMap([job.id]);
    const dto = this.publicJob(
      job,
      this.ads?.activeBoosts().get(job.id) ?? null,
      hiring.get(job.id) ?? null,
    );
    if (this.cache?.active) {
      await this.cache.setJson(
        this.cache.jobPublicKey(job.id),
        dto,
        this.cache.ttl.jobPublic,
      );
      await this.cache.setJson(
        this.cache.jobPublicSlugKey(slug),
        dto,
        this.cache.ttl.jobPublic,
      );
    }
    return dto;
  }

  async related(id: string) {
    const job = await this.store.findById(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    const boosts = this.ads?.activeBoosts() ?? new Map();
    const related = await this.store.related(job);
    const hiring = await this.hiringMap(related.map((item) => item.id));
    return related.map((item) =>
      this.publicJob(
        item,
        boosts.get(item.id) ?? null,
        hiring.get(item.id) ?? null,
      ),
    );
  }

  async categories() {
    return { items: await this.store.categories() };
  }

  async createQuick(user: AuthUser, dto: CreateJobDto) {
    const employer = this.requireEmployer(user);
    try {
      // Recruiter direct-publish already reviewed client-side — do not re-enrich.
      const enriched = dto.directPublish
        ? {
            title: dto.title,
            employerName: dto.employerName || employer.name,
            locationCity: dto.locationCity,
            jobType: dto.jobType,
            salaryText: dto.salaryText,
            description: dto.description,
            contentLanguage: dto.contentLanguage,
          }
        : await this.ai.enrichJob({
            title: dto.title,
            employerName: dto.employerName || employer.name,
            locationCity: dto.locationCity,
            jobType: dto.jobType,
            salaryText: dto.salaryText,
            description: dto.description,
            contentLanguage: dto.contentLanguage,
          });
      const status = dto.directPublish ? 'published' : 'needs-review';
      const { directPublish: _directPublish, ...jobFields } = dto;
      const job = await this.store.createAndPublish({
        ...jobFields,
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
        status,
      });
      if (status === 'published') {
        this.ops?.recordPublish();
        void this.notifications?.onJobPublished(job.id);
      } else {
        this.notifyNeedsReview(job.id);
      }
      await this.bustJobCache(job);
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
      const status = dto.directPublish ? 'published' : 'needs-review';
      const job = await this.store.createFromPaste(
        textForStore,
        enriched.contentLanguage || dto.contentLanguage || 'en',
        {
          employerId: employer.id,
          ownerUserId: user.id,
          employerName: enriched.employerName || employer.name,
          status,
        },
      );
      if (status === 'published') {
        this.ops?.recordPublish();
        void this.notifications?.onJobPublished(job.id);
      } else {
        this.notifyNeedsReview(job.id);
      }
      await this.bustJobCache(job);
      return this.publicJob(job);
    } catch (error) {
      this.rethrowDuplicate(error);
    }
  }

  async myJobs(user: AuthUser, page = 1, limit = 10) {
    const companyIds = this.companies?.accessibleCompanyIds(user) ?? [];
    let items: JobRecord[] = [];
    if (companyIds.length) {
      const batches = await Promise.all(
        companyIds.map((id) => this.store.listByEmployer(id)),
      );
      const seen = new Set<string>();
      for (const batch of batches) {
        for (const job of batch) {
          if (seen.has(job.id)) continue;
          seen.add(job.id);
          items.push(job);
        }
      }
    } else {
      items = await this.store.listByOwner(user.id);
    }
    items = items.sort((a, b) =>
      (b.publishedAt || '').localeCompare(a.publishedAt || ''),
    );
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const total = items.length;
    const slice = items.slice(
      (safePage - 1) * safeLimit,
      safePage * safeLimit,
    );
    const boosts = this.ads?.activeBoosts() ?? new Map();
    const stats = await this.analytics.summarizeForJobs(slice);
    return {
      items: slice.map((job) => ({
        ...this.publicJob(job, boosts.get(job.id) ?? null),
        analytics: stats.get(job.id) ?? {
          views: 0,
          applied: 0,
          appliedActive: 0,
          contacted: 0,
          daysLive: 0,
          reportCount: job.reportCount ?? 0,
          applyRatePct: null,
          contactRatePct: null,
        },
      })),
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    };
  }

  /** Public listing view — once per viewerKey per UTC day. */
  recordJobView(jobId: string, viewerKey: string) {
    return this.analytics.recordJobView(jobId, viewerKey);
  }

  /** Recruiter per-job analytics board (KPI totals + daily series). */
  async jobAnalytics(user: AuthUser, jobId: string, days = 30) {
    const job = await this.requireManageableJob(user, jobId, 'read');
    return this.analytics.dashboardForOwner(
      job.ownerUserId || user.id,
      jobId,
      days,
    );
  }

  async updateMyJob(user: AuthUser, id: string, dto: UpdateJobDto) {
    const existing = await this.requireManageableJob(user, id);
    // Status changes go through activate / deactivate / hide / renew /
    // admin moderation — employers must not PATCH past Blog Approval.
    const { status: _ignoredStatus, ...safeDto } = dto;
    const job = await this.store.updateOwned(
      id,
      existing.ownerUserId || user.id,
      safeDto,
    );
    if (!job) throw new NotFoundException('Job not found');
    await this.bustJobCache(job);
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  async activateMyJob(user: AuthUser, id: string) {
    const existing = await this.requireManageableJob(user, id);
    if (
      existing.status === 'needs-review' ||
      existing.status === 'rejected' ||
      existing.status === 'removed'
    ) {
      throw new BadRequestException(
        'This job cannot be activated until moderation completes',
      );
    }
    this.lifecycle.assertTransition(existing.status, 'published', 'employer');
    const job = await this.store.updateOwned(
      id,
      existing.ownerUserId || user.id,
      { status: 'published' },
    );
    if (!job) throw new NotFoundException('Job not found');
    this.ops?.recordPublish();
    void this.notifications?.onJobPublished(job.id);
    await this.bustJobCache(job);
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  async deactivateMyJob(user: AuthUser, id: string) {
    const existing = await this.requireManageableJob(user, id);
    this.lifecycle.assertTransition(existing.status, 'draft', 'employer');
    const job = await this.store.updateOwned(
      id,
      existing.ownerUserId || user.id,
      { status: 'draft' },
    );
    if (!job) throw new NotFoundException('Job not found');
    await this.bustJobCache(job);
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  async hideMyJob(user: AuthUser, id: string) {
    const existing = await this.requireManageableJob(user, id);
    this.lifecycle.assertTransition(existing.status, 'removed', 'employer');
    const job = await this.store.updateOwned(
      id,
      existing.ownerUserId || user.id,
      { status: 'removed' },
    );
    if (!job) throw new NotFoundException('Job not found');
    await this.bustJobCache(job);
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  async deleteMyJob(user: AuthUser, id: string) {
    const existing = await this.requireManageableJob(user, id);
    const job = await this.store.softRemoveOwned(
      id,
      existing.ownerUserId || user.id,
    );
    if (!job) throw new NotFoundException('Job not found');
    await this.bustJobCache(job);
    return { ok: true, id: job.id, status: job.status };
  }

  /** Extend listing by 30 days and republish if expired/draft. */
  async renewMyJob(user: AuthUser, id: string) {
    const expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const existing = await this.requireManageableJob(user, id);
    const shouldPublish =
      existing.status === 'expired' ||
      existing.status === 'draft' ||
      existing.status === 'published';
    if (shouldPublish) {
      this.lifecycle.assertTransition(existing.status, 'published', 'employer');
    }
    const job = await this.store.updateOwned(
      id,
      existing.ownerUserId || user.id,
      {
        expiresAt,
        status: shouldPublish ? 'published' : existing.status,
        effectiveFrom: new Date().toISOString(),
      },
    );
    if (!job) throw new NotFoundException('Job not found');
    if (job.status === 'published') {
      this.ops?.recordPublish();
      void this.notifications?.onJobPublished(job.id);
    }
    await this.bustJobCache(job);
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  async publicEmployer(employerId: string) {
    const cacheKey = this.cache?.companyPublicKey(employerId);
    if (cacheKey && this.cache?.active) {
      const hit = await this.cache.getJson<Record<string, unknown>>(cacheKey);
      if (hit) return hit;
    }
    const employer = this.authStore.getEmployer(employerId);
    if (!employer) throw new NotFoundException('Employer not found');
    const boosts = this.ads?.activeBoosts() ?? new Map();
    const published = (await this.store.listPublished()).filter(
      (job) => job.employerId === employerId,
    );
    const dto = {
      id: employer.id,
      name: employer.name,
      slug: employer.slug ?? employer.id,
      about: employer.about ?? null,
      logoUrl: employer.logoUrl ?? null,
      website: employer.website ?? null,
      industry: employer.industry ?? null,
      sizeBand: employer.sizeBand ?? null,
      headquarters: employer.headquarters ?? null,
      hiringLocations: employer.hiringLocations ?? [],
      verificationStatus: employer.verificationStatus,
      verified: employer.verificationStatus === 'verified',
      jobs: published.map((job) =>
        this.publicJob(job, boosts.get(job.id) ?? null),
      ),
    };
    if (cacheKey && this.cache) {
      await this.cache.setJson(cacheKey, dto, this.cache.ttl.companyPublic);
    }
    return dto;
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
    await this.bustJobCache(job);
    return {
      ...this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null),
      contactWebsite: job.privateContact?.website || null,
      reportCount: job.reportCount ?? 0,
      moderationNote: job.moderationNote,
      ownerUserId: job.ownerUserId,
    };
  }

  async approve(id: string, dto: ModerateJobDto) {
    const existing = await this.store.findById(id);
    if (!existing) throw new NotFoundException('Job not found');
    this.lifecycle.assertTransition(existing.status, 'published', 'admin');
    const job = await this.store.setStatus(id, 'published', dto.note);
    if (!job) throw new NotFoundException('Job not found');
    await this.rejectSiblingDuplicates(job);
    this.ops?.recordPublish();
    void this.notifications?.onJobPublished(job.id);
    await this.bustJobCache(job);
    void this.moderation?.onJobModerated(
      dto.actorId,
      id,
      'approve',
      dto.note || 'Approved',
    );
    return this.publicJob(job, this.ads?.activeBoosts().get(job.id) ?? null);
  }

  async reject(id: string, dto: ModerateJobDto) {
    const existing = await this.store.findById(id);
    if (!existing) throw new NotFoundException('Job not found');
    this.lifecycle.assertTransition(existing.status, 'rejected', 'admin');
    const job = await this.store.setStatus(
      id,
      'rejected',
      dto.note || 'Rejected by moderator',
    );
    if (!job) throw new NotFoundException('Job not found');
    await this.bustJobCache(job);
    void this.moderation?.onJobModerated(
      dto.actorId,
      id,
      'reject',
      dto.note || 'Rejected by moderator',
    );
    return this.publicJob(job);
  }

  async removeForModeration(id: string, dto: ModerateJobDto) {
    const existing = await this.store.findById(id);
    if (!existing) throw new NotFoundException('Job not found');
    this.lifecycle.assertTransition(existing.status, 'removed', 'admin');
    const job = await this.store.setStatus(
      id,
      'removed',
      dto.note || 'Removed by moderator',
    );
    if (!job) throw new NotFoundException('Job not found');
    await this.bustJobCache(job);
    void this.moderation?.onJobModerated(
      dto.actorId,
      id,
      'remove',
      dto.note || 'Removed by moderator',
    );
    return this.publicJob(job);
  }

  /**
   * Flip `published` jobs past `expiresAt` to `expired`.
   * Called by JobsScheduler and on public detail reads.
   */
  async expireDueJobs(): Promise<number> {
    const now = Date.now();
    let count = 0;
    for (const job of await this.store.listAll()) {
      if (job.status !== 'published') continue;
      if (!this.lifecycle.isPastExpiry(job, now)) continue;
      this.lifecycle.assertTransition(job.status, 'expired', 'system');
      await this.store.setStatus(
        job.id,
        'expired',
        'Auto-expired: listing window ended',
      );
      await this.bustJobCache(job);
      count += 1;
    }
    return count;
  }

  /** If published and past expiresAt, persist `expired` and return the updated row. */
  async expireIfDue(
    job: JobRecord | undefined,
  ): Promise<JobRecord | undefined> {
    if (!job || job.status !== 'published') return job;
    if (!this.lifecycle.isPastExpiry(job)) return job;
    this.lifecycle.assertTransition(job.status, 'expired', 'system');
    const expired =
      (await this.store.setStatus(
        job.id,
        'expired',
        'Auto-expired: listing window ended',
      )) ?? job;
    await this.bustJobCache(expired);
    return expired;
  }

  async report(id: string, dto: ReportJobDto, reporter?: AuthUser) {
    const existing = await this.store.findById(id);
    if (!existing) throw new NotFoundException('Job not found');
    if (this.moderation) {
      return this.moderation.createReport(reporter, {
        targetType: 'job',
        targetId: id,
        category: dto.category || 'other',
        details: dto.details || dto.reason,
        reason: dto.reason,
      });
    }
    const reason = (dto.details || dto.reason || 'Reported').slice(0, 500);
    const job = await this.store.report(id, reason);
    if (!job) throw new NotFoundException('Job not found');
    return {
      ok: true,
      reportCount: job.reportCount ?? 0,
      status: job.status,
      acknowledgement: 'Thanks — your report was received.',
    };
  }

  /** Open a new_job_review case when a job lands in needs-review. */
  notifyNeedsReview(jobId: string) {
    void this.moderation?.ensureJobReviewCase(jobId);
  }

  private requireEmployer(user: AuthUser) {
    // Prefer owned company; else first active membership (for invited recruiters).
    let employer = this.authStore.getEmployerByOwner(user.id);
    if (!employer && this.companies) {
      const primary = this.companies.primaryCompanyFor(user);
      if (primary) {
        employer = this.authStore.getEmployer(primary.id);
      }
    }
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
    this.companies?.resolveAccess(user, employer.id);
    return employer;
  }

  /**
   * Company-scoped job access. Cross-company jobs are never visible.
   * Revoked members fail immediately (no cached permission).
   */
  private async requireManageableJob(
    user: AuthUser,
    id: string,
    action: 'read' | 'manage_jobs' = 'manage_jobs',
  ): Promise<JobRecord> {
    const existing = await this.store.findById(id);
    if (!existing) throw new NotFoundException('Job not found');
    if (user.roles.includes('admin')) return existing;
    if (!existing.employerId) {
      if (existing.ownerUserId !== user.id) {
        throw new NotFoundException('Job not found');
      }
      return existing;
    }
    if (!this.companies) {
      if (existing.ownerUserId !== user.id) {
        throw new NotFoundException('Job not found');
      }
      return existing;
    }
    try {
      this.companies.requireAction(user, existing.employerId, action);
    } catch {
      throw new NotFoundException('Job not found');
    }
    return existing;
  }

  private isPubliclyListed(job: {
    status: string;
    effectiveFrom?: string;
    publishedAt: string;
    expiresAt: string;
  }): boolean {
    if (job.status !== 'published') return false;
    return this.lifecycle.isListingWindowOpen(job);
  }

  private async collapseReviewDuplicates(jobs: JobRecord[]): Promise<JobRecord[]> {
    const seen = new Set<string>();
    const unique: JobRecord[] = [];
    for (const job of jobs) {
      const key = this.store.dedupeKey(job.title, job.location.city);
      if (seen.has(key)) {
        this.lifecycle.assertTransition(job.status, 'rejected', 'system');
        await this.store.setStatus(
          job.id,
          'rejected',
          'Auto-rejected as duplicate',
        );
        void this.moderation?.ensureDuplicateCase(
          job.id,
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
      this.lifecycle.assertTransition(other.status, 'rejected', 'system');
      await this.store.setStatus(
        other.id,
        'rejected',
        'Auto-rejected as duplicate',
      );
      void this.moderation?.ensureDuplicateCase(
        other.id,
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
