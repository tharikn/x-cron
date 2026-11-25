import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
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
  PortfolioAnalyticsSummary,
  PortfolioComponentDefinition,
  PortfolioDocument,
  PortfolioNavItem,
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
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import {
  PortfolioTourService,
  type TourStep,
} from '../../core/services/portfolio-tour.service';
import {
  PortfolioRendererComponent,
  type PortfolioDevice,
} from '../../shared/portfolio-renderer/portfolio-renderer.component';
import { PortfolioWizardStepperComponent } from './portfolio-wizard-stepper.component';
import { PortfolioTourComponent } from '../../shared/portfolio-tour/portfolio-tour.component';
import {
  codeByteLength,
  codeLineCount,
  splitCustomCodePage,
  usesExternalResources,
} from '../../shared/portfolio-custom-code/custom-code-frame';

type EditorTab = 'content' | 'design' | 'theme' | 'publish' | 'insights';
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

const AUTOSAVE_MS = 1_200;
const HISTORY_LIMIT = 40;

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

/**
 * Dynamic Portfolios — draft editor.
 *
 * Local, revision-aware editing with a debounced autosave. The API owns the
 * schema, the component registry owns the property fields, and this page only
 * edits the JSON document. Nothing here mutates shared app state.
 */
@Component({
  selector: 'app-portfolio-editor',
  imports: [
    FormsModule,
    RouterLink,
    PortfolioRendererComponent,
    PortfolioWizardStepperComponent,
    PortfolioTourComponent,
  ],
  templateUrl: './portfolio-editor.page.html',
  styleUrl: './portfolio-editor.page.scss',
})
export class PortfolioEditorPage implements OnInit, OnDestroy {
  private readonly portfolio = inject(PortfolioService);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly tourService = inject(PortfolioTourService);

  readonly doc = signal<PortfolioDocument | null>(null);
  readonly site = signal<PortfolioSiteSummary | null>(null);
  readonly components = signal<PortfolioComponentDefinition[]>([]);
  readonly versions = signal<PortfolioVersionSummary[]>([]);
  readonly analytics = signal<PortfolioAnalyticsSummary | null>(null);

  /** Guided tour for new editors. Auto-starts on first entry. */
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
  readonly undoDepth = signal(0);
  readonly redoDepth = signal(0);
  readonly previewMode = signal<'light' | 'dark' | ''>('');
  /** Which code field the hidden file picker will fill. */
  readonly codeImportAccept = signal('.html,.htm,.css,.js,.mjs');
  /** Human-readable result of the last code import/split. */
  readonly codeNotice = signal('');

  @ViewChild('codeFile') private codeFileInput?: ElementRef<HTMLInputElement>;
  private lastCodeEdit = { key: '', at: 0 };
  private codeImportSectionId: string | null = null;

  readonly sectionTypes = sectionLabels;
  readonly sectionLabel = sectionLabel;
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

  readonly sections = computed(() => this.doc()?.pages[0]?.sections ?? []);
  readonly navItems = computed(() => this.doc()?.navigation ?? []);
  readonly selectedSection = computed(
    () => this.sections().find((section) => section.id === this.selectedId()) ?? null,
  );
  readonly selectedDefinition = computed(() => {
    const type = this.selectedSection()?.type;
    return this.components().find((component) => component.type === type) ?? null;
  });
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

  /** Per-section issue counts used by the section list and the canvas badges. */
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
    } catch (error) {
      this.saveError.set(this.errorMessage(error, 'Could not load this portfolio.'));
    } finally {
      this.loading.set(false);
      // Show the guided walkthrough the first time this user opens the editor.
      if (!this.tourService.isSeen()) {
        this.tourService.start();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.saveTimer != null) clearTimeout(this.saveTimer);
    if (this.saveState() === 'dirty') void this.save();
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

  // ── Autosave / history ──────────────────────────────────────────────────

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
        // A rejected save usually means bad document content. Fetch the
        // structured issues so the offending field/section can be highlighted.
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

  // ── Sections ────────────────────────────────────────────────────────────

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

  addSection(): void {
    const type = this.addType();
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
      page.sections.push(section);
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

  private cloneSection(section: PortfolioSection, document: PortfolioDocument): PortfolioSection {
    // `mutate` already cloned the document; JSON round-trip isolates this copy.
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

  // ── Property editing ────────────────────────────────────────────────────

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

  /**
   * Code typing is coalesced into one undo entry per burst, so a 200 KB block
   * does not push a full document snapshot on every keystroke.
   */
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

  // ── Custom code ─────────────────────────────────────────────────────────

  codeValue(value: unknown): string {
    return typeof value === 'string' ? value : '';
  }

  codeBytes(value: unknown): number {
    return codeByteLength(value);
  }

  codeLines(value: unknown): number {
    return codeLineCount(value);
  }

  /** True when the HTML pane holds a whole page that can be split into panes. */
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
    this.codeNotice.set(`Split into ${parts.join(' + ')}.`);
  }

  /**
   * Toolbar entry point: import a file as the whole portfolio. Existing sections
   * are replaced (after confirmation) so the imported page becomes the entire
   * site instead of being appended under the template.
   */
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
    // Set the attribute directly so the picker filter is correct immediately.
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
    if (external) notes.push('external fonts, styles or scripts enabled');
    this.codeNotice.set(notes.join(' · '));
    if (!html && !css && !js) return;
    this.mutate((document) => {
      const section = this.findSection(document, sectionId);
      if (!section) return;
      if (html) section.props['html'] = html;
      if (css) section.props['css'] = css;
      if (js) section.props['js'] = js;
      // Give an unnamed section a usable frame title (required by the schema).
      if (titleFromFile && !this.codeValue(section.props['title']).trim()) {
        section.props['title'] = titleFromFile;
      }
      // Imported pages usually pull a web font or library; without this the
      // sandboxed frame's CSP silently blocks them.
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
      const previous = row[key] && typeof row[key] === 'object' ? (row[key] as Record<string, string>) : {};
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

  // ── Theme ───────────────────────────────────────────────────────────────

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

  // ── Site settings ───────────────────────────────────────────────────────

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

  // ── Guided tour ─────────────────────────────────────────────────────────

  /** Re-open the guided tour from the Help button (works even after it was seen). */
  openTour(): void {
    this.tourService.start();
    this.onTourStepChange(this.tourService.current());
  }

  /**
   * Reveal the panel a tour step points at. Publishing and version management
   * live in the Publish tab, which is not the default tab.
   */
  onTourStepChange(step: TourStep | null): void {
    if (!step) return;
    if (step.id === 'publish' || step.id === 'versions') {
      this.openTab('publish');
      // Wait for Angular to render the tab before re-measuring the highlight.
      setTimeout(() => this.tourService.measure(), 0);
    } else if (step.id === 'content') {
      this.openTab('content');
      setTimeout(() => this.tourService.measure(), 0);
    }
  }

  // ── Validation / publishing ─────────────────────────────────────────────

  openTab(tab: EditorTab): void {
    this.tab.set(tab);
    if (tab === 'publish') void this.loadVersions();
    if (tab === 'insights') void this.loadAnalytics();
  }

  /** Fetch issues from the API and keep them for inline highlighting. */
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
      if (result && !result.ok) this.tab.set('publish');
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
        // Errors are shown inline on the field/section plus the issue list.
        if (result) this.tab.set('publish');
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

  /** First error/warning for a section field, with errors taking precedence. */
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
    if (target.seoKey) return `SEO · ${humanize(target.seoKey)}`;
    if (target.sectionId) {
      const section = this.sections().find((item) => item.id === target.sectionId);
      const label = section ? sectionLabel(section.type) : 'Section';
      const field = target.nestedKey ?? target.fieldKey;
      return field ? `${label} · ${humanize(field)}` : label;
    }
    return 'Draft';
  }

  /** Jump from an issue row to the section and field that caused it. */
  goToIssue(issue: PortfolioValidationIssue): void {
    const target = locateIssue(issue, this.sections());
    if (target.sectionId) this.select(target.sectionId);
    const controlId = target.seoKey
      ? `seo-${target.seoKey}`
      : target.fieldKey
        ? `field-${target.fieldKey}`
        : null;
    if (!controlId) {
      this.tab.set('publish');
      return;
    }
    this.tab.set('content');
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

  // ── Section styles ─────────────────────────────────────────────────────

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

  // ── Navigation ──────────────────────────────────────────────────────────

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

  saveLabel(): string {
    switch (this.saveState()) {
      case 'saving':
        return 'Saving…';
      case 'dirty':
        return 'Unsaved changes';
      case 'conflict':
        return 'Conflict';
      case 'error':
        return 'Save failed';
      default:
        return this.lastSavedAt() ? 'Saved' : 'Draft saved';
    }
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
