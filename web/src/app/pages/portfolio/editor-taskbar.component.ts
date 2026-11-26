import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { sectionLabel, type PortfolioSectionType } from '../../core/models/portfolio.model';
import { EditorIconComponent, iconForSectionType } from './editor-icons.component';
import { EditorTooltipDirective } from './editor-tooltip.directive';

/**
 * Strong bottom studio taskbar: save state, revision, error/warning jump chips,
 * selection breadcrumb, style clipboard status, guides toggle, zoom controls,
 * and keyboard shortcuts trigger.
 */
@Component({
  selector: 'app-editor-taskbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, EditorIconComponent, EditorTooltipDirective],
  template: `
    <footer class="tsk" role="contentinfo" aria-label="Editor status taskbar">
      <!-- Left cluster: save status, revision, validation issues, selection & clipboard -->
      <div class="tsk__group">
        <button
          type="button"
          class="tsk-item tsk-item--btn"
          (click)="saveState() === 'error' || saveState() === 'conflict' ? retrySaveClick.emit() : null"
          [appTip]="saveTooltip()"
          appTipPos="top"
        >
          <span
            class="tsk-dot"
            [class.tsk-dot--saved]="saveState() === 'saved'"
            [class.tsk-dot--dirty]="saveState() === 'dirty' || saveState() === 'saving'"
            [class.tsk-dot--error]="saveState() === 'error' || saveState() === 'conflict'"
          ></span>
          <span>{{ saveShort() }}</span>
        </button>

        <span class="tsk-sep"></span>

        <span class="tsk-item" appTip="Draft revision" appTipPos="top">
          r{{ revision() }}
        </span>

        @if (errorCount() > 0) {
          <button
            type="button"
            class="tsk-badge tsk-badge--err"
            (click)="focusIssueClick.emit()"
            appTip="Jump to blocking issue"
            appTipPos="top"
          >
            <app-editor-icon name="alert-circle" [size]="12" />
            <span>{{ errorCount() }}</span>
          </button>
        }

        @if (warningCount() > 0) {
          <button
            type="button"
            class="tsk-badge tsk-badge--warn"
            (click)="focusIssueClick.emit()"
            appTip="Review warnings"
            appTipPos="top"
          >
            <app-editor-icon name="alert-triangle" [size]="12" />
            <span>{{ warningCount() }}</span>
          </button>
        }

        @if (selectedSectionType(); as type) {
          <span class="tsk-sep"></span>
          <span class="tsk-item tsk-item--strong" appTip="Selected section" appTipPos="top">
            <app-editor-icon [name]="sectionIcon(type)" [size]="12" />
            <span>{{ sectionTitle(type) }}</span>
            @if (selectedVariant()) {
              <span class="tsk-muted">· {{ selectedVariant() }}</span>
            }
          </span>
        }

        @if (hasCopiedStyle()) {
          <span class="tsk-sep"></span>
          <button
            type="button"
            class="tsk-badge tsk-badge--clip"
            (click)="pasteStyleClick.emit()"
            appTip="Paste copied section style"
            appTipKbd="Ctrl+Alt+V"
            appTipPos="top"
          >
            <app-editor-icon name="paintbrush" [size]="11" />
            <app-editor-icon name="clipboard" [size]="11" />
          </button>
        }
      </div>

      <!-- Right cluster: section count, guides toggle, zoom controls, shortcuts -->
      <div class="tsk__group">
        <span class="tsk-item" appTip="Total sections" appTipPos="top">
          <app-editor-icon name="layers" [size]="12" />
          <span>{{ sectionCount() }}</span>
        </span>

        <button
          type="button"
          class="tsk-icon-btn"
          [class.tsk-icon-btn--on]="showGuides()"
          (click)="toggleGuidesClick.emit()"
          appTip="Toggle section guides"
          appTipPos="top"
        >
          <app-editor-icon name="grid" [size]="13" />
        </button>

        <span class="tsk-sep"></span>

        <div class="tsk-zoom" role="group" aria-label="Canvas zoom">
          <button
            type="button"
            class="tsk-icon-btn"
            [disabled]="zoom() <= 50"
            (click)="stepZoom(-15)"
            appTip="Zoom out"
            appTipKbd="Ctrl+-"
            appTipPos="top"
          >
            <app-editor-icon name="zoom-out" [size]="13" />
          </button>

          <select
            class="tsk-zoom__select"
            [ngModel]="zoom()"
            (ngModelChange)="zoomChange.emit(+$event)"
            aria-label="Zoom percentage"
            appTip="Zoom level"
            appTipPos="top"
          >
            @for (z of zoomLevels; track z) {
              <option [value]="z">{{ z }}%</option>
            }
          </select>

          <button
            type="button"
            class="tsk-icon-btn"
            [disabled]="zoom() >= 125"
            (click)="stepZoom(15)"
            appTip="Zoom in"
            appTipKbd="Ctrl+="
            appTipPos="top"
          >
            <app-editor-icon name="zoom-in" [size]="13" />
          </button>

          <button
            type="button"
            class="tsk-icon-btn"
            [class.tsk-icon-btn--on]="zoom() === 100"
            (click)="zoomChange.emit(100)"
            appTip="Reset zoom (100%)"
            appTipKbd="Ctrl+0"
            appTipPos="top"
          >
            <app-editor-icon name="maximize" [size]="12" />
          </button>
        </div>

        <span class="tsk-sep"></span>

        <button
          type="button"
          class="tsk-icon-btn"
          (click)="shortcutsClick.emit()"
          appTip="Keyboard shortcuts"
          appTipKbd="?"
          appTipPos="top"
        >
          <app-editor-icon name="keyboard" [size]="13" />
        </button>
      </div>
    </footer>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .tsk {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      min-height: 40px;
      padding: 6px 16px;
      background: var(--xcron-bg-elevated);
      border-top: 1px solid var(--xcron-line);
      font-family: var(--xcron-font-body);
      font-size: 0.72rem;
      color: var(--xcron-muted);
      user-select: none;
      flex-wrap: wrap;
    }

    .tsk__group {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .tsk-sep {
      width: 1px;
      height: 14px;
      background: var(--xcron-line);
      flex-shrink: 0;
    }

    .tsk-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2px 6px;
      border-radius: 5px;
      white-space: nowrap;
    }

    .tsk-item--btn {
      border: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }

    .tsk-item--btn:hover,
    .tsk-item--btn:focus-visible {
      background: var(--xcron-wash);
      color: var(--xcron-ink);
    }

    .tsk-item--btn:focus-visible {
      outline: 1px solid var(--xcron-primary);
    }

    .tsk-item--strong {
      color: var(--xcron-ink);
      font-weight: 600;
    }

    .tsk-muted {
      color: var(--xcron-muted);
      font-weight: 400;
    }

    .tsk-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .tsk-dot--saved {
      background: var(--xcron-success);
    }

    .tsk-dot--dirty {
      background: var(--xcron-accent);
    }

    .tsk-dot--error {
      background: var(--xcron-danger);
    }

    .tsk-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      height: 20px;
      padding: 0 7px;
      border: 0;
      border-radius: 999px;
      font-size: 10.5px;
      font-weight: 700;
      cursor: pointer;
    }

    .tsk-badge--err {
      background: color-mix(in srgb, var(--xcron-danger) 16%, transparent);
      color: var(--xcron-danger);
    }

    .tsk-badge--warn {
      background: color-mix(in srgb, var(--xcron-accent) 18%, transparent);
      color: var(--xcron-accent);
    }

    .tsk-badge--clip {
      background: color-mix(in srgb, var(--xcron-primary) 16%, transparent);
      color: var(--xcron-primary);
    }

    .tsk-icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      padding: 0;
      border: 1px solid transparent;
      border-radius: 0.6rem;
      background: transparent;
      color: var(--xcron-muted);
      cursor: pointer;
      transition: background 160ms var(--xcron-ease), color 160ms var(--xcron-ease);
    }

    .tsk-icon-btn:hover:not(:disabled),
    .tsk-icon-btn:focus-visible:not(:disabled) {
      background: var(--xcron-wash);
      color: var(--xcron-ink);
    }

    .tsk-icon-btn:focus-visible {
      outline: none;
      border-color: var(--xcron-primary);
    }

    .tsk-icon-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .tsk-icon-btn--on {
      color: var(--xcron-primary);
      background: color-mix(in srgb, var(--xcron-primary) 14%, transparent);
    }

    .tsk-zoom {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }

    .tsk-zoom__select {
      min-height: 0 !important;
      height: 22px;
      padding: 0 14px 0 4px !important;
      border: 1px solid transparent !important;
      border-radius: 5px !important;
      background-color: transparent !important;
      font-size: 11px !important;
      font-weight: 600;
      color: var(--xcron-ink);
      cursor: pointer;
      box-shadow: none !important;
    }

    .tsk-zoom__select:hover {
      background-color: var(--xcron-wash) !important;
    }

    @media (max-width: 620px) {
      .tsk {
        padding: 8px 10px;
      }

      .tsk-icon-btn,
      .tsk-badge,
      .tsk-item--btn {
        min-height: 44px;
      }
    }
  `,
})
export class EditorTaskbarComponent {
  readonly saveState = input<'saved' | 'dirty' | 'saving' | 'conflict' | 'error'>('saved');
  readonly lastSavedAt = input<string | null>(null);
  readonly sectionCount = input(0);
  readonly selectedSectionType = input<string | null>(null);
  readonly selectedVariant = input<string>('');
  readonly errorCount = input(0);
  readonly warningCount = input(0);
  readonly revision = input(0);
  readonly zoom = input(100);
  readonly showGuides = input(true);
  readonly hasCopiedStyle = input(false);

  readonly zoomChange = output<number>();
  readonly toggleGuidesClick = output<void>();
  readonly shortcutsClick = output<void>();
  readonly focusIssueClick = output<void>();
  readonly retrySaveClick = output<void>();
  readonly pasteStyleClick = output<void>();

  readonly zoomLevels = [50, 75, 90, 100, 115, 125];

  saveShort(): string {
    switch (this.saveState()) {
      case 'saving':
        return 'Saving…';
      case 'dirty':
        return 'Unsaved';
      case 'error':
        return 'Failed';
      case 'conflict':
        return 'Conflict';
      default:
        return 'Saved';
    }
  }

  saveTooltip(): string {
    const savedAt = this.lastSavedAt();
    if (this.saveState() === 'saved' && savedAt) {
      return `Saved at ${new Date(savedAt).toLocaleTimeString()}`;
    }
    return this.saveShort();
  }

  sectionIcon(type: string) {
    return iconForSectionType(type);
  }

  sectionTitle(type: string): string {
    return sectionLabel(type as PortfolioSectionType);
  }

  stepZoom(delta: number): void {
    const next = Math.max(50, Math.min(125, this.zoom() + delta));
    this.zoomChange.emit(next);
  }
}
