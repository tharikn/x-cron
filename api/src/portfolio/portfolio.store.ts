import type {
  PortfolioAnalyticsSummary,
  PortfolioMediaAsset,
  PortfolioSiteRecord,
  PortfolioVersionRecord,
} from './portfolio.types';

export interface PortfolioAnalyticsEvent {
  siteId: string;
  type: 'view' | 'contact' | 'outbound' | 'download';
  path: string;
  locale: string;
  referrer: string;
  /** Privacy-preserving rotating visitor hash — never a raw IP. */
  visitorKey: string;
}

/** Repository port — memory today, Prisma implementation can be added later. */
export abstract class PortfolioStore {
  abstract listSites(ownerUserId: string): Promise<PortfolioSiteRecord[]>;
  abstract getSite(siteId: string): Promise<PortfolioSiteRecord | null>;
  abstract getSiteBySlug(slug: string): Promise<PortfolioSiteRecord | null>;
  abstract saveSite(record: PortfolioSiteRecord): Promise<PortfolioSiteRecord>;
  abstract deleteSite(siteId: string): Promise<boolean>;

  abstract listVersions(siteId: string): Promise<PortfolioVersionRecord[]>;
  abstract getVersion(
    siteId: string,
    versionId: string,
  ): Promise<PortfolioVersionRecord | null>;
  abstract addVersion(version: PortfolioVersionRecord): Promise<void>;

  abstract recordEvent(event: PortfolioAnalyticsEvent): Promise<void>;
  abstract analyticsFor(siteId: string): Promise<PortfolioAnalyticsSummary>;
  abstract clearForUser(ownerUserId: string): Promise<void>;

  abstract listMedia(ownerUserId: string): Promise<PortfolioMediaAsset[]>;
  abstract addMedia(ownerUserId: string, url: string): Promise<PortfolioMediaAsset>;
  abstract deleteMedia(ownerUserId: string, assetId: string): Promise<boolean>;
}
