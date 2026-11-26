import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EditorIconComponent } from './editor-icons.component';
import { EditorTooltipDirective } from './editor-tooltip.directive';

/**
 * Solid uniformed top studio bar.
 * Purely icon-based controls with instant hover tooltips and shortcuts.
 */
@Component({
  selector: 'app-editor-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, EditorIconComponent, EditorTooltipDirective],
  template: `
    <header class="tb" role="toolbar" aria-label="Editor toolbar">
      <!-- Left cluster: navigation, layers toggle, brand title & save indicator -->
      <div class="tb__group tb__group--left">
        <a
          class="tb-btn"
          routerLink="/portfolio"
          appTip="Back to portfolios"
        >
          <app-editor-icon name="arrow-left" [size]="16" />
        </a>

        <button
          type="button"
          class="tb-btn"
          [class.tb-btn--on]="!layersCollapsed()"
          (click)="toggleLayersClick.emit()"
          appTip="Layers panel"
          appTipKbd="Ctrl+B"
        >
          <app-editor-icon name="panel-left" [size]="16" />
        </button>

        <span class="tb-sep"></span>

        <div class="tb-brand">
          <input
            class="tb-brand__input"
            [ngModel]="siteName()"
            (ngModelChange)="siteNameChange.emit($event)"
            maxlength="80"
            aria-label="Portfolio name"
            appTip="Rename portfolio"
          />
          <button
            type="button"
            class="tb-save"
            [attr.data-state]="saveState()"
            (click)="saveState() === 'error' || saveState() === 'conflict' ? retrySaveClick.emit() : null"
            [appTip]="saveTooltip()"
          >
            <span class="tb-save__dot"></span>
          </button>
        </div>
      </div>

      <!-- Center cluster: history, mode, viewport, theme preview, AI & command palette -->
      <div class="tb__group tb__group--center">
        <div class="tb-pill">
          <button
            type="button"
            class="tb-btn tb-btn--sm"
            [disabled]="!canUndo()"
            (click)="undoClick.emit()"
            appTip="Undo"
            appTipKbd="Ctrl+Z"
          >
            <app-editor-icon name="undo" [size]="15" />
          </button>
          <button
            type="button"
            class="tb-btn tb-btn--sm"
            [disabled]="!canRedo()"
            (click)="redoClick.emit()"
            appTip="Redo"
            appTipKbd="Ctrl+Y"
          >
            <app-editor-icon name="redo" [size]="15" />
          </button>
        </div>

        <div class="tb-pill" role="group" aria-label="Editor mode">
          <button
            type="button"
            class="tb-btn tb-btn--sm"
            [class.tb-btn--on]="!previewOnly()"
            (click)="previewOnlyChange.emit(false)"
            appTip="Edit mode"
            appTipKbd="P"
            appTipDesc="Click text to edit, drag to reorder, style sections"
          >
            <app-editor-icon name="edit" [size]="15" />
          </button>
          <button
            type="button"
            class="tb-btn tb-btn--sm"
            [class.tb-btn--on]="previewOnly()"
            (click)="previewOnlyChange.emit(true)"
            appTip="Live preview mode"
            appTipKbd="P"
            appTipDesc="Hide editor chrome and test links interactively"
          >
            <app-editor-icon name="eye" [size]="15" />
          </button>
          <button
            type="button"
            class="tb-btn tb-btn--sm"
            (click)="importClick.emit()"
            appTip="Import HTML / CSS / JS"
            appTipDesc="Import standalone code into a sandboxed section"
          >
            <app-editor-icon name="code" [size]="15" />
          </button>
        </div>

        <div class="tb-pill" role="group" aria-label="Viewport width">
          <button
            type="button"
            class="tb-btn tb-btn--sm"
            [class.tb-btn--on]="device() === 'desktop'"
            (click)="deviceChange.emit('desktop')"
            appTip="Desktop view"
            appTipKbd="1"
          >
            <app-editor-icon name="monitor" [size]="15" />
          </button>
          <button
            type="button"
            class="tb-btn tb-btn--sm"
            [class.tb-btn--on]="device() === 'tablet'"
            (click)="deviceChange.emit('tablet')"
            appTip="Tablet view"
            appTipKbd="2"
          >
            <app-editor-icon name="tablet" [size]="15" />
          </button>
          <button
            type="button"
            class="tb-btn tb-btn--sm"
            [class.tb-btn--on]="device() === 'mobile'"
            (click)="deviceChange.emit('mobile')"
            appTip="Mobile view"
            appTipKbd="3"
          >
            <app-editor-icon name="smartphone" [size]="15" />
          </button>
        </div>

        <div class="tb-pill" role="group" aria-label="Color mode">
          <button
            type="button"
            class="tb-btn tb-btn--sm"
            [class.tb-btn--on]="previewMode() === 'light'"
            (click)="previewModeChange.emit('light')"
            appTip="Light preview"
          >
            <app-editor-icon name="sun" [size]="15" />
          </button>
          <button
            type="button"
            class="tb-btn tb-btn--sm"
            [class.tb-btn--on]="previewMode() === 'dark'"
            (click)="previewModeChange.emit('dark')"
            appTip="Dark preview"
          >
            <app-editor-icon name="moon" [size]="15" />
          </button>
          <button
            type="button"
            class="tb-btn tb-btn--sm"
            [class.tb-btn--on]="previewMode() === ''"
            (click)="previewModeChange.emit('')"
            appTip="Theme default"
          >
            <app-editor-icon name="contrast" [size]="15" />
          </button>
        </div>

        <div class="tb-pill">
          <button
            type="button"
            class="tb-btn tb-btn--sm tb-btn--ai"
            (click)="aiClick.emit()"
            appTip="AI copy assist"
            appTipDesc="Generate headline, bio & skills proposals"
          >
            <app-editor-icon name="sparkles" [size]="15" />
          </button>
          <button
            type="button"
            class="tb-btn tb-btn--sm"
            (click)="commandPaletteClick.emit()"
            appTip="Command palette"
            appTipKbd="Ctrl+K"
          >
            <app-editor-icon name="search" [size]="15" />
          </button>
        </div>
      </div>

      <!-- Right cluster: language, inspector toggle, validation, settings, tour, live & publish -->
      <div class="tb__group tb__group--right">
        <label class="tb-locale" appTip="Editing language">
          <app-editor-icon name="globe" [size]="14" />
          <select
            [ngModel]="activeLocale()"
            (ngModelChange)="localeChange.emit($event)"
            aria-label="Editing language"
          >
            @for (code of locales(); track code) {
              <option [value]="code">{{ code }}</option>
            }
          </select>
        </label>

        <button
          type="button"
          class="tb-btn"
          [class.tb-btn--on]="!inspectorCollapsed()"
          (click)="toggleInspectorClick.emit()"
          appTip="Inspector panel"
          appTipKbd="Ctrl+I"
        >
          <app-editor-icon name="panel-right" [size]="16" />
        </button>

        <span class="tb-sep"></span>

        <button
          type="button"
          class="tb-btn"
          [class.tb-btn--danger]="errorCount() > 0"
          [disabled]="busy()"
          (click)="validateClick.emit()"
          appTip="Validate draft"
          appTipKbd="Ctrl+Shift+V"
        >
          <app-editor-icon name="check-circle" [size]="16" />
          @if (errorCount() + warningCount() > 0) {
            <span class="tb-badge" [class.tb-badge--warn]="errorCount() === 0">
              {{ errorCount() > 0 ? errorCount() : warningCount() }}
            </span>
          }
        </button>

        <button
          type="button"
          class="tb-btn"
          [class.tb-btn--on]="settingsOpen()"
          (click)="settingsClick.emit()"
          appTip="Site settings"
        >
          <app-editor-icon name="settings" [size]="16" />
        </button>

        <button
          type="button"
          class="tb-btn"
          (click)="helpClick.emit()"
          appTip="Guided tour"
        >
          <app-editor-icon name="help-circle" [size]="16" />
        </button>

        @if (isPublished()) {
          <a
            class="tb-btn"
            [routerLink]="['/p', slug()]"
            target="_blank"
            rel="noopener"
            appTip="Open live site"
          >
            <app-editor-icon name="external-link" [size]="16" />
          </a>
        }

        <button
          type="button"
          class="tb-publish"
          [disabled]="publishing() || busy()"
          (click)="publishClick.emit()"
          appTip="Publish immutable version"
        >
          <app-editor-icon name="rocket" [size]="14" />
          <span>{{ publishing() ? '…' : 'Publish' }}</span>
        </button>
      </div>
    </header>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .tb {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-height: 48px;
      padding: 6px 12px;
      background: var(--xcron-bg-elevated);
      border-bottom: 1px solid var(--xcron-line);
      flex-wrap: wrap;
    }

    .tb__group {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .tb__group--center {
      flex-wrap: wrap;
      justify-content: center;
    }

    .tb-sep {
      width: 1px;
      height: 20px;
      background: var(--xcron-line);
      flex-shrink: 0;
    }

    .tb-pill {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: 2px;
      border-radius: 10px;
      border: 1px solid var(--xcron-line);
      background: var(--xcron-wash);
    }

    .tb-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      padding: 0;
      border: 1px solid transparent;
      border-radius: 8px;
      background: transparent;
      color: var(--xcron-muted);
      text-decoration: none;
      cursor: pointer;
      transition:
        background 140ms ease,
        color 140ms ease,
        border-color 140ms ease;
    }

    .tb-btn--sm {
      width: 30px;
      height: 28px;
      border-radius: 7px;
    }

    .tb-btn:hover:not(:disabled) {
      background: color-mix(in srgb, var(--xcron-primary) 12%, transparent);
      color: var(--xcron-ink);
    }

    .tb-btn:disabled {
      opacity: 0.32;
      cursor: not-allowed;
    }

    .tb-btn--on {
      background: var(--xcron-primary);
      color: #fff;
      box-shadow: 0 2px 8px color-mix(in srgb, var(--xcron-primary) 35%, transparent);
    }

    .tb-btn--on:hover:not(:disabled) {
      background: var(--xcron-primary-hover);
      color: #fff;
    }

    .tb-btn--ai {
      color: var(--xcron-accent);
    }

    .tb-btn--ai:hover:not(:disabled) {
      background: color-mix(in srgb, var(--xcron-accent) 16%, transparent);
      color: var(--xcron-accent);
    }

    .tb-btn--danger {
      color: var(--xcron-danger);
    }

    .tb-badge {
      position: absolute;
      top: 2px;
      right: 2px;
      min-width: 15px;
      height: 15px;
      padding: 0 4px;
      border-radius: 999px;
      background: var(--xcron-danger);
      color: #fff;
      font-size: 9.5px;
      font-weight: 800;
      line-height: 15px;
      text-align: center;
    }

    .tb-badge--warn {
      background: var(--xcron-accent);
      color: #111;
    }

    .tb-brand {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .tb-brand__input {
      width: 148px;
      min-height: 30px !important;
      height: 30px;
      padding: 3px 8px !important;
      border-radius: 8px !important;
      border: 1px solid transparent !important;
      background: transparent !important;
      color: var(--xcron-ink);
      font-family: var(--xcron-font-display) !important;
      font-size: 13.5px !important;
      font-weight: 700;
      letter-spacing: -0.02em;
      text-overflow: ellipsis;
    }

    .tb-brand__input:hover {
      border-color: var(--xcron-line) !important;
      background: var(--xcron-wash) !important;
    }

    .tb-brand__input:focus {
      border-color: var(--xcron-primary) !important;
      background: var(--xcron-bg) !important;
      box-shadow: none !important;
    }

    .tb-save {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      padding: 0;
      border: 0;
      border-radius: 999px;
      background: transparent;
      cursor: pointer;
    }

    .tb-save__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--xcron-success);
      transition: background 150ms ease, transform 150ms ease;
    }

    .tb-save[data-state='dirty'] .tb-save__dot,
    .tb-save[data-state='saving'] .tb-save__dot {
      background: var(--xcron-accent);
    }

    .tb-save[data-state='error'] .tb-save__dot,
    .tb-save[data-state='conflict'] .tb-save__dot {
      background: var(--xcron-danger);
    }

    .tb-locale {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      height: 32px;
      padding: 0 8px;
      border-radius: 8px;
      border: 1px solid var(--xcron-line);
      background: var(--xcron-wash);
      color: var(--xcron-muted);
      cursor: pointer;
    }

    .tb-locale select {
      min-height: 0 !important;
      height: 28px;
      padding: 0 16px 0 2px !important;
      border: 0 !important;
      background-color: transparent !important;
      font-size: 11.5px !important;
      font-weight: 600;
      color: var(--xcron-ink);
      cursor: pointer;
      box-shadow: none !important;
    }

    .tb-publish {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 34px;
      padding: 0 14px;
      border: 0;
      border-radius: 9px;
      background: var(--xcron-cta-gradient);
      color: #fff;
      font-size: 12.5px;
      font-weight: 700;
      letter-spacing: 0.01em;
      cursor: pointer;
      box-shadow: 0 4px 14px color-mix(in srgb, var(--xcron-primary) 32%, transparent);
      transition: filter 150ms ease, transform 150ms ease, opacity 150ms ease;
    }

    .tb-publish:hover:not(:disabled) {
      filter: brightness(1.08);
      transform: translateY(-1px);
    }

    .tb-publish:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    @media (max-width: 960px) {
      .tb-brand__input {
        width: 110px;
      }
    }
  `,
})
export class EditorToolbarComponent {
  readonly siteName = input('');
  readonly saveState = input<'saved' | 'dirty' | 'saving' | 'conflict' | 'error'>('saved');
  readonly lastSavedAt = input<string | null>(null);
  readonly canUndo = input(false);
  readonly canRedo = input(false);
  readonly isPublished = input(false);
  readonly publishing = input(false);
  readonly busy = input(false);
  readonly previewOnly = input(false);
  readonly layersCollapsed = input(false);
  readonly inspectorCollapsed = input(false);
  readonly settingsOpen = input(false);
  readonly device = input<'desktop' | 'tablet' | 'mobile'>('desktop');
  readonly previewMode = input<'light' | 'dark' | ''>('');
  readonly activeLocale = input('en-IN');
  readonly locales = input<string[]>(['en-IN']);
  readonly errorCount = input(0);
  readonly warningCount = input(0);
  readonly slug = input('');

  readonly undoClick = output<void>();
  readonly redoClick = output<void>();
  readonly validateClick = output<void>();
  readonly importClick = output<void>();
  readonly publishClick = output<void>();
  readonly settingsClick = output<void>();
  readonly helpClick = output<void>();
  readonly aiClick = output<void>();
  readonly commandPaletteClick = output<void>();
  readonly toggleLayersClick = output<void>();
  readonly toggleInspectorClick = output<void>();
  readonly previewOnlyChange = output<boolean>();
  readonly deviceChange = output<'desktop' | 'tablet' | 'mobile'>();
  readonly previewModeChange = output<'light' | 'dark' | ''>();
  readonly localeChange = output<string>();
  readonly retrySaveClick = output<void>();
  readonly siteNameChange = output<string>();

  saveTooltip(): string {
    switch (this.saveState()) {
      case 'saving':
        return 'Saving draft…';
      case 'dirty':
        return 'Unsaved changes (autosaving)';
      case 'conflict':
        return 'Draft conflict — click to resolve';
      case 'error':
        return 'Save failed — click to retry';
      default:
        return this.lastSavedAt() ? 'All changes saved' : 'Draft saved';
    }
  }
}
