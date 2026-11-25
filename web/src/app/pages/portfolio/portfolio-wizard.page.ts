import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import type {
  PortfolioDocument,
  PortfolioLocalizedText,
  PortfolioTemplateSummary,
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

  readonly step = signal<PortfolioWizardStep>(1);
  readonly busy = signal(false);
  readonly loadingTemplates = signal(true);
  readonly templates = signal<PortfolioTemplateSummary[]>([]);
  readonly selectedTemplateId = signal('');

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

  /** Live scaled documents for every template card. */
  readonly templateDocuments = computed<Map<string, PortfolioDocument>>(() => {
    const map = new Map<string, PortfolioDocument>();
    for (const template of this.templates()) {
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

      if (section.type === 'hero' && !props['subheadline']) {
        props['subheadline'] = {
          [locale]:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore.',
        };
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
