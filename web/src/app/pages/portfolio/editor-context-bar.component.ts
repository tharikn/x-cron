import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type {
  PortfolioComponentDefinition,
  PortfolioSection,
  PortfolioSectionStyle,
} from '../../core/models/portfolio.model';
import { sectionLabel } from '../../core/models/portfolio.model';
import { EditorIconComponent, iconForSectionType } from './editor-icons.component';
import { EditorTooltipDirective } from './editor-tooltip.directive';

/**
 * Canva / Hostinger-style contextual property bar docked right above the canvas.
 * Exposes all left-click selection actions, styling, AI, link editing, and a
 * cursor menu button mirroring right-click options. Purely icon-based.
 */
@Component({
  selector: 'app-editor-context-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, EditorIconComponent, EditorTooltipDirective],
  template: `
    @if (section(); as sec) {
      <div class="cb" role="toolbar" aria-label="Selected section formatting">
        <!-- Selection identity + variant switcher -->
        <div class="cb__group">
          <span class="cb-chip" [appTip]="sectionTitle(sec) + ' section'">
            <app-editor-icon [name]="sectionIcon(sec.type)" [size]="14" />
            <span class="cb-chip__label">{{ sectionTitle(sec) }}</span>
          </span>

          @if (definition()?.variants?.length) {
            <label class="cb-select-wrap" appTip="Layout variant">
              <app-editor-icon name="layout" [size]="13" />
              <select
                class="cb-select"
                [ngModel]="sec.variant"
                (ngModelChange)="variantChange.emit($event)"
                aria-label="Layout variant"
              >
                @for (v of definition()!.variants; track v) {
                  <option [value]="v">{{ v }}</option>
                }
              </select>
            </label>
          }

          <button
            type="button"
            class="cb-btn cb-btn--ai"
            (click)="aiClick.emit()"
            appTip="AI edit section copy"
          >
            <app-editor-icon name="sparkles" [size]="14" />
          </button>
        </div>

        <span class="cb-sep"></span>

        <!-- Colors (Background & Text) -->
        <div class="cb__group">
          <label class="cb-swatch" appTip="Section background color">
            <input
              type="color"
              [ngModel]="style().backgroundColor || '#ffffff'"
              (ngModelChange)="styleChange.emit({ key: 'backgroundColor', value: $event })"
              aria-label="Section background color"
            />
            <span
              class="cb-swatch__dot"
              [style.background]="style().backgroundColor || 'transparent'"
              [class.cb-swatch__dot--empty]="!style().backgroundColor"
            ></span>
          </label>
          @if (style().backgroundColor) {
            <button
              type="button"
              class="cb-mini-clear"
              (click)="styleChange.emit({ key: 'backgroundColor', value: '' })"
              appTip="Clear background color"
            >
              <app-editor-icon name="x" [size]="11" />
            </button>
          }

          <label class="cb-swatch" appTip="Section text color">
            <input
              type="color"
              [ngModel]="style().textColor || '#111111'"
              (ngModelChange)="styleChange.emit({ key: 'textColor', value: $event })"
              aria-label="Section text color"
            />
            <span class="cb-swatch__text" [style.color]="style().textColor || 'var(--xcron-ink)'">A</span>
          </label>
          @if (style().textColor) {
            <button
              type="button"
              class="cb-mini-clear"
              (click)="styleChange.emit({ key: 'textColor', value: '' })"
              appTip="Clear text color"
            >
              <app-editor-icon name="x" [size]="11" />
            </button>
          }
        </div>

        <span class="cb-sep"></span>

        <!-- Alignment -->
        <div class="cb-pill" role="group" aria-label="Text alignment">
          <button
            type="button"
            class="cb-btn cb-btn--sm"
            [class.cb-btn--on]="!style().textAlign || style().textAlign === 'left'"
            (click)="styleChange.emit({ key: 'textAlign', value: 'left' })"
            appTip="Align left"
          >
            <app-editor-icon name="align-left" [size]="14" />
          </button>
          <button
            type="button"
            class="cb-btn cb-btn--sm"
            [class.cb-btn--on]="style().textAlign === 'center'"
            (click)="styleChange.emit({ key: 'textAlign', value: 'center' })"
            appTip="Align center"
          >
            <app-editor-icon name="align-center" [size]="14" />
          </button>
          <button
            type="button"
            class="cb-btn cb-btn--sm"
            [class.cb-btn--on]="style().textAlign === 'right'"
            (click)="styleChange.emit({ key: 'textAlign', value: 'right' })"
            appTip="Align right"
          >
            <app-editor-icon name="align-right" [size]="14" />
          </button>
        </div>

        <!-- Spacing & Width -->
        <div class="cb__group">
          <label class="cb-select-wrap" appTip="Section vertical padding">
            <app-editor-icon name="spacing" [size]="13" />
            <select
              class="cb-select"
              [ngModel]="style().paddingTop || ''"
              (ngModelChange)="applyPadding($event)"
              aria-label="Section padding"
            >
              <option value="">Auto</option>
              <option value="1.5rem">S</option>
              <option value="3rem">M</option>
              <option value="5rem">L</option>
              <option value="7rem">XL</option>
            </select>
          </label>

          <label class="cb-select-wrap" appTip="Content max width">
            <app-editor-icon name="width" [size]="13" />
            <select
              class="cb-select"
              [ngModel]="style().maxWidth || ''"
              (ngModelChange)="styleChange.emit({ key: 'maxWidth', value: $event })"
              aria-label="Content max width"
            >
              <option value="">1120</option>
              <option value="680px">680</option>
              <option value="860px">860</option>
              <option value="1400px">1400</option>
              <option value="100%">100%</option>
            </select>
          </label>

          <!-- Quick link popover (Hostinger-style link target editor) -->
          @if (hasCtaLink()) {
            <div class="cb-pop-anchor">
              <button
                type="button"
                class="cb-btn"
                [class.cb-btn--on]="linkPopoverOpen()"
                (click)="linkPopoverOpen.update(v => !v)"
                appTip="Edit section link"
              >
                <app-editor-icon name="link" [size]="14" />
              </button>

              @if (linkPopoverOpen()) {
                <div class="cb-popover" (click)="$event.stopPropagation()">
                  <div class="cb-popover__row">
                    <input
                      type="url"
                      class="cb-popover__input"
                      [ngModel]="ctaLinkValue()"
                      (ngModelChange)="ctaLinkChange.emit($event)"
                      placeholder="https://, mailto: or #section"
                      aria-label="Button link target"
                    />
                    <button
                      type="button"
                      class="cb-btn cb-btn--sm"
                      (click)="linkPopoverOpen.set(false)"
                      appTip="Done"
                    >
                      <app-editor-icon name="check" [size]="13" />
                    </button>
                  </div>
                  @if (anchorTargets().length) {
                    <div class="cb-popover__anchors">
                      @for (target of anchorTargets(); track target.id) {
                        <button
                          type="button"
                          class="cb-anchor-chip"
                          [class.cb-anchor-chip--on]="ctaLinkValue() === '#' + target.id"
                          (click)="ctaLinkChange.emit('#' + target.id)"
                        >
                          #{{ target.label }}
                        </button>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>

        <span class="cb-sep"></span>

        <!-- Style clipboard & inspector shortcuts -->
        <div class="cb__group">
          <button
            type="button"
            class="cb-btn"
            (click)="copyStyleClick.emit()"
            appTip="Copy section style"
            appTipKbd="Ctrl+Alt+C"
          >
            <app-editor-icon name="paintbrush" [size]="14" />
          </button>
          <button
            type="button"
            class="cb-btn"
            [disabled]="!hasCopiedStyle()"
            (click)="pasteStyleClick.emit()"
            appTip="Paste section style"
            appTipKbd="Ctrl+Alt+V"
          >
            <app-editor-icon name="clipboard" [size]="14" />
          </button>
          <button
            type="button"
            class="cb-btn"
            (click)="openContentClick.emit()"
            appTip="Edit content"
            appTipKbd="Enter"
          >
            <app-editor-icon name="edit" [size]="14" />
          </button>
          <button
            type="button"
            class="cb-btn"
            (click)="openDesignClick.emit()"
            appTip="Design panel"
            appTipKbd="D"
          >
            <app-editor-icon name="sliders" [size]="14" />
          </button>
        </div>

        <span class="cb-sep"></span>

        <!-- Arrange & lifecycle actions (left-click parity with right-click menu) -->
        <div class="cb__group">
          <button
            type="button"
            class="cb-btn"
            [disabled]="sectionIndex() <= 0"
            (click)="moveUpClick.emit()"
            appTip="Move up"
            appTipKbd="Alt+↑"
          >
            <app-editor-icon name="arrow-up" [size]="14" />
          </button>
          <button
            type="button"
            class="cb-btn"
            [disabled]="sectionIndex() >= totalSections() - 1"
            (click)="moveDownClick.emit()"
            appTip="Move down"
            appTipKbd="Alt+↓"
          >
            <app-editor-icon name="arrow-down" [size]="14" />
          </button>
          <button
            type="button"
            class="cb-btn"
            (click)="duplicateClick.emit()"
            appTip="Duplicate section"
            appTipKbd="Ctrl+D"
          >
            <app-editor-icon name="copy" [size]="14" />
          </button>
          <button
            type="button"
            class="cb-btn"
            (click)="toggleHiddenClick.emit()"
            [appTip]="sec.hidden ? 'Show section' : 'Hide section'"
            appTipKbd="H"
          >
            <app-editor-icon [name]="sec.hidden ? 'eye-off' : 'eye'" [size]="14" />
          </button>
          <button
            type="button"
            class="cb-btn cb-btn--danger"
            (click)="deleteClick.emit()"
            appTip="Delete section"
            appTipKbd="Del"
          >
            <app-editor-icon name="trash" [size]="14" />
          </button>
          <button
            type="button"
            class="cb-btn"
            (click)="moreClick.emit($event)"
            appTip="All section options"
          >
            <app-editor-icon name="more-horizontal" [size]="14" />
          </button>
        </div>
      </div>
    } @else {
      <div class="cb cb--empty" role="toolbar" aria-label="Canvas quick actions">
        <button
          type="button"
          class="cb-btn-pill"
          (click)="addSectionClick.emit()"
          appTip="Insert new section"
          appTipKbd="A"
        >
          <app-editor-icon name="plus" [size]="14" />
          <span>Add</span>
        </button>
        <button
          type="button"
          class="cb-btn"
          (click)="aiClick.emit()"
          appTip="AI copy assist"
        >
          <app-editor-icon name="sparkles" [size]="14" />
        </button>
        <button
          type="button"
          class="cb-btn"
          (click)="moreClick.emit($event)"
          appTip="Canvas actions"
        >
          <app-editor-icon name="more-horizontal" [size]="14" />
        </button>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .cb {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      min-height: 48px;
      padding: 6px 16px;
      background:
        radial-gradient(500px 120px at 50% -60%, color-mix(in srgb, var(--xcron-primary) 16%, transparent), transparent 70%),
        color-mix(in srgb, var(--xcron-bg-elevated) 92%, var(--xcron-wash));
      border-bottom: 1px solid var(--xcron-line);
    }

    .cb--empty {
      justify-content: center;
    }

    .cb__group {
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }

    .cb-sep {
      width: 1px;
      height: 18px;
      background: var(--xcron-line);
      margin: 0 2px;
    }

    .cb-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 28px;
      padding: 0 9px;
      border-radius: 7px;
      border: 1px solid var(--xcron-line);
      background: var(--xcron-wash);
      color: var(--xcron-ink);
      font-size: 11.5px;
      font-weight: 700;
    }

    .cb-chip__label {
      max-width: 90px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cb-select-wrap {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      height: 28px;
      padding: 0 6px;
      border-radius: 7px;
      border: 1px solid var(--xcron-line);
      background: var(--xcron-wash);
      color: var(--xcron-muted);
      cursor: pointer;
    }

    .cb-select {
      min-height: 0 !important;
      height: 24px;
      padding: 0 15px 0 2px !important;
      border: 0 !important;
      background-color: transparent !important;
      color: var(--xcron-ink);
      font-size: 11.5px !important;
      font-weight: 600;
      cursor: pointer;
      box-shadow: none !important;
    }

    .cb-pill {
      display: inline-flex;
      align-items: center;
      gap: 1px;
      padding: 2px;
      border-radius: 8px;
      border: 1px solid var(--xcron-line);
      background: var(--xcron-wash);
    }

    .cb-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: 1px solid transparent;
      border-radius: 0.6rem;
      background: transparent;
      color: var(--xcron-muted);
      cursor: pointer;
      transition:
        background 160ms var(--xcron-ease),
        color 160ms var(--xcron-ease),
        border-color 160ms var(--xcron-ease),
        transform 160ms var(--xcron-ease);
    }

    .cb-btn:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    .cb-btn:focus-visible {
      outline: none;
      border-color: var(--xcron-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--xcron-primary) 18%, transparent);
    }

    .cb-btn--sm {
      width: 26px;
      height: 24px;
      border-radius: 0.4rem;
    }

    .cb-btn:hover:not(:disabled) {
      background: color-mix(in srgb, var(--xcron-primary) 13%, transparent);
      color: var(--xcron-ink);
    }

    .cb-btn:disabled {
      opacity: 0.32;
      cursor: not-allowed;
    }

    .cb-btn--on {
      background: var(--xcron-primary);
      color: #fff;
    }

    .cb-btn--on:hover:not(:disabled) {
      background: var(--xcron-primary-hover);
      color: #fff;
    }

    .cb-btn--ai {
      color: var(--xcron-accent);
    }

    .cb-btn--danger:hover:not(:disabled) {
      background: color-mix(in srgb, var(--xcron-danger) 14%, transparent);
      color: var(--xcron-danger);
    }

    .cb-btn-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 28px;
      padding: 0 10px;
      border: 1px solid var(--xcron-line);
      border-radius: 7px;
      background: var(--xcron-wash);
      color: var(--xcron-ink);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .cb-btn-pill:hover,
    .cb-btn-pill:focus-visible {
      border-color: var(--xcron-primary);
      color: var(--xcron-primary);
    }

    .cb-btn-pill:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--xcron-primary) 18%, transparent);
    }

    .cb-swatch {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: 7px;
      border: 1px solid var(--xcron-line);
      background: var(--xcron-wash);
      cursor: pointer;
    }

    .cb-swatch:hover {
      border-color: var(--xcron-line-strong);
    }

    .cb-swatch input[type='color'] {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    .cb-swatch__dot {
      width: 15px;
      height: 15px;
      border-radius: 4px;
      border: 1px solid var(--xcron-line-strong);
    }

    .cb-swatch__dot--empty {
      background: var(--xcron-cta-gradient);
    }

    .cb-swatch__text {
      font-family: var(--xcron-font-display);
      font-size: 13px;
      font-weight: 800;
      text-decoration: underline;
      text-decoration-thickness: 2px;
    }

    .cb-mini-clear {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      padding: 0;
      border: 0;
      border-radius: 999px;
      background: var(--xcron-wash);
      color: var(--xcron-muted);
      cursor: pointer;
    }

    .cb-mini-clear:hover {
      color: var(--xcron-danger);
    }

    .cb-pop-anchor {
      position: relative;
    }

    .cb-popover {
      position: absolute;
      top: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      z-index: 400;
      display: grid;
      gap: 6px;
      width: 270px;
      padding: 8px;
      border-radius: 10px;
      border: 1px solid var(--xcron-line-strong);
      background: var(--xcron-bg-elevated);
      box-shadow: var(--xcron-shadow);
    }

    .cb-popover__row {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .cb-popover__input {
      flex: 1;
      min-height: 30px !important;
      height: 30px;
      padding: 4px 8px !important;
      font-size: 12px !important;
      border-radius: 6px !important;
    }

    .cb-popover__anchors {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .cb-anchor-chip {
      padding: 2px 7px;
      border-radius: 999px;
      border: 1px solid var(--xcron-line);
      background: var(--xcron-wash);
      color: var(--xcron-muted);
      font-size: 10.5px;
      cursor: pointer;
    }

    .cb-anchor-chip:hover,
    .cb-anchor-chip--on {
      border-color: var(--xcron-primary);
      color: var(--xcron-ink);
    }

    @media (max-width: 620px) {
      .cb {
        justify-content: flex-start;
        padding: 8px 10px;
      }

      .cb-btn,
      .cb-btn-pill,
      .cb-swatch {
        min-height: 44px;
      }
    }
  `,
})
export class EditorContextBarComponent {
  readonly section = input<PortfolioSection | null>(null);
  readonly definition = input<PortfolioComponentDefinition | null>(null);
  readonly sectionIndex = input(0);
  readonly totalSections = input(0);
  readonly hasCopiedStyle = input(false);
  readonly anchorTargets = input<Array<{ id: string; label: string }>>([]);

  readonly variantChange = output<string>();
  readonly styleChange = output<{ key: keyof PortfolioSectionStyle; value: string }>();
  readonly ctaLinkChange = output<string>();
  readonly copyStyleClick = output<void>();
  readonly pasteStyleClick = output<void>();
  readonly openContentClick = output<void>();
  readonly openDesignClick = output<void>();
  readonly moveUpClick = output<void>();
  readonly moveDownClick = output<void>();
  readonly duplicateClick = output<void>();
  readonly toggleHiddenClick = output<void>();
  readonly deleteClick = output<void>();
  readonly aiClick = output<void>();
  readonly addSectionClick = output<void>();
  readonly moreClick = output<MouseEvent>();

  readonly linkPopoverOpen = signal(false);

  style(): PortfolioSectionStyle {
    return this.section()?.style ?? {};
  }

  sectionTitle(section: PortfolioSection): string {
    return sectionLabel(section.type);
  }

  sectionIcon(type: string) {
    return iconForSectionType(type);
  }

  hasCtaLink(): boolean {
    const type = this.section()?.type;
    return type === 'hero' || type === 'cta';
  }

  ctaLinkValue(): string {
    const sec = this.section();
    if (!sec) return '';
    const key = sec.type === 'cta' ? 'buttonHref' : 'primaryCtaHref';
    const val = sec.props[key];
    return typeof val === 'string' ? val : '';
  }

  applyPadding(value: string): void {
    this.styleChange.emit({ key: 'paddingTop', value });
    this.styleChange.emit({ key: 'paddingBottom', value });
  }
}
