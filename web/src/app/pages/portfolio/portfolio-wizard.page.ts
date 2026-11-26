import { Component, ElementRef, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  localizedValue,
  type PortfolioDocument,
  type PortfolioLocalizedText,
  type PortfolioTemplateSummary,
} from '../../core/models/portfolio.model';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import {
  PortfolioRendererComponent,
  type PortfolioDevice,
} from '../../shared/portfolio-renderer/portfolio-renderer.component';
import {
  PortfolioWizardStepperComponent,
  type PortfolioWizardStep,
} from './portfolio-wizard-stepper.component';

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/;
const GENERIC_LINK_TEXT = /^(?:read more|learn more|click here|more|here)$/i;

export type PaginationItem =
  | { kind: 'page'; page: number }
  | { kind: 'ellipsis'; key: string };

/**
 * Compute a compact, gap-free page sequence with ellipses (max 7 numeric slots).
 * Avoids single-page ellipses (e.g. `1 … 3` renders `1 2 3`).
 */
export function buildPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 0) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({ kind: 'page', page: i + 1 }));
  }

  const clamped = Math.min(Math.max(1, currentPage), totalPages);
  const pages = new Set<number>([1, totalPages, clamped - 1, clamped, clamped + 1]);

  if (clamped <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (clamped >= totalPages - 2) {
    pages.add(totalPages - 3);
    pages.add(totalPages - 2);
    pages.add(totalPages - 1);
  }

  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const items: PaginationItem[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const page = sorted[i];
    const prev = sorted[i - 1];
    if (prev !== undefined) {
      const gap = page - prev;
      if (gap === 2) {
        items.push({ kind: 'page', page: prev + 1 });
      } else if (gap > 2) {
        items.push({ kind: 'ellipsis', key: `gap-${prev}-${page}` });
      }
    }
    items.push({ kind: 'page', page });
  }
  return items;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

/**
 * Dynamic Portfolios — three-step creation wizard.
 *
 * 1. Choose a design, 2. add site details, 3. create the draft and hand off to
 * the existing editor. Nothing here touches job-portal state or shared UI.
 */
@Component({
  selector: 'app-portfolio-wizard',
  imports: [FormsModule, RouterLink, PortfolioRendererComponent, PortfolioWizardStepperComponent],
  templateUrl: './portfolio-wizard.page.html',
  styleUrl: './portfolio-wizard.page.scss',
})
export class PortfolioWizardPage implements OnInit {
  private readonly portfolio = inject(PortfolioService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  @ViewChild('catalogTop') private catalogTop?: ElementRef<HTMLElement>;

  readonly step = signal<PortfolioWizardStep>(1);
  readonly busy = signal(false);
  readonly loadingTemplates = signal(true);
  readonly templates = signal<PortfolioTemplateSummary[]>([]);
  readonly selectedTemplateId = signal('');

  readonly searchQuery = signal('');
  readonly activeCategory = signal('all');
  readonly activeThemeMode = signal<'all' | 'light' | 'dark'>('all');
  readonly pageSizeOptions = [12, 24, 48, 96] as const;
  readonly pageSize = signal<number>(24);
  readonly requestedPage = signal<number>(1);
  readonly jumpPageInput = signal<string>('');

  readonly hoveredTemplateId = signal<string | null>(null);
  readonly previewTemplateId = signal<string | null>(null);
  readonly previewDocument = signal<PortfolioDocument | null>(null);
  readonly previewMode = signal<'light' | 'dark' | ''>('');
  readonly device = signal<PortfolioDevice>('desktop');

  readonly name = signal('');
  readonly slug = signal('');
  readonly defaultLocale = signal('en-IN');
  readonly additionalLocales = signal('');

  readonly localeOptions = [
    { value: 'en-IN', label: 'English (India)' },
    { value: 'ta-IN', label: 'Tamil (India)' },
    { value: 'hi-IN', label: 'Hindi (India)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'en-US', label: 'English (US)' },
  ];

  readonly categoryOptions = computed(() => {
    const counts = new Map<string, { id: string; label: string; count: number }>();
    for (const t of this.templates()) {
      const existing = counts.get(t.category);
      if (existing) {
        existing.count++;
      } else {
        counts.set(t.category, { id: t.category, label: t.family || t.category, count: 1 });
      }
    }
    return [...counts.values()];
  });

  readonly filteredTemplates = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const cat = this.activeCategory();
    const mode = this.activeThemeMode();
    return this.templates().filter((t) => {
      if (cat !== 'all' && t.category !== cat) return false;
      if (mode === 'light' && t.theme.mode === 'dark') return false;
      if (mode === 'dark' && t.theme.mode !== 'dark') return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.family.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.audience.some((a) => a.toLowerCase().includes(q))
      );
    });
  });

  readonly totalFilteredCount = computed(() => this.filteredTemplates().length);

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalFilteredCount() / this.pageSize())),
  );

  readonly currentPage = computed(() =>
    Math.min(Math.max(1, this.requestedPage()), this.totalPages()),
  );

  readonly pagedTemplates = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredTemplates().slice(start, start + this.pageSize());
  });

  readonly pageRangeStart = computed(() =>
    this.totalFilteredCount() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1,
  );

  readonly pageRangeEnd = computed(() =>
    Math.min(this.totalFilteredCount(), this.currentPage() * this.pageSize()),
  );

  readonly paginationItems = computed(() =>
    buildPaginationItems(this.currentPage(), this.totalPages()),
  );

  readonly selectedTemplate = computed(
    () => this.templates().find((template) => template.id === this.selectedTemplateId()) ?? null,
  );
  readonly selectedTemplateName = computed(
    () => this.selectedTemplate()?.name ?? 'your template',
  );
  readonly activeLocale = computed(() => this.defaultLocale() || 'en-IN');
  readonly previewTemplateName = computed(() => {
    const template = this.templates().find((item) => item.id === this.previewTemplateId());
    return template ? template.name : '';
  });

  /** Live scaled documents for the active page only (keeps 500+ catalog fast). */
  readonly templateDocuments = computed<Map<string, PortfolioDocument>>(() => {
    const map = new Map<string, PortfolioDocument>();
    for (const template of this.pagedTemplates()) {
      map.set(template.id, this.buildDocumentForTemplate(template));
    }
    return map;
  });

  readonly effectiveSlug = computed(
    () => slugify(this.slug().trim() || this.name()) || 'your-name',
  );
  readonly locales = computed(() => {
    const extra = this.additionalLocales()
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    return [...new Set([this.defaultLocale().trim(), ...extra])].filter(Boolean).slice(0, 10);
  });

  readonly stepTitle = computed(() => {
    switch (this.step()) {
      case 1:
        return 'Choose a design';
      case 2:
        return 'Add the details';
      default:
        return 'Open the design editor';
    }
  });

  readonly stepLead = computed(() => {
    switch (this.step()) {
      case 1:
        return 'Pick a starter. You can change sections, colours and content in the next step.';
      case 2:
        return 'Give the site a name and a public address. You can refine these later in Settings.';
      default:
        return 'Creating a draft from your template and taking you to the editor.';
    }
  });

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'New portfolio',
      description: 'Choose a design and set up a new JSON-first portfolio.',
      path: '/portfolio/new',
      robots: 'noindex,nofollow',
    });
    await this.loadTemplates();
  }

  async loadTemplates(): Promise<void> {
    this.loadingTemplates.set(true);
    try {
      const templates = await this.portfolio.listTemplates();
      this.templates.set(templates);
      if (!this.selectedTemplateId() && templates.length > 0) {
        this.selectedTemplateId.set(templates[0].id);
      }
    } catch {
      this.toast.error('Could not load the template catalog.');
    } finally {
      this.loadingTemplates.set(false);
    }
  }

  goTo(step: PortfolioWizardStep): void {
    if (this.busy()) return;
    if (step === 2 && !this.selectedTemplateId()) {
      this.toast.error('Choose a design first.');
      return;
    }
    if (step === 3 && !this.name().trim()) {
      this.toast.error('Please fill in the site details.');
      return;
    }
    this.step.set(step);
  }

  selectTemplate(template: PortfolioTemplateSummary): void {
    if (this.busy()) return;
    this.selectedTemplateId.set(template.id);
    this.previewTemplateId.set(null);
  }

  setSearchQuery(value: string): void {
    this.searchQuery.set(value);
    this.requestedPage.set(1);
  }

  setCategory(category: string): void {
    this.activeCategory.set(category);
    this.requestedPage.set(1);
  }

  setThemeMode(mode: 'all' | 'light' | 'dark'): void {
    this.activeThemeMode.set(mode);
    this.requestedPage.set(1);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.activeCategory.set('all');
    this.activeThemeMode.set('all');
    this.requestedPage.set(1);
  }

  setPage(page: number, scrollToGrid = false): void {
    const clamped = Math.min(Math.max(1, Math.trunc(page)), this.totalPages());
    this.requestedPage.set(clamped);
    this.jumpPageInput.set('');
    if (scrollToGrid) {
      const el = this.catalogTop?.nativeElement;
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  setPageSize(rawSize: number | string): void {
    const parsed = Number(rawSize);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    this.pageSize.set(parsed);
    this.requestedPage.set(1);
  }

  submitJumpPage(): void {
    const parsed = Number(this.jumpPageInput().trim());
    if (!Number.isFinite(parsed) || parsed < 1) return;
    this.setPage(parsed, true);
  }

  useTemplate(template: PortfolioTemplateSummary): void {
    this.selectTemplate(template);
    this.step.set(2);
  }

  previewTemplate(template: PortfolioTemplateSummary): void {
    this.previewTemplateId.set(template.id);
    this.previewDocument.set(this.buildDocumentForTemplate(template));
    this.previewMode.set(template.theme.mode === 'system' ? '' : template.theme.mode);
    this.device.set('desktop');
  }

  usePreviewedTemplate(): void {
    const template = this.templates().find((item) => item.id === this.previewTemplateId());
    if (template) {
      this.useTemplate(template);
      this.closePreview();
    }
  }

  closePreview(): void {
    this.previewTemplateId.set(null);
    this.previewDocument.set(null);
  }

  async continueFromDetails(): Promise<void> {
    if (this.busy()) return;

    const name = this.name().trim();
    if (name.length < 2 || name.length > 80) {
      this.toast.error('Give the portfolio a name (2–80 characters).');
      return;
    }

    const slug = this.slug().trim();
    if (slug && !SLUG_RE.test(slug)) {
      this.toast.error('The slug must be 3–40 lowercase letters, numbers or dashes.');
      return;
    }

    const locales = this.locales();
    if (locales.length > 10 || locales.some((locale) => locale.length > 20)) {
      this.toast.error('Use at most 10 language codes, up to 20 characters each.');
      return;
    }

    if (!this.selectedTemplateId()) {
      this.toast.error('Choose a design first.');
      this.step.set(1);
      return;
    }

    this.step.set(3);
    this.busy.set(true);
    try {
      const site = await this.portfolio.createSite({
        name,
        templateId: this.selectedTemplateId(),
        slug: slug || undefined,
        defaultLocale: this.defaultLocale().trim() || 'en-IN',
        locales,
      });
      this.toast.success('Portfolio created. Start with the draft.');
      await this.router.navigate(['/portfolio', site.id]);
    } catch (error) {
      this.step.set(2);
      this.toast.error(this.errorMessage(error, 'Could not create the portfolio.'));
    } finally {
      this.busy.set(false);
    }
  }

  /** Build a preview document from a template summary (no API draft is created). */
  buildDocumentForTemplate(template: PortfolioTemplateSummary): PortfolioDocument {
    const locale = this.activeLocale();

    const SAMPLE_IMAGES = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    ];

    const sections = template.sections.map((section, index) => {
      const props: Record<string, unknown> = JSON.parse(JSON.stringify(section.props));

      // Enrich sections with realistic lorem ipsum content for previews
      if (section.type === 'gallery') {
        const items = (props['items'] as Array<Record<string, unknown>> | undefined) ?? [];
        props['items'] = items.map((item, i) => ({
          ...item,
          url: item['url'] || SAMPLE_IMAGES[i % SAMPLE_IMAGES.length],
          alt: item['alt'] || { [locale]: 'Gallery photo preview' },
          caption: item['caption'] || { [locale]: `Visual Series 0${i + 1}` },
        }));
      }

      if (section.type === 'about' && !props['body']) {
        props['body'] = {
          [locale]:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.',
        };
      }

      if (section.type === 'hero') {
        // Template previews are audited as real pages; generic CTA text fails link-text SEO.
        const ctaLabel = localizedValue(props['primaryCtaLabel'], locale, 'en-IN');
        if (GENERIC_LINK_TEXT.test(ctaLabel)) {
          props['primaryCtaLabel'] = { [locale]: 'Read more about my work' };
        }

        if (!props['subheadline']) {
          props['subheadline'] = {
            [locale]:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore.',
          };
        }
      }

      return {
        id: `${section.type}-${index + 1}`,
        type: section.type,
        variant: section.variant || 'default',
        hidden: false,
        props,
      };
    });

    const hero = sections.find((section) => section.type === 'hero');
    const heroProps = (hero?.props ?? {}) as Record<string, unknown>;
    const roleText =
      (heroProps['subheadline'] as PortfolioLocalizedText | undefined)?.[locale] ??
      template.description;

    const navLabels: Record<string, string> = {
      hero: 'Home',
      about: 'About',
      skills: 'Skills',
      projects: 'Work',
      experience: 'Experience',
      education: 'Education',
      gallery: 'Gallery',
      testimonials: 'Testimonials',
      contact: 'Contact',
      cta: 'Contact',
    };
    const navigation = [
      { id: 'nav-home', label: { [locale]: 'Home' }, target: '/' },
    ];
    const seenTargets = new Set<string>(['/']);
    for (const section of sections) {
      const target = `#${section.id}`;
      if (seenTargets.has(target)) continue;
      seenTargets.add(target);
      navigation.push({
        id: `nav-${section.id}`,
        label: { [locale]: navLabels[section.type] ?? section.type },
        target,
      });
    }

    return {
      schemaVersion: '1.0',
      site: {
        id: template.id,
        name: template.name,
        slug: template.id,
        defaultLocale: locale,
        locales: [locale],
        template: { id: template.id, version: template.version },
      },
      theme: template.theme,
      navigation,
      pages: [
        {
          id: 'home',
          path: '/',
          seo: {
            title: { [locale]: `${template.name} · Portfolio` },
            description: {
              [locale]: roleText?.slice(0, 160) || 'My professional portfolio',
            },
          },
          sections,
        },
      ],
    };
  }

  private errorMessage(error: unknown, fallback: string): string {
    const body = (error as { error?: { message?: string } } | null)?.error;
    return body?.message || fallback;
  }
}
