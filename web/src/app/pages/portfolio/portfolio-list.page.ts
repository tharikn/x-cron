import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { PortfolioSiteSummary } from '../../core/models/portfolio.model';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';

/** Dynamic Portfolios — site list. Creation lives in the /portfolio/new wizard. */
@Component({
  selector: 'app-portfolio-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './portfolio-list.page.html',
  styleUrl: './portfolio-list.page.scss',
})
export class PortfolioListPage implements OnInit {
  private readonly portfolio = inject(PortfolioService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  readonly sites = this.portfolio.sites;
  readonly loading = signal(true);
  readonly deletingId = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Portfolios',
      description: 'Build and publish a JSON-first professional portfolio.',
      path: '/portfolio',
      robots: 'noindex,follow',
    });
    await this.reload();
  }

  async reload(): Promise<void> {
    this.loading.set(true);
    try {
      await this.portfolio.listSites();
    } catch {
      this.toast.error('Could not load your portfolios.');
    } finally {
      this.loading.set(false);
    }
  }

  statusLabel(site: PortfolioSiteSummary): string {
    if (site.status === 'published') return 'Published';
    if (site.status === 'unpublished') return 'Unpublished';
    return 'Draft';
  }

  async remove(site: PortfolioSiteSummary): Promise<void> {
    if (!window.confirm('Delete this portfolio? This cannot be undone.')) return;
    this.deletingId.set(site.id);
    try {
      await this.portfolio.deleteSite(site.id);
      await this.reload();
      this.toast.success('Portfolio deleted.');
    } catch (error) {
      this.toast.error(this.errorMessage(error, 'Could not delete the portfolio.'));
    } finally {
      this.deletingId.set(null);
    }
  }

  private errorMessage(error: unknown, fallback: string): string {
    const body = (error as { error?: { message?: string } } | null)?.error;
    return body?.message || fallback;
  }
}
