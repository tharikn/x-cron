import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioCustomCodeComponent } from '../portfolio-custom-code/portfolio-custom-code.component';
import type {
  PortfolioDocument,
  PortfolioLocalizedText,
  PortfolioSection,
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

/**
 * Public portfolio renderer.
 *
 * Renders only allow-listed section types from validated JSON. Never binds raw
 * HTML. Shared by the editor preview and the public runtime page — the same
 * component keeps preview and production output identical.
 */
@Component({
  selector: 'app-portfolio-renderer',
  imports: [CommonModule, PortfolioCustomCodeComponent],
  templateUrl: './portfolio-renderer.component.html',
  styleUrl: './portfolio-renderer.component.scss',
})
export class PortfolioRendererComponent {
  readonly document = input.required<PortfolioDocument>();
  readonly locale = input<string>('');
  readonly device = input<PortfolioDevice>('desktop');
  /** Editor preview override. */
  readonly forceMode = input<'light' | 'dark' | ''>('');

  readonly interaction = output<{ type: 'contact' | 'outbound'; label: string }>();

  readonly defaultLocale = computed(
    () => this.document().site.defaultLocale,
  );

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
      return luminance(accent) > 0.55 ? '#111111' : '#ffffff';
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
    if (raw.startsWith('#')) return raw;
    if (/^(https:\/\/|http:\/\/|mailto:|tel:)/i.test(raw)) return raw;
    return '';
  }

  image(value: unknown): string {
    const url = this.href(value);
    return /^(https:\/\/|http:\/\/)/i.test(url) ? url : '';
  }

  mailto(value: unknown): string {
    const email = this.plain(value);
    return email ? `mailto:${email}` : '';
  }

  tel(value: unknown): string {
    const phone = this.plain(value);
    return phone ? `tel:${phone.replace(/[^+\d]/g, '')}` : '';
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
      result['background-image'] = `url(${style.backgroundImage})`;
      result['background-size'] = style.backgroundSize || 'cover';
      result['background-position'] = style.backgroundPosition || 'center';
      result['background-repeat'] = 'no-repeat';
    }
    if (style.borderTop) result['border-top'] = style.borderTop;
    if (style.borderBottom) result['border-bottom'] = style.borderBottom;
    if (style.opacity) result['opacity'] = style.opacity;
    return result;
  }

  getSectionInnerStyles(section: PortfolioSection): Record<string, string> {
    const style = section.style;
    if (!style) return {};
    const result: Record<string, string> = {};
    if (style.maxWidth) result['max-width'] = style.maxWidth;
    return result;
  }

  /**
   * Namespace for the author's browser storage. Scoping by site and section
   * keeps two portfolios (or two code blocks) from reading each other's data.
   */
  codeStorageKey(section: PortfolioSection): string {
    return `${this.document().site.id}:${section.id}`;
  }
}
