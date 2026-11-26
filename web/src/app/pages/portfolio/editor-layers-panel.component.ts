import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  localizedValue,
  sectionLabel,
  type PortfolioNavItem,
  type PortfolioSection,
  type PortfolioSectionType,
} from '../../core/models/portfolio.model';
import { EditorIconComponent, iconForSectionType } from './editor-icons.component';
import { EditorTooltipDirective } from './editor-tooltip.directive';

/**
 * Collapsible icon-driven Layers & Navigation sidebar.
 * Supports drag-and-drop reordering, hover quick-actions, right-click context
 * menu, and left-click `⋯` parity.
 */
@Component({
  selector: 'app-editor-layers-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, EditorIconComponent, EditorTooltipDirective],
  template: `
    <aside
      class="layers panel panel--sections"
      [class.layers--collapsed]="collapsed()"
      aria-label="Layers and navigation"
    >
      <!-- Panel Header -->
      <div class="layers__head">
        @if (!collapsed()) {
          <div class="layers__title-group">
            <app-editor-icon name="layers" [size]="15" />
            <span class="layers__title">Layers</span>
            <span class="layers__count">{{ sections().length }}</span>
          </div>
          <div class="layers__head-tools">
            <button
              type="button"
              class="lyr-btn"
              (click)="openPickerClick.emit()"
              appTip="Add section"
              appTipKbd="A"
            >
              <app-editor-icon name="plus" [size]="15" />
            </button>
            <button
              type="button"
              class="lyr-btn"
              (click)="toggleCollapse.emit()"
              appTip="Collapse layers"
              appTipKbd="Ctrl+B"
            >
              <app-editor-icon name="chevron-left" [size]="15" />
            </button>
          </div>
        } @else {
          <button
            type="button"
            class="lyr-btn"
            (click)="toggleCollapse.emit()"
            appTip="Expand layers"
            appTipKbd="Ctrl+B"
          >
            <app-editor-icon name="chevron-right" [size]="15" />
          </button>
        }
      </div>

      <!-- Sections Tree -->
      <ul class="layers__list" role="listbox" aria-label="Page sections">
        @for (section of sections(); track section.id; let i = $index) {
          <li
            class="lyr-row"
            [class.lyr-row--on]="section.id === selectedId()"
            [class.lyr-row--hidden]="section.hidden"
            [class.lyr-row--err]="issueCount(section.id).errors > 0"
            [class.lyr-row--warn]="issueCount(section.id).errors === 0 && issueCount(section.id).warnings > 0"
            [class.lyr-row--drag-over]="dragOverIndex() === i"
            draggable="true"
            (click)="sectionSelect.emit(section.id)"
            (contextmenu)="onItemContext($event, section.id)"
            (dragstart)="onDragStart($event, i)"
            (dragover)="onDragOver($event, i)"
            (dragleave)="onDragLeave(i)"
            (drop)="onDrop($event, i)"
            (dragend)="onDragEnd()"
            [appTip]="collapsed() ? titleFor(section.type) + ' · ' + section.variant : ''"
          >
            @if (!collapsed()) {
              <span class="lyr-grip" aria-hidden="true">
                <app-editor-icon name="grip" [size]="12" />
              </span>
            }

            <span class="lyr-icon">
              <app-editor-icon [name]="iconFor(section.type)" [size]="15" />
            </span>

            @if (!collapsed()) {
              <span class="lyr-meta">
                <span class="lyr-name">{{ titleFor(section.type) }}</span>
                <span class="lyr-var">{{ section.variant }}</span>
              </span>

              @if (issueCount(section.id).errors > 0) {
                <span class="lyr-dot lyr-dot--err" appTip="Validation errors"></span>
              } @else if (issueCount(section.id).warnings > 0) {
                <span class="lyr-dot lyr-dot--warn" appTip="Warnings"></span>
              }

              <div class="lyr-actions" (click)="$event.stopPropagation()">
                <button
                  type="button"
                  class="lyr-act"
                  (click)="sectionToggleHidden.emit(section.id)"
                  [appTip]="section.hidden ? 'Show' : 'Hide'"
                >
                  <app-editor-icon [name]="section.hidden ? 'eye-off' : 'eye'" [size]="13" />
                </button>
                <button
                  type="button"
                  class="lyr-act"
                  (click)="sectionDuplicate.emit(section.id)"
                  appTip="Duplicate"
                >
                  <app-editor-icon name="copy" [size]="13" />
                </button>
                <button
                  type="button"
                  class="lyr-act"
                  (click)="onMenuClick($event, section.id)"
                  appTip="Section options"
                >
                  <app-editor-icon name="more-vertical" [size]="13" />
                </button>
              </div>
            }
          </li>
        }
      </ul>

      <!-- Bottom Quick Add (when collapsed or expanded) -->
      <div class="layers__add">
        <button
          type="button"
          class="lyr-add-btn"
          (click)="openPickerClick.emit()"
          appTip="Add section"
          appTipKbd="A"
        >
          <app-editor-icon name="plus" [size]="15" />
          @if (!collapsed()) {
            <span>Add</span>
          }
        </button>
      </div>

      <!-- Navigation Tree (expanded only) -->
      @if (!collapsed()) {
        <div class="nav-box">
          <div
            class="nav-box__head"
            (contextmenu)="onNavContext($event)"
          >
            <button
              type="button"
              class="nav-box__toggle"
              (click)="navOpen.update(v => !v)"
              appTip="Toggle navigation links"
            >
              <app-editor-icon name="compass" [size]="13" />
              <span>Nav</span>
              <span class="layers__count">{{ navItems().length }}</span>
            </button>
            <div class="nav-box__tools">
              <button
                type="button"
                class="lyr-act"
                (click)="navAdd.emit()"
                appTip="Add nav link"
              >
                <app-editor-icon name="plus" [size]="13" />
              </button>
              <button
                type="button"
                class="lyr-act"
                (click)="navSync.emit()"
                appTip="Sync nav from visible sections"
              >
                <app-editor-icon name="refresh" [size]="13" />
              </button>
            </div>
          </div>

          @if (navOpen()) {
            <ul class="nav-box__list">
              @for (item of navItems(); track item.id; let ni = $index) {
                <li class="nav-row" (contextmenu)="onNavContext($event)">
                  <div class="nav-row__fields">
                    <input
                      class="nav-row__input"
                      [ngModel]="localized(item.label)"
                      (ngModelChange)="navLabelChange.emit({ id: item.id, label: $event })"
                      placeholder="Label"
                      aria-label="Nav link label"
                    />
                    <select
                      class="nav-row__select"
                      [ngModel]="item.target"
                      (ngModelChange)="navTargetChange.emit({ id: item.id, target: $event })"
                      aria-label="Nav link target"
                    >
                      <option value="#pf-main">#top</option>
                      @for (sec of sections(); track sec.id) {
                        <option [value]="'#' + sec.id">#{{ titleFor(sec.type) }}</option>
                      }
                    </select>
                  </div>
                  <div class="nav-row__tools">
                    <button
                      type="button"
                      class="lyr-act"
                      [disabled]="ni === 0"
                      (click)="navMoveUp.emit(item.id)"
                      appTip="Move up"
                    >
                      <app-editor-icon name="chevron-up" [size]="12" />
                    </button>
                    <button
                      type="button"
                      class="lyr-act"
                      [disabled]="ni === navItems().length - 1"
                      (click)="navMoveDown.emit(item.id)"
                      appTip="Move down"
                    >
                      <app-editor-icon name="chevron-down" [size]="12" />
                    </button>
                    <button
                      type="button"
                      class="lyr-act lyr-act--danger"
                      (click)="navRemove.emit(item.id)"
                      appTip="Remove link"
                    >
                      <app-editor-icon name="trash" [size]="12" />
                    </button>
                  </div>
                </li>
              }
            </ul>
          }
        </div>
      }
    </aside>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
      min-height: 0;
    }

    .layers {
      display: flex;
      flex-direction: column;
      width: 240px;
      height: 100%;
      background: var(--xcron-bg-elevated);
      border-right: 1px solid var(--xcron-line);
      transition: width 180ms cubic-bezier(0.22, 1, 0.36, 1);
      overflow: hidden;
    }

    .layers--collapsed {
      width: 52px;
    }

    .layers__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      height: 44px;
      padding: 0 10px;
      border-bottom: 1px solid var(--xcron-line);
      flex-shrink: 0;
    }

    .layers--collapsed .layers__head {
      justify-content: center;
      padding: 0 6px;
    }

    .layers__title-group {
      display: flex;
      align-items: center;
      gap: 7px;
      color: var(--xcron-ink);
      min-width: 0;
    }

    .layers__title {
      font-family: var(--xcron-font-display);
      font-size: 12.5px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .layers__count {
      padding: 1px 6px;
      border-radius: 999px;
      background: var(--xcron-wash);
      border: 1px solid var(--xcron-line);
      color: var(--xcron-muted);
      font-size: 10px;
      font-weight: 700;
    }

    .layers__head-tools {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .lyr-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: 0;
      border-radius: 7px;
      background: transparent;
      color: var(--xcron-muted);
      cursor: pointer;
    }

    .lyr-btn:hover {
      background: var(--xcron-wash);
      color: var(--xcron-ink);
    }

    .layers__list {
      flex: 1;
      min-height: 0;
      margin: 0;
      padding: 6px;
      list-style: none;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .lyr-row {
      position: relative;
      display: flex;
      align-items: center;
      gap: 7px;
      min-height: 36px;
      padding: 5px 8px;
      border-radius: 8px;
      border: 1px solid transparent;
      color: var(--xcron-ink);
      cursor: pointer;
      transition: background 120ms ease, border-color 120ms ease;
    }

    .layers--collapsed .lyr-row {
      justify-content: center;
      padding: 6px;
    }

    .lyr-row:hover {
      background: var(--xcron-wash);
    }

    .lyr-row--on {
      border-color: color-mix(in srgb, var(--xcron-primary) 55%, transparent);
      background: color-mix(in srgb, var(--xcron-primary) 13%, transparent);
    }

    .lyr-row--hidden {
      opacity: 0.45;
    }

    .lyr-row--err {
      border-color: color-mix(in srgb, var(--xcron-danger) 55%, transparent);
    }

    .lyr-row--warn {
      border-color: color-mix(in srgb, var(--xcron-accent) 50%, transparent);
    }

    .lyr-row--drag-over {
      border-top: 2px solid var(--xcron-primary);
    }

    .lyr-grip {
      color: var(--xcron-faint);
      cursor: grab;
      display: inline-flex;
    }

    .lyr-icon {
      display: inline-flex;
      color: var(--xcron-primary);
      flex-shrink: 0;
    }

    .lyr-meta {
      flex: 1;
      min-width: 0;
      display: grid;
      line-height: 1.2;
    }

    .lyr-name {
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .lyr-var {
      font-size: 10px;
      color: var(--xcron-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .lyr-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .lyr-dot--err {
      background: var(--xcron-danger);
    }

    .lyr-dot--warn {
      background: var(--xcron-accent);
    }

    .lyr-actions {
      display: none;
      align-items: center;
      gap: 1px;
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      padding: 2px;
      border-radius: 7px;
      background: var(--xcron-bg-elevated);
      border: 1px solid var(--xcron-line);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }

    .lyr-row:hover .lyr-actions,
    .lyr-row--on:hover .lyr-actions {
      display: flex;
    }

    .lyr-act {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      padding: 0;
      border: 0;
      border-radius: 5px;
      background: transparent;
      color: var(--xcron-muted);
      cursor: pointer;
    }

    .lyr-act:hover:not(:disabled) {
      background: var(--xcron-wash);
      color: var(--xcron-ink);
    }

    .lyr-act:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .lyr-act--danger:hover:not(:disabled) {
      color: var(--xcron-danger);
    }

    .layers__add {
      padding: 8px;
      border-top: 1px solid var(--xcron-line);
      flex-shrink: 0;
    }

    .lyr-add-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      height: 32px;
      padding: 0;
      border: 1px dashed var(--xcron-line-strong);
      border-radius: 8px;
      background: transparent;
      color: var(--xcron-muted);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: border-color 140ms ease, color 140ms ease, background 140ms ease;
    }

    .lyr-add-btn:hover {
      border-color: var(--xcron-primary);
      color: var(--xcron-ink);
      background: color-mix(in srgb, var(--xcron-primary) 10%, transparent);
    }

    .nav-box {
      border-top: 1px solid var(--xcron-line);
      flex-shrink: 0;
    }

    .nav-box__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 10px;
    }

    .nav-box__toggle {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 2px 4px;
      border: 0;
      border-radius: 6px;
      background: transparent;
      color: var(--xcron-ink);
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
    }

    .nav-box__tools {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .nav-box__list {
      margin: 0;
      padding: 0 8px 8px;
      list-style: none;
      max-height: 170px;
      overflow-y: auto;
      display: grid;
      gap: 5px;
    }

    .nav-row {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 5px;
      border-radius: 8px;
      border: 1px solid var(--xcron-line);
      background: var(--xcron-wash);
    }

    .nav-row__fields {
      flex: 1;
      min-width: 0;
      display: grid;
      gap: 3px;
    }

    .nav-row__input,
    .nav-row__select {
      width: 100%;
      min-height: 24px !important;
      height: 24px;
      padding: 2px 6px !important;
      border-radius: 5px !important;
      font-size: 11px !important;
      box-shadow: none !important;
    }

    .nav-row__tools {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
  `,
})
export class EditorLayersPanelComponent {
  readonly sections = input<PortfolioSection[]>([]);
  readonly selectedId = input<string | null>(null);
  readonly navItems = input<PortfolioNavItem[]>([]);
  readonly sectionIssues = input<Record<string, { errors: number; warnings: number }>>({});
  readonly collapsed = input(false);
  readonly locale = input('en-IN');
  readonly defaultLocale = input('en-IN');

  readonly sectionSelect = output<string>();
  readonly sectionToggleHidden = output<string>();
  readonly sectionDuplicate = output<string>();
  readonly sectionReorder = output<{ fromIndex: number; toIndex: number }>();
  readonly sectionContextMenu = output<{ sectionId: string; x: number; y: number }>();
  readonly openPickerClick = output<void>();
  readonly toggleCollapse = output<void>();

  readonly navAdd = output<void>();
  readonly navRemove = output<string>();
  readonly navMoveUp = output<string>();
  readonly navMoveDown = output<string>();
  readonly navSync = output<void>();
  readonly navLabelChange = output<{ id: string; label: string }>();
  readonly navTargetChange = output<{ id: string; target: string }>();
  readonly navContextMenu = output<{ x: number; y: number }>();

  readonly navOpen = signal(false);
  readonly dragFromIndex = signal<number | null>(null);
  readonly dragOverIndex = signal<number | null>(null);

  iconFor(type: string) {
    return iconForSectionType(type);
  }

  titleFor(type: string): string {
    return sectionLabel(type as PortfolioSectionType);
  }

  issueCount(id: string): { errors: number; warnings: number } {
    return this.sectionIssues()[id] ?? { errors: 0, warnings: 0 };
  }

  localized(value: unknown): string {
    return localizedValue(value, this.locale(), this.defaultLocale());
  }

  onItemContext(event: MouseEvent, sectionId: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.sectionSelect.emit(sectionId);
    this.sectionContextMenu.emit({ sectionId, x: event.clientX, y: event.clientY });
  }

  onMenuClick(event: MouseEvent, sectionId: string): void {
    event.stopPropagation();
    this.sectionSelect.emit(sectionId);
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.sectionContextMenu.emit({ sectionId, x: rect.right + 4, y: rect.top });
  }

  onNavContext(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.navContextMenu.emit({ x: event.clientX, y: event.clientY });
  }

  onDragStart(event: DragEvent, index: number): void {
    this.dragFromIndex.set(index);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(index));
    }
  }

  onDragOver(event: DragEvent, index: number): void {
    if (this.dragFromIndex() === null) return;
    event.preventDefault();
    this.dragOverIndex.set(index);
  }

  onDragLeave(index: number): void {
    if (this.dragOverIndex() === index) {
      this.dragOverIndex.set(null);
    }
  }

  onDrop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    const fromIndex = this.dragFromIndex();
    this.dragFromIndex.set(null);
    this.dragOverIndex.set(null);
    if (fromIndex === null || fromIndex === targetIndex) return;
    this.sectionReorder.emit({ fromIndex, toIndex: targetIndex });
  }

  onDragEnd(): void {
    this.dragFromIndex.set(null);
    this.dragOverIndex.set(null);
  }
}
