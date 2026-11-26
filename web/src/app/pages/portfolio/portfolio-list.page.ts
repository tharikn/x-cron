import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import type {
  PortfolioSiteStatus,
  PortfolioSiteSummary,
  PortfolioTemplateSummary,
} from '../../core/models/portfolio.model';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';

type StatusFilter = 'all' | PortfolioSiteStatus;

/** Dynamic Portfolios — studio home. Creation lives in the /portfolio/new wizard. */
@Component({
  selector: 'app-portfolio-list',
  imports: [DatePipe, FormsModule, RouterLink],
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

  readonly query = signal('');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly filters: Array<{ id: StatusFilter; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'published', label: 'Published' },
    { id: 'draft', label: 'Drafts' },
  ];
  readonly skeletonSlots = [0, 1, 2, 3];

  private readonly templateById = computed(
    () => new Map(this.portfolio.templates().map((template) => [template.id, template])),
  );

  readonly publishedCount = computed(
    () => this.sites().filter((site) => site.status === 'published').length,
  );
  readonly draftCount = computed(() => this.sites().length - this.publishedCount());

  readonly filteredSites = computed(() => {
    const q = this.query().trim().toLowerCase();
    const status = this.statusFilter();
    return this.sites().filter((site) => {
      if (status !== 'all' && site.status !== status) return false;
      if (!q) return true;
      return (
        site.name.toLowerCase().includes(q) ||
        site.slug.toLowerCase().includes(q) ||
        site.template.id.toLowerCase().includes(q)
      );
    });
  });

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Portfolios',
      description: 'Build and publish a JSON-first professional portfolio.',
      path: '/portfolio',
      robots: 'noindex,follow',
    });
    // Catalogue data only paints preview tiles; a failed lookup never blocks the list.
    await Promise.all([this.reload(), this.portfolio.listTemplates().catch(() => [])]);
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

  clearFilters(): void {
    this.query.set('');
    this.statusFilter.set('all');
  }

  templateFor(site: PortfolioSiteSummary): PortfolioTemplateSummary | null {
    return this.templateById().get(site.template.id) ?? null;
  }

  gradientFor(site: PortfolioSiteSummary): string {
    return this.templateFor(site)?.previewGradient ?? 'linear-gradient(135deg, #14101f, #241e36)';
  }

  accentFor(site: PortfolioSiteSummary): string {
    return this.templateFor(site)?.theme.tokens.accent ?? '#7c5cff';
  }

  surfaceFor(site: PortfolioSiteSummary): string {
    return this.templateFor(site)?.theme.tokens.surface ?? '#14101f';
  }

  inkFor(site: PortfolioSiteSummary): string {
    return this.templateFor(site)?.theme.tokens.text ?? '#ffffff';
  }

  familyFor(site: PortfolioSiteSummary): string {
    return this.templateFor(site)?.family || 'Portfolio';
  }

  async copyPath(site: PortfolioSiteSummary): Promise<void> {
    const path = site.publicPath || `/p/${site.slug}`;
    try {
      const url = new URL(path, window.location.origin).toString();
      await navigator.clipboard.writeText(url);
      this.toast.success('Public link copied.');
    } catch {
      this.toast.error('Could not copy the link.');
    }
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
