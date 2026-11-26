import { Injectable } from '@nestjs/common';
import {
  PortfolioStore,
  type PortfolioAnalyticsEvent,
} from './portfolio.store';
import type {
  PortfolioAnalyticsSummary,
  PortfolioDomainBinding,
  PortfolioMediaAsset,
  PortfolioSiteRecord,
  PortfolioVersionRecord,
} from './portfolio.types';

interface AnalyticsBucket {
  views: number;
  contactClicks: number;
  outboundClicks: number;
  visitors: Set<string>;
  byPath: Map<string, number>;
  byLocale: Map<string, number>;
  byReferrer: Map<string, number>;
  updatedAt: string;
}

function bump(map: Map<string, number>, key: string, by = 1): void {
  map.set(key, (map.get(key) ?? 0) + by);
}

function topEntries(
  map: Map<string, number>,
  limit = 8,
): Array<{ key: string; value: number }> {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, value]) => ({ key, value }));
}

@Injectable()
export class PortfolioMemoryStore extends PortfolioStore {
  private readonly sites = new Map<string, PortfolioSiteRecord>();
  private readonly versions = new Map<string, PortfolioVersionRecord[]>();
  private readonly analytics = new Map<string, AnalyticsBucket>();
  private readonly media = new Map<string, PortfolioMediaAsset[]>();
  private readonly domains = new Map<string, PortfolioDomainBinding>();

  async listSites(ownerUserId: string): Promise<PortfolioSiteRecord[]> {
    return [...this.sites.values()]
      .filter((site) => site.ownerUserId === ownerUserId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getSite(siteId: string): Promise<PortfolioSiteRecord | null> {
    return this.sites.get(siteId) ?? null;
  }

  async getSiteBySlug(slug: string): Promise<PortfolioSiteRecord | null> {
    const normalized = slug.trim().toLowerCase();
    for (const site of this.sites.values()) {
      if (site.slug === normalized) return site;
    }
    return null;
  }

  async saveSite(record: PortfolioSiteRecord): Promise<PortfolioSiteRecord> {
    this.sites.set(record.id, record);
    return record;
  }

  async deleteSite(siteId: string): Promise<boolean> {
    const existed = this.sites.delete(siteId);
    this.versions.delete(siteId);
    this.analytics.delete(siteId);
    for (const [id, domain] of this.domains) {
      if (domain.siteId === siteId) this.domains.delete(id);
    }
    return existed;
  }

  async listVersions(siteId: string): Promise<PortfolioVersionRecord[]> {
    return [...(this.versions.get(siteId) ?? [])].sort(
      (a, b) => b.versionNumber - a.versionNumber,
    );
  }

  async getVersion(
    siteId: string,
    versionId: string,
  ): Promise<PortfolioVersionRecord | null> {
    return (
      (this.versions.get(siteId) ?? []).find(
        (version) => version.id === versionId,
      ) ?? null
    );
  }

  async addVersion(version: PortfolioVersionRecord): Promise<void> {
    const list = this.versions.get(version.siteId) ?? [];
    list.push(version);
    this.versions.set(version.siteId, list);
  }

  async recordEvent(event: PortfolioAnalyticsEvent): Promise<void> {
    const bucket = this.analytics.get(event.siteId) ?? {
      views: 0,
      contactClicks: 0,
      outboundClicks: 0,
      visitors: new Set<string>(),
      byPath: new Map<string, number>(),
      byLocale: new Map<string, number>(),
      byReferrer: new Map<string, number>(),
      updatedAt: new Date().toISOString(),
    };
    if (event.type === 'view') {
      bucket.views += 1;
      bucket.visitors.add(event.visitorKey);
      bump(bucket.byPath, event.path || '/');
      bump(bucket.byLocale, event.locale || 'unknown');
      bump(bucket.byReferrer, event.referrer || 'direct');
    } else if (event.type === 'contact') {
      bucket.contactClicks += 1;
    } else {
      bucket.outboundClicks += 1;
    }
    bucket.updatedAt = new Date().toISOString();
    this.analytics.set(event.siteId, bucket);
  }

  async analyticsFor(siteId: string): Promise<PortfolioAnalyticsSummary> {
    const bucket = this.analytics.get(siteId);
    if (!bucket) {
      return {
        siteId,
        views: 0,
        uniqueVisitors: 0,
        contactClicks: 0,
        outboundClicks: 0,
        byPath: [],
        byLocale: [],
        byReferrer: [],
        updatedAt: new Date().toISOString(),
      };
    }
    return {
      siteId,
      views: bucket.views,
      uniqueVisitors: bucket.visitors.size,
      contactClicks: bucket.contactClicks,
      outboundClicks: bucket.outboundClicks,
      byPath: topEntries(bucket.byPath).map((entry) => ({
        path: entry.key,
        views: entry.value,
      })),
      byLocale: topEntries(bucket.byLocale).map((entry) => ({
        locale: entry.key,
        views: entry.value,
      })),
      byReferrer: topEntries(bucket.byReferrer).map((entry) => ({
        referrer: entry.key,
        views: entry.value,
      })),
      updatedAt: bucket.updatedAt,
    };
  }

  async listMedia(ownerUserId: string): Promise<PortfolioMediaAsset[]> {
    return [...(this.media.get(ownerUserId) ?? [])].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  async findMedia(
    ownerUserId: string,
    assetId: string,
  ): Promise<PortfolioMediaAsset | null> {
    return (
      (this.media.get(ownerUserId) ?? []).find((a) => a.id === assetId) ?? null
    );
  }

  async addMedia(
    ownerUserId: string,
    url: string,
    storageAssetId?: string,
  ): Promise<PortfolioMediaAsset> {
    const asset: PortfolioMediaAsset = {
      id: `media_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      ownerUserId,
      url,
      kind: 'image',
      createdAt: new Date().toISOString(),
      ...(storageAssetId ? { storageAssetId } : {}),
    };
    const list = this.media.get(ownerUserId) ?? [];
    list.push(asset);
    this.media.set(ownerUserId, list);
    return asset;
  }

  async deleteMedia(ownerUserId: string, assetId: string): Promise<boolean> {
    const list = this.media.get(ownerUserId) ?? [];
    const idx = list.findIndex((a) => a.id === assetId);
    if (idx < 0) return false;
    list.splice(idx, 1);
    this.media.set(ownerUserId, list);
    return true;
  }

  // ── Domain bindings ─────────────────────────────────────────────────────

  async listDomains(siteId?: string): Promise<PortfolioDomainBinding[]> {
    const bindings = [...this.domains.values()];
    const filtered = siteId
      ? bindings.filter((domain) => domain.siteId === siteId)
      : bindings;
    return filtered.sort((a, b) => a.hostname.localeCompare(b.hostname));
  }

  async getDomain(domainId: string): Promise<PortfolioDomainBinding | null> {
    return this.domains.get(domainId) ?? null;
  }

  async getDomainByHostname(
    hostname: string,
  ): Promise<PortfolioDomainBinding | null> {
    const normalized = hostname.trim().toLowerCase();
    for (const domain of this.domains.values()) {
      if (domain.hostname === normalized) return domain;
    }
    return null;
  }

  async saveDomain(domain: PortfolioDomainBinding): Promise<PortfolioDomainBinding> {
    this.domains.set(domain.id, domain);
    return domain;
  }

  async deleteDomain(domainId: string): Promise<boolean> {
    const existed = this.domains.delete(domainId);
    return existed;
  }

  async listPublishedSites(
    limit = 100,
  ): Promise<Array<{ slug: string; updatedAt: string }>> {
    return [...this.sites.values()]
      .filter((site) => site.status === 'published' && site.publishedVersionId)
      .slice(0, limit)
      .map((site) => ({ slug: site.slug, updatedAt: site.updatedAt }));
  }

  async clearForUser(ownerUserId: string): Promise<void> {
    for (const site of [...this.sites.values()]) {
      if (site.ownerUserId === ownerUserId) {
        await this.deleteSite(site.id);
      }
    }
  }
}
