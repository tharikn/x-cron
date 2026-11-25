import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { PORTFOLIO_COMPONENTS } from './component-registry';
import {
  PortfolioStore,
  type PortfolioAnalyticsEvent,
} from './portfolio.store';
import { buildPortfolioSeo, portfolioPublicPath } from './portfolio.seo';
import type {
  PortfolioAnalyticsSummary,
  PortfolioDocument,
  PortfolioSiteRecord,
  PortfolioTemplateDefinition,
  PortfolioValidationIssue,
  PortfolioValidationResult,
  PortfolioVersionRecord,
} from './portfolio.types';
import { validateForPublish } from './portfolio.validation';
import {
  buildSiteDocument,
  findTemplate,
  listTemplates,
} from './templates/template-catalog';
import {
  isValidSlug,
  normalizeLocaleCode,
  sanitizeUrl,
  slugify,
  validatePortfolioDocument,
} from './site-schema';

export interface PortfolioSiteSummary {
  id: string;
  name: string;
  slug: string;
  status: PortfolioSiteRecord['status'];
  defaultLocale: string;
  locales: string[];
  template: { id: string; version: string };
  revision: number;
  publishedVersionId: string | null;
  publishedAt: string | null;
  publicPath: string;
  sectionCount: number;
  themeMode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioSiteInput {
  name: string;
  templateId: string;
  slug?: string;
  defaultLocale?: string;
  locales?: string[];
}

export interface UpdatePortfolioSiteInput {
  name?: string;
  slug?: string;
  defaultLocale?: string;
  locales?: string[];
}

export interface SaveDraftInput {
  document: unknown;
  baseRevision: number;
  mutationId?: string;
}

export interface PublishSiteInput {
  idempotencyKey: string;
  note?: string;
}

export interface RollbackInput {
  versionId: string;
  idempotencyKey: string;
}

export interface PublicPortfolioResponse {
  site: {
    id: string;
    name: string;
    slug: string;
    defaultLocale: string;
    locales: string[];
    template: { id: string; version: string };
  };
  theme: PortfolioDocument['theme'];
  navigation: PortfolioDocument['navigation'];
  pages: PortfolioDocument['pages'];
  versionId: string;
  publishedAt: string;
  seo: ReturnType<typeof buildPortfolioSeo>;
}

function checksumOf(document: PortfolioDocument): string {
  return createHash('sha256').update(JSON.stringify(document)).digest('hex');
}

function cloneDocument(document: PortfolioDocument): PortfolioDocument {
  return JSON.parse(JSON.stringify(document)) as PortfolioDocument;
}

function toSummary(site: PortfolioSiteRecord): PortfolioSiteSummary {
  const page = site.document.pages[0];
  return {
    id: site.id,
    name: site.name,
    slug: site.slug,
    status: site.status,
    defaultLocale: site.document.site.defaultLocale,
    locales: site.document.site.locales,
    template: site.document.site.template,
    revision: site.draftRevision,
    publishedVersionId: site.publishedVersionId,
    publishedAt: site.publishedAt,
    publicPath: portfolioPublicPath(site.slug),
    sectionCount: page?.sections.length ?? 0,
    themeMode: site.document.theme.mode,
    createdAt: site.createdAt,
    updatedAt: site.updatedAt,
  };
}

function validationError(issues: PortfolioValidationIssue[]): BadRequestException {
  return new BadRequestException({
    code: 'PORTFOLIO_SCHEMA_INVALID',
    message: 'The site document contains invalid content.',
    details: issues,
  });
}

@Injectable()
export class PortfolioService {
  /** Publish idempotency: `${siteId}:${idempotencyKey}` → version id. */
  private readonly publishKeys = new Map<string, string>();

  constructor(private readonly store: PortfolioStore) {}

  // ── Templates / registry ────────────────────────────────────────────────

  listTemplates(category?: string): PortfolioTemplateDefinition[] {
    const all = listTemplates();
    if (!category) return all;
    return all.filter((template) => template.category === category);
  }

  getTemplate(templateId: string): PortfolioTemplateDefinition {
    const template = findTemplate(templateId);
    if (!template) {
      throw new NotFoundException({
        code: 'PORTFOLIO_TEMPLATE_UNKNOWN',
        message: `Template "${templateId}" is not registered.`,
      });
    }
    return template;
  }

  listComponents() {
    return PORTFOLIO_COMPONENTS;
  }

  // ── Sites ───────────────────────────────────────────────────────────────

  async listSites(userId: string): Promise<PortfolioSiteSummary[]> {
    const sites = await this.store.listSites(userId);
    return sites.map(toSummary);
  }

  async createSite(
    userId: string,
    input: CreatePortfolioSiteInput,
  ): Promise<PortfolioSiteSummary> {
    const template = findTemplate(input.templateId);
    if (!template) {
      throw new BadRequestException({
        code: 'PORTFOLIO_TEMPLATE_UNKNOWN',
        message: `Template "${input.templateId}" is not registered.`,
      });
    }
    const name = input.name.trim();
    if (name.length < 2 || name.length > 80) {
      throw new BadRequestException({
        code: 'PORTFOLIO_SITE_NAME_INVALID',
        message: 'Site name must be between 2 and 80 characters.',
      });
    }
    const defaultLocale = normalizeLocaleCode(input.defaultLocale ?? 'en-IN');
    const locales = [
      ...new Set(
        (input.locales && input.locales.length > 0
          ? input.locales
          : [defaultLocale]
        ).map((locale) => normalizeLocaleCode(locale)),
      ),
    ];
    if (!locales.includes(defaultLocale)) locales.unshift(defaultLocale);

    const slug = await this.resolveSlug(input.slug ?? name);
    const siteId = `site_${randomUUID()}`;
    const now = new Date().toISOString();
    const document = buildSiteDocument(template, {
      siteId,
      name,
      slug,
      defaultLocale,
      locales,
    });

    const record: PortfolioSiteRecord = {
      id: siteId,
      ownerUserId: userId,
      workspaceId: `ws_${userId}`,
      name,
      slug,
      status: 'draft',
      document,
      draftRevision: 1,
      publishedVersionId: null,
      publishedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    await this.store.saveSite(record);
    return toSummary(record);
  }

  async getSite(userId: string, siteId: string): Promise<PortfolioSiteSummary> {
    return toSummary(await this.requireSite(userId, siteId));
  }

  async updateSite(
    userId: string,
    siteId: string,
    input: UpdatePortfolioSiteInput,
  ): Promise<PortfolioSiteSummary> {
    const site = await this.requireSite(userId, siteId);
    if (input.name != null) {
      const name = input.name.trim();
      if (name.length < 2 || name.length > 80) {
        throw new BadRequestException({
          code: 'PORTFOLIO_SITE_NAME_INVALID',
          message: 'Site name must be between 2 and 80 characters.',
        });
      }
      site.name = name;
      site.document.site.name = name;
    }
    if (input.slug != null) {
      const slug = await this.resolveSlug(input.slug, site.id);
      site.slug = slug;
      site.document.site.slug = slug;
    }
    if (input.defaultLocale != null || input.locales != null) {
      const defaultLocale =
        input.defaultLocale != null
          ? normalizeLocaleCode(input.defaultLocale)
          : site.document.site.defaultLocale;
      const locales = (
        input.locales ?? site.document.site.locales
      ).map((locale) => normalizeLocaleCode(locale));
      if (!locales.includes(defaultLocale)) locales.unshift(defaultLocale);
      site.document.site.defaultLocale = defaultLocale;
      site.document.site.locales = [...new Set(locales)];
    }
    site.document = validatePortfolioDocument(site.document).document ?? site.document;
    site.updatedAt = new Date().toISOString();
    await this.store.saveSite(site);
    return toSummary(site);
  }

  async deleteSite(userId: string, siteId: string): Promise<{ ok: true }> {
    await this.requireSite(userId, siteId);
    await this.store.deleteSite(siteId);
    this.publishKeys.delete(`${siteId}:*`);
    return { ok: true };
  }

  async getDraft(
    userId: string,
    siteId: string,
  ): Promise<{ site: PortfolioSiteSummary; document: PortfolioDocument }> {
    const site = await this.requireSite(userId, siteId);
    return { site: toSummary(site), document: site.document };
  }

  async saveDraft(
    userId: string,
    siteId: string,
    input: SaveDraftInput,
  ): Promise<{ site: PortfolioSiteSummary; revision: number }> {
    const site = await this.requireSite(userId, siteId);
    if (input.baseRevision !== site.draftRevision) {
      throw new ConflictException({
        code: 'PORTFOLIO_REVISION_CONFLICT',
        message: 'This draft changed elsewhere. Reload before saving.',
        currentRevision: site.draftRevision,
      });
    }
    const candidate = input.document as Partial<PortfolioDocument> | null;
    if (!candidate || typeof candidate !== 'object') {
      throw new BadRequestException({
        code: 'PORTFOLIO_DOCUMENT_INVALID',
        message: 'A site document is required.',
      });
    }
    // Site identity and slug are owned by the site record, not the editor body.
    const enforced: unknown = {
      ...candidate,
      site: {
        ...(candidate.site ?? {}),
        id: site.id,
        slug: site.slug,
        name: site.name,
      },
    };
    const validation = validatePortfolioDocument(enforced);
    if (!validation.ok || !validation.document) {
      throw validationError(validation.issues);
    }
    site.document = validation.document;
    site.draftRevision += 1;
    site.updatedAt = new Date().toISOString();
    await this.store.saveSite(site);
    return { site: toSummary(site), revision: site.draftRevision };
  }

  async validateDraft(
    userId: string,
    siteId: string,
    document?: unknown,
  ): Promise<PortfolioValidationResult> {
    const site = await this.requireSite(userId, siteId);
    if (document == null) {
      return validateForPublish(site.document);
    }
    const candidate = document as Partial<PortfolioDocument>;
    const enforced: unknown = {
      ...candidate,
      site: {
        ...(candidate.site ?? {}),
        id: site.id,
        slug: site.slug,
        name: site.name,
      },
    };
    const validation = validatePortfolioDocument(enforced);
    if (!validation.document) {
      const errors = validation.issues.filter((i) => i.severity === 'error');
      return { ok: false, errors, warnings: [], suggestions: [] };
    }
    return validateForPublish(validation.document);
  }

  // ── Publishing ──────────────────────────────────────────────────────────

  async publish(
    userId: string,
    siteId: string,
    input: PublishSiteInput,
  ): Promise<{
    site: PortfolioSiteSummary;
    version: PortfolioVersionRecord;
    publicPath: string;
  }> {
    const site = await this.requireSite(userId, siteId);
    const key = `${siteId}:${input.idempotencyKey || 'default'}`;
    const existingVersionId = this.publishKeys.get(key);
    if (existingVersionId) {
      const existing = await this.store.getVersion(siteId, existingVersionId);
      if (existing) {
        return {
          site: toSummary(site),
          version: existing,
          publicPath: portfolioPublicPath(site.slug),
        };
      }
    }

    const validation = validateForPublish(site.document);
    if (!validation.ok) {
      throw new BadRequestException({
        code: 'PORTFOLIO_VALIDATION_FAILED',
        message: 'Fix the blocking issues before publishing.',
        details: validation.errors,
        warnings: validation.warnings,
      });
    }

    const versions = await this.store.listVersions(siteId);
    const version: PortfolioVersionRecord = {
      id: `ver_${randomUUID()}`,
      siteId,
      workspaceId: site.workspaceId,
      versionNumber: (versions[0]?.versionNumber ?? 0) + 1,
      document: cloneDocument(site.document),
      templateId: site.document.site.template.id,
      templateVersion: site.document.site.template.version,
      schemaVersion: site.document.schemaVersion,
      checksum: checksumOf(site.document),
      createdAt: new Date().toISOString(),
      actorUserId: userId,
      sourceVersionId: null,
    };
    await this.store.addVersion(version);

    site.status = 'published';
    site.publishedVersionId = version.id;
    site.publishedAt = version.createdAt;
    site.updatedAt = version.createdAt;
    await this.store.saveSite(site);
    this.publishKeys.set(key, version.id);

    return {
      site: toSummary(site),
      version,
      publicPath: portfolioPublicPath(site.slug),
    };
  }

  async unpublish(
    userId: string,
    siteId: string,
  ): Promise<PortfolioSiteSummary> {
    const site = await this.requireSite(userId, siteId);
    site.status = 'unpublished';
    site.publishedVersionId = null;
    site.updatedAt = new Date().toISOString();
    await this.store.saveSite(site);
    return toSummary(site);
  }

  async listVersions(
    userId: string,
    siteId: string,
  ): Promise<Array<Omit<PortfolioVersionRecord, 'document'> & { isLive: boolean }>> {
    const site = await this.requireSite(userId, siteId);
    const versions = await this.store.listVersions(siteId);
    return versions.map((version) => {
      const { document: _document, ...rest } = version;
      return {
        ...rest,
        isLive: version.id === site.publishedVersionId,
      };
    });
  }

  async getVersion(
    userId: string,
    siteId: string,
    versionId: string,
  ): Promise<PortfolioVersionRecord> {
    await this.requireSite(userId, siteId);
    const version = await this.store.getVersion(siteId, versionId);
    if (!version) {
      throw new NotFoundException({
        code: 'PORTFOLIO_VERSION_NOT_FOUND',
        message: 'Version not found.',
      });
    }
    return version;
  }

  async rollback(
    userId: string,
    siteId: string,
    input: RollbackInput,
  ): Promise<{
    site: PortfolioSiteSummary;
    version: PortfolioVersionRecord;
    publicPath: string;
  }> {
    const site = await this.requireSite(userId, siteId);
    const source = await this.store.getVersion(siteId, input.versionId);
    if (!source) {
      throw new NotFoundException({
        code: 'PORTFOLIO_VERSION_NOT_FOUND',
        message: 'Version not found.',
      });
    }
    const key = `${siteId}:${input.idempotencyKey}`;
    const existingVersionId = this.publishKeys.get(key);
    if (existingVersionId) {
      const existing = await this.store.getVersion(siteId, existingVersionId);
      if (existing) {
        return {
          site: toSummary(site),
          version: existing,
          publicPath: portfolioPublicPath(site.slug),
        };
      }
    }

    const validation = validateForPublish(source.document);
    if (!validation.ok) {
      throw new BadRequestException({
        code: 'PORTFOLIO_VALIDATION_FAILED',
        message: 'This snapshot no longer passes current validation.',
        details: validation.errors,
      });
    }

    const versions = await this.store.listVersions(siteId);
    const version: PortfolioVersionRecord = {
      id: `ver_${randomUUID()}`,
      siteId,
      workspaceId: site.workspaceId,
      versionNumber: (versions[0]?.versionNumber ?? 0) + 1,
      document: cloneDocument(source.document),
      templateId: source.templateId,
      templateVersion: source.templateVersion,
      schemaVersion: source.schemaVersion,
      checksum: checksumOf(source.document),
      createdAt: new Date().toISOString(),
      actorUserId: userId,
      sourceVersionId: source.id,
    };
    await this.store.addVersion(version);

    site.document = cloneDocument(source.document);
    site.draftRevision += 1;
    site.status = 'published';
    site.publishedVersionId = version.id;
    site.publishedAt = version.createdAt;
    site.updatedAt = version.createdAt;
    await this.store.saveSite(site);
    this.publishKeys.set(key, version.id);

    return {
      site: toSummary(site),
      version,
      publicPath: portfolioPublicPath(site.slug),
    };
  }

  // ── Public runtime ──────────────────────────────────────────────────────

  async getPublicSite(
    slug: string,
    locale?: string,
  ): Promise<PublicPortfolioResponse> {
    const site = await this.store.getSiteBySlug(slug);
    if (
      !site ||
      site.status !== 'published' ||
      !site.publishedVersionId
    ) {
      throw new NotFoundException({
        code: 'PORTFOLIO_NOT_PUBLISHED',
        message: 'This portfolio is not published.',
      });
    }
    const version = await this.store.getVersion(site.id, site.publishedVersionId);
    if (!version) {
      throw new NotFoundException({
        code: 'PORTFOLIO_NOT_PUBLISHED',
        message: 'This portfolio is not published.',
      });
    }
    const activeLocale =
      locale && version.document.site.locales.includes(normalizeLocaleCode(locale))
        ? normalizeLocaleCode(locale)
        : version.document.site.defaultLocale;
    const seo = buildPortfolioSeo(version.document, activeLocale);
    return {
      site: version.document.site,
      theme: version.document.theme,
      navigation: version.document.navigation,
      pages: version.document.pages,
      versionId: version.id,
      publishedAt: version.createdAt,
      seo,
    };
  }

  async recordPublicEvent(
    slug: string,
    input: {
      type?: 'view' | 'contact' | 'outbound' | 'download';
      path?: string;
      locale?: string;
      referrer?: string;
    },
    visitorKey: string,
  ): Promise<{ ok: true }> {
    const site = await this.store.getSiteBySlug(slug);
    if (!site || site.status !== 'published') {
      throw new NotFoundException({
        code: 'PORTFOLIO_NOT_PUBLISHED',
        message: 'This portfolio is not published.',
      });
    }
    const referrer = String(input.referrer ?? '').slice(0, 200);
    const event: PortfolioAnalyticsEvent = {
      siteId: site.id,
      type: input.type ?? 'view',
      path: String(input.path ?? '/').slice(0, 200),
      locale: String(input.locale ?? site.document.site.defaultLocale).slice(0, 20),
      referrer: this.referrerCategory(referrer),
      visitorKey,
    };
    await this.store.recordEvent(event);
    return { ok: true };
  }

  async analytics(
    userId: string,
    siteId: string,
  ): Promise<PortfolioAnalyticsSummary> {
    await this.requireSite(userId, siteId);
    return this.store.analyticsFor(siteId);
  }

  async listMedia(userId: string) {
    return this.store.listMedia(userId);
  }

  async addMedia(userId: string, url: string) {
    if (!/^https?:\/\//i.test(url)) throw new Error('invalid_url');
    return this.store.addMedia(userId, url);
  }

  async deleteMedia(userId: string, assetId: string) {
    const ok = await this.store.deleteMedia(userId, assetId);
    if (!ok) throw new Error('not_found');
    return { ok: true };
  }

  async clearForUser(userId: string): Promise<void> {
    await this.store.clearForUser(userId);
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  private async requireSite(
    userId: string,
    siteId: string,
  ): Promise<PortfolioSiteRecord> {
    const site = await this.store.getSite(siteId);
    if (!site || site.ownerUserId !== userId) {
      // Same response for missing and foreign resources — no tenant leakage.
      throw new NotFoundException({
        code: 'PORTFOLIO_SITE_NOT_FOUND',
        message: 'Portfolio not found.',
      });
    }
    return site;
  }

  private async resolveSlug(
    raw: string,
    currentSiteId?: string,
  ): Promise<string> {
    let base = slugify(raw);
    if (!base) {
      throw new BadRequestException({
        code: 'PORTFOLIO_SLUG_INVALID',
        message: 'Choose a URL slug with letters and numbers.',
      });
    }
    if (!isValidSlug(base)) {
      throw new BadRequestException({
        code: 'PORTFOLIO_SLUG_INVALID',
        message:
          'Slug must be 3–40 characters, start and end with a letter or number, and not be reserved.',
      });
    }
    let candidate = base;
    let counter = 2;
    for (;;) {
      const existing = await this.store.getSiteBySlug(candidate);
      if (!existing || existing.id === currentSiteId) return candidate;
      candidate = `${base.slice(0, 32)}-${counter}`;
      counter += 1;
      if (counter > 50) {
        throw new ConflictException({
          code: 'PORTFOLIO_SLUG_TAKEN',
          message: 'That slug is already in use. Choose another.',
        });
      }
    }
  }

  private referrerCategory(referrer: string): string {
    if (!referrer) return 'direct';
    const safe = sanitizeUrl(referrer, 'link');
    if (!safe || safe === '') return 'direct';
    try {
      const host = new URL(safe).hostname.toLowerCase();
      if (host.includes('google')) return 'search';
      if (host.includes('bing') || host.includes('duckduckgo')) return 'search';
      if (host.includes('linkedin')) return 'linkedin';
      if (host.includes('twitter') || host.includes('x.com')) return 'social';
      if (host.includes('instagram') || host.includes('facebook')) return 'social';
      return 'referral';
    } catch {
      return 'direct';
    }
  }
}
