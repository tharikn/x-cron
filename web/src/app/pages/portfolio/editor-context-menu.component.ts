import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  output,
} from '@angular/core';
import { EditorIconComponent } from './editor-icons.component';
import { EditorTooltipDirective } from './editor-tooltip.directive';

export type ContextMenuScope = 'section' | 'canvas' | 'nav';

/**
 * Shared Cursor Context Menu triggered by BOTH mouse right-click and left-click
 * `⋯` menu buttons. Features uniform SVG icons, inline alignment strip, style
 * copy/paste, arrangement, insertion, AI assist, and shortcut hints.
 */
@Component({
  selector: 'app-editor-context-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EditorIconComponent, EditorTooltipDirective],
  template: `
    @if (visible()) {
      <div class="ctx-backdrop" (click)="onClose()" (contextmenu)="$event.preventDefault(); onClose()"></div>
      <div
        class="ctx-menu"
        role="menu"
        [style.left.px]="adjustedX()"
        [style.top.px]="adjustedY()"
        (click)="$event.stopPropagation()"
      >
        @if (context() === 'section') {
          <!-- Inline quick-align bar right at top of menu (Figma/Canva style) -->
          <div class="ctx-align-row" role="group" aria-label="Text alignment">
            <button
              type="button"
              class="ctx-align-btn"
              [class.ctx-align-btn--on]="!textAlign() || textAlign() === 'left'"
              (click)="emit('align-left')"
              appTip="Align left"
            >
              <app-editor-icon name="align-left" [size]="14" />
            </button>
            <button
              type="button"
              class="ctx-align-btn"
              [class.ctx-align-btn--on]="textAlign() === 'center'"
              (click)="emit('align-center')"
              appTip="Align center"
            >
              <app-editor-icon name="align-center" [size]="14" />
            </button>
            <button
              type="button"
              class="ctx-align-btn"
              [class.ctx-align-btn--on]="textAlign() === 'right'"
              (click)="emit('align-right')"
              appTip="Align right"
            >
              <app-editor-icon name="align-right" [size]="14" />
            </button>
            <span class="ctx-align-sep"></span>
            <button
              type="button"
              class="ctx-align-btn ctx-align-btn--ai"
              (click)="emit('ai-assist')"
              appTip="AI copy assist"
            >
              <app-editor-icon name="sparkles" [size]="14" />
            </button>
          </div>

          <div class="ctx-sep"></div>

          <button type="button" class="ctx-item" role="menuitem" (click)="emit('edit-content')">
            <app-editor-icon name="edit" [size]="14" />
            <span class="ctx-label">Edit Content</span>
            <kbd class="ctx-kbd">Enter</kbd>
          </button>
          <button type="button" class="ctx-item" role="menuitem" (click)="emit('edit-design')">
            <app-editor-icon name="sliders" [size]="14" />
            <span class="ctx-label">Style & Design</span>
            <kbd class="ctx-kbd">D</kbd>
          </button>

          <div class="ctx-sep"></div>

          <button type="button" class="ctx-item" role="menuitem" (click)="emit('duplicate')">
            <app-editor-icon name="copy" [size]="14" />
            <span class="ctx-label">Duplicate</span>
            <kbd class="ctx-kbd">Ctrl+D</kbd>
          </button>
          <button type="button" class="ctx-item" role="menuitem" (click)="emit('copy-section')">
            <app-editor-icon name="layers" [size]="14" />
            <span class="ctx-label">Copy Section</span>
            <kbd class="ctx-kbd">Ctrl+C</kbd>
          </button>
          <button
            type="button"
            class="ctx-item"
            role="menuitem"
            [disabled]="!hasCopiedSection()"
            (click)="emit('paste-section')"
          >
            <app-editor-icon name="clipboard" [size]="14" />
            <span class="ctx-label">Paste Section Below</span>
            <kbd class="ctx-kbd">Ctrl+V</kbd>
          </button>

          <div class="ctx-sep"></div>

          <button type="button" class="ctx-item" role="menuitem" (click)="emit('copy-style')">
            <app-editor-icon name="paintbrush" [size]="14" />
            <span class="ctx-label">Copy Style</span>
            <kbd class="ctx-kbd">Ctrl+Alt+C</kbd>
          </button>
          <button
            type="button"
            class="ctx-item"
            role="menuitem"
            [disabled]="!hasCopiedStyle()"
            (click)="emit('paste-style')"
          >
            <app-editor-icon name="clipboard" [size]="14" />
            <span class="ctx-label">Paste Style</span>
            <kbd class="ctx-kbd">Ctrl+Alt+V</kbd>
          </button>
          <button type="button" class="ctx-item" role="menuitem" (click)="emit('reset-style')">
            <app-editor-icon name="rotate-ccw" [size]="14" />
            <span class="ctx-label">Reset Styles</span>
          </button>

          <div class="ctx-sep"></div>

          <button
            type="button"
            class="ctx-item"
            role="menuitem"
            [disabled]="sectionIndex() <= 0"
            (click)="emit('move-up')"
          >
            <app-editor-icon name="arrow-up" [size]="14" />
            <span class="ctx-label">Move Up</span>
            <kbd class="ctx-kbd">Alt+↑</kbd>
          </button>
          <button
            type="button"
            class="ctx-item"
            role="menuitem"
            [disabled]="sectionIndex() >= totalSections() - 1"
            (click)="emit('move-down')"
          >
            <app-editor-icon name="arrow-down" [size]="14" />
            <span class="ctx-label">Move Down</span>
            <kbd class="ctx-kbd">Alt+↓</kbd>
          </button>
          <button type="button" class="ctx-item" role="menuitem" (click)="emit('add-section-above')">
            <app-editor-icon name="plus-circle" [size]="14" />
            <span class="ctx-label">Insert Above</span>
          </button>
          <button type="button" class="ctx-item" role="menuitem" (click)="emit('add-section-below')">
            <app-editor-icon name="plus-circle" [size]="14" />
            <span class="ctx-label">Insert Below</span>
          </button>
          <button type="button" class="ctx-item" role="menuitem" (click)="emit('toggle-hidden')">
            <app-editor-icon [name]="sectionHidden() ? 'eye' : 'eye-off'" [size]="14" />
            <span class="ctx-label">{{ sectionHidden() ? 'Show' : 'Hide' }}</span>
            <kbd class="ctx-kbd">H</kbd>
          </button>

          <div class="ctx-sep"></div>

          <button type="button" class="ctx-item ctx-item--danger" role="menuitem" (click)="emit('delete')">
            <app-editor-icon name="trash" [size]="14" />
            <span class="ctx-label">Delete</span>
            <kbd class="ctx-kbd">Del</kbd>
          </button>
        } @else if (context() === 'canvas') {
          <button type="button" class="ctx-item" role="menuitem" (click)="emit('add-section')">
            <app-editor-icon name="plus-circle" [size]="14" />
            <span class="ctx-label">Add Section</span>
            <kbd class="ctx-kbd">A</kbd>
          </button>
          <button
            type="button"
            class="ctx-item"
            role="menuitem"
            [disabled]="!hasCopiedSection()"
            (click)="emit('paste-section')"
          >
            <app-editor-icon name="clipboard" [size]="14" />
            <span class="ctx-label">Paste Section</span>
            <kbd class="ctx-kbd">Ctrl+V</kbd>
          </button>
          <button type="button" class="ctx-item" role="menuitem" (click)="emit('ai-assist')">
            <app-editor-icon name="sparkles" [size]="14" />
            <span class="ctx-label">AI Copy Assist</span>
          </button>

          <div class="ctx-sep"></div>

          <button type="button" class="ctx-item" role="menuitem" (click)="emit('zoom-100')">
            <app-editor-icon name="maximize" [size]="14" />
            <span class="ctx-label">Reset Zoom (100%)</span>
            <kbd class="ctx-kbd">Ctrl+0</kbd>
          </button>
          <button type="button" class="ctx-item" role="menuitem" (click)="emit('toggle-guides')">
            <app-editor-icon name="grid" [size]="14" />
            <span class="ctx-label">Toggle Guides</span>
          </button>
          <button type="button" class="ctx-item" role="menuitem" (click)="emit('toggle-sidebar')">
            <app-editor-icon name="panel-left" [size]="14" />
            <span class="ctx-label">Toggle Layers</span>
            <kbd class="ctx-kbd">Ctrl+B</kbd>
          </button>
          <button type="button" class="ctx-item" role="menuitem" (click)="emit('toggle-preview')">
            <app-editor-icon name="eye" [size]="14" />
            <span class="ctx-label">Preview Mode</span>
            <kbd class="ctx-kbd">P</kbd>
          </button>

          <div class="ctx-sep"></div>

          <button type="button" class="ctx-item" role="menuitem" (click)="emit('validate')">
            <app-editor-icon name="check-circle" [size]="14" />
            <span class="ctx-label">Validate Draft</span>
          </button>
        } @else {
          <button type="button" class="ctx-item" role="menuitem" (click)="emit('add-nav')">
            <app-editor-icon name="plus-circle" [size]="14" />
            <span class="ctx-label">Add Nav Link</span>
          </button>
          <button type="button" class="ctx-item" role="menuitem" (click)="emit('sync-nav')">
            <app-editor-icon name="refresh" [size]="14" />
            <span class="ctx-label">Sync from Sections</span>
          </button>
        }
      </div>
    }
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 10000;
    }

    .ctx-backdrop {
      position: fixed;
      inset: 0;
      pointer-events: auto;
    }

    .ctx-menu {
      position: fixed;
      pointer-events: auto;
      min-width: 236px;
      padding: 5px;
      border-radius: 12px;
      border: 1px solid var(--xcron-line-strong);
      background: var(--xcron-bg-elevated);
      box-shadow: 0 18px 46px rgba(0, 0, 0, 0.45);
      z-index: 10001;
      animation: ctx-pop 110ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    @keyframes ctx-pop {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .ctx-align-row {
      display: flex;
      align-items: center;
      gap: 3px;
      padding: 3px 4px;
    }

    .ctx-align-btn {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      border: 1px solid transparent;
      border-radius: 7px;
      background: var(--xcron-wash);
      color: var(--xcron-muted);
      cursor: pointer;
    }

    .ctx-align-btn:hover {
      color: var(--xcron-ink);
      border-color: var(--xcron-line);
    }

    .ctx-align-btn--on {
      background: var(--xcron-primary);
      color: #fff;
    }

    .ctx-align-btn--ai {
      color: var(--xcron-accent);
    }

    .ctx-align-sep {
      width: 1px;
      height: 18px;
      background: var(--xcron-line);
      margin: 0 2px;
    }

    .ctx-item {
      display: flex;
      align-items: center;
      gap: 9px;
      width: 100%;
      padding: 7px 9px;
      border: 0;
      border-radius: 7px;
      background: transparent;
      color: var(--xcron-ink);
      font-size: 12.5px;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: background 100ms ease, color 100ms ease;
    }

    .ctx-item:hover:not(:disabled) {
      background: color-mix(in srgb, var(--xcron-primary) 13%, transparent);
    }

    .ctx-item:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .ctx-item--danger {
      color: var(--xcron-danger);
    }

    .ctx-item--danger:hover:not(:disabled) {
      background: color-mix(in srgb, var(--xcron-danger) 14%, transparent);
    }

    .ctx-label {
      flex: 1;
    }

    .ctx-kbd {
      font-family: ui-monospace, 'Cascadia Code', monospace;
      font-size: 10px;
      color: var(--xcron-muted);
    }

    .ctx-sep {
      height: 1px;
      margin: 4px 6px;
      background: var(--xcron-line);
    }
  `,
})
export class EditorContextMenuComponent {
  readonly visible = input(false);
  readonly x = input(0);
  readonly y = input(0);
  readonly context = input<ContextMenuScope>('canvas');
  readonly sectionId = input<string | null>(null);
  readonly sectionIndex = input(0);
  readonly totalSections = input(0);
  readonly sectionHidden = input(false);
  readonly textAlign = input<'left' | 'center' | 'right' | undefined>(undefined);
  readonly hasCopiedStyle = input(false);
  readonly hasCopiedSection = input(false);

  readonly action = output<{ action: string; sectionId?: string }>();
  readonly close = output<void>();

  readonly adjustedX = computed(() => {
    if (typeof window === 'undefined') return this.x();
    return Math.max(8, Math.min(this.x(), window.innerWidth - 256));
  });

  readonly adjustedY = computed(() => {
    if (typeof window === 'undefined') return this.y();
    const height =
      this.context() === 'section' ? 470 : this.context() === 'canvas' ? 270 : 100;
    return Math.max(8, Math.min(this.y(), window.innerHeight - height));
  });

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.visible()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.onClose();
    }
  }

  emit(action: string): void {
    const id = this.sectionId();
    this.action.emit(id ? { action, sectionId: id } : { action });
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
