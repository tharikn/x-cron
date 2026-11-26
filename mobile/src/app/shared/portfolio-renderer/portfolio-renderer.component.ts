import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioCustomCodeComponent } from '../portfolio-custom-code/portfolio-custom-code.component';
import type {
  PortfolioDocument,
  PortfolioLocalizedText,
  PortfolioSection,
  PortfolioSectionStyle,
} from '../../core/models/portfolio.model';
import { localizedValue } from '../../core/models/portfolio.model';

const FONT_STACKS: Record<string, string> = {
  Outfit: "'Outfit', 'Noto Sans Tamil', system-ui, sans-serif",
  Manrope: "'Manrope', 'Noto Sans Tamil', system-ui, sans-serif",
  Fraunces: "'Fraunces', Georgia, 'Noto Sans Tamil', serif",
  'Noto Sans Tamil': "'Noto Sans Tamil', 'Manrope', system-ui, sans-serif",
  Georgia: "Georgia, 'Times New Roman', serif",
  System: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  Mono: "'SFMono-Regular', ui-monospace, 'Cascadia Code', monospace",
};

export type PortfolioDevice = 'desktop' | 'tablet' | 'mobile';

function luminance(hex: string): number {
  const normalized = hex.replace('#', '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const channel = (offset: number): number => {
    const value = parseInt(full.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

function contrastRatio(a: number, b: number): number {
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Public portfolio renderer — enhanced with visual-builder capabilities.
 *
 * When `editable` is true the renderer becomes a Canva-style visual editor:
 *   • Click any text to edit it inline (contenteditable)
 *   • Click a section to select it (blue outline + floating toolbar)
 *   • Drag sections to reorder them
 *   • Per-section custom styles applied live
 *
 * When `editable` is false (public page) this renders identically to before.
 */
@Component({
  selector: 'app-portfolio-renderer',
  imports: [CommonModule, FormsModule, PortfolioCustomCodeComponent],
  templateUrl: './portfolio-renderer.component.html',
  styleUrl: './portfolio-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioRendererComponent implements AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly document = input.required<PortfolioDocument>();
  readonly locale = input<string>('');
  readonly device = input<PortfolioDevice>('desktop');
  /** Editor preview override. */
  readonly forceMode = input<'light' | 'dark' | ''>('');
  /** Inline edit mode (set true from editor to enable visual editing). */
  readonly editable = input<boolean>(false);
  /** Show hover outlines, section badges, and insertion guides in edit mode. */
  readonly showGuides = input<boolean>(true);
  /** External selected section id controlled by the host editor. */
  readonly activeSectionId = input<string | null>(null);
  /** Validation counts passed by the editor to mark sections with issues. */
  readonly sectionIssues = input<Record<string, { errors: number; warnings: number }>>({});

  readonly interaction = output<{ type: 'contact' | 'outbound'; label: string }>();
  /** Emitted when user finishes editing an inline field. */
  readonly editRequest = output<{ sectionId: string; propKey: string; value: string }>();
  /** Emitted when user finishes editing the brand/site name in the navbar. */
  readonly brandEditRequest = output<{ name: string }>();
  /** Emitted when user finishes editing a navigation link label. */
  readonly navEditRequest = output<{ id: string; label: string }>();
  /** Emitted when a section is clicked/selected in the canvas. */
  readonly sectionSelect = output<string>();
  /** Emitted when sections are reordered via drag-and-drop. */
  readonly sectionReorder = output<{ fromIndex: number; toIndex: number }>();
  /** Emitted when user right-clicks or clicks the section options handle. */
  readonly sectionContextMenu = output<{ sectionId: string; x: number; y: number }>();
  /** Emitted when user right-clicks empty canvas space. */
  readonly canvasContextMenu = output<{ x: number; y: number }>();
  /** Emitted when user right-clicks the portfolio navigation bar. */
  readonly navContextMenu = output<{ x: number; y: number }>();
  /** Emitted when user clicks an inline `+` insert bar on the canvas. */
  readonly quickInsert = output<{ index: number }>();
  /** Emitted when a section's style changes. */
  readonly sectionStyleChange = output<{ sectionId: string; style: PortfolioSectionStyle }>();
  /** Emitted when a row field is edited inline (objectList items). */
  readonly rowEditRequest = output<{
    sectionId: string;
    fieldKey: string;
    rowIndex: number;
    propKey: string;
    value: string;
  }>();
  /** Emitted when a list item is edited inline (textList items). */
  readonly listEditRequest = output<{
    sectionId: string;
    fieldKey: string;
    index: number;
    value: string;
  }>();

  @ViewChild('mainRef') mainRef!: ElementRef<HTMLElement>;

  readonly defaultLocale = computed(() => this.document().site.defaultLocale);

  readonly activeLocale = computed(
    () => this.locale() || this.defaultLocale(),
  );

  readonly mode = computed<'light' | 'dark'>(() => {
    const forced = this.forceMode();
    if (forced === 'light' || forced === 'dark') return forced;
    return this.document().theme.mode === 'dark' ? 'dark' : 'light';
  });

  readonly tokens = computed(() => this.document().theme.tokens);

  readonly sections = computed<PortfolioSection[]>(() => {
    const page = this.document().pages[0];
    return (page?.sections ?? []).filter((section) => !section.hidden);
  });

  readonly navItems = computed(() =>
    this.document().navigation.filter((item) => item.target !== '/'),
  );

  /** True when the page is a single imported code block: drop the portfolio chrome. */
  readonly fullCodePage = computed(() => {
    const sections = this.sections();
    return (
      sections.length === 1 &&
      sections[0]?.type === 'custom-code' &&
      this.navItems().length === 0
    );
  });

  readonly brandName = computed(() => this.document().site.name);

  readonly accentInk = computed(() => {
    const accent = this.tokens().accent;
    try {
      // Pick the ink by actual WCAG contrast against the accent: a fixed
      // luminance cutoff makes mid-tone accents (e.g. #2f6fed) fail AA.
      const background = luminance(accent);
      const whiteRatio = contrastRatio(background, 1);
      const darkRatio = contrastRatio(background, luminance('#111111'));
      if (whiteRatio >= 4.5) return '#ffffff';
      if (darkRatio >= 4.5) return '#111111';
      return whiteRatio >= darkRatio ? '#ffffff' : '#111111';
    } catch {
      return '#ffffff';
    }
  });

  readonly radius = computed(() => {
    const value = this.tokens().radius;
    if (value === 'sm') return '6px';
    if (value === 'lg') return '22px';
    return '14px';
  });

  readonly density = computed(() =>
    this.tokens().density === 'compact' ? '0.82' : '1',
  );

  readonly headingFont = computed(
    () => FONT_STACKS[this.tokens().fontHeading] ?? FONT_STACKS['Manrope'],
  );

  readonly bodyFont = computed(
    () => FONT_STACKS[this.tokens().fontBody] ?? FONT_STACKS['Manrope'],
  );

  // ── Visual builder state ─────────────────────────────────────────────

  /** Currently selected section id in the visual builder. */
  readonly selectedSectionId = signal<string | null>(null);

  /** Currently editing field: { sectionId, propKey } */
  readonly editingField = signal<{ sectionId: string; propKey: string } | null>(null);

  /** Drag state */
  readonly dragSectionId = signal<string | null>(null);
  readonly dragOverSectionId = signal<string | null>(null);
  readonly dragPosition = signal<'above' | 'below' | null>(null);
  /** Touch-first drag state used by the grip; also works with a mouse. */
  readonly pointerDragOffsetPx = signal(0);

  /** Hover section */
  readonly hoverSectionId = signal<string | null>(null);

  private mutationObserver: MutationObserver | null = null;

  ngAfterViewInit(): void {
    // No special DOM setup needed; inline editing uses contenteditable events
  }

  ngOnDestroy(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  // ── Text helpers ─────────────────────────────────────────────────────

  t(value: unknown): string {
    return localizedValue(value, this.activeLocale(), this.defaultLocale());
  }

  has(value: unknown): boolean {
    return this.t(value).length > 0;
  }

  list(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  }

  rows(value: unknown): Array<Record<string, unknown>> {
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === 'object' && !Array.isArray(item),
    );
  }

  /** Approved protocols only; `#` anchors allowed for in-page navigation. */
  href(value: unknown): string {
    if (typeof value !== 'string') return '';
    const raw = value.trim();
    if (!raw) return '';
    if (raw.startsWith('#')) {
      return /^#[A-Za-z0-9_-]*$/.test(raw) ? raw : '';
    }
    if (raw.startsWith('//')) return '';
    if (!/^(https:\/\/|http:\/\/|mailto:|tel:)/i.test(raw)) return '';
    if (/[\u0000-\u001f\u007f]/.test(raw)) return '';
    return raw;
  }

  image(value: unknown): string {
    const url = this.href(value);
    return /^(https:\/\/|http:\/\/)/i.test(url) ? url : '';
  }

  mailto(value: unknown): string {
    const email = this.plain(value);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '';
    return `mailto:${email}`;
  }

  tel(value: unknown): string {
    const phone = this.plain(value);
    const digits = phone.replace(/[^+\d]/g, '');
    return digits ? `tel:${digits}` : '';
  }

  plain(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  rowText(row: Record<string, unknown>, key: string): string {
    return this.t(row[key]);
  }

  anchor(target: string): string {
    return target.startsWith('#') || target.startsWith('/') ? target : '#';
  }

  isExternal(value: string): boolean {
    return /^https?:\/\//i.test(value);
  }

  notify(type: 'contact' | 'outbound', label: string): void {
    this.interaction.emit({ type, label });
  }

  onLinkClick(event: MouseEvent, href: string, label: string): void {
    if (this.editable()) {
      event.preventDefault();
      return;
    }
    if (!href) {
      event.preventDefault();
      return;
    }
    const type = /^(mailto:|tel:)/i.test(href) ? 'contact' : 'outbound';
    this.notify(type, label || href);
  }

  /** Used by the editor preview to list what the template will render. */
  protected localizedMap(value: unknown): PortfolioLocalizedText {
    return value && typeof value === 'object'
      ? (value as PortfolioLocalizedText)
      : {};
  }

  // ── Section selection & hover ─────────────────────────────────────────

  onSectionClick(event: MouseEvent, sectionId: string): void {
    if (!this.editable()) return;
    this.selectedSectionId.set(sectionId);
    this.sectionSelect.emit(sectionId);
    const target = event.target as HTMLElement;
    if (target.hasAttribute('contenteditable') && target.getAttribute('contenteditable') === 'true') {
      return;
    }
  }

  onSectionContextMenu(event: MouseEvent, sectionId: string): void {
    if (!this.editable()) return;
    event.preventDefault();
    event.stopPropagation();
    this.selectedSectionId.set(sectionId);
    this.sectionSelect.emit(sectionId);
    this.sectionContextMenu.emit({ sectionId, x: event.clientX, y: event.clientY });
  }

  onSectionMenuButton(event: MouseEvent, sectionId: string): void {
    if (!this.editable()) return;
    event.stopPropagation();
    this.selectedSectionId.set(sectionId);
    this.sectionSelect.emit(sectionId);
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.sectionContextMenu.emit({ sectionId, x: rect.left, y: rect.bottom + 4 });
  }

  onCanvasContextMenu(event: MouseEvent): void {
    if (!this.editable()) return;
    event.preventDefault();
    this.canvasContextMenu.emit({ x: event.clientX, y: event.clientY });
  }

  onNavContextMenu(event: MouseEvent): void {
    if (!this.editable()) return;
    event.preventDefault();
    event.stopPropagation();
    this.navContextMenu.emit({ x: event.clientX, y: event.clientY });
  }

  emitQuickInsert(afterSectionId?: string): void {
    if (!this.editable()) return;
    const allSections = this.document().pages[0]?.sections ?? [];
    if (!afterSectionId) {
      this.quickInsert.emit({ index: 0 });
      return;
    }
    const idx = allSections.findIndex((s) => s.id === afterSectionId);
    this.quickInsert.emit({ index: idx >= 0 ? idx + 1 : allSections.length });
  }

  onSectionMouseEnter(sectionId: string): void {
    if (!this.editable()) return;
    this.hoverSectionId.set(sectionId);
  }

  onSectionMouseLeave(sectionId: string): void {
    if (!this.editable()) return;
    if (this.hoverSectionId() === sectionId) {
      this.hoverSectionId.set(null);
    }
  }

  isSectionSelected(sectionId: string): boolean {
    if (!this.editable()) return false;
    const active = this.activeSectionId() ?? this.selectedSectionId();
    return active === sectionId;
  }

  isSectionHovered(sectionId: string): boolean {
    if (!this.editable()) return false;
    const active = this.activeSectionId() ?? this.selectedSectionId();
    return this.hoverSectionId() === sectionId && active !== sectionId;
  }

  isSectionInvalid(sectionId: string): boolean {
    return this.editable() && (this.sectionIssues()[sectionId]?.errors ?? 0) > 0;
  }

  sectionIssueCount(sectionId: string): number {
    const counts = this.sectionIssues()[sectionId];
    return counts ? counts.errors + counts.warnings : 0;
  }

  // ── Inline editing ────────────────────────────────────────────────────

  isFieldEditing(sectionId: string, propKey: string): boolean {
    const field = this.editingField();
    return field?.sectionId === sectionId && field?.propKey === propKey;
  }

  startInlineEdit(event: MouseEvent, sectionId: string, propKey: string): void {
    if (!this.editable()) return;
    event.stopPropagation();
    this.editingField.set({ sectionId, propKey });
    this.selectedSectionId.set(sectionId);
    this.sectionSelect.emit(sectionId);
  }

  onInlineBlur(event: FocusEvent, sectionId: string, propKey: string): void {
    const target = event.target as HTMLElement;
    const value = target.innerText.trim();
    this.editRequest.emit({ sectionId, propKey, value });
    this.editingField.set(null);
  }

  onInlineKeydown(event: KeyboardEvent, sectionId: string, propKey: string): void {
    if (event.key === 'Escape') {
      (event.target as HTMLElement).blur();
      this.editingField.set(null);
      event.preventDefault();
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      (event.target as HTMLElement).blur();
      event.preventDefault();
    }
  }

  onBrandInlineBlur(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    const value = target.innerText.trim();
    if (value) {
      this.brandEditRequest.emit({ name: value });
    }
  }

  onNavInlineBlur(event: FocusEvent, itemId: string): void {
    const target = event.target as HTMLElement;
    const value = target.innerText.trim();
    if (value) {
      this.navEditRequest.emit({ id: itemId, label: value });
    }
  }

  onNavLinkClick(event: MouseEvent, targetAnchor: string): void {
    if (this.editable()) {
      // In editor mode, don't follow the anchor link unless desired
      event.preventDefault();
    }
  }

  /** Handle inline editing for row fields (objectList items). */
  onRowInlineBlur(event: FocusEvent, sectionId: string, fieldKey: string, rowIndex: number, propKey: string): void {
    const target = event.target as HTMLElement;
    const value = target.innerText.trim();
    this.rowEditRequest.emit({ sectionId, fieldKey, rowIndex, propKey, value });
  }

  onRowInlineKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      (event.target as HTMLElement).blur();
      event.preventDefault();
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      (event.target as HTMLElement).blur();
      event.preventDefault();
    }
  }

  /** Handle inline editing for list items (textList). */
  onListInlineBlur(event: FocusEvent, sectionId: string, fieldKey: string, index: number): void {
    const target = event.target as HTMLElement;
    const value = target.innerText.trim();
    this.listEditRequest.emit({ sectionId, fieldKey, index, value });
  }

  // ── Drag and drop ────────────────────────────────────────────────────

  onDragStart(event: DragEvent, sectionId: string): void {
    if (!this.editable()) return;
    this.dragSectionId.set(sectionId);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', sectionId);
    }
    // Add a slight delay to allow the drag image to render
    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  onDragOver(event: DragEvent, sectionId: string): void {
    if (!this.editable() || !this.dragSectionId()) return;
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const position = y < rect.height / 2 ? 'above' : 'below';

    this.dragOverSectionId.set(sectionId);
    this.dragPosition.set(position);
  }

  onDragLeave(event: DragEvent, sectionId: string): void {
    if (this.dragOverSectionId() === sectionId) {
      this.dragOverSectionId.set(null);
      this.dragPosition.set(null);
    }
  }

  onDrop(event: DragEvent, targetSectionId: string): void {
    event.preventDefault();
    const dragId = this.dragSectionId();
    if (!dragId || dragId === targetSectionId) {
      this.resetDrag();
      return;
    }

    const sections = this.document().pages[0]?.sections ?? [];
    const fromIndex = sections.findIndex((s) => s.id === dragId);
    let toIndex = sections.findIndex((s) => s.id === targetSectionId);
    if (fromIndex < 0 || toIndex < 0) {
      this.resetDrag();
      return;
    }

    if (this.dragPosition() === 'below') {
      toIndex = toIndex + 1;
    }
    // Adjust if dragging downward
    if (fromIndex < toIndex) {
      toIndex = toIndex - 1;
    }

    if (fromIndex !== toIndex) {
      this.sectionReorder.emit({ fromIndex, toIndex });
    }

    this.resetDrag();
  }

  onDragEnd(): void {
    this.resetDrag();
  }

  /**
   * Touch-first reorder from the grip. Pointer events work with fingers, pens
   * and mice in Android WebViews, where HTML5 drag/drop is unreliable.
   */
  onGripPointerDown(event: PointerEvent, sectionId: string): void {
    if (!this.editable() || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    this.pointerDrag = {
      sectionId,
      pointerId: event.pointerId,
      startY: event.clientY,
      targetSectionId: sectionId,
      position: null,
    };
    this.dragSectionId.set(sectionId);
    this.pointerDragOffsetPx.set(0);
  }

  onGripPointerMove(event: PointerEvent): void {
    const drag = this.pointerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();

    this.pointerDragOffsetPx.set(event.clientY - drag.startY);

    const elements = Array.from(
      this.mainRef?.nativeElement.querySelectorAll<HTMLElement>('.pf-section') ?? [],
    );
    let targetSectionId = drag.sectionId;
    let position: 'above' | 'below' = 'below';
    for (const element of elements) {
      if (!element.id) continue;
      const rect = element.getBoundingClientRect();
      if (event.clientY < rect.top + rect.height / 2) {
        targetSectionId = element.id;
        position = 'above';
        break;
      }
      targetSectionId = element.id;
      position = 'below';
    }
    drag.targetSectionId = targetSectionId;
    drag.position = position;
    this.dragOverSectionId.set(targetSectionId);
    this.dragPosition.set(position);
  }

  onGripPointerUp(event: PointerEvent): void {
    const drag = this.pointerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();

    const sections = this.document().pages[0]?.sections ?? [];
    const fromIndex = sections.findIndex((section) => section.id === drag.sectionId);
    let toIndex = sections.findIndex((section) => section.id === drag.targetSectionId);
    if (toIndex >= 0) {
      if (drag.position === 'below') toIndex += 1;
      if (fromIndex < toIndex) toIndex -= 1;
    }
    if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
      this.sectionReorder.emit({ fromIndex, toIndex });
    }
    this.resetPointerDrag();
  }

  onGripPointerCancel(): void {
    this.resetPointerDrag();
  }

  pointerDragStyle(sectionId: string): string | null {
    if (!this.pointerDrag || this.pointerDrag.sectionId !== sectionId) return null;
    return `translateY(${this.pointerDragOffsetPx()}px)`;
  }

  private resetPointerDrag(): void {
    this.pointerDrag = null;
    this.pointerDragOffsetPx.set(0);
    this.resetDrag();
  }

  private pointerDrag: {
    sectionId: string;
    pointerId: number;
    startY: number;
    targetSectionId: string;
    position: 'above' | 'below' | null;
  } | null = null;

  private resetDrag(): void {
    this.dragSectionId.set(null);
    this.dragOverSectionId.set(null);
    this.dragPosition.set(null);
  }

  isDragging(sectionId: string): boolean {
    return this.dragSectionId() === sectionId;
  }

  isDragOver(sectionId: string): boolean {
    return this.dragOverSectionId() === sectionId;
  }

  getDragPosition(): 'above' | 'below' | null {
    return this.dragPosition();
  }

  // ── Per-section styles ────────────────────────────────────────────────

  getSectionStyles(section: PortfolioSection): Record<string, string> {
    const style = section.style;
    if (!style) return {};
    const result: Record<string, string> = {};
    if (style.backgroundColor) result['background-color'] = style.backgroundColor;
    if (style.textColor) result['color'] = style.textColor;
    if (style.paddingTop) result['padding-top'] = style.paddingTop;
    if (style.paddingBottom) result['padding-bottom'] = style.paddingBottom;
    if (style.textAlign) result['text-align'] = style.textAlign;
    if (style.backgroundImage) {
      result['background-image'] = `url("${style.backgroundImage.replace(/"/g, '%22')}")`;
      result['background-size'] = style.backgroundSize || 'cover';
      result['background-position'] = style.backgroundPosition || 'center';
      result['background-repeat'] = 'no-repeat';
    }
    if (style.borderTop) result['border-top'] = style.borderTop;
    if (style.borderBottom) result['border-bottom'] = style.borderBottom;
    if (style.opacity) result['opacity'] = style.opacity;
    return result;
  }

  /**
   * Namespace for the author's browser storage. Scoping by site and section
   * keeps two portfolios (or two code blocks) from reading each other's data.
   */
  codeStorageKey(section: PortfolioSection): string {
    return `${this.document().site.id}:${section.id}`;
  }

  getSectionInnerStyles(section: PortfolioSection): Record<string, string> {
    const style = section.style;
    if (!style) return {};
    const result: Record<string, string> = {};
    if (style.maxWidth) result['max-width'] = style.maxWidth;
    return result;
  }

  // ── Display value helper (used in template) ──────────────────────────

  getDisplayValue(section: PortfolioSection, key: string): string {
    const raw = section.props[key];
    if (!raw) return '';
    if (typeof raw === 'object' && !Array.isArray(raw)) {
      return localizedValue(raw, this.activeLocale(), this.defaultLocale());
    }
    return String(raw);
  }

  /** Whether any inline field or placeholder content is empty (show placeholder). */
  getPlaceholder(section: PortfolioSection, key: string, placeholder: string): string {
    const val = this.getDisplayValue(section, key);
    return val || (this.editable() ? placeholder : '');
  }

  /** Track which section index we're at for drag purposes. */
  trackSection(index: number, section: PortfolioSection): string {
    return section.id;
  }
}
