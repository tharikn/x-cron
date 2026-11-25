import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  PortfolioAnalyticsSummary,
  PortfolioComponentDefinition,
  PortfolioDocument,
  PortfolioDraftResponse,
  PortfolioSiteSummary,
  PortfolioTemplateSummary,
  PortfolioValidationResult,
  PortfolioVersionSummary,
  PublicPortfolioResponse,
} from '../models/portfolio.model';
import { AuthService } from './auth.service';

/**
 * Dynamic Portfolios API client. Self-contained: nothing else in the app
 * depends on these signals, so the module can be removed cleanly.
 */
@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  readonly sites = signal<PortfolioSiteSummary[]>([]);
  readonly templates = signal<PortfolioTemplateSummary[]>([]);
  readonly components = signal<PortfolioComponentDefinition[]>([]);
  readonly draft = signal<PortfolioDocument | null>(null);
  readonly draftSite = signal<PortfolioSiteSummary | null>(null);
  readonly versions = signal<PortfolioVersionSummary[]>([]);

  private base = `${environment.apiUrl}/portfolio`;

  private headers(): Record<string, string> {
    return this.auth.authHeaders();
  }

  /** Older Android WebViews may not expose crypto.randomUUID(). */
  private id(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  async listSites(): Promise<PortfolioSiteSummary[]> {
    const res = await firstValueFrom(
      this.http.get<{ items: PortfolioSiteSummary[] }>(`${this.base}/sites`, {
        headers: this.headers(),
        withCredentials: true,
      }),
    );
    this.sites.set(res.items ?? []);
    return res.items ?? [];
  }

  async listTemplates(category?: string): Promise<PortfolioTemplateSummary[]> {
    const qs = category ? `?category=${encodeURIComponent(category)}` : '';
    const res = await firstValueFrom(
      this.http.get<{ items: PortfolioTemplateSummary[] }>(
        `${this.base}/templates${qs}`,
        { headers: this.headers(), withCredentials: true },
      ),
    );
    this.templates.set(res.items ?? []);
    return res.items ?? [];
  }

  async listComponents(): Promise<PortfolioComponentDefinition[]> {
    if (this.components().length > 0) return this.components();
    const res = await firstValueFrom(
      this.http.get<{ items: PortfolioComponentDefinition[] }>(
        `${this.base}/components`,
        { headers: this.headers(), withCredentials: true },
      ),
    );
    this.components.set(res.items ?? []);
    return res.items ?? [];
  }

  createSite(input: {
    name: string;
    templateId: string;
    slug?: string;
    defaultLocale?: string;
    locales?: string[];
  }): Promise<PortfolioSiteSummary> {
    return firstValueFrom(
      this.http.post<PortfolioSiteSummary>(`${this.base}/sites`, input, {
        headers: this.headers(),
        withCredentials: true,
      }),
    );
  }

  async loadDraft(siteId: string): Promise<PortfolioDraftResponse> {
    const res = await firstValueFrom(
      this.http.get<PortfolioDraftResponse>(
        `${this.base}/sites/${siteId}/draft`,
        { headers: this.headers(), withCredentials: true },
      ),
    );
    this.draft.set(res.document);
    this.draftSite.set(res.site);
    return res;
  }

  updateSite(
    siteId: string,
    input: {
      name?: string;
      slug?: string;
      defaultLocale?: string;
      locales?: string[];
    },
  ): Promise<PortfolioSiteSummary> {
    return firstValueFrom(
      this.http.patch<PortfolioSiteSummary>(
        `${this.base}/sites/${siteId}`,
        input,
        { headers: this.headers(), withCredentials: true },
      ),
    );
  }

  saveDraft(
    siteId: string,
    document: PortfolioDocument,
    baseRevision: number,
  ): Promise<{ site: PortfolioSiteSummary; revision: number }> {
    return firstValueFrom(
      this.http.put<{ site: PortfolioSiteSummary; revision: number }>(
        `${this.base}/sites/${siteId}/draft`,
        { document, baseRevision, mutationId: this.id() },
        { headers: this.headers(), withCredentials: true },
      ),
    );
  }

  validateDraft(
    siteId: string,
    document?: PortfolioDocument,
  ): Promise<PortfolioValidationResult> {
    return firstValueFrom(
      this.http.post<PortfolioValidationResult>(
        `${this.base}/sites/${siteId}/draft/validate`,
        document ? { document } : {},
        { headers: this.headers(), withCredentials: true },
      ),
    );
  }

  publish(
    siteId: string,
  ): Promise<{
    site: PortfolioSiteSummary;
    version: PortfolioVersionSummary;
    publicPath: string;
  }> {
    return firstValueFrom(
      this.http.post<{
        site: PortfolioSiteSummary;
        version: PortfolioVersionSummary;
        publicPath: string;
      }>(
        `${this.base}/sites/${siteId}/publish`,
        { idempotencyKey: this.id() },
        { headers: this.headers(), withCredentials: true },
      ),
    );
  }

  async listVersions(siteId: string): Promise<PortfolioVersionSummary[]> {
    const res = await firstValueFrom(
      this.http.get<{ items: PortfolioVersionSummary[] }>(
        `${this.base}/sites/${siteId}/versions`,
        { headers: this.headers(), withCredentials: true },
      ),
    );
    this.versions.set(res.items ?? []);
    return res.items ?? [];
  }

  rollback(
    siteId: string,
    versionId: string,
  ): Promise<{
    site: PortfolioSiteSummary;
    version: PortfolioVersionSummary;
    publicPath: string;
  }> {
    return firstValueFrom(
      this.http.post<{
        site: PortfolioSiteSummary;
        version: PortfolioVersionSummary;
        publicPath: string;
      }>(
        `${this.base}/sites/${siteId}/rollback`,
        { versionId, idempotencyKey: this.id() },
        { headers: this.headers(), withCredentials: true },
      ),
    );
  }

  unpublish(siteId: string): Promise<PortfolioSiteSummary> {
    return firstValueFrom(
      this.http.post<PortfolioSiteSummary>(
        `${this.base}/sites/${siteId}/unpublish`,
        {},
        { headers: this.headers(), withCredentials: true },
      ),
    );
  }

  deleteSite(siteId: string): Promise<{ ok: boolean }> {
    return firstValueFrom(
      this.http.delete<{ ok: boolean }>(`${this.base}/sites/${siteId}`, {
        headers: this.headers(),
        withCredentials: true,
      }),
    );
  }

  analytics(siteId: string): Promise<PortfolioAnalyticsSummary> {
    return firstValueFrom(
      this.http.get<PortfolioAnalyticsSummary>(
        `${this.base}/sites/${siteId}/analytics`,
        { headers: this.headers(), withCredentials: true },
      ),
    );
  }

  /** Anonymous public runtime read. No auth headers. */
  getPublic(
    slug: string,
    locale?: string,
  ): Promise<PublicPortfolioResponse> {
    const qs = locale ? `?locale=${encodeURIComponent(locale)}` : '';
    return firstValueFrom(
      this.http.get<PublicPortfolioResponse>(
        `${this.base}/public/${encodeURIComponent(slug)}${qs}`,
      ),
    );
  }

  /** Fire-and-forget privacy-light analytics beacon. */
  recordEvent(
    slug: string,
    input: {
      type?: 'view' | 'contact' | 'outbound' | 'download';
      path?: string;
      locale?: string;
      referrer?: string;
    },
  ): void {
    this.http
      .post(`${this.base}/public/${encodeURIComponent(slug)}/events`, input)
      .subscribe({ error: () => undefined });
  }
}
