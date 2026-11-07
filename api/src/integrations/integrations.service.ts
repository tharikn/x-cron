import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, timingSafeEqual } from 'crypto';
import { AuthStore } from '../auth/auth.store';
import type { AuthUser } from '../auth/auth.types';
import { IngestionService } from '../ingestion/ingestion.service';
import type { ExtractedJobDraft } from '../ingestion/parsers/parser.types';
import { CsvParser } from '../ingestion/parsers/csv.parser';
import { JobType } from '../jobs/job.types';
import { JobsStore } from '../jobs/jobs.store';
import {
  CreateApiKeyDto,
  CreateFeedDto,
  CreateWebhookDto,
  PartnerJobDto,
  PullSheetDto,
  UpdateFeedDto,
} from './dto/integrations.dto';
import {
  mapLooseJob,
  parseJsonFeed,
  parseXmlFeed,
} from './feed-parse.util';
import { IntegrationsStore } from './integrations.store';
import type { JobFeed, PartnerApiKey } from './integrations.types';

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);
  private readonly csvParser = new CsvParser();

  constructor(
    private readonly store: IntegrationsStore,
    private readonly authStore: AuthStore,
    private readonly jobsStore: JobsStore,
    private readonly ingestion: IngestionService,
  ) {}

  // ── Employer: API keys ──────────────────────────────────────────

  createApiKey(user: AuthUser, dto: CreateApiKeyDto) {
    const employer = this.requireEmployer(user);
    const minted = this.store.mintApiKeyRaw();
    const row = this.store.createApiKey({
      employerId: employer.id,
      ownerUserId: user.id,
      label: dto.label,
      autoPublish: !!dto.autoPublish,
      rawKey: minted.raw,
      keyPrefix: minted.prefix,
      keyHash: minted.hash,
    });
    return {
      id: row.id,
      label: row.label,
      keyPrefix: row.keyPrefix,
      autoPublish: row.autoPublish,
      createdAt: row.createdAt,
      /** Shown once — store client-side; API keeps only a hash. */
      apiKey: row.rawKey,
    };
  }

  listApiKeys(user: AuthUser) {
    return {
      items: this.store.listApiKeys(user.id).map((k) => ({
        id: k.id,
        label: k.label,
        keyPrefix: k.keyPrefix,
        autoPublish: k.autoPublish,
        lastUsedAt: k.lastUsedAt,
        createdAt: k.createdAt,
      })),
    };
  }

  revokeApiKey(user: AuthUser, id: string) {
    if (!this.store.revokeApiKey(id, user.id)) {
      throw new NotFoundException('API key not found');
    }
    return { ok: true };
  }

  // ── Employer: feeds ─────────────────────────────────────────────

  createFeed(user: AuthUser, dto: CreateFeedDto) {
    this.assertHttpsUrl(dto.url);
    const employer = this.requireEmployer(user);
    const feed = this.store.createFeed({
      employerId: employer.id,
      ownerUserId: user.id,
      label: dto.label,
      url: dto.url.trim(),
      format: dto.format || 'auto',
      enabled: dto.enabled !== false,
      closeMissing: dto.closeMissing !== false,
    });
    return this.toPublicFeed(feed);
  }

  listFeeds(user: AuthUser) {
    return { items: this.store.listFeeds(user.id).map((f) => this.toPublicFeed(f)) };
  }

  updateFeed(user: AuthUser, id: string, dto: UpdateFeedDto) {
    const feed = this.requireOwnedFeed(user, id);
    if (dto.url) this.assertHttpsUrl(dto.url);
    const updated = this.store.updateFeed(feed.id, {
      label: dto.label ?? feed.label,
      url: dto.url?.trim() ?? feed.url,
      format: dto.format ?? feed.format,
      enabled: dto.enabled ?? feed.enabled,
      closeMissing: dto.closeMissing ?? feed.closeMissing,
    });
    return this.toPublicFeed(updated!);
  }

  async pullFeed(user: AuthUser, id: string) {
    const feed = this.requireOwnedFeed(user, id);
    return this.crawlFeed(feed);
  }

  async maybeRunScheduledFeeds() {
    if ((process.env.JOB_FEED_SCHEDULE_ENABLED ?? '1') === '0') return;
    const feeds = this.store.listEnabledFeeds();
    for (const feed of feeds) {
      try {
        await this.crawlFeed(feed);
      } catch (error) {
        this.logger.warn(
          `Feed ${feed.id} crawl failed: ${
            error instanceof Error ? error.message : 'error'
          }`,
        );
      }
    }
  }

  // ── Employer: webhooks + sheets ─────────────────────────────────

  createWebhook(user: AuthUser, dto: CreateWebhookDto) {
    const employer = this.requireEmployer(user);
    const token = this.store.mintWebhookToken();
    const row = this.store.createWebhook({
      employerId: employer.id,
      ownerUserId: user.id,
      label: dto.label,
      token,
      secret: dto.secret?.trim() || undefined,
      enabled: true,
    });
    return {
      id: row.id,
      label: row.label,
      createdAt: row.createdAt,
      /** POST jobs JSON here (Zapier Webhooks / ATS outbound). */
      urlPath: `/v1/integrations/webhooks/${row.token}`,
      secretConfigured: !!row.secret,
    };
  }

  listWebhooks(user: AuthUser) {
    return {
      items: this.store.listWebhooks(user.id).map((w) => ({
        id: w.id,
        label: w.label,
        urlPath: `/v1/integrations/webhooks/${w.token}`,
        secretConfigured: !!w.secret,
        lastUsedAt: w.lastUsedAt,
        createdAt: w.createdAt,
      })),
    };
  }

  revokeWebhook(user: AuthUser, id: string) {
    if (!this.store.revokeWebhook(id, user.id)) {
      throw new NotFoundException('Webhook not found');
    }
    return { ok: true };
  }

  async pullSheet(user: AuthUser, dto: PullSheetDto) {
    this.assertHttpsUrl(dto.csvUrl);
    this.assertAllowedSheetHost(dto.csvUrl);
    const employer = this.requireEmployer(user);
    const text = await this.fetchText(dto.csvUrl);
    const parsed = await this.csvParser.parse({
      sourceType: 'csv',
      filename: dto.label || 'google-sheet.csv',
      text,
    });
    const result = await this.ingestion.ingestDrafts({
      ownerUserId: user.id,
      employerId: employer.id,
      employerName: employer.name,
      sourceType: 'sheet',
      filename: dto.label || 'google-sheet.csv',
      drafts: parsed.drafts,
      warnings: [
        ...parsed.warnings,
        'Pulled from public Google Sheet / CSV URL (free).',
      ],
    });
    return result;
  }

  async ingestWebhook(
    token: string,
    body: Record<string, unknown>,
    secretHeader?: string,
  ) {
    const hook = this.store.findWebhookByToken(token);
    if (!hook) throw new NotFoundException('Webhook not found');
    if (hook.secret) {
      const provided = (secretHeader || '').trim();
      if (!provided || !safeEqualSecret(hook.secret, provided)) {
        throw new UnauthorizedException('Invalid webhook secret');
      }
    }

    const owner = this.authStore.getUser(hook.ownerUserId);
    if (!owner) throw new BadRequestException('Webhook owner missing');

    let drafts: ExtractedJobDraft[] = [];
    if (Array.isArray(body.jobs)) {
      drafts = body.jobs
        .filter((j): j is Record<string, unknown> => !!j && typeof j === 'object')
        .map((j, i) => mapLooseJob(j, i, `webhook:${hook.id}`));
    } else if (body.title || body.externalJobId) {
      drafts = [mapLooseJob(body, 0, `webhook:${hook.id}`)];
    } else if (Array.isArray(body)) {
      drafts = (body as unknown[])
        .filter((j): j is Record<string, unknown> => !!j && typeof j === 'object')
        .map((j, i) => mapLooseJob(j, i, `webhook:${hook.id}`));
    }

    if (!drafts.length) {
      throw new BadRequestException(
        'Expected { jobs: [...] } or a single job object with title.',
      );
    }

    return this.ingestion.ingestDrafts({
      ownerUserId: hook.ownerUserId,
      employerId: hook.employerId,
      sourceType: 'webhook',
      filename: `webhook-${hook.id}.json`,
      drafts,
      warnings: ['Ingested via free Zapier/ATS webhook.'],
    });
  }

  // ── Partner Job API ─────────────────────────────────────────────

  resolvePartnerKey(rawKey?: string): PartnerApiKey {
    if (!rawKey?.trim()) {
      throw new UnauthorizedException('API key required');
    }
    const key = this.store.findApiKeyByRaw(rawKey.trim());
    if (!key) throw new UnauthorizedException('Invalid API key');
    return key;
  }

  async partnerUpsert(key: PartnerApiKey, dto: PartnerJobDto) {
    const owner = this.authStore.getUser(key.ownerUserId);
    if (!owner) throw new BadRequestException('Key owner missing');
    const employer = this.authStore.getEmployerByOwner(key.ownerUserId);
    const status = this.resolvePublishStatus(key);
    const existing = this.store.findExternalRef(
      key.employerId,
      dto.externalJobId,
    );

    if (existing) {
      const updated = await this.jobsStore.updateOwned(
        existing.jobId,
        key.ownerUserId,
        {
          title: dto.title,
          employerName: dto.employerName || employer?.name,
          locationCity: dto.locationCity || 'Palani',
          jobType: (dto.jobType as JobType) || 'full-time',
          salaryText: dto.salaryText,
          vacancies: dto.vacancies,
          description: dto.description,
          contentLanguage: dto.contentLanguage || 'en',
          contactPhone: dto.contactPhone,
          contactEmail: dto.contactEmail,
          contactWebsite: dto.contactWebsite,
          status,
        },
      );
      if (!updated) throw new NotFoundException('Linked job missing');
      this.store.upsertExternalRef({
        employerId: key.employerId,
        ownerUserId: key.ownerUserId,
        externalJobId: dto.externalJobId,
        jobId: updated.id,
        source: 'partner',
      });
      return { action: 'updated' as const, jobId: updated.id, status: updated.status };
    }

    const job = await this.jobsStore.createAndPublish({
      title: dto.title,
      employerName: dto.employerName || employer?.name || 'Employer',
      locationCity: dto.locationCity || 'Palani',
      jobType: (dto.jobType as JobType) || 'full-time',
      salaryText: dto.salaryText,
      vacancies: dto.vacancies,
      description: dto.description,
      contentLanguage: dto.contentLanguage || 'en',
      contactPhone: dto.contactPhone,
      contactEmail: dto.contactEmail,
      contactWebsite: dto.contactWebsite,
      employerId: key.employerId,
      ownerUserId: key.ownerUserId,
      status,
    });
    this.store.upsertExternalRef({
      employerId: key.employerId,
      ownerUserId: key.ownerUserId,
      externalJobId: dto.externalJobId,
      jobId: job.id,
      source: 'partner',
    });
    return { action: 'created' as const, jobId: job.id, status: job.status };
  }

  async partnerBatch(key: PartnerApiKey, jobs: PartnerJobDto[]) {
    if (!jobs?.length) throw new BadRequestException('jobs required');
    if (jobs.length > 100) {
      throw new BadRequestException('Max 100 jobs per batch');
    }
    const results = [];
    for (const job of jobs) {
      try {
        results.push({ externalJobId: job.externalJobId, ...(await this.partnerUpsert(key, job)) });
      } catch (error) {
        results.push({
          externalJobId: job.externalJobId,
          action: 'error' as const,
          error: error instanceof Error ? error.message : 'failed',
        });
      }
    }
    return { items: results };
  }

  async partnerClose(key: PartnerApiKey, externalJobId: string) {
    const ref = this.store.findExternalRef(key.employerId, externalJobId);
    if (!ref) throw new NotFoundException('Job not found for externalJobId');
    const closed = await this.jobsStore.updateOwned(ref.jobId, key.ownerUserId, {
      status: 'removed',
    });
    if (!closed) throw new NotFoundException('Job not found');
    return { ok: true, jobId: closed.id, status: closed.status };
  }

  async partnerList(key: PartnerApiKey) {
    const refs = this.store.listExternalRefsByEmployer(key.employerId);
    const items = [];
    for (const ref of refs) {
      const job = await this.jobsStore.findById(ref.jobId);
      if (!job) continue;
      items.push({
        externalJobId: ref.externalJobId,
        jobId: job.id,
        title: job.title,
        status: job.status,
        updatedAt: ref.updatedAt,
      });
    }
    return { items };
  }

  // ── Crawl internals ─────────────────────────────────────────────

  private async crawlFeed(feed: JobFeed) {
    try {
      const text = await this.fetchText(feed.url);
      const format =
        feed.format === 'auto' ? detectFormat(feed.url, text) : feed.format;
      const parsed =
        format === 'xml'
          ? parseXmlFeed(text, feed.url)
          : parseJsonFeed(text, feed.url);

      if (!parsed.drafts.length) {
        this.store.updateFeed(feed.id, {
          lastPulledAt: new Date().toISOString(),
          lastStatus: 'empty',
          lastError: parsed.warnings.join('; ') || 'empty',
        });
        return { feedId: feed.id, empty: true, warnings: parsed.warnings };
      }

      const result = await this.ingestion.ingestDrafts({
        ownerUserId: feed.ownerUserId,
        employerId: feed.employerId,
        sourceType: format === 'xml' ? 'xml' : 'json',
        filename: `feed-${feed.id}.${format}`,
        drafts: parsed.drafts,
        warnings: [
          ...parsed.warnings,
          `Feed crawl ${feed.label} (${feed.url}).`,
        ],
      });

      const seen = new Set(
        parsed.drafts
          .map((d) => d.externalJobId?.trim().toLowerCase())
          .filter(Boolean) as string[],
      );
      for (const draft of parsed.drafts) {
        if (!draft.externalJobId) continue;
        // Ref is linked after approve; for lean MVP we track feed ids seen for close-missing
        // against previously known refs only.
      }

      let closed = 0;
      if (feed.closeMissing && seen.size) {
        for (const ref of this.store.listExternalRefsByFeed(feed.id)) {
          if (!seen.has(ref.externalJobId.trim().toLowerCase())) {
            await this.jobsStore.updateOwned(ref.jobId, feed.ownerUserId, {
              status: 'removed',
            });
            closed += 1;
          }
        }
      }

      // Record refs for drafts that already have jobIds from prior partner syncs;
      // new import rows get refs when approved via partner path. For feed-only,
      // stash provisional refs keyed by external id when we can match existing jobs.
      for (const draft of parsed.drafts) {
        if (!draft.externalJobId) continue;
        const existing = this.store.findExternalRef(
          feed.employerId,
          draft.externalJobId,
        );
        if (existing) {
          this.store.upsertExternalRef({
            ...existing,
            feedId: feed.id,
            source: 'feed',
          });
        }
      }

      this.store.updateFeed(feed.id, {
        lastPulledAt: new Date().toISOString(),
        lastStatus: 'ok',
        lastError: undefined,
        lastBatchId: result.batch.id,
      });

      return {
        feedId: feed.id,
        batchId: result.batch.id,
        recordCount: result.recordIds.length,
        closedMissing: closed,
        warnings: parsed.warnings,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'crawl_failed';
      this.store.updateFeed(feed.id, {
        lastPulledAt: new Date().toISOString(),
        lastStatus: 'error',
        lastError: message,
      });
      throw error;
    }
  }

  private async fetchText(url: string): Promise<string> {
    this.assertHttpsUrl(url);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20_000);
    try {
      const res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { Accept: 'application/json, application/xml, text/csv, text/plain, */*' },
      });
      if (!res.ok) {
        throw new BadRequestException(`Feed fetch HTTP ${res.status}`);
      }
      const text = await res.text();
      if (text.length > 5_000_000) {
        throw new BadRequestException('Feed payload too large (max 5MB)');
      }
      return text;
    } finally {
      clearTimeout(timer);
    }
  }

  private resolvePublishStatus(key: PartnerApiKey) {
    const envOn = (process.env.PARTNER_AUTO_PUBLISH ?? '0') === '1';
    if (envOn && key.autoPublish) return 'published' as const;
    return 'needs-review' as const;
  }

  private requireEmployer(user: AuthUser) {
    let employer = this.authStore.getEmployerByOwner(user.id);
    if (!employer) {
      if (!user.roles.includes('employer') && !user.roles.includes('admin')) {
        throw new ForbiddenException('Employer profile required');
      }
      employer = this.authStore.createEmployer(
        user.id,
        user.displayName || 'Employer',
      );
    }
    return employer;
  }

  private requireOwnedFeed(user: AuthUser, id: string): JobFeed {
    const feed = this.store.getFeed(id);
    if (!feed) throw new NotFoundException('Feed not found');
    if (feed.ownerUserId !== user.id && !user.roles.includes('admin')) {
      throw new ForbiddenException('Not your feed');
    }
    return feed;
  }

  private assertHttpsUrl(url: string) {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new BadRequestException('Invalid URL');
    }
    if (parsed.protocol !== 'https:') {
      throw new BadRequestException('Only HTTPS feed/sheet URLs are allowed');
    }
    if (
      ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(parsed.hostname) ||
      parsed.hostname.endsWith('.local') ||
      /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(parsed.hostname)
    ) {
      throw new BadRequestException('Private/local URLs are not allowed');
    }
  }

  private assertAllowedSheetHost(url: string) {
    const host = new URL(url).hostname.toLowerCase();
    const allowed = [
      'docs.google.com',
      'spreadsheets.google.com',
      'drive.google.com',
    ];
    if (!allowed.some((h) => host === h || host.endsWith(`.${h}`))) {
      // Still allow any https CSV for lean MVP agencies hosting their own export.
      this.logger.log(`Sheet pull from non-Google host: ${host}`);
    }
  }

  private toPublicFeed(feed: JobFeed) {
    return {
      id: feed.id,
      label: feed.label,
      url: feed.url,
      format: feed.format,
      enabled: feed.enabled,
      closeMissing: feed.closeMissing,
      lastPulledAt: feed.lastPulledAt,
      lastStatus: feed.lastStatus,
      lastError: feed.lastError,
      lastBatchId: feed.lastBatchId,
      createdAt: feed.createdAt,
      updatedAt: feed.updatedAt,
    };
  }
}

function detectFormat(url: string, text: string): 'xml' | 'json' {
  const lower = url.toLowerCase();
  if (lower.includes('.xml') || text.trimStart().startsWith('<')) return 'xml';
  return 'json';
}

function safeEqualSecret(expected: string, provided: string): boolean {
  const a = createHash('sha256').update(expected).digest();
  const b = createHash('sha256').update(provided).digest();
  return timingSafeEqual(a, b);
}
