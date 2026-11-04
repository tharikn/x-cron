import { Injectable, OnModuleInit } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  AdCreative,
  AdEvent,
  AdPlacement,
  AdSlot,
  JobPromotion,
  PromoPackage,
  PromoPackageId,
} from './ads.types';

export const PROMO_PACKAGES: PromoPackage[] = [
  {
    id: 'featured_3d',
    name: 'Highlight 3 days',
    description: 'Boost one published job near the top of local search for 3 days.',
    durationDays: 3,
    pricePaise: 19900,
    badge: 'Promoted',
  },
  {
    id: 'featured_7d',
    name: 'Featured 7 days',
    description: 'Feature one job with a Featured badge for a week.',
    durationDays: 7,
    pricePaise: 49900,
    badge: 'Featured',
  },
  {
    id: 'featured_30d',
    name: 'Featured 30 days',
    description: 'Month-long feature for high-intent local hiring.',
    durationDays: 30,
    pricePaise: 149900,
    badge: 'Featured',
  },
];

@Injectable()
export class AdsStore implements OnModuleInit {
  private readonly placements = new Map<AdSlot, AdPlacement>();
  private readonly creatives = new Map<string, AdCreative>();
  private readonly events: AdEvent[] = [];
  private readonly promotions = new Map<string, JobPromotion>();
  /** deviceId → creativeId → day → count */
  private readonly freq = new Map<string, Map<string, { day: string; count: number }>>();

  onModuleInit() {
    this.seedPlacements();
    this.seedCreatives();
  }

  listPlacements(): AdPlacement[] {
    return [...this.placements.values()];
  }

  getPlacement(slot: AdSlot): AdPlacement | undefined {
    return this.placements.get(slot);
  }

  upsertPlacement(placement: AdPlacement): AdPlacement {
    this.placements.set(placement.slot, placement);
    return placement;
  }

  listCreatives(slot?: AdSlot): AdCreative[] {
    return [...this.creatives.values()]
      .filter((c) => (slot ? c.slot === slot : true))
      .sort((a, b) => b.priority - a.priority);
  }

  getCreative(id: string): AdCreative | undefined {
    return this.creatives.get(id);
  }

  saveCreative(input: Omit<AdCreative, 'id' | 'createdAt'> & { id?: string }): AdCreative {
    const id = input.id ?? `ad_${uuidv4().slice(0, 8)}`;
    const record: AdCreative = {
      id,
      createdAt: this.creatives.get(id)?.createdAt ?? new Date().toISOString(),
      slot: input.slot,
      kind: input.kind,
      advertiser: input.advertiser,
      headline: input.headline,
      body: input.body,
      ctaLabel: input.ctaLabel,
      targetUrl: input.targetUrl,
      active: input.active,
      priority: input.priority,
    };
    this.creatives.set(id, record);
    return record;
  }

  addEvent(input: Omit<AdEvent, 'id' | 'createdAt'>): AdEvent {
    const event: AdEvent = {
      id: `aev_${uuidv4().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      ...input,
    };
    this.events.push(event);
    if (input.type === 'impression') {
      this.bumpFreq(input.deviceId, input.creativeId);
    }
    return event;
  }

  impressionCountToday(deviceId: string, creativeId: string): number {
    const day = new Date().toISOString().slice(0, 10);
    const byCreative = this.freq.get(deviceId)?.get(creativeId);
    if (!byCreative || byCreative.day !== day) return 0;
    return byCreative.count;
  }

  eventStats() {
    const impressions = this.events.filter((e) => e.type === 'impression').length;
    const clicks = this.events.filter((e) => e.type === 'click').length;
    return { impressions, clicks, events: this.events.length };
  }

  listPackages(): PromoPackage[] {
    return PROMO_PACKAGES;
  }

  getPackage(id: PromoPackageId): PromoPackage | undefined {
    return PROMO_PACKAGES.find((p) => p.id === id);
  }

  createPromotion(input: Omit<JobPromotion, 'id' | 'createdAt'>): JobPromotion {
    const record: JobPromotion = {
      id: `prm_${uuidv4().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      ...input,
    };
    this.promotions.set(record.id, record);
    return record;
  }

  listPromotionsForUser(userId: string): JobPromotion[] {
    return [...this.promotions.values()]
      .filter((p) => p.ownerUserId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  activePromotions(now = new Date()): JobPromotion[] {
    return [...this.promotions.values()].filter(
      (p) =>
        p.status === 'active' &&
        new Date(p.startsAt) <= now &&
        new Date(p.endsAt) > now,
    );
  }

  expireDue(now = new Date()): number {
    let n = 0;
    for (const promo of this.promotions.values()) {
      if (promo.status === 'active' && new Date(promo.endsAt) <= now) {
        promo.status = 'expired';
        n += 1;
      }
    }
    return n;
  }

  private bumpFreq(deviceId: string, creativeId: string) {
    const day = new Date().toISOString().slice(0, 10);
    if (!this.freq.has(deviceId)) this.freq.set(deviceId, new Map());
    const map = this.freq.get(deviceId)!;
    const current = map.get(creativeId);
    if (!current || current.day !== day) {
      map.set(creativeId, { day, count: 1 });
    } else {
      current.count += 1;
    }
  }

  private seedPlacements() {
    const defaults: AdPlacement[] = [
      {
        slot: 'discover_feed',
        enabled: true,
        maxPerSession: 1,
        frequencyCapPerDay: 6,
        label: 'Advertisement',
      },
      {
        slot: 'job_detail_footer',
        enabled: true,
        maxPerSession: 1,
        frequencyCapPerDay: 4,
        label: 'Advertisement',
      },
      {
        slot: 'web_home_rail',
        enabled: true,
        maxPerSession: 2,
        frequencyCapPerDay: 8,
        label: 'Advertisement',
      },
    ];
    for (const p of defaults) this.placements.set(p.slot, p);
  }

  private seedCreatives() {
    const seeds: Array<Omit<AdCreative, 'id' | 'createdAt'>> = [
      {
        slot: 'discover_feed',
        kind: 'house',
        advertiser: 'X Cron Jobs',
        headline: 'Hiring locally? Promote your listing',
        body: 'Featured placements put your job near the top for seekers in your town — without cluttering the feed.',
        ctaLabel: 'See packages',
        targetUrl: '/tabs/post',
        active: true,
        priority: 10,
      },
      {
        slot: 'job_detail_footer',
        kind: 'house',
        advertiser: 'X Cron Jobs',
        headline: 'Save jobs you like',
        body: 'Sign in to sync saved roles and preferences across devices — contacts stay free on every listing.',
        ctaLabel: 'Open account',
        targetUrl: '/tabs/account',
        active: true,
        priority: 5,
      },
      {
        slot: 'web_home_rail',
        kind: 'third_party',
        advertiser: 'Local Skills Trust',
        headline: 'Free weekend skills clinic',
        body: 'Third-party notice — clearly labelled. Not a job listing.',
        ctaLabel: 'Learn more',
        targetUrl: 'https://example.com/skills',
        active: true,
        priority: 8,
      },
    ];
    for (const seed of seeds) this.saveCreative(seed);
  }
}
