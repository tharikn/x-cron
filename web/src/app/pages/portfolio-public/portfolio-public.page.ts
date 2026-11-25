import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type {
  PortfolioDocument,
  PublicPortfolioResponse,
} from '../../core/models/portfolio.model';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SeoService } from '../../core/services/seo.service';
import { environment } from '../../../environments/environment';
import { PortfolioRendererComponent } from '../../shared/portfolio-renderer/portfolio-renderer.component';

/**
 * Public, server-rendered portfolio page.
 *
 * Reads only the immutable published JSON from the anonymous runtime endpoint.
 * Draft content can never reach this route.
 */
@Component({
  selector: 'app-portfolio-public',
  imports: [PortfolioRendererComponent],
  templateUrl: './portfolio-public.page.html',
  styleUrl: './portfolio-public.page.scss',
})
export class PortfolioPublicPage implements OnInit {
  private readonly portfolio = inject(PortfolioService);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly browserDocument = inject(DOCUMENT);

  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly response = signal<PublicPortfolioResponse | null>(null);

  readonly document = computed<PortfolioDocument | null>(() => {
    const data = this.response();
    if (!data) return null;
    return {
      schemaVersion: '1.0',
      site: data.site,
      theme: data.theme,
      navigation: data.navigation,
      pages: data.pages,
    };
  });

  readonly requestedLocale = signal('');
  readonly activeLocale = computed(() => {
    const data = this.response();
    if (!data) return this.requestedLocale();
    const requested = this.requestedLocale();
    return requested && data.site.locales.includes(requested)
      ? requested
      : data.site.defaultLocale;
  });

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const requested = this.route.snapshot.queryParamMap.get('locale') ?? '';
    this.requestedLocale.set(requested);
    try {
      const data = await this.portfolio.getPublic(slug, requested || undefined);
      this.response.set(data);
      this.applySeo(data);
      if (isPlatformBrowser(this.platformId)) {
        this.portfolio.recordEvent(slug, {
          type: 'view',
          path: `/p/${slug}`,
          locale: this.activeLocale(),
          referrer: this.browserDocument.referrer ?? '',
        });
      }
    } catch {
      this.notFound.set(true);
      this.seo.setPage({
        title: 'Portfolio not found',
        description: 'This portfolio is not published.',
        path: `/p/${slug}`,
        robots: 'noindex,nofollow',
      });
    } finally {
      this.loading.set(false);
    }
  }

  onInteraction(event: { type: 'contact' | 'outbound'; label: string }): void {
    const data = this.response();
    if (!data || !isPlatformBrowser(this.platformId)) return;
    this.portfolio.recordEvent(data.site.slug, {
      type: event.type,
      path: `/p/${data.site.slug}`,
      locale: this.activeLocale(),
      referrer: this.browserDocument.referrer ?? '',
    });
  }

  private applySeo(data: PublicPortfolioResponse): void {
    const seo = data.seo;
    this.seo.setPage({
      title: seo.title,
      description: seo.description,
      path: seo.canonicalPath,
      robots: seo.robots,
    });
    if (seo.ogImage) {
      const image = /^https?:\/\//i.test(seo.ogImage)
        ? seo.ogImage
        : `${environment.siteUrl}${seo.ogImage}`;
      this.seo.setSocialImage(image);
    }
    this.seo.setStructuredData(seo.jsonLd);
  }
}
