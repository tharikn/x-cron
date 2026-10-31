import { Injectable } from '@nestjs/common';
import { AdsStore } from '../ads/ads.store';
import { JobsMemoryStore } from '../jobs/jobs.memory-store';
import { CostLineItem, QuotaPolicy } from './ops.types';
import { OpsStore } from './ops.store';

@Injectable()
export class OpsService {
  constructor(
    private readonly store: OpsStore,
    private readonly jobs: JobsMemoryStore,
    private readonly ads: AdsStore,
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

  recordAd(type: 'impression' | 'click') {
    this.store.bump(type === 'impression' ? 'adImpressions' : 'adClicks');
  }

  recordPromotion() {
    this.store.bump('promotionsSold');
  }
}
