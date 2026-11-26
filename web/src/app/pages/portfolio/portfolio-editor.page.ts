import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type {
  PortfolioAiGenerateInput,
  PortfolioAiGenerateResult,
  PortfolioAnalyticsSummary,
  PortfolioComponentDefinition,
  PortfolioDomainBinding,
  PortfolioDocument,
  PortfolioMediaAsset,
  PortfolioPropField,
  PortfolioSection,
  PortfolioSectionStyle,
  PortfolioSectionType,
  PortfolioSiteSummary,
  PortfolioThemeMode,
  PortfolioValidationIssue,
  PortfolioValidationResult,
  PortfolioVersionSummary,
} from '../../core/models/portfolio.model';
import { localizedValue, sectionLabel } from '../../core/models/portfolio.model';
import { useImageUpload } from '../../core/hooks/use-image-upload';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { environment } from '../../../environments/environment';
import {
  PortfolioTourService,
  type TourStep,
} from '../../core/services/portfolio-tour.service';
import {
  PortfolioRendererComponent,
  type PortfolioDevice,
} from '../../shared/portfolio-renderer/portfolio-renderer.component';
import { PortfolioTourComponent } from '../../shared/portfolio-tour/portfolio-tour.component';
import {
  codeByteLength,
  codeLineCount,
  splitCustomCodePage,
  usesExternalResources,
} from '../../shared/portfolio-custom-code/custom-code-frame';
import { EditorIconComponent } from './editor-icons.component';
import {
  EditorTooltipDirective,
  EditorTooltipOverlayComponent,
} from './editor-tooltip.directive';
import { EditorToolbarComponent } from './editor-toolbar.component';
import { EditorContextBarComponent } from './editor-context-bar.component';
import { EditorLayersPanelComponent } from './editor-layers-panel.component';
import { EditorTaskbarComponent } from './editor-taskbar.component';
import {
  EditorContextMenuComponent,
  type ContextMenuScope,
} from './editor-context-menu.component';
import {
  EditorAiModalComponent,
  EditorCommandPaletteComponent,
  EditorMediaModalComponent,
  EditorSectionPickerComponent,
  EditorShortcutsModalComponent,
  type CommandItem,
} from './editor-modals.component';

type EditorTab = 'content' | 'design' | 'theme' | 'publish' | 'domain' | 'insights';
type SaveState = 'saved' | 'dirty' | 'saving' | 'conflict' | 'error';
type SeoIssueKey = 'title' | 'description' | 'imageUrl';

export interface IssueTarget {
  sectionId?: string;
  fieldKey?: string;
  rowIndex?: number;
  nestedKey?: string;
  seoKey?: SeoIssueKey;
}

interface IssueIndex {
  fields: Map<string, PortfolioValidationIssue[]>;
  seo: Map<string, PortfolioValidationIssue[]>;
}

interface ThemePalettePreset {
  id: string;
  name: string;
  mode: PortfolioThemeMode;
  primary: string;
  accent: string;
  surface: string;
  text: string;
}

interface FontPairingPreset {
  id: string;
  name: string;
  heading: string;
  body: string;
}

type MediaTarget =
  | { kind: 'prop'; key: string }
  | { kind: 'row'; fieldKey: string; rowIndex: number; nestedKey: string }
  | { kind: 'styleBg' };

const AUTOSAVE_MS = 1_200;
const HISTORY_LIMIT = 40;

const THEME_PRESETS: ThemePalettePreset[] = [
  {
    id: 'swiss',
    name: 'Swiss Paper',
    mode: 'light',
    primary: '#0f0f10',
    accent: '#2f6fed',
    surface: '#ffffff',
    text: '#141416',
  },
  {
    id: 'midnight',
    name: 'Night Violet',
    mode: 'dark',
    primary: '#f5f7ff',
    accent: '#8f7bff',
    surface: '#110d1f',
    text: '#f0eef6',
  },
  {
    id: 'editorial',
    name: 'Warm Editorial',
    mode: 'light',
    primary: '#1f1812',
    accent: '#c25e00',
    surface: '#faf5ec',
    text: '#2c241d',
  },
  {
    id: 'emerald',
    name: 'Emerald Studio',
    mode: 'dark',
    primary: '#ecfdf5',
    accent: '#10b981',
    surface: '#0a1914',
    text: '#d1fae5',
  },
  {
    id: 'obsidian',
    name: 'Amber Noir',
    mode: 'dark',
    primary: '#ffffff',
    accent: '#f5a524',
    surface: '#0d0d10',
    text: '#e4e4e7',
  },
  {
    id: 'cobalt',
    name: 'Slate Clean',
    mode: 'light',
    primary: '#0f172a',
    accent: '#0284c7',
    surface: '#f8fafc',
    text: '#1e293b',
  },
];

const FONT_PAIRINGS: FontPairingPreset[] = [
  { id: 'editorial', name: 'Fraunces + Manrope', heading: 'Fraunces', body: 'Manrope' },
  { id: 'modern', name: 'Outfit + Manrope', heading: 'Outfit', body: 'Manrope' },
  { id: 'classic', name: 'Georgia + System', heading: 'Georgia', body: 'System' },
  { id: 'tech', name: 'Mono + Manrope', heading: 'Mono', body: 'Manrope' },
];

function fieldIssueKey(
  sectionId: string,
  fieldKey: string,
  rowIndex?: number,
  nestedKey?: string,
): string {
  return `${sectionId}|${fieldKey}|${rowIndex ?? ''}|${nestedKey ?? ''}`;
}

function addIssue(
  map: Map<string, PortfolioValidationIssue[]>,
  key: string,
  issue: PortfolioValidationIssue,
): void {
  const list = map.get(key);
  if (list) list.push(issue);
  else map.set(key, [issue]);
}

function humanize(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/^./, (char) => char.toUpperCase());
}

/**
 * Resolve an API issue path to the editor control that produced it.
 * Schema paths look like `pages[0].sections[2].props.items[0].alt`;
 * publish-rule issues often carry only a `sectionId`.
 */
export function locateIssue(
  issue: PortfolioValidationIssue,
  sections: PortfolioSection[],
): IssueTarget {
  const path = issue.path ?? '';
  const sectionMatch = /^pages\[\d+\]\.sections\[(\d+)\](?:\.(.*))?$/.exec(path);

  if (sectionMatch) {
    const section = sections[Number(sectionMatch[1])];
    const rest = sectionMatch[2] ?? '';
    if (section) {
      if (issue.code === 'PORTFOLIO_VARIANT_UNKNOWN') {
        return { sectionId: section.id, fieldKey: 'variant' };
      }
      if (rest.startsWith('props.')) {
        const parts = rest.slice('props.'.length).split('.');
        const head = parts[0] ?? '';
        const rowMatch = /^([^[]+)\[(\d+)\]$/.exec(head);
        return {
          sectionId: section.id,
          fieldKey: rowMatch ? rowMatch[1] : head,
          ...(rowMatch ? { rowIndex: Number(rowMatch[2]) } : {}),
          ...(rowMatch && parts.length > 1 ? { nestedKey: parts.slice(1).join('.') } : {}),
        };
      }
      return { sectionId: section.id };
    }
  }

  const seoMatch = /^pages\[\d+\]\.seo\.(title|description|imageUrl)$/.exec(path);
  if (seoMatch) {
    return { seoKey: seoMatch[1] as SeoIssueKey };
  }

  if (issue.sectionId) {
    const propMatch = /\.props\.([^.[]+)(?:\[(\d+)\])?(?:\.(.+))?$/.exec(path);
    if (propMatch) {
      return {
        sectionId: issue.sectionId,
        fieldKey: propMatch[1],
        ...(propMatch[2] ? { rowIndex: Number(propMatch[2]) } : {}),
        ...(propMatch[3] ? { nestedKey: propMatch[3] } : {}),
      };
    }
    const ruleField: Record<string, string> = {
      PORTFOLIO_LOCALE_CONTENT_MISSING: 'headline',
      PORTFOLIO_IMAGE_ALT_MISSING: 'imageAlt',
      PORTFOLIO_GALLERY_ALT_MISSING: 'items',
      PORTFOLIO_CONTACT_EMAIL_INVALID: 'email',
    };
    return {
      sectionId: issue.sectionId,
      ...(ruleField[issue.code] ? { fieldKey: ruleField[issue.code] } : {}),
    };
  }

  return {};
}

/** Custom domain verification methods supported by the portfolio API. */
export type DomainVerificationMethod = 'TXT' | 'CNAME';

export interface DomainChallengeInput {
  type: 'TXT' | 'CNAME';
  name: string;
  value?: string;
  target?: string;
}

/**
 * Build the DNS ownership challenge for a custom domain binding.
 * TXT: publish `_xcron.<host> â†’ xcron-verify=<token>`.
 * CNAME: point `<host>` at `<token>.cname.xcron.app`.
 */
export function domainChallengeFor(
  hostname: string,
  method: DomainVerificationMethod = 'TXT',
  token = `xcron-${Math.random().toString(36).slice(2, 8)}`,
): DomainChallengeInput {
  if (method === 'CNAME') {
    return { type: 'CNAME', name: hostname, target: `${token}.cname.xcron.app` };
  }
  return { type: 'TXT', name: `_xcron.${hostname}`, value: `xcron-verify=${token}` };
}

/** Live URL a verified custom domain serves the portfolio at (site root). */
export function domainLiveUrl(hostname: string): string {
  return `https://${hostname}/`;
}

/**
 * Dynamic Portfolios â€” studio draft editor.
 *
 * Unified toolbar, contextual formatting bar, collapsible icon layers,
 * icon-only inspector, bottom status/zoom taskbar, and shared right/left
 * cursor context menus.
 */
@Component({
  selector: 'app-portfolio-editor',
  imports: [
    FormsModule,
    RouterLink,
    PortfolioRendererComponent,
    PortfolioTourComponent,
    EditorIconComponent,
    EditorTooltipDirective,
    EditorTooltipOverlayComponent,
    EditorToolbarComponent,
    EditorContextBarComponent,
    EditorLayersPanelComponent,
    EditorTaskbarComponent,
    EditorContextMenuComponent,
    EditorSectionPickerComponent,
    EditorAiModalComponent,
    EditorMediaModalComponent,
    EditorCommandPaletteComponent,
    EditorShortcutsModalComponent,
  ],
  templateUrl: './portfolio-editor.page.html',
  styleUrl: './portfolio-editor.page.scss',
})
export class PortfolioEditorPage implements OnInit, OnDestroy {
  private readonly portfolio = inject(PortfolioService);
  private readonly imageUpload = useImageUpload();
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly tourService = inject(PortfolioTourService);

  readonly doc = signal<PortfolioDocument | null>(null);
  readonly site = signal<PortfolioSiteSummary | null>(null);
  readonly components = signal<PortfolioComponentDefinition[]>([]);
  readonly versions = signal<PortfolioVersionSummary[]>([]);
  readonly analytics = signal<PortfolioAnalyticsSummary | null>(null);
  readonly domains = signal<PortfolioDomainBinding[]>([]);

  readonly isTourSeen = this.tourService.isSeen;
  readonly isTourActive = this.tourService.isActive;

  readonly selectedId = signal<string | null>(null);
  readonly tab = signal<EditorTab>('content');
  readonly locale = signal('en-IN');
  readonly device = signal<PortfolioDevice>('desktop');
  readonly addType = signal<PortfolioSectionType>('about');
  readonly saveState = signal<SaveState>('saved');
  readonly saveError = signal('');
  readonly lastSavedAt = signal<string | null>(null);
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly publishing = signal(false);
  readonly validation = signal<PortfolioValidationResult | null>(null);
  readonly showSiteSettings = signal(false);
  readonly domainBusy = signal(false);
  readonly undoDepth = signal(0);
  readonly redoDepth = signal(0);
  readonly previewMode = signal<'light' | 'dark' | ''>('');
  readonly codeImportAccept = signal('.html,.htm,.css,.js,.mjs');
  readonly codeNotice = signal('');

  // â”€â”€ Studio UI State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  readonly layersCollapsed = signal(false);
  readonly inspectorCollapsed = signal(false);
  readonly previewOnly = signal(false);
  readonly showGuides = signal(true);
  readonly zoom = signal(100);

  // â”€â”€ Clipboards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  readonly copiedStyle = signal<PortfolioSectionStyle | null>(null);
  readonly copiedSection = signal<PortfolioSection | null>(null);

  // â”€â”€ Context Menu State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  readonly ctxVisible = signal(false);
  readonly ctxX = signal(0);
  readonly ctxY = signal(0);
  readonly ctxScope = signal<ContextMenuScope>('canvas');
  readonly ctxSectionId = signal<string | null>(null);

  // â”€â”€ Modals & Overlays â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  readonly sectionPickerVisible = signal(false);
  readonly sectionInsertIndex = signal<number | null>(null);
  readonly commandPaletteVisible = signal(false);
  readonly shortcutsVisible = signal(false);
  readonly aiModalVisible = signal(false);
  readonly aiBusy = signal(false);
  readonly aiResult = signal<PortfolioAiGenerateResult | null>(null);
  readonly mediaModalVisible = signal(false);
  readonly mediaBusy = signal(false);
  readonly mediaAssets = signal<PortfolioMediaAsset[]>([]);
  private mediaTarget: MediaTarget | null = null;

  @ViewChild('codeFile') private codeFileInput?: ElementRef<HTMLInputElement>;
  private lastCodeEdit = { key: '', at: 0 };
  private codeImportSectionId: string | null = null;

  readonly sectionTypes = sectionLabels;
  readonly sectionLabel = sectionLabel;
  readonly themePresets = THEME_PRESETS;
  readonly fontPairings = FONT_PAIRINGS;
  readonly fontOptions = [
    'Outfit',
    'Manrope',
    'Fraunces',
    'Noto Sans Tamil',
    'Georgia',
    'System',
    'Mono',
  ];
  readonly localeOptions = [
    { value: 'en-IN', label: 'English (India)' },
    { value: 'ta-IN', label: 'Tamil (India)' },
    { value: 'hi-IN', label: 'Hindi (India)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'en-US', label: 'English (US)' },
  ];

  siteForm = { name: '', slug: '', defaultLocale: 'en-IN', locales: 'en-IN' };
  newDomainHostname = '';
  newDomainMethod: DomainVerificationMethod = 'TXT';
  readonly domainProofs = signal<Record<string, string>>({});

  readonly sections = computed(() => this.doc()?.pages[0]?.sections ?? []);
  readonly navItems = computed(() => this.doc()?.navigation ?? []);
  readonly selectedSection = computed(
    () => this.sections().find((section) => section.id === this.selectedId()) ?? null,
  );
  readonly selectedSectionIndex = computed(() => {
    const id = this.selectedId();
    return id ? this.sections().findIndex((s) => s.id === id) : -1;
  });
  readonly selectedDefinition = computed(() => {
    const type = this.selectedSection()?.type;
    return this.components().find((component) => component.type === type) ?? null;
  });
  readonly anchorTargets = computed(() =>
    this.sections()
      .filter((s) => !s.hidden)
      .map((s) => ({ id: s.id, label: sectionLabel(s.type) })),
  );
  readonly defaultLocale = computed(
    () => this.doc()?.site.defaultLocale ?? 'en-IN',
  );
  readonly activeLocale = computed(
    () => this.locale() || this.defaultLocale(),
  );
  readonly locales = computed(() => this.doc()?.site.locales ?? [this.defaultLocale()]);
  readonly canUndo = computed(() => this.undoDepth() > 0);
  readonly canRedo = computed(() => this.redoDepth() > 0);
  readonly revision = signal(0);
  readonly errorCount = computed(() => this.validation()?.errors.length ?? 0);
  readonly warningCount = computed(
    () =>
      (this.validation()?.warnings.length ?? 0) +
      (this.validation()?.suggestions.length ?? 0),
  );
  readonly domainTabAvailable = computed(
    () => this.site()?.status === 'published' || this.domains().length > 0,
  );
  readonly verifiedDomain = computed(
    () => this.domains().find((domain) => domain.status === 'verified') ?? null,
  );
  readonly platformPublicUrl = computed(() => {
    const site = this.site();
    if (!site) return '';
    const base = environment.siteUrl.replace(/\/$/, '');
    return `${base}/p/${site.slug}`;
  });

  readonly ctxSection = computed(() => {
    const id = this.ctxSectionId();
    return id ? this.sections().find((s) => s.id === id) ?? null : null;
  });
  readonly ctxSectionIndex = computed(() => {
    const id = this.ctxSectionId();
    return id ? this.sections().findIndex((s) => s.id === id) : -1;
  });

  readonly commandItems = computed<CommandItem[]>(() => [
    {
      id: 'add-section',
      label: 'Insert new section',
      kbd: 'A',
      icon: 'plus',
      run: () => this.openSectionPicker(),
    },
    {
      id: 'ai-assist',
      label: 'Open AI copy assist',
      icon: 'sparkles',
      run: () => this.aiModalVisible.set(true),
    },
    {
      id: 'undo',
      label: 'Undo last change',
      kbd: 'Ctrl+Z',
      icon: 'undo',
      run: () => this.undo(),
    },
    {
      id: 'redo',
      label: 'Redo change',
      kbd: 'Ctrl+Y',
      icon: 'redo',
      run: () => this.redo(),
    },
    {
      id: 'preview',
      label: this.previewOnly() ? 'Exit preview mode' : 'Enter live preview mode',
      kbd: 'P',
      icon: 'eye',
      run: () => this.previewOnly.update((v) => !v),
    },
    {
      id: 'device-desktop',
      label: 'Viewport: Desktop',
      kbd: '1',
      icon: 'monitor',
      run: () => this.device.set('desktop'),
    },
    {
      id: 'device-tablet',
      label: 'Viewport: Tablet',
      kbd: '2',
      icon: 'tablet',
      run: () => this.device.set('tablet'),
    },
    {
      id: 'device-mobile',
      label: 'Viewport: Mobile',
      kbd: '3',
      icon: 'smartphone',
      run: () => this.device.set('mobile'),
    },
    {
      id: 'theme-light',
      label: 'Preview light mode',
      icon: 'sun',
      run: () => this.previewMode.set('light'),
    },
    {
      id: 'theme-dark',
      label: 'Preview dark mode',
      icon: 'moon',
      run: () => this.previewMode.set('dark'),
    },
    {
      id: 'validate',
      label: 'Validate draft',
      kbd: 'Ctrl+Shift+V',
      icon: 'check-circle',
      run: () => void this.validateNow(),
    },
    {
      id: 'publish',
      label: 'Publish current draft',
      icon: 'rocket',
      run: () => void this.publish(),
    },
    {
      id: 'domain',
      label: 'Open domain settings',
      icon: 'globe',
      run: () => {
        this.inspectorCollapsed.set(false);
        this.openTab('domain');
      },
    },
    {
      id: 'import-code',
      label: 'Import HTML / CSS / JS file',
      icon: 'code',
      run: () => this.importCodeFromToolbar(),
    },
    {
      id: 'settings',
      label: 'Toggle site settings',
      icon: 'settings',
      run: () => this.showSiteSettings.update((v) => !v),
    },
  ]);

  /** Per-section issue counts used by the section list and canvas badges. */
  readonly sectionIssues = computed<Record<string, { errors: number; warnings: number }>>(() => {
    const counts: Record<string, { errors: number; warnings: number }> = {};
    const validation = this.validation();
    if (!validation) return counts;
    const sections = this.sections();
    for (const issue of [...validation.errors, ...validation.warnings]) {
      const target = locateIssue(issue, sections);
      if (!target.sectionId) continue;
      const entry = (counts[target.sectionId] ??= { errors: 0, warnings: 0 });
      if (issue.severity === 'error') entry.errors += 1;
      else entry.warnings += 1;
    }
    return counts;
  });

  private readonly issueIndex = computed<IssueIndex>(() => {
    const fields = new Map<string, PortfolioValidationIssue[]>();
    const seo = new Map<string, PortfolioValidationIssue[]>();
    const validation = this.validation();
    if (!validation) return { fields, seo };
    const sections = this.sections();
    for (const issue of [...validation.errors, ...validation.warnings]) {
      const target = locateIssue(issue, sections);
      if (target.seoKey) {
        addIssue(seo, target.seoKey, issue);
      } else if (target.sectionId && target.fieldKey) {
        addIssue(
          fields,
          fieldIssueKey(target.sectionId, target.fieldKey, target.rowIndex, target.nestedKey),
          issue,
        );
      }
    }
    return { fields, seo };
  });

  private siteId = '';
  private revisionAtSave = 0;
  private mutationCount = 0;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private savePromise: Promise<void> | null = null;
  private undoStack: string[] = [];
  private redoStack: string[] = [];

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Portfolio editor',
      description: 'Edit a dynamic portfolio draft.',
      path: '/portfolio',
      robots: 'noindex,nofollow',
    });
    this.siteId = this.route.snapshot.paramMap.get('siteId') ?? '';
    if (!this.siteId) {
      this.loading.set(false);
      this.saveError.set('Missing portfolio id.');
      return;
    }
    try {
      const [components, draft] = await Promise.all([
        this.portfolio.listComponents().catch(() => []),
        this.portfolio.loadDraft(this.siteId),
      ]);
      this.components.set(components);
      this.site.set(draft.site);
      this.applyDraft(draft.document, draft.site.revision);
      this.siteForm = {
        name: draft.site.name,
        slug: draft.site.slug,
        defaultLocale: draft.site.defaultLocale,
        locales: draft.site.locales.join(', '),
      };
      await this.loadVersions();
      await this.loadDomains();
    } catch (error) {
      this.saveError.set(this.errorMessage(error, 'Could not load this portfolio.'));
    } finally {
      this.loading.set(false);
      if (!this.tourService.isSeen()) {
        this.tourService.start();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.saveTimer != null) clearTimeout(this.saveTimer);
    if (this.saveState() === 'dirty') void this.save();
  }

  // â”€â”€ Keyboard Shortcuts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  @HostListener('document:keydown', ['$event'])
  onGlobalKeydown(event: KeyboardEvent): void {
    if (this.loading() || !this.doc()) return;
    const mod = event.ctrlKey || event.metaKey;
    const target = event.target as HTMLElement | null;
    const inTextInput = Boolean(
      target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable),
    );

    if (mod && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.commandPaletteVisible.update((v) => !v);
      return;
    }

    if (mod && event.key.toLowerCase() === 'b') {
      event.preventDefault();
      this.layersCollapsed.update((v) => !v);
      return;
    }

    if (mod && event.key.toLowerCase() === 'i') {
      event.preventDefault();
      this.inspectorCollapsed.update((v) => !v);
      return;
    }

    if (mod && event.shiftKey && event.key.toLowerCase() === 'v') {
      event.preventDefault();
      void this.validateNow();
      return;
    }

    if (mod && event.key === '0') {
      event.preventDefault();
      this.zoom.set(100);
      return;
    }

    if (mod && (event.key === '=' || event.key === '+')) {
      event.preventDefault();
      this.zoom.update((z) => Math.min(125, z + 15));
      return;
    }

    if (mod && event.key === '-') {
      event.preventDefault();
      this.zoom.update((z) => Math.max(50, z - 15));
      return;
    }

    if (inTextInput) return;

    if (event.key === 'Escape') {
      if (this.ctxVisible()) {
        this.ctxVisible.set(false);
        return;
      }
      if (this.previewOnly()) {
        this.previewOnly.set(false);
        return;
      }
    }

    if (mod && event.altKey && event.key.toLowerCase() === 'c') {
      event.preventDefault();
      this.copySelectedStyle();
      return;
    }

    if (mod && event.altKey && event.key.toLowerCase() === 'v') {
      event.preventDefault();
      this.pasteStyleToSelected();
      return;
    }

    if (mod && !event.shiftKey && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      this.undo();
      return;
    }

    if ((mod && event.key.toLowerCase() === 'y') || (mod && event.shiftKey && event.key.toLowerCase() === 'z')) {
      event.preventDefault();
      this.redo();
      return;
    }

    if (mod && event.key.toLowerCase() === 'd') {
      const id = this.selectedId();
      if (id) {
        event.preventDefault();
        this.duplicateSection(id);
      }
      return;
    }

    if (mod && event.key.toLowerCase() === 'c') {
      const id = this.selectedId();
      if (id) {
        event.preventDefault();
        this.copySection(id);
      }
      return;
    }

    if (mod && event.key.toLowerCase() === 'v') {
      if (this.copiedSection()) {
        event.preventDefault();
        this.pasteSection(this.selectedId() ?? undefined);
      }
      return;
    }

    if (event.altKey && event.key === 'ArrowUp') {
      const id = this.selectedId();
      if (id) {
        event.preventDefault();
        this.moveSection(id, -1);
      }
      return;
    }

    if (event.altKey && event.key === 'ArrowDown') {
      const id = this.selectedId();
      if (id) {
        event.preventDefault();
        this.moveSection(id, 1);
      }
      return;
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      const id = this.selectedId();
      if (id) {
        event.preventDefault();
        this.removeSection(id);
      }
      return;
    }

    switch (event.key.toLowerCase()) {
      case '1':
        this.device.set('desktop');
        break;
      case '2':
        this.device.set('tablet');
        break;
      case '3':
        this.device.set('mobile');
        break;
      case 'a':
        event.preventDefault();
        this.openSectionPicker();
        break;
      case 'd':
        this.inspectorCollapsed.set(false);
        this.openTab('design');
        break;
      case 'h':
        if (this.selectedId()) this.toggleHidden(this.selectedId()!);
        break;
      case 'p':
        this.previewOnly.update((v) => !v);
        break;
      case '?':
        this.shortcutsVisible.update((v) => !v);
        break;
    }
  }

  private applyDraft(document: PortfolioDocument, revision: number): void {
    this.doc.set(this.clone(document));
    this.revision.set(revision);
    this.locale.set(document.site.defaultLocale);
    this.selectedId.set(document.pages[0]?.sections[0]?.id ?? null);
    this.undoStack = [];
    this.redoStack = [];
    this.syncHistoryDepth();
    this.saveState.set('saved');
    this.saveError.set('');
    this.validation.set(null);
    this.lastSavedAt.set(null);
  }

  // â”€â”€ Autosave / history â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  private clone(document: PortfolioDocument): PortfolioDocument {
    return JSON.parse(JSON.stringify(document)) as PortfolioDocument;
  }

  private mutate(
    update: (document: PortfolioDocument) => void,
    options: { history?: boolean } = {},
  ): void {
    const current = this.doc();
    if (!current) return;
    const next = this.clone(current);
    update(next);
    if (options.history !== false) {
      this.undoStack.push(JSON.stringify(current));
      if (this.undoStack.length > HISTORY_LIMIT) this.undoStack.shift();
      this.redoStack = [];
      this.syncHistoryDepth();
    }
    this.doc.set(next);
    this.mutationCount += 1;
    this.saveState.set('dirty');
    this.saveError.set('');
    this.validation.set(null);
    this.scheduleSave();
  }

  private syncHistoryDepth(): void {
    this.undoDepth.set(this.undoStack.length);
    this.redoDepth.set(this.redoStack.length);
  }

  private scheduleSave(): void {
    if (this.saveTimer != null) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      void this.save();
    }, AUTOSAVE_MS);
  }

  private save(): Promise<void> {
    if (this.savePromise) return this.savePromise;
    this.savePromise = this.runSave().finally(() => {
      this.savePromise = null;
    });
    return this.savePromise;
  }

  private async runSave(): Promise<void> {
    const document = this.doc();
    const site = this.site();
    if (!document || !site || this.saveState() === 'conflict') return;
    this.revisionAtSave = this.mutationCount;
    this.saveState.set('saving');
    this.saveError.set('');
    try {
      const result = await this.portfolio.saveDraft(
        site.id,
        document,
        this.revision(),
      );
      this.revision.set(result.revision);
      this.site.set(result.site);
      this.lastSavedAt.set(new Date().toISOString());
      if (this.mutationCount === this.revisionAtSave) {
        this.saveState.set('saved');
      } else {
        this.saveState.set('dirty');
        this.scheduleSave();
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 409) {
        this.saveState.set('conflict');
        this.saveError.set('This draft changed in another session. Reload it before continuing.');
      } else {
        this.saveState.set('error');
        this.saveError.set(this.errorMessage(error, 'Autosave failed. Try again.'));
        void this.runValidation(true);
      }
    }
  }

  private async flushSave(): Promise<boolean> {
    if (this.saveTimer != null) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    if (this.saveState() === 'conflict') return false;
    if (this.saveState() !== 'saved') await this.save();
    return this.saveState() === 'saved';
  }

  async retrySave(): Promise<void> {
    this.saveState.set('dirty');
    await this.save();
  }

  async reloadDraft(): Promise<void> {
    try {
      const draft = await this.portfolio.loadDraft(this.siteId);
      this.site.set(draft.site);
      this.applyDraft(draft.document, draft.site.revision);
      this.toast.success('Latest draft loaded.');
    } catch (error) {
      this.toast.error(this.errorMessage(error, 'Could not reload the draft.'));
    }
  }

  undo(): void {
    const previous = this.undoStack.pop();
    if (!previous) return;
    const current = this.doc();
    if (current) this.redoStack.push(JSON.stringify(current));
    this.syncHistoryDepth();
    this.doc.set(JSON.parse(previous) as PortfolioDocument);
    this.mutationCount += 1;
    this.saveState.set('dirty');
    this.scheduleSave();
  }

  redo(): void {
    const next = this.redoStack.pop();
    if (!next) return;
    const current = this.doc();
    if (current) this.undoStack.push(JSON.stringify(current));
    this.syncHistoryDepth();
    this.doc.set(JSON.parse(next) as PortfolioDocument);
    this.mutationCount += 1;
    this.saveState.set('dirty');
    this.scheduleSave();
  }

  // â”€â”€ Sections â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  select(sectionId: string): void {
    this.selectedId.set(sectionId);
    this.codeNotice.set('');
  }

  private findSection(
    document: PortfolioDocument,
    sectionId: string | null,
  ): PortfolioSection | undefined {
    return document.pages[0]?.sections.find((section) => section.id === sectionId);
  }

  selectedProps(): Record<string, unknown> {
    return this.selectedSection()?.props ?? {};
  }

  openSectionPicker(insertIndex: number | null = null): void {
    this.sectionInsertIndex.set(insertIndex);
    this.sectionPickerVisible.set(true);
  }

  onPickSectionType(type: PortfolioSectionType): void {
    this.addType.set(type);
    this.addSectionAt(type, this.sectionInsertIndex());
    this.sectionInsertIndex.set(null);
  }

  addSection(): void {
    this.addSectionAt(this.addType(), null);
  }

  addSectionAt(type: PortfolioSectionType, index: number | null): void {
    const definition = this.components().find((component) => component.type === type);
    if (!definition) return;
    const id = `${type}-${Date.now().toString(36)}`;
    const locale = this.activeLocale();
    const section: PortfolioSection = {
      id,
      type,
      variant: definition.defaultVariant,
      hidden: false,
      props: this.defaultProps(definition.fields, locale),
    };
    this.mutate((document) => {
      const page = document.pages[0];
      if (!page) return;
      if (index != null && index >= 0 && index <= page.sections.length) {
        page.sections.splice(index, 0, section);
      } else {
        page.sections.push(section);
      }
      if (type !== 'hero' && type !== 'custom-code') {
        document.navigation.push({
          id: `nav-${id}`,
          label: { [locale]: definition.label },
          target: `#${id}`,
        });
      }
    });
    this.selectedId.set(id);
  }

  removeSection(sectionId: string): void {
    this.mutate((document) => {
      const page = document.pages[0];
      if (!page) return;
      page.sections = page.sections.filter((section) => section.id !== sectionId);
      document.navigation = document.navigation.filter(
        (item) => item.target !== `#${sectionId}`,
      );
    });
    if (this.selectedId() === sectionId) {
      this.selectedId.set(this.sections()[0]?.id ?? null);
    }
  }

  duplicateSection(sectionId: string): void {
    const source = this.sections().find((section) => section.id === sectionId);
    if (!source) return;
    const id = `${source.type}-${Date.now().toString(36)}`;
    this.mutate((document) => {
      const page = document.pages[0];
      if (!page) return;
      const index = page.sections.findIndex((section) => section.id === sectionId);
      const copy = this.cloneSection({ ...source, id }, document);
      page.sections.splice(index + 1, 0, copy);
      if (source.type !== 'hero' && source.type !== 'custom-code') {
        document.navigation.push({
          id: `nav-${id}`,
          label: { [this.activeLocale()]: sectionLabel(source.type) },
          target: `#${id}`,
        });
      }
    });
    this.selectedId.set(id);
  }

  copySection(sectionId: string): void {
    const source = this.sections().find((s) => s.id === sectionId);
    if (!source) return;
    this.copiedSection.set(JSON.parse(JSON.stringify(source)) as PortfolioSection);
    this.toast.success(`${sectionLabel(source.type)} copied.`);
  }

  pasteSection(afterSectionId?: string): void {
    const source = this.copiedSection();
    if (!source) return;
    const id = `${source.type}-${Date.now().toString(36)}`;
    this.mutate((document) => {
      const page = document.pages[0];
      if (!page) return;
      const copy = this.cloneSection({ ...source, id }, document);
      const idx = afterSectionId
        ? page.sections.findIndex((s) => s.id === afterSectionId)
        : -1;
      if (idx >= 0) {
        page.sections.splice(idx + 1, 0, copy);
      } else {
        page.sections.push(copy);
      }
      if (source.type !== 'hero' && source.type !== 'custom-code') {
        document.navigation.push({
          id: `nav-${id}`,
          label: { [this.activeLocale()]: sectionLabel(source.type) },
          target: `#${id}`,
        });
      }
    });
    this.selectedId.set(id);
  }

  private cloneSection(section: PortfolioSection, document: PortfolioDocument): PortfolioSection {
    void document;
    return JSON.parse(JSON.stringify(section)) as PortfolioSection;
  }

  moveSection(sectionId: string, direction: -1 | 1): void {
    this.mutate((document) => {
      const sections = document.pages[0]?.sections;
      if (!sections) return;
      const index = sections.findIndex((section) => section.id === sectionId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= sections.length) return;
      const [item] = sections.splice(index, 1);
      if (item) sections.splice(target, 0, item);
    });
  }

  toggleHidden(sectionId: string): void {
    this.mutate((document) => {
      const section = this.findSection(document, sectionId);
      if (section) section.hidden = !section.hidden;
    });
  }

  setVariant(sectionId: string, variant: string): void {
    this.mutate((document) => {
      const section = this.findSection(document, sectionId);
      if (section) section.variant = variant;
    });
  }

  // â”€â”€ Style Clipboard & Presets â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  copySelectedStyle(sectionId?: string): void {
    const target = sectionId
      ? this.sections().find((s) => s.id === sectionId)
      : this.selectedSection();
    if (!target) return;
    this.copiedStyle.set({ ...(target.style ?? {}) });
    this.toast.success('Section style copied.');
  }

  pasteStyleToSelected(sectionId?: string): void {
    const clipboard = this.copiedStyle();
    const id = sectionId ?? this.selectedId();
    if (!clipboard || !id) return;
    this.mutate((document) => {
      const section = this.findSection(document, id);
      if (!section) return;
      section.style = Object.keys(clipboard).length ? { ...clipboard } : undefined;
    });
    this.toast.success('Style applied.');
  }

  applySurfacePreset(preset: 'default' | 'soft' | 'tint' | 'dark'): void {
    const id = this.selectedId();
    if (!id) return;
    this.mutate((document) => {
      const section = this.findSection(document, id);
      if (!section) return;
      const next: PortfolioSectionStyle = { ...(section.style ?? {}) };
      const tokens = document.theme.tokens;
      if (preset === 'default') {
        delete next.backgroundColor;
        delete next.textColor;
      } else if (preset === 'soft') {
        next.backgroundColor = document.theme.mode === 'dark' ? '#1b162b' : '#f4f4f8';
        delete next.textColor;
      } else if (preset === 'tint') {
        next.backgroundColor = tokens.accent;
        next.textColor = '#ffffff';
      } else {
        next.backgroundColor = '#111116';
        next.textColor = '#f5f5f7';
      }
      section.style = Object.keys(next).length ? next : undefined;
    });
  }

  setCtaLink(value: string): void {
    const sec = this.selectedSection();
    if (!sec) return;
    const key = sec.type === 'cta' ? 'buttonHref' : 'primaryCtaHref';
    this.setProp(key, value);
  }

  // â”€â”€ Context Menu Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  openSectionContextMenu(event: { sectionId: string; x: number; y: number }): void {
    this.select(event.sectionId);
    this.ctxScope.set('section');
    this.ctxSectionId.set(event.sectionId);
    this.ctxX.set(event.x);
    this.ctxY.set(event.y);
    this.ctxVisible.set(true);
  }

  openCanvasContextMenu(event: { x: number; y: number }): void {
    this.ctxScope.set('canvas');
    this.ctxSectionId.set(null);
    this.ctxX.set(event.x);
    this.ctxY.set(event.y);
    this.ctxVisible.set(true);
  }

  openNavContextMenu(event: { x: number; y: number }): void {
    this.ctxScope.set('nav');
    this.ctxSectionId.set(null);
    this.ctxX.set(event.x);
    this.ctxY.set(event.y);
    this.ctxVisible.set(true);
  }

  openContextMenuFromButton(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const id = this.selectedId();
    if (id) {
      this.openSectionContextMenu({ sectionId: id, x: rect.left, y: rect.bottom + 6 });
    } else {
      this.openCanvasContextMenu({ x: rect.left, y: rect.bottom + 6 });
    }
  }

  onContextMenuAction(event: { action: string; sectionId?: string }): void {
    const id = event.sectionId ?? this.selectedId();
    switch (event.action) {
      case 'edit-content':
        if (id) this.select(id);
        this.inspectorCollapsed.set(false);
        this.openTab('content');
        break;
      case 'edit-design':
        if (id) this.select(id);
        this.inspectorCollapsed.set(false);
        this.openTab('design');
        break;
      case 'align-left':
        if (id) this.select(id);
        this.setSectionStyle('textAlign', 'left');
        break;
      case 'align-center':
        if (id) this.select(id);
        this.setSectionStyle('textAlign', 'center');
        break;
      case 'align-right':
        if (id) this.select(id);
        this.setSectionStyle('textAlign', 'right');
        break;
      case 'ai-assist':
        this.aiModalVisible.set(true);
        break;
      case 'duplicate':
        if (id) this.duplicateSection(id);
        break;
      case 'copy-section':
        if (id) this.copySection(id);
        break;
      case 'paste-section':
        this.pasteSection(id ?? undefined);
        break;
      case 'copy-style':
        this.copySelectedStyle(id ?? undefined);
        break;
      case 'paste-style':
        this.pasteStyleToSelected(id ?? undefined);
        break;
      case 'reset-style':
        if (id) this.select(id);
        this.resetSectionStyles();
        break;
      case 'move-up':
        if (id) this.moveSection(id, -1);
        break;
      case 'move-down':
        if (id) this.moveSection(id, 1);
        break;
      case 'toggle-hidden':
        if (id) this.toggleHidden(id);
        break;
      case 'add-section-above': {
        const idx = id ? this.sections().findIndex((s) => s.id === id) : 0;
        this.openSectionPicker(Math.max(0, idx));
        break;
      }
      case 'add-section-below': {
        const idx = id ? this.sections().findIndex((s) => s.id === id) : -1;
        this.openSectionPicker(idx >= 0 ? idx + 1 : null);
        break;
      }
      case 'delete':
        if (id) this.removeSection(id);
        break;
      case 'add-section':
        this.openSectionPicker(null);
        break;
      case 'zoom-100':
        this.zoom.set(100);
        break;
      case 'toggle-guides':
        this.showGuides.update((v) => !v);
        break;
      case 'toggle-sidebar':
        this.layersCollapsed.update((v) => !v);
        break;
      case 'toggle-preview':
        this.previewOnly.update((v) => !v);
        break;
      case 'validate':
        void this.validateNow();
        break;
      case 'add-nav':
        this.addNavItem();
        break;
      case 'sync-nav':
        this.syncNavFromSections();
        break;
    }
  }

  // â”€â”€ AI Copy Assist â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async onGenerateAiCopy(input: PortfolioAiGenerateInput): Promise<void> {
    this.aiBusy.set(true);
    try {
      this.aiResult.set(await this.portfolio.generateCopy(input));
    } catch (error) {
      this.toast.error(this.errorMessage(error, 'Could not generate copy.'));
    } finally {
      this.aiBusy.set(false);
    }
  }

  onApplyAiField(event: {
    target: 'headline' | 'subheadline' | 'bio' | 'skills';
    value?: string;
    values?: string[];
  }): void {
    const locale = this.activeLocale();
    this.mutate((document) => {
      const sections = document.pages[0]?.sections ?? [];
      if (event.target === 'headline' || event.target === 'subheadline') {
        const hero = sections.find((s) => s.type === 'hero');
        if (!hero || event.value == null) return;
        const prev = (hero.props[event.target] as Record<string, string> | undefined) ?? {};
        hero.props[event.target] = { ...prev, [locale]: event.value };
      } else if (event.target === 'bio') {
        const about = sections.find((s) => s.type === 'about');
        if (!about || event.value == null) return;
        const prev = (about.props['body'] as Record<string, string> | undefined) ?? {};
        about.props['body'] = { ...prev, [locale]: event.value };
      } else if (event.target === 'skills') {
        const skills = sections.find((s) => s.type === 'skills');
        if (!skills || !event.values?.length) return;
        skills.props['items'] = [...event.values];
      }
    });
    this.toast.success('Proposal applied to draft.');
  }

  onApplyAllAi(result: PortfolioAiGenerateResult): void {
    const locale = this.activeLocale();
    this.mutate((document) => {
      const sections = document.pages[0]?.sections ?? [];
      const hero = sections.find((s) => s.type === 'hero');
      if (hero) {
        const hPrev = (hero.props['headline'] as Record<string, string> | undefined) ?? {};
        const sPrev = (hero.props['subheadline'] as Record<string, string> | undefined) ?? {};
        hero.props['headline'] = { ...hPrev, [locale]: result.headline };
        hero.props['subheadline'] = { ...sPrev, [locale]: result.subheadline };
      }
      const about = sections.find((s) => s.type === 'about');
      if (about) {
        const bPrev = (about.props['body'] as Record<string, string> | undefined) ?? {};
        about.props['body'] = { ...bPrev, [locale]: result.bio };
      }
      const skills = sections.find((s) => s.type === 'skills');
      if (skills && result.suggestedSkills.length) {
        skills.props['items'] = [...result.suggestedSkills];
      }
    });
    this.aiModalVisible.set(false);
    this.toast.success('AI copy proposals applied.');
  }

  // â”€â”€ Media Library â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async openMediaPicker(target: MediaTarget): Promise<void> {
    this.mediaTarget = target;
    this.mediaModalVisible.set(true);
    this.mediaBusy.set(true);
    try {
      this.mediaAssets.set(await this.portfolio.listMedia());
    } catch {
      this.mediaAssets.set([]);
    } finally {
      this.mediaBusy.set(false);
    }
  }

  async onUploadMedia(file: File): Promise<void> {
    this.mediaBusy.set(true);
    try {
      const uploaded = await this.imageUpload.upload(file, 'portfolio');
      if (!uploaded) {
        this.toast.error(this.imageUpload.error() ?? 'Could not upload image.');
        return;
      }
      const media = await this.portfolio.addMedia(uploaded.url, uploaded.id);
      this.mediaAssets.update((list) => [media, ...list]);
      this.toast.success('Image uploaded and added to the media library.');
    } finally {
      this.mediaBusy.set(false);
    }
  }

  async onAddMediaUrl(url: string): Promise<void> {
    this.mediaBusy.set(true);
    try {
      const asset = await this.portfolio.addMedia(url);
      this.mediaAssets.update((list) => [asset, ...list]);
      this.toast.success('Saved to media library.');
    } catch (error) {
      this.toast.error(this.errorMessage(error, 'Enter a valid http(s) image URL.'));
    } finally {
      this.mediaBusy.set(false);
    }
  }

  async onDeleteMediaAsset(id: string): Promise<void> {
    try {
      await this.portfolio.deleteMedia(id);
      this.mediaAssets.update((list) => list.filter((a) => a.id !== id));
    } catch {
      this.toast.error('Could not delete media item.');
    }
  }

  onPickMediaUrl(url: string): void {
    const target = this.mediaTarget;
    if (!target) return;
    if (target.kind === 'prop') {
      this.setProp(target.key, url);
    } else if (target.kind === 'row') {
      this.setRowText(target.fieldKey, target.rowIndex, target.nestedKey, url);
    } else if (target.kind === 'styleBg') {
      this.setSectionStyle('backgroundImage', url);
    }
    this.mediaTarget = null;
  }

  // â”€â”€ Property editing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  localized(value: unknown): string {
    return localizedValue(value, this.activeLocale(), this.defaultLocale());
  }

  setLocalized(key: string, value: string): void {
    this.updateSelected((section) => {
      const previous =
        section.props[key] && typeof section.props[key] === 'object'
          ? (section.props[key] as Record<string, string>)
          : {};
      section.props[key] = { ...previous, [this.activeLocale()]: value };
    });
  }

  setProp(key: string, value: string): void {
    this.updateSelected((section) => {
      section.props[key] = value;
    });
  }

  setToggle(key: string, value: boolean): void {
    this.updateSelected((section) => {
      section.props[key] = value;
    });
  }

  setCode(key: string, value: string): void {
    const now = Date.now();
    const coalesce = this.lastCodeEdit.key === key && now - this.lastCodeEdit.at < 900;
    this.lastCodeEdit = { key, at: now };
    this.updateSelected(
      (section) => {
        section.props[key] = value;
      },
      { history: !coalesce },
    );
  }

  setNumber(key: string, value: number | null): void {
    this.updateSelected((section) => {
      section.props[key] = value == null ? '' : String(value);
    });
  }

  // â”€â”€ Custom code â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  codeValue(value: unknown): string {
    return typeof value === 'string' ? value : '';
  }

  codeBytes(value: unknown): number {
    return codeByteLength(value);
  }

  codeLines(value: unknown): number {
    return codeLineCount(value);
  }

  canSplitPage(section: PortfolioSection): boolean {
    return /<html[\s>]|<body[\s>]|<head[\s>]|<style[\s>]|<script[\s>]/i.test(
      this.codeValue(section.props['html']),
    );
  }

  splitPage(): void {
    const section = this.selectedSection();
    if (!section) return;
    const split = splitCustomCodePage(this.codeValue(section.props['html']));
    this.updateSelected((target) => {
      target.props['html'] = split.html;
      if (split.css) target.props['css'] = split.css;
      if (split.js) target.props['js'] = split.js;
    });
    const parts = ['HTML'];
    if (split.css) parts.push('CSS');
    if (split.js) parts.push('JS');
    this.codeNotice.set(`${parts.join(' + ')}`);
  }

  importCodeFromToolbar(): void {
    const definition = this.components().find((component) => component.type === 'custom-code');
    if (!definition) {
      this.toast.error(
        'Custom code is unavailable. Restart the API server so it serves the updated component registry.',
      );
      return;
    }
    if (this.sections().length > 0) {
      const ok = window.confirm(
        'Replace the current portfolio content with the imported file? Your existing sections will be removed.',
      );
      if (!ok) return;
    }
    this.mutate((document) => {
      const page = document.pages[0];
      if (!page) return;
      page.sections = [];
      document.navigation = [];
    });
    this.addType.set('custom-code');
    this.addSection();
    this.inspectorCollapsed.set(false);
    this.openTab('content');
    this.triggerCodeImport('html');
  }

  triggerCodeImport(fieldKey: string): void {
    const accept =
      fieldKey === 'css'
        ? '.css'
        : fieldKey === 'js'
          ? '.js,.mjs'
          : '.html,.htm,.css,.js,.mjs';
    this.codeImportAccept.set(accept);
    this.codeImportSectionId = this.selectedId();
    const input = this.codeFileInput?.nativeElement;
    if (!input) return;
    input.accept = accept;
    input.click();
  }

  async onCodeFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    const sectionId = this.codeImportSectionId;
    this.codeImportSectionId = null;
    if (!files.length || !sectionId) return;

    const notes: string[] = [];
    let html = '';
    let css = '';
    let js = '';
    let titleFromFile = '';

    for (const file of files) {
      if (file.size > 512_000) {
        notes.push(`${file.name}: larger than 512 KB`);
        continue;
      }
      const extension = (file.name.split('.').pop() ?? '').toLowerCase();
      const source = await file.text();
      if (extension === 'html' || extension === 'htm') {
        const split = splitCustomCodePage(source);
        html = split.html;
        if (split.css) css = split.css;
        if (split.js) js = split.js;
        if (!titleFromFile) titleFromFile = this.titleFromFileName(file.name);
        notes.push(
          `${file.name}: HTML${split.css ? ' + CSS' : ''}${split.js ? ' + JS' : ''}`,
        );
      } else if (extension === 'css') {
        css = source;
        notes.push(`${file.name}: CSS`);
      } else if (extension === 'js' || extension === 'mjs') {
        js = source;
        notes.push(`${file.name}: JS`);
      } else {
        notes.push(`${file.name}: use .html, .css or .js`);
      }
    }

    const external = usesExternalResources(html, css, js);
    if (external) notes.push('external enabled');
    this.codeNotice.set(notes.join(' Â· '));
    if (!html && !css && !js) return;
    this.mutate((document) => {
      const section = this.findSection(document, sectionId);
      if (!section) return;
      if (html) section.props['html'] = html;
      if (css) section.props['css'] = css;
      if (js) section.props['js'] = js;
      if (titleFromFile && !this.codeValue(section.props['title']).trim()) {
        section.props['title'] = titleFromFile;
      }
      if (external) section.props['allowExternal'] = true;
    });
    this.toast.success(this.codeNotice() || 'Code imported.');
  }

  private titleFromFileName(name: string): string {
    return name
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .trim()
      .slice(0, 120);
  }

  private updateSelected(
    update: (section: PortfolioSection) => void,
    options: { history?: boolean } = {},
  ): void {
    const id = this.selectedId();
    if (!id) return;
    this.mutate((document) => {
      const section = this.findSection(document, id);
      if (section) update(section);
    }, options);
  }

  fieldTooltip(field: PortfolioPropField): string {
    if (field.kind === 'image') return 'Accepts http(s) image URLs';
    if (field.kind === 'url') return 'Accepts https:, http:, mailto:, tel: or #anchor';
    if (field.kind === 'number') {
      return `Range ${field.min ?? 0}â€“${field.max ?? 'âˆž'}`;
    }
    if (field.kind === 'code') {
      return 'Sandboxed opaque origin; no access to app cookies or DOM';
    }
    if (field.kind === 'localizedText' || field.kind === 'localizedTextarea') {
      return `Localized for ${this.activeLocale()}`;
    }
    return '';
  }

  emptyValue(field: PortfolioPropField): unknown {
    switch (field.kind) {
      case 'localizedText':
      case 'localizedTextarea':
        return { [this.activeLocale()]: '' };
      case 'textList':
      case 'objectList':
        return [];
      case 'toggle':
        return false;
      case 'number':
        return field.defaultValue ?? String(field.min ?? 0);
      default:
        return '';
    }
  }

  defaultProps(fields: PortfolioPropField[], locale: string): Record<string, unknown> {
    const props: Record<string, unknown> = {};
    for (const field of fields) {
      switch (field.kind) {
        case 'localizedText':
        case 'localizedTextarea':
          props[field.key] = { [locale]: '' };
          break;
        case 'textList':
        case 'objectList':
          props[field.key] = [];
          break;
        case 'toggle':
          props[field.key] = field.defaultValue === 'true';
          break;
        case 'number':
          props[field.key] = field.defaultValue ?? String(field.min ?? 0);
          break;
        default:
          props[field.key] = '';
      }
    }
    return props;
  }

  stringList(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is string => typeof item === 'string');
  }

  objectRows(value: unknown): Array<Record<string, unknown>> {
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === 'object' && !Array.isArray(item),
    );
  }

  updateListItem(fieldKey: string, index: number, value: string): void {
    this.updateSelected((section) => {
      const items = section.props[fieldKey];
      if (!Array.isArray(items)) return;
      items[index] = value;
    });
  }

  addListItem(fieldKey: string): void {
    this.updateSelected((section) => {
      const items = section.props[fieldKey];
      if (Array.isArray(items)) items.push('');
    });
  }

  removeListItem(fieldKey: string, index: number): void {
    this.updateSelected((section) => {
      const items = section.props[fieldKey];
      if (Array.isArray(items)) items.splice(index, 1);
    });
  }

  rowText(row: Record<string, unknown>, key: string): string {
    return this.localized(row[key]);
  }

  setRowLocalized(fieldKey: string, index: number, key: string, value: string): void {
    this.updateSelected((section) => {
      const rows = section.props[fieldKey];
      if (!Array.isArray(rows)) return;
      const row = rows[index];
      if (!row || typeof row !== 'object') return;
      const previous =
        row[key] && typeof row[key] === 'object' ? (row[key] as Record<string, string>) : {};
      (row as Record<string, unknown>)[key] = { ...previous, [this.activeLocale()]: value };
    });
  }

  setRowText(fieldKey: string, index: number, key: string, value: string): void {
    this.updateSelected((section) => {
      const rows = section.props[fieldKey];
      if (!Array.isArray(rows)) return;
      const row = rows[index];
      if (row && typeof row === 'object') {
        (row as Record<string, unknown>)[key] = value;
      }
    });
  }

  setRowList(fieldKey: string, index: number, key: string, value: string): void {
    this.updateSelected((section) => {
      const rows = section.props[fieldKey];
      if (!Array.isArray(rows)) return;
      const row = rows[index];
      if (!row || typeof row !== 'object') return;
      (row as Record<string, unknown>)[key] = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    });
  }

  addRow(field: PortfolioPropField): void {
    this.updateSelected((section) => {
      const rows = section.props[field.key];
      if (!Array.isArray(rows)) return;
      const row: Record<string, unknown> = {};
      for (const nested of field.itemFields ?? []) {
        row[nested.key] = this.emptyValue(nested);
      }
      rows.push(row);
    });
  }

  removeRow(fieldKey: string, index: number): void {
    this.updateSelected((section) => {
      const rows = section.props[fieldKey];
      if (Array.isArray(rows)) rows.splice(index, 1);
    });
  }

  moveRow(fieldKey: string, index: number, direction: -1 | 1): void {
    this.updateSelected((section) => {
      const rows = section.props[fieldKey];
      if (!Array.isArray(rows)) return;
      const target = index + direction;
      if (target < 0 || target >= rows.length) return;
      const [row] = rows.splice(index, 1);
      if (row) rows.splice(target, 0, row);
    });
  }

  sectionCountLabel(type: PortfolioSectionType): string {
    return sectionLabel(type);
  }

  // â”€â”€ Theme & Brand Kit Presets â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  applyThemePreset(preset: ThemePalettePreset): void {
    this.mutate((document) => {
      document.theme.mode = preset.mode;
      document.theme.tokens.primary = preset.primary;
      document.theme.tokens.accent = preset.accent;
      document.theme.tokens.surface = preset.surface;
      document.theme.tokens.text = preset.text;
    });
  }

  applyFontPairing(pairing: FontPairingPreset): void {
    this.mutate((document) => {
      document.theme.tokens.fontHeading = pairing.heading;
      document.theme.tokens.fontBody = pairing.body;
    });
  }

  setThemeMode(mode: PortfolioThemeMode): void {
    this.mutate((document) => {
      document.theme.mode = mode;
    });
  }

  setToken(key: string, value: string): void {
    this.mutate((document) => {
      (document.theme.tokens as unknown as Record<string, string>)[key] = value;
    });
  }

  setFont(key: 'fontHeading' | 'fontBody', value: string): void {
    this.setToken(key, value);
  }

  setRadius(value: 'sm' | 'md' | 'lg'): void {
    this.mutate((document) => {
      document.theme.tokens.radius = value;
    });
  }

  setDensity(value: 'compact' | 'comfortable'): void {
    this.mutate((document) => {
      document.theme.tokens.density = value;
    });
  }

  setSeo(key: 'title' | 'description', value: string): void {
    this.mutate((document) => {
      const seo = document.pages[0]?.seo;
      if (!seo) return;
      const previous = seo[key];
      seo[key] = {
        ...(previous ?? {}),
        [this.activeLocale()]: value,
      };
    });
  }

  // â”€â”€ Site settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async saveSiteSettings(): Promise<void> {
    const site = this.site();
    if (!site) return;
    this.busy.set(true);
    try {
      const locales = this.siteForm.locales
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      if (!locales.includes(this.siteForm.defaultLocale)) {
        locales.unshift(this.siteForm.defaultLocale);
      }
      const updated = await this.portfolio.updateSite(site.id, {
        name: this.siteForm.name,
        slug: this.siteForm.slug,
        defaultLocale: this.siteForm.defaultLocale,
        locales,
      });
      this.site.set(updated);
      const draft = await this.portfolio.loadDraft(site.id);
      this.applyDraft(draft.document, draft.site.revision);
      this.siteForm = {
        name: updated.name,
        slug: updated.slug,
        defaultLocale: updated.defaultLocale,
        locales: updated.locales.join(', '),
      };
      this.showSiteSettings.set(false);
      this.toast.success('Site settings saved.');
    } catch (error) {
      this.toast.error(this.errorMessage(error, 'Could not save site settings.'));
    } finally {
      this.busy.set(false);
    }
  }

  // â”€â”€ Guided tour â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  openTour(): void {
    this.layersCollapsed.set(false);
    this.inspectorCollapsed.set(false);
    this.previewOnly.set(false);
    this.tourService.start();
    this.onTourStepChange(this.tourService.current());
  }

  onTourStepChange(step: TourStep | null): void {
    if (!step) return;
    if (step.id === 'publish' || step.id === 'versions') {
      this.inspectorCollapsed.set(false);
      this.openTab('publish');
      setTimeout(() => this.tourService.measure(), 0);
    } else if (step.id === 'content') {
      this.inspectorCollapsed.set(false);
      this.openTab('content');
      setTimeout(() => this.tourService.measure(), 0);
    }
  }

  // â”€â”€ Validation / publishing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  openTab(tab: EditorTab): void {
    this.tab.set(tab);
    if (tab === 'publish') void this.loadVersions();
    if (tab === 'insights') void this.loadAnalytics();
    if (tab === 'domain') void this.loadDomains();
  }

  async loadDomains(): Promise<void> {
    const site = this.site();
    if (!site) return;
    try {
      this.domains.set(await this.portfolio.listDomains(site.id));
    } catch {
      this.domains.set([]);
    }
  }

  async createDomain(input: {
    hostname: string;
    verificationMethod?: 'TXT' | 'CNAME';
  }): Promise<void> {
    const site = this.site();
    if (!site) return;
    this.domainBusy.set(true);
    try {
      const created = await this.portfolio.createDomain(site.id, input);
      this.domains.update((items) =>
        [...items.filter((domain) => domain.hostname !== created.hostname), created],
      );
      this.toast.success(
        `Domain ${created.hostname} added. Publish the TXT or CNAME record, then verify.`,
      );
    } catch (error) {
      this.toast.error(this.errorMessage(error, 'Could not add this domain.'));
    } finally {
      this.domainBusy.set(false);
    }
  }

  async verifyDomain(domainId: string, token?: string): Promise<void> {
    this.domainBusy.set(true);
    try {
      const verified = await this.portfolio.verifyDomain(domainId, token);
      this.domains.update((items) =>
        items.map((domain) => (domain.id === verified.id ? verified : domain)),
      );
      this.toast.success(`Domain ${verified.hostname} verified.`);
    } catch (error) {
      this.toast.error(this.errorMessage(error, 'Could not verify this domain.'));
    } finally {
      this.domainBusy.set(false);
    }
  }

  async removeDomain(domainId: string): Promise<void> {
    this.domainBusy.set(true);
    try {
      await this.portfolio.removeDomain(domainId);
      this.domains.update((items) => items.filter((domain) => domain.id !== domainId));
      this.toast.success('Domain detached.');
    } catch (error) {
      this.toast.error(this.errorMessage(error, 'Could not remove this domain.'));
    } finally {
      this.domainBusy.set(false);
    }
  }

  setDomainProof(domainId: string, value: string): void {
    this.domainProofs.update((proofs) => ({ ...proofs, [domainId]: value }));
  }

  liveDomainUrl(hostname: string): string {
    return domainLiveUrl(hostname);
  }

  async onDomainSubmit(): Promise<void> {
    const hostname = this.newDomainHostname.trim();
    if (!hostname) return;
    await this.createDomain({
      hostname,
      verificationMethod: this.newDomainMethod,
    });
    this.newDomainHostname = '';
  }

  private async runValidation(silent = false): Promise<PortfolioValidationResult | null> {
    const site = this.site();
    if (!site) return null;
    try {
      const result = await this.portfolio.validateDraft(site.id, this.doc() ?? undefined);
      this.validation.set(result);
      return result;
    } catch (error) {
      if (!silent) {
        this.toast.error(this.errorMessage(error, 'Could not validate this draft.'));
      }
      return null;
    }
  }

  async validateNow(): Promise<void> {
    this.busy.set(true);
    try {
      const result = await this.runValidation();
      if (result) {
        this.inspectorCollapsed.set(false);
        if (!result.ok) {
          this.openTab('publish');
        } else {
          this.toast.success('Validation passed.');
        }
      }
    } finally {
      this.busy.set(false);
    }
  }

  async publish(): Promise<void> {
    const site = this.site();
    if (!site || this.publishing()) return;
    this.publishing.set(true);
    try {
      const saved = await this.flushSave();
      if (!saved) {
        this.toast.error('Save or reload the draft before publishing.');
        return;
      }
      const result = await this.runValidation();
      if (!result?.ok) {
        if (result) {
          this.inspectorCollapsed.set(false);
          this.openTab('publish');
        }
        return;
      }
      const published = await this.portfolio.publish(site.id);
      this.site.set(published.site);
      await this.loadVersions();
      this.toast.success('Published. This version is now immutable.');
    } catch (error) {
      this.toast.error(
        this.errorMessage(error, 'Could not publish. Resolve the validation issues first.'),
      );
    } finally {
      this.publishing.set(false);
    }
  }

  fieldIssue(
    sectionId: string,
    fieldKey: string,
    rowIndex?: number,
    nestedKey?: string,
  ): PortfolioValidationIssue | null {
    const list =
      this.issueIndex().fields.get(fieldIssueKey(sectionId, fieldKey, rowIndex, nestedKey)) ?? [];
    return list.find((issue) => issue.severity === 'error') ?? list[0] ?? null;
  }

  seoIssue(key: SeoIssueKey): PortfolioValidationIssue | null {
    return this.issueIndex().seo.get(key)?.[0] ?? null;
  }

  sectionIssueCounts(sectionId: string): { errors: number; warnings: number } {
    return this.sectionIssues()[sectionId] ?? { errors: 0, warnings: 0 };
  }

  issueTargetLabel(issue: PortfolioValidationIssue): string {
    const target = locateIssue(issue, this.sections());
    if (target.seoKey) return `SEO Â· ${humanize(target.seoKey)}`;
    if (target.sectionId) {
      const section = this.sections().find((item) => item.id === target.sectionId);
      const label = section ? sectionLabel(section.type) : 'Section';
      const field = target.nestedKey ?? target.fieldKey;
      return field ? `${label} Â· ${humanize(field)}` : label;
    }
    return 'Draft';
  }

  goToIssue(issue: PortfolioValidationIssue): void {
    const target = locateIssue(issue, this.sections());
    if (target.sectionId) this.select(target.sectionId);
    const controlId = target.seoKey
      ? `seo-${target.seoKey}`
      : target.fieldKey
        ? `field-${target.fieldKey}`
        : null;
    this.inspectorCollapsed.set(false);
    if (!controlId) {
      this.openTab('publish');
      return;
    }
    this.openTab('content');
    setTimeout(() => {
      const control = document.getElementById(controlId);
      control?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      control?.focus({ preventScroll: true });
    });
  }

  focusFirstIssue(): void {
    const validation = this.validation();
    const issue = validation?.errors[0] ?? validation?.warnings[0];
    if (issue) this.goToIssue(issue);
  }

  dismissValidation(): void {
    this.validation.set(null);
  }

  async unpublish(): Promise<void> {
    const site = this.site();
    if (!site) return;
    const ok = window.confirm(
      'Unpublish? The public URL will stop serving this portfolio. Previous versions stay available.',
    );
    if (!ok) return;
    this.publishing.set(true);
    try {
      this.site.set(await this.portfolio.unpublish(site.id));
      await this.loadVersions();
      this.toast.success('Portfolio unpublished.');
    } catch (error) {
      this.toast.error(this.errorMessage(error, 'Could not unpublish.'));
    } finally {
      this.publishing.set(false);
    }
  }

  async loadVersions(): Promise<void> {
    const site = this.site();
    if (!site) return;
    try {
      await this.portfolio.listVersions(site.id);
      this.versions.set(this.portfolio.versions());
    } catch {
      this.versions.set([]);
    }
  }

  async rollback(versionId: string): Promise<void> {
    const site = this.site();
    if (!site) return;
    const ok = window.confirm(
      'Publish a new version from this snapshot? The current public page will be replaced.',
    );
    if (!ok) return;
    if (this.saveTimer != null) clearTimeout(this.saveTimer);
    this.publishing.set(true);
    try {
      await this.portfolio.rollback(site.id, versionId);
      const draft = await this.portfolio.loadDraft(site.id);
      this.site.set(draft.site);
      this.applyDraft(draft.document, draft.site.revision);
      await this.loadVersions();
      this.toast.success('Rolled back and published a new immutable version.');
    } catch (error) {
      this.toast.error(this.errorMessage(error, 'Could not roll back to that version.'));
    } finally {
      this.publishing.set(false);
    }
  }

  async loadAnalytics(): Promise<void> {
    const site = this.site();
    if (!site) return;
    try {
      this.analytics.set(await this.portfolio.analytics(site.id));
    } catch {
      this.analytics.set(null);
    }
  }

  onInteraction(event: { type: 'contact' | 'outbound'; label: string }): void {
    const site = this.site();
    if (!site || site.status !== 'published') return;
    this.portfolio.recordEvent(site.slug, {
      type: event.type,
      locale: this.activeLocale(),
      path: `/p/${site.slug}`,
    });
  }

  onEditRequest(event: { sectionId: string; propKey: string; value: string }): void {
    this.mutate((document) => {
      const section = document.pages[0]?.sections.find(
        (s) => s.id === event.sectionId,
      );
      if (!section) return;
      if (typeof section.props[event.propKey] === 'object' && !Array.isArray(section.props[event.propKey])) {
        const existing = section.props[event.propKey] as Record<string, string>;
        section.props[event.propKey] = { ...existing, [this.activeLocale()]: event.value };
      } else {
        section.props[event.propKey] = event.value;
      }
    });
  }

  onRowEditRequest(event: { sectionId: string; fieldKey: string; rowIndex: number; propKey: string; value: string }): void {
    this.mutate((document) => {
      const section = document.pages[0]?.sections.find(
        (s) => s.id === event.sectionId,
      );
      if (!section) return;
      const rows = section.props[event.fieldKey];
      if (!Array.isArray(rows)) return;
      const row = rows[event.rowIndex];
      if (!row || typeof row !== 'object') return;
      const existing = row[event.propKey];
      if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
        (row as Record<string, unknown>)[event.propKey] = { ...(existing as Record<string, string>), [this.activeLocale()]: event.value };
      } else {
        (row as Record<string, unknown>)[event.propKey] = event.value;
      }
    });
  }

  onListEditRequest(event: { sectionId: string; fieldKey: string; index: number; value: string }): void {
    this.mutate((document) => {
      const section = document.pages[0]?.sections.find(
        (s) => s.id === event.sectionId,
      );
      if (!section) return;
      const items = section.props[event.fieldKey];
      if (Array.isArray(items)) {
        items[event.index] = event.value;
      }
    });
  }

  onSectionSelect(sectionId: string): void {
    this.selectedId.set(sectionId);
  }

  onSectionReorder(event: { fromIndex: number; toIndex: number }): void {
    this.mutate((document) => {
      const sections = document.pages[0]?.sections;
      if (!sections) return;
      const [item] = sections.splice(event.fromIndex, 1);
      if (item) sections.splice(event.toIndex, 0, item);
    });
  }

  // â”€â”€ Section styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  selectedStyle(): PortfolioSectionStyle {
    return this.selectedSection()?.style ?? {};
  }

  setSectionStyle(key: keyof PortfolioSectionStyle, value: string): void {
    const id = this.selectedId();
    if (!id) return;
    this.mutate((document) => {
      const section = this.findSection(document, id);
      if (!section) return;
      if (!section.style) section.style = {};
      if (value) {
        (section.style as Record<string, string>)[key] = value;
      } else {
        delete (section.style as Record<string, string | undefined>)[key];
      }
    });
  }

  resetSectionStyles(): void {
    const id = this.selectedId();
    if (!id) return;
    this.mutate((document) => {
      const section = this.findSection(document, id);
      if (section) section.style = undefined;
    });
  }

  // â”€â”€ Navigation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  onNavEditRequest(event: { id: string; label: string }): void {
    this.mutate((document) => {
      const item = document.navigation.find((nav) => nav.id === event.id);
      if (item) {
        item.label = { ...item.label, [this.activeLocale()]: event.label };
      }
    });
  }

  onBrandEditRequest(event: { name: string }): void {
    this.mutate((document) => {
      document.site.name = event.name;
    });
    this.siteForm.name = event.name;
    if (this.site()) {
      this.site.update((s) => (s ? { ...s, name: event.name } : null));
    }
  }

  setNavLabel(id: string, label: string): void {
    this.mutate((document) => {
      const item = document.navigation.find((nav) => nav.id === id);
      if (item) {
        item.label = { ...item.label, [this.activeLocale()]: label };
      }
    });
  }

  setNavTarget(id: string, target: string): void {
    this.mutate((document) => {
      const item = document.navigation.find((nav) => nav.id === id);
      if (item) {
        item.target = target;
      }
    });
  }

  addNavItem(): void {
    this.mutate((document) => {
      const id = `nav-${Date.now().toString(36)}`;
      const firstSection = document.pages[0]?.sections[0];
      const target = firstSection ? `#${firstSection.id}` : '#pf-main';
      document.navigation.push({
        id,
        label: { [this.activeLocale()]: 'New link' },
        target,
      });
    });
  }

  removeNavItem(id: string): void {
    this.mutate((document) => {
      document.navigation = document.navigation.filter((item) => item.id !== id);
    });
  }

  moveNavItem(id: string, direction: -1 | 1): void {
    this.mutate((document) => {
      const index = document.navigation.findIndex((item) => item.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= document.navigation.length) return;
      const [item] = document.navigation.splice(index, 1);
      if (item) document.navigation.splice(target, 0, item);
    });
  }

  syncNavFromSections(): void {
    this.mutate((document) => {
      const sections = document.pages[0]?.sections ?? [];
      const locale = this.activeLocale();
      document.navigation = sections
        .filter((s) => !s.hidden)
        .map((s) => ({
          id: `nav-${s.id}`,
          label: { [locale]: s.type === 'hero' ? 'Home' : sectionLabel(s.type) },
          target: `#${s.id}`,
        }));
    });
    this.toast.success('Navigation links synced from page sections.');
  }

  private errorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as { message?: string; details?: Array<{ message: string }> } | null;
      if (body?.details?.length) return body.details[0]?.message ?? fallback;
      return body?.message ?? fallback;
    }
    return fallback;
  }
}

const sectionLabels: Array<{ value: PortfolioSectionType; label: string }> = [
  { value: 'hero', label: 'Hero' },
  { value: 'about', label: 'About' },
  { value: 'skills', label: 'Skills' },
  { value: 'projects', label: 'Projects' },
  { value: 'experience', label: 'Experience' },
  { value: 'education', label: 'Education' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'contact', label: 'Contact' },
  { value: 'cta', label: 'Call to action' },
  { value: 'custom-code', label: 'Custom code' },
];
