import { Injectable } from '@nestjs/common';
import { AdsStore } from '../ads/ads.store';
import { AuthStore } from '../auth/auth.store';
import { JobsMemoryStore } from '../jobs/jobs.memory-store';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { CostLineItem, QuotaPolicy } from './ops.types';
import { OpsStore } from './ops.store';

@Injectable()
export class OpsService {
  constructor(
    private readonly store: OpsStore,
    private readonly jobs: JobsMemoryStore,
    private readonly ads: AdsStore,
    private readonly auth: AuthStore,
  ) {}

  costModel() {
    const monthlyBudgetInr = Number(process.env.MONTHLY_BUDGET_INR ?? 15000);
    const lines: CostLineItem[] = [
      {
        key: 'api_compute',
        label: 'API / workers (single small instance)',
        unit: 'instance-month',
        unitCostInr: 2500,
        monthlyEstimateInr: 2500,
        notes: 'Scale horizontally after RPS/p95 thresholds.',
      },
      {
        key: 'postgres',
        label: 'Managed PostgreSQL',
        unit: 'instance-month',
        unitCostInr: 1800,
        monthlyEstimateInr: 1800,
      },
      {
        key: 'object_storage',
        label: 'Source uploads / OCR inputs',
        unit: 'GB-month',
        unitCostInr: 2,
        monthlyEstimateInr: 200,
        notes: 'Expire unused sources under retention policy.',
      },
      {
        key: 'cdn',
        label: 'CDN + static web',
        unit: 'GB egress',
        unitCostInr: 7,
        monthlyEstimateInr: 500,
      },
      {
        key: 'ocr_llm',
        label: 'OCR / LLM extraction',
        unit: 'page',
        unitCostInr: 0.4,
        monthlyEstimateInr: 2000,
        notes: 'Hard cap via OCR_MONTHLY_PAGE_CAP.',
      },
      {
        key: 'fcm_email',
        label: 'Push + transactional email',
        unit: '1k messages',
        unitCostInr: 40,
        monthlyEstimateInr: 400,
      },
      {
        key: 'payments',
        label: 'Gateway fees (unlocks + promos)',
        unit: 'txn',
        unitCostInr: 2,
        monthlyEstimateInr: 800,
        notes: '₹5 unlocks may be uneconomical; monitor fee %.',
      },
    ];

    const estimatedSpendInr = lines.reduce(
      (sum, line) => sum + line.monthlyEstimateInr,
      0,
    );
    const published = this.jobs.listPublished().length || 1;
    const alertThresholdPct = Number(process.env.BUDGET_ALERT_PCT ?? 80);

    return {
      currency: 'INR',
      monthlyBudgetInr,
      estimatedSpendInr,
      budgetUsedPct: Math.round((estimatedSpendInr / monthlyBudgetInr) * 100),
      alertThresholdPct,
      overBudget: estimatedSpendInr > monthlyBudgetInr,
      costPerPublishedJobInr: Number(
        (estimatedSpendInr / published).toFixed(2),
      ),
      lines,
      governance: [
        'Monthly budget alerts from first cloud deploy',
        'Hard OCR/LLM page caps',
        'Per-employer import quotas',
        'Expire unused upload objects',
        'Review cost per published job and per MAU',
      ],
    };
  }

  metrics() {
    const counters = this.store.snapshot();
    const adStats = this.ads.eventStats();
    return {
      ...counters,
      adImpressions: Math.max(counters.adImpressions, adStats.impressions),
      adClicks: Math.max(counters.adClicks, adStats.clicks),
      promotionsSold: Math.max(
        counters.promotionsSold,
        this.ads.activePromotions().length,
      ),
      publishedJobs: this.jobs.listPublished().length,
      time: new Date().toISOString(),
    };
  }

  dashboard(query: DashboardQueryDto) {
    const granularity = query.granularity ?? 'day';
    const { from, to } = this.resolveRange(granularity, query.from, query.to);
    const fromMs = from.getTime();
    const toMs = to.getTime();

    const allJobs = this.jobs.listAll();
    const users = this.auth.listUsers();
    const signIns = this.auth.listSignInEvents();

    const postsInRange = allJobs.filter((job) => {
      const t = Date.parse(job.publishedAt);
      return Number.isFinite(t) && t >= fromMs && t <= toMs;
    });
    const signInsInRange = signIns.filter((ev) => {
      const t = Date.parse(ev.at);
      return Number.isFinite(t) && t >= fromMs && t <= toMs;
    });
    const newUsersInRange = users.filter((user) => {
      const t = Date.parse(user.createdAt);
      return Number.isFinite(t) && t >= fromMs && t <= toMs;
    });

    const byStatus = {
      published: 0,
      draft: 0,
      expired: 0,
      'needs-review': 0,
      rejected: 0,
      removed: 0,
    };
    for (const job of allJobs) {
      byStatus[job.status] = (byStatus[job.status] ?? 0) + 1;
    }

    const buckets = this.buildBuckets(from, to, granularity);
    const postSeries = new Map(buckets.map((b) => [b, 0]));
    const signInSeries = new Map(buckets.map((b) => [b, 0]));

    for (const job of postsInRange) {
      const key = this.bucketKey(job.publishedAt, granularity);
      if (postSeries.has(key)) {
        postSeries.set(key, (postSeries.get(key) ?? 0) + 1);
      }
    }
    for (const ev of signInsInRange) {
      const key = this.bucketKey(ev.at, granularity);
      if (signInSeries.has(key)) {
        signInSeries.set(key, (signInSeries.get(key) ?? 0) + 1);
      }
    }

    return {
      granularity,
      from: from.toISOString(),
      to: to.toISOString(),
      summary: {
        usersTotal: users.length,
        usersSignedUpInPeriod: newUsersInRange.length,
        signInsInPeriod: signInsInRange.length,
        activeSessions: this.auth.activeSessionCount(),
        postsUploadedInPeriod: postsInRange.length,
        postsTotal: allJobs.length,
        publishedJobs: byStatus.published,
        needsReview: byStatus['needs-review'],
        draftJobs: byStatus.draft,
        removedJobs: byStatus.removed,
        rejectedJobs: byStatus.rejected,
        expiredJobs: byStatus.expired,
        importBatches: this.store.snapshot().importBatches,
        contactUnlocks: this.store.snapshot().contactUnlocks,
        searches: this.store.snapshot().searches,
      },
      series: buckets.map((bucket) => ({
        bucket,
        posts: postSeries.get(bucket) ?? 0,
        signIns: signInSeries.get(bucket) ?? 0,
      })),
      time: new Date().toISOString(),
    };
  }

  private resolveRange(
    granularity: 'day' | 'month' | 'year',
    fromRaw?: string,
    toRaw?: string,
  ): { from: Date; to: Date } {
    let to = toRaw ? new Date(toRaw) : new Date();
    if (Number.isNaN(to.getTime())) {
      to = new Date();
    }
    let from: Date;
    if (fromRaw) {
      from = new Date(fromRaw);
      if (Number.isNaN(from.getTime())) {
        from = this.defaultFrom(to, granularity);
      }
    } else {
      from = this.defaultFrom(to, granularity);
    }
    if (from.getTime() > to.getTime()) {
      const swap = from;
      from = to;
      to = swap;
    }
    return { from, to };
  }

  private defaultFrom(to: Date, granularity: 'day' | 'month' | 'year'): Date {
    const from = new Date(to);
    if (granularity === 'year') {
      from.setUTCFullYear(from.getUTCFullYear() - 4);
      from.setUTCMonth(0, 1);
      from.setUTCHours(0, 0, 0, 0);
      return from;
    }
    if (granularity === 'month') {
      from.setUTCMonth(from.getUTCMonth() - 11, 1);
      from.setUTCHours(0, 0, 0, 0);
      return from;
    }
    from.setUTCDate(from.getUTCDate() - 13);
    from.setUTCHours(0, 0, 0, 0);
    return from;
  }

  private buildBuckets(
    from: Date,
    to: Date,
    granularity: 'day' | 'month' | 'year',
  ): string[] {
    const keys: string[] = [];
    const cursor = new Date(from);
    if (granularity === 'year') {
      cursor.setUTCMonth(0, 1);
      cursor.setUTCHours(0, 0, 0, 0);
      while (cursor.getTime() <= to.getTime()) {
        keys.push(String(cursor.getUTCFullYear()));
        cursor.setUTCFullYear(cursor.getUTCFullYear() + 1);
      }
      return keys;
    }
    if (granularity === 'month') {
      cursor.setUTCDate(1);
      cursor.setUTCHours(0, 0, 0, 0);
      while (cursor.getTime() <= to.getTime()) {
        keys.push(
          `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, '0')}`,
        );
        cursor.setUTCMonth(cursor.getUTCMonth() + 1);
      }
      return keys;
    }
    cursor.setUTCHours(0, 0, 0, 0);
    while (cursor.getTime() <= to.getTime()) {
      keys.push(cursor.toISOString().slice(0, 10));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return keys;
  }

  private bucketKey(
    iso: string,
    granularity: 'day' | 'month' | 'year',
  ): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    if (granularity === 'year') return String(d.getUTCFullYear());
    if (granularity === 'month') {
      return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    }
    return d.toISOString().slice(0, 10);
  }

  quotas(): { items: QuotaPolicy[] } {
    const ocrCap = Number(process.env.OCR_MONTHLY_PAGE_CAP ?? 5000);
    const importCap = Number(process.env.IMPORT_DAILY_BATCH_CAP ?? 50);
    const unlockCap = Number(process.env.UNLOCK_DAILY_CAP ?? 200);
    const counters = this.store.snapshot();
    return {
      items: [
        {
          key: 'ocr_pages',
          label: 'OCR / LLM pages',
          limit: ocrCap,
          window: 'month',
          used: counters.ocrPages,
        },
        {
          key: 'import_batches',
          label: 'Import batches',
          limit: importCap,
          window: 'day',
          used: counters.importBatches,
        },
        {
          key: 'contact_unlocks',
          label: 'Contact unlocks',
          limit: unlockCap,
          window: 'day',
          used: counters.contactUnlocks,
        },
      ],
    };
  }

  scaleHints() {
    const m = this.metrics();
    const hints: string[] = [];
    if (m.searches > 10000) {
      hints.push('Add read replicas / search index before search p95 degrades.');
    }
    if (m.importBatches > 40) {
      hints.push('Move OCR to a dedicated worker pool with concurrency caps.');
    }
    if (m.notificationsSent > 5000) {
      hints.push('Shard notification outbox; enforce quiet hours + daily caps.');
    }
    if (!hints.length) {
      hints.push(
        'Stay on single API + managed Postgres until measured RPS or OCR volume warrants workers.',
      );
    }
    return {
      thresholds: {
        searchRpsWarn: 50,
        ocrPagesMonthWarn: 4000,
        notificationDayWarn: 10000,
      },
      hints,
    };
  }

  recordSearch() {
    this.store.bump('searches');
    this.store.bump('apiRequests');
  }

  recordPublish() {
    this.store.bump('jobPublishes');
  }

  recordUnlock() {
    this.store.bump('contactUnlocks');
  }

  recordImport(pages = 0) {
    this.store.bump('importBatches');
    if (pages) this.store.bump('ocrPages', pages);
  }

  recordOcrPages(pages = 1) {
    if (pages > 0) this.store.bump('ocrPages', pages);
  }

  recordAd(type: 'impression' | 'click') {
    this.store.bump(type === 'impression' ? 'adImpressions' : 'adClicks');
  }

  recordPromotion() {
    this.store.bump('promotionsSold');
  }
}
