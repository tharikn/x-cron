import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type {
  PortfolioDocument,
  PublicPortfolioResponse,
} from '../../core/models/portfolio.model';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { environment } from '../../../environments/environment';
import { PortfolioRendererComponent } from '../../shared/portfolio-renderer/portfolio-renderer.component';

/**
 * Public, server-rendered portfolio page.
 *
 * Reads only the immutable published JSON from the anonymous runtime endpoint.
 * Draft content can never reach this route.
 * Faulty or broken portfolio links automatically route back to X Cron Jobs.
 */
@Component({
  selector: 'app-portfolio-public',
  imports: [RouterLink, PortfolioRendererComponent],
  templateUrl: './portfolio-public.page.html',
  styleUrl: './portfolio-public.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioPublicPage implements OnInit, OnDestroy {
  private readonly portfolio = inject(PortfolioService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly browserDocument = inject(DOCUMENT);

  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly response = signal<PublicPortfolioResponse | null>(null);
  readonly countdown = signal(4);
  readonly redirectCancelled = signal(false);

  private redirectTimer: ReturnType<typeof setTimeout> | null = null;
  private intervalTimer: ReturnType<typeof setInterval> | null = null;

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
        description: 'This portfolio link is inactive or does not exist.',
        path: `/p/${slug}`,
        robots: 'noindex,nofollow',
      });
      if (isPlatformBrowser(this.platformId)) {
        this.startFaultyLinkRecovery();
      }
    } finally {
      this.loading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  cancelRedirect(): void {
    this.redirectCancelled.set(true);
    this.clearTimers();
  }

  private startFaultyLinkRecovery(): void {
    this.intervalTimer = setInterval(() => {
      this.countdown.update((n) => {
        if (n <= 1) {
          this.clearTimers();
          if (!this.redirectCancelled()) {
            this.toast.show(
              'Portfolio link is inactive. Redirected to X Cron Jobs.',
              'default',
            );
            void this.router.navigateByUrl('/');
          }
          return 0;
        }
        return n - 1;
      });
    }, 1000);
  }

  private clearTimers(): void {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = null;
    }
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
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
    this.seo.setPortfolioPublicSeo(data.seo);
  }
}
