import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

@Injectable()
export class PortfolioPrismaStore extends PortfolioStore {
  private readonly logger = new Logger(PortfolioPrismaStore.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async listSites(ownerUserId: string): Promise<PortfolioSiteRecord[]> {
    try {
      const rows = await (this.prisma as any).portfolioSite.findMany({
        where: { ownerUserId },
        orderBy: { updatedAt: 'desc' },
      });
      return rows.map(this.mapSite);
    } catch (err) {
      this.logger.warn(`listSites fallback: ${(err as Error).message}`);
      return [];
    }
  }

  async getSite(siteId: string): Promise<PortfolioSiteRecord | null> {
    try {
      const row = await (this.prisma as any).portfolioSite.findUnique({
        where: { id: siteId },
      });
      return row ? this.mapSite(row) : null;
    } catch {
      return null;
    }
  }

  async getSiteBySlug(slug: string): Promise<PortfolioSiteRecord | null> {
    const normalized = slug.trim().toLowerCase();
    try {
      const row = await (this.prisma as any).portfolioSite.findUnique({
        where: { slug: normalized },
      });
      return row ? this.mapSite(row) : null;
    } catch {
      return null;
    }
  }

  async saveSite(record: PortfolioSiteRecord): Promise<PortfolioSiteRecord> {
    const data = {
      id: record.id,
      ownerUserId: record.ownerUserId,
      workspaceId: record.workspaceId || 'default',
      name: record.name,
      slug: record.slug.trim().toLowerCase(),
      status: record.status,
      documentJson: record.document as any,
      draftRevision: record.draftRevision,
      publishedVersionId: record.publishedVersionId,
      publishedAt: record.publishedAt ? new Date(record.publishedAt) : null,
      updatedAt: new Date(record.updatedAt),
    };

    await (this.prisma as any).portfolioSite.upsert({
      where: { id: record.id },
      create: {
        ...data,
        createdAt: new Date(record.createdAt),
      },
      update: data,
    });
    return record;
  }

  async deleteSite(siteId: string): Promise<boolean> {
    try {
      await (this.prisma as any).portfolioSite.delete({
        where: { id: siteId },
      });
      return true;
    } catch {
      return false;
    }
  }

  async listVersions(siteId: string): Promise<PortfolioVersionRecord[]> {
    try {
      const rows = await (this.prisma as any).portfolioVersion.findMany({
        where: { siteId },
        orderBy: { versionNumber: 'desc' },
      });
      return rows.map(this.mapVersion);
    } catch {
      return [];
    }
  }

  async getVersion(
    siteId: string,
    versionId: string,
  ): Promise<PortfolioVersionRecord | null> {
    try {
      const row = await (this.prisma as any).portfolioVersion.findUnique({
        where: { id: versionId },
      });
      return row ? this.mapVersion(row) : null;
    } catch {
      return null;
    }
  }

  async addVersion(version: PortfolioVersionRecord): Promise<void> {
    await (this.prisma as any).portfolioVersion.create({
      data: {
        id: version.id,
        siteId: version.siteId,
        workspaceId: version.workspaceId || 'default',
        versionNumber: version.versionNumber,
        documentJson: version.document as any,
        templateId: version.templateId,
        templateVersion: version.templateVersion,
        schemaVersion: version.schemaVersion,
        checksum: version.checksum,
        actorUserId: version.actorUserId,
        sourceVersionId: version.sourceVersionId,
        createdAt: new Date(version.createdAt),
      },
    });
  }

  async recordEvent(event: PortfolioAnalyticsEvent): Promise<void> {
    try {
      await (this.prisma as any).portfolioEvent?.create({
        data: {
          siteId: event.siteId,
          type: event.type,
          path: event.path || '/',
          locale: event.locale || 'unknown',
          referrer: event.referrer || 'direct',
          visitorKey: event.visitorKey,
        },
      });
    } catch {
      // analytics are non-blocking fire-and-forget
    }
  }

  async analyticsFor(siteId: string): Promise<PortfolioAnalyticsSummary> {
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

  async clearForUser(ownerUserId: string): Promise<void> {
    try {
      await (this.prisma as any).portfolioSite.deleteMany({
        where: { ownerUserId },
      });
    } catch {
      // best-effort
    }
  }

  async listMedia(ownerUserId: string): Promise<PortfolioMediaAsset[]> {
    try {
      const rows = await (this.prisma as any).portfolioMedia.findMany({
        where: { ownerUserId },
        orderBy: { createdAt: 'desc' },
      });
      return rows.map((r: any) => ({
        id: r.id,
        ownerUserId: r.ownerUserId,
        url: r.url,
        kind: 'image' as const,
        storageAssetId: r.storageAssetId ?? undefined,
        createdAt: r.createdAt.toISOString(),
      }));
    } catch {
      return [];
    }
  }

  async findMedia(
    ownerUserId: string,
    assetId: string,
  ): Promise<PortfolioMediaAsset | null> {
    try {
      const row = await (this.prisma as any).portfolioMedia.findUnique({
        where: { id: assetId },
      });
      if (!row || row.ownerUserId !== ownerUserId) return null;
      return {
        id: row.id,
        ownerUserId: row.ownerUserId,
        url: row.url,
        kind: 'image',
        storageAssetId: row.storageAssetId ?? undefined,
        createdAt: row.createdAt.toISOString(),
      };
    } catch {
      return null;
    }
  }

  async addMedia(
    ownerUserId: string,
    url: string,
    storageAssetId?: string,
  ): Promise<PortfolioMediaAsset> {
    const id = `media_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date();
    await (this.prisma as any).portfolioMedia.create({
      data: {
        id,
        ownerUserId,
        url,
        kind: 'image',
        storageAssetId: storageAssetId ?? null,
        createdAt: now,
      },
    });
    return {
      id,
      ownerUserId,
      url,
      kind: 'image',
      storageAssetId,
      createdAt: now.toISOString(),
    };
  }

  async deleteMedia(ownerUserId: string, assetId: string): Promise<boolean> {
    try {
      await (this.prisma as any).portfolioMedia.deleteMany({
        where: { id: assetId, ownerUserId },
      });
      return true;
    } catch {
      return false;
    }
  }

  async listDomains(siteId?: string): Promise<PortfolioDomainBinding[]> {
    try {
      const where = siteId ? { siteId } : {};
      const rows = await (this.prisma as any).portfolioDomain.findMany({
        where,
        orderBy: { hostname: 'asc' },
      });
      return rows.map(this.mapDomain);
    } catch {
      return [];
    }
  }

  async getDomain(domainId: string): Promise<PortfolioDomainBinding | null> {
    try {
      const row = await (this.prisma as any).portfolioDomain.findUnique({
        where: { id: domainId },
      });
      return row ? this.mapDomain(row) : null;
    } catch {
      return null;
    }
  }

  async getDomainByHostname(
    hostname: string,
  ): Promise<PortfolioDomainBinding | null> {
    try {
      const row = await (this.prisma as any).portfolioDomain.findUnique({
        where: { hostname: hostname.trim().toLowerCase() },
      });
      return row ? this.mapDomain(row) : null;
    } catch {
      return null;
    }
  }

  async saveDomain(domain: PortfolioDomainBinding): Promise<PortfolioDomainBinding> {
    const data = {
      id: domain.id,
      siteId: domain.siteId,
      workspaceId: domain.workspaceId || 'default',
      hostname: domain.hostname.trim().toLowerCase(),
      verificationMethod: domain.verificationMethod,
      status: domain.status,
      challengeJson: domain.challenge as any,
      tlsState: domain.tlsState,
      verifiedAt: domain.verifiedAt ? new Date(domain.verifiedAt) : null,
      updatedAt: new Date(domain.updatedAt),
    };
    await (this.prisma as any).portfolioDomain.upsert({
      where: { id: domain.id },
      create: {
        ...data,
        createdAt: new Date(domain.createdAt),
      },
      update: data,
    });
    return domain;
  }

  async deleteDomain(domainId: string): Promise<boolean> {
    try {
      await (this.prisma as any).portfolioDomain.delete({
        where: { id: domainId },
      });
      return true;
    } catch {
      return false;
    }
  }

  async listPublishedSites(
    limit = 100,
  ): Promise<Array<{ slug: string; updatedAt: string }>> {
    try {
      const rows = await (this.prisma as any).portfolioSite.findMany({
        where: { status: 'published' },
        take: limit,
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
      });
      return rows.map((r: any) => ({
        slug: r.slug,
        updatedAt: r.updatedAt.toISOString(),
      }));
    } catch {
      return [];
    }
  }

  private mapSite(row: any): PortfolioSiteRecord {
    return {
      id: row.id,
      ownerUserId: row.ownerUserId,
      workspaceId: row.workspaceId,
      name: row.name,
      slug: row.slug,
      status: row.status,
      document: row.documentJson,
      draftRevision: row.draftRevision,
      publishedVersionId: row.publishedVersionId,
      publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private mapVersion(row: any): PortfolioVersionRecord {
    return {
      id: row.id,
      siteId: row.siteId,
      workspaceId: row.workspaceId,
      versionNumber: row.versionNumber,
      document: row.documentJson,
      templateId: row.templateId,
      templateVersion: row.templateVersion,
      schemaVersion: row.schemaVersion,
      checksum: row.checksum,
      actorUserId: row.actorUserId,
      sourceVersionId: row.sourceVersionId,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private mapDomain(row: any): PortfolioDomainBinding {
    return {
      id: row.id,
      siteId: row.siteId,
      workspaceId: row.workspaceId || 'default',
      hostname: row.hostname,
      verificationMethod: row.verificationMethod || 'dns-txt',
      status: row.status,
      challenge: row.challengeJson ?? null,
      tlsState: row.tlsState || 'pending',
      verifiedAt: row.verifiedAt ? row.verifiedAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
