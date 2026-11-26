import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import type {
  PortfolioAiGenerateInput,
  PortfolioAiGenerateResult,
  PortfolioComponentDefinition,
  PortfolioMediaAsset,
  PortfolioSection,
  PortfolioSectionType,
} from '../../core/models/portfolio.model';
import { sectionLabel } from '../../core/models/portfolio.model';
import { EditorIconComponent, iconForSectionType } from './editor-icons.component';
import { EditorTooltipDirective } from './editor-tooltip.directive';

export interface CommandItem {
  id: string;
  label: string;
  kbd?: string;
  icon: ReturnType<typeof iconForSectionType> | 'sparkles' | 'rocket' | 'check-circle' | 'eye' | 'monitor' | 'tablet' | 'smartphone' | 'undo' | 'redo' | 'sun' | 'moon' | 'plus' | 'settings' | 'code';
  run: () => void;
}

/**
 * Canva-style visual section picker modal.
 * Icon-led grid of all registered section blocks; descriptions stay in tooltips.
 */
@Component({
  selector: 'app-editor-section-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EditorIconComponent, EditorTooltipDirective],
  template: `
    @if (visible()) {
      <div class="m-backdrop" (click)="close.emit()">
        <div class="m-dialog m-dialog--wide" role="dialog" aria-modal="true" aria-label="Insert section" (click)="$event.stopPropagation()">
          <header class="m-head">
            <div class="m-head__title">
              <app-editor-icon name="plus-circle" [size]="16" />
              <h3>Insert Section</h3>
            </div>
            <button type="button" class="m-close" (click)="close.emit()" appTip="Close (Esc)">
              <app-editor-icon name="x" [size]="16" />
            </button>
          </header>

          <div class="picker-grid">
            @for (type of sectionTypes(); track type.value) {
              <button
                type="button"
                class="picker-card"
                (click)="pick.emit(type.value); close.emit()"
                [appTip]="descriptionFor(type.value)"
              >
                <span class="picker-card__icon">
                  <app-editor-icon [name]="iconFor(type.value)" [size]="22" />
                </span>
                <span class="picker-card__label">{{ type.label }}</span>
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .m-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10500;
      display: grid;
      place-items: center;
      padding: 16px;
      background: rgba(5, 3, 14, 0.65);
      backdrop-filter: blur(4px);
    }

    .m-dialog {
      width: min(560px, 100%);
      border-radius: 14px;
      border: 1px solid var(--xcron-line-strong);
      background: var(--xcron-bg-elevated);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
      overflow: hidden;
      animation: m-in 140ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    @keyframes m-in {
      from { opacity: 0; transform: translateY(8px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .m-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--xcron-line);
    }

    .m-head__title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--xcron-ink);
    }

    .m-head h3 {
      margin: 0;
      font-family: var(--xcron-font-display);
      font-size: 14px;
      font-weight: 700;
    }

    .m-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: 0;
      border-radius: 7px;
      background: transparent;
      color: var(--xcron-muted);
      cursor: pointer;
    }

    .m-close:hover {
      background: var(--xcron-wash);
      color: var(--xcron-ink);
    }

    .picker-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
      gap: 10px;
      padding: 16px;
    }

    .picker-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px 10px;
      border-radius: 12px;
      border: 1px solid var(--xcron-line);
      background: var(--xcron-wash);
      color: var(--xcron-ink);
      cursor: pointer;
      transition: border-color 140ms ease, background 140ms ease, transform 140ms ease;
    }

    .picker-card:hover {
      border-color: var(--xcron-primary);
      background: color-mix(in srgb, var(--xcron-primary) 13%, var(--xcron-wash));
      transform: translateY(-2px);
    }

    .picker-card__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--xcron-primary) 14%, transparent);
      color: var(--xcron-primary);
    }

    .picker-card__label {
      font-size: 12px;
      font-weight: 600;
      text-align: center;
    }
  `,
})
export class EditorSectionPickerComponent {
  readonly visible = input(false);
  readonly sectionTypes = input<Array<{ value: PortfolioSectionType; label: string }>>([]);
  readonly components = input<PortfolioComponentDefinition[]>([]);

  readonly pick = output<PortfolioSectionType>();
  readonly close = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible()) this.close.emit();
  }

  iconFor(type: PortfolioSectionType) {
    return iconForSectionType(type);
  }

  descriptionFor(type: PortfolioSectionType): string {
    return this.components().find((c) => c.type === type)?.description ?? type;
  }
}

/**
 * AI Copy Assist Modal — proposals only via POST /v1/portfolio/ai/generate.
 */
@Component({
  selector: 'app-editor-ai-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, EditorIconComponent, EditorTooltipDirective],
  template: `
    @if (visible()) {
      <div class="m-backdrop" (click)="close.emit()">
        <div class="m-dialog" role="dialog" aria-modal="true" aria-label="AI copy assist" (click)="$event.stopPropagation()">
          <header class="m-head">
            <div class="m-head__title m-head__title--ai">
              <app-editor-icon name="sparkles" [size]="16" />
              <h3>AI Copy Assist</h3>
            </div>
            <button type="button" class="m-close" (click)="close.emit()" appTip="Close">
              <app-editor-icon name="x" [size]="16" />
            </button>
          </header>

          <form class="ai-form" (ngSubmit)="submit()">
            <div class="ai-row">
              <input
                [(ngModel)]="role"
                name="aiRole"
                maxlength="80"
                placeholder="Role (e.g. Product Designer)"
                required
              />
              <select [(ngModel)]="tone" name="aiTone" aria-label="Tone">
                <option value="professional">Professional</option>
                <option value="creative">Creative</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
            <input
              [(ngModel)]="skills"
              name="aiSkills"
              placeholder="Skills (comma separated)"
            />
            <input
              [(ngModel)]="experience"
              name="aiExp"
              maxlength="200"
              placeholder="Experience summary (optional)"
            />
            <button type="submit" class="btn btn--sm" [disabled]="busy() || role.trim().length < 2">
              <app-editor-icon name="sparkles" [size]="14" />
              <span>{{ busy() ? 'Generating…' : 'Generate' }}</span>
            </button>
          </form>

          @if (result(); as res) {
            <div class="ai-result">
              <div class="ai-card">
                <div class="ai-card__top">
                  <strong>Headline</strong>
                  <button type="button" class="ai-apply" (click)="applyField.emit({ target: 'headline', value: res.headline })">
                    Apply Hero
                  </button>
                </div>
                <p>{{ res.headline }}</p>
              </div>
              <div class="ai-card">
                <div class="ai-card__top">
                  <strong>Subheadline</strong>
                  <button type="button" class="ai-apply" (click)="applyField.emit({ target: 'subheadline', value: res.subheadline })">
                    Apply Hero
                  </button>
                </div>
                <p>{{ res.subheadline }}</p>
              </div>
              <div class="ai-card">
                <div class="ai-card__top">
                  <strong>Bio</strong>
                  <button type="button" class="ai-apply" (click)="applyField.emit({ target: 'bio', value: res.bio })">
                    Apply About
                  </button>
                </div>
                <p>{{ res.bio }}</p>
              </div>
              <div class="ai-card">
                <div class="ai-card__top">
                  <strong>Skills</strong>
                  <button type="button" class="ai-apply" (click)="applyField.emit({ target: 'skills', values: res.suggestedSkills })">
                    Apply Skills
                  </button>
                </div>
                <div class="ai-tags">
                  @for (s of res.suggestedSkills; track s) {
                    <span>{{ s }}</span>
                  }
                </div>
              </div>
              <button type="button" class="btn btn--sm" (click)="applyAll.emit(res)">
                <app-editor-icon name="check" [size]="14" />
                <span>Apply All Proposals</span>
              </button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: `
    .m-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10500;
      display: grid;
      place-items: center;
      padding: 16px;
      background: rgba(5, 3, 14, 0.65);
      backdrop-filter: blur(4px);
    }

    .m-dialog {
      width: min(520px, 100%);
      max-height: 85vh;
      overflow-y: auto;
      border-radius: 14px;
      border: 1px solid var(--xcron-line-strong);
      background: var(--xcron-bg-elevated);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
    }

    .m-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--xcron-line);
    }

    .m-head__title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--xcron-ink);
    }

    .m-head__title--ai {
      color: var(--xcron-accent);
    }

    .m-head h3 {
      margin: 0;
      font-family: var(--xcron-font-display);
      font-size: 14px;
      font-weight: 700;
      color: var(--xcron-ink);
    }

    .m-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: 0;
      border-radius: 7px;
      background: transparent;
      color: var(--xcron-muted);
      cursor: pointer;
    }

    .m-close:hover {
      background: var(--xcron-wash);
      color: var(--xcron-ink);
    }

    .ai-form,
    .ai-result {
      display: grid;
      gap: 10px;
      padding: 16px;
    }

    .ai-result {
      padding-top: 0;
    }

    .ai-row {
      display: grid;
      grid-template-columns: 1fr 130px;
      gap: 8px;
    }

    .ai-form input,
    .ai-form select {
      min-height: 36px;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 13px;
    }

    .ai-card {
      display: grid;
      gap: 4px;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid var(--xcron-line);
      background: var(--xcron-wash);
    }

    .ai-card__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: var(--xcron-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .ai-card p {
      margin: 0;
      font-size: 13px;
      color: var(--xcron-ink);
    }

    .ai-apply {
      padding: 2px 8px;
      border: 1px solid var(--xcron-line-strong);
      border-radius: 999px;
      background: var(--xcron-bg-elevated);
      color: var(--xcron-primary);
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }

    .ai-apply:hover {
      background: var(--xcron-primary);
      color: #fff;
    }

    .ai-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .ai-tags span {
      padding: 2px 8px;
      border-radius: 999px;
      background: var(--xcron-bg-elevated);
      border: 1px solid var(--xcron-line);
      font-size: 11.5px;
    }
  `,
})
export class EditorAiModalComponent {
  readonly visible = input(false);
  readonly busy = input(false);
  readonly result = input<PortfolioAiGenerateResult | null>(null);
  readonly locale = input('en-IN');

  readonly generate = output<PortfolioAiGenerateInput>();
  readonly applyField = output<{
    target: 'headline' | 'subheadline' | 'bio' | 'skills';
    value?: string;
    values?: string[];
  }>();
  readonly applyAll = output<PortfolioAiGenerateResult>();
  readonly close = output<void>();

  role = '';
  skills = '';
  experience = '';
  tone: 'professional' | 'creative' | 'minimal' = 'professional';

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible()) this.close.emit();
  }

  submit(): void {
    const role = this.role.trim();
    if (role.length < 2) return;
    this.generate.emit({
      role,
      tone: this.tone,
      locale: this.locale(),
      ...(this.experience.trim() ? { experience: this.experience.trim() } : {}),
      ...(this.skills.trim()
        ? {
            skills: this.skills
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
          }
        : {}),
    });
  }
}

/**
 * Media Library Modal — reusable http(s) image URLs plus validated uploads.
 */
@Component({
  selector: 'app-editor-media-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, EditorIconComponent, EditorTooltipDirective],
  template: `
    @if (visible()) {
      <div class="m-backdrop" (click)="close.emit()">
        <div class="m-dialog" role="dialog" aria-modal="true" aria-label="Media library" (click)="$event.stopPropagation()">
          <header class="m-head">
            <div class="m-head__title">
              <app-editor-icon name="image" [size]="16" />
              <h3>Media</h3>
            </div>
            <button type="button" class="m-close" (click)="close.emit()" appTip="Close">
              <app-editor-icon name="x" [size]="16" />
            </button>
          </header>

          <form class="media-add" (ngSubmit)="submitUrl()">
            <input
              type="url"
              [(ngModel)]="newUrl"
              name="mediaUrl"
              placeholder="https://…"
              required
            />
            <button type="submit" class="btn btn--sm" [disabled]="busy() || !newUrl.trim()">
              <app-editor-icon name="plus" [size]="14" />
            </button>
          </form>

          <label class="media-upload" [class.media-upload--busy]="busy()">
            <app-editor-icon name="image" [size]="14" />
            <span>{{ busy() ? 'Uploading…' : 'Upload image (svg, png, jpg · 5 MB)' }}</span>
            <input
              type="file"
              hidden
              accept=".svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg"
              [disabled]="busy()"
              (change)="onFileSelected($event)"
            />
          </label>

          <div class="media-grid">
            @for (asset of assets(); track asset.id) {
              <div class="media-card">
                <button
                  type="button"
                  class="media-card__pick"
                  (click)="pickUrl.emit(asset.url); close.emit()"
                  appTip="Use image"
                >
                  <img [src]="asset.url" alt="" loading="lazy" />
                </button>
                <button
                  type="button"
                  class="media-card__del"
                  (click)="deleteAsset.emit(asset.id)"
                  appTip="Remove from library"
                >
                  <app-editor-icon name="trash" [size]="12" />
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .m-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10500;
      display: grid;
      place-items: center;
      padding: 16px;
      background: rgba(5, 3, 14, 0.65);
      backdrop-filter: blur(4px);
    }

    .m-dialog {
      width: min(520px, 100%);
      max-height: 80vh;
      overflow-y: auto;
      border-radius: 14px;
      border: 1px solid var(--xcron-line-strong);
      background: var(--xcron-bg-elevated);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
    }

    .m-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--xcron-line);
    }

    .m-head__title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--xcron-ink);
    }

    .m-head h3 {
      margin: 0;
      font-family: var(--xcron-font-display);
      font-size: 14px;
      font-weight: 700;
    }

    .m-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: 0;
      border-radius: 7px;
      background: transparent;
      color: var(--xcron-muted);
      cursor: pointer;
    }

    .media-add {
      display: flex;
      gap: 8px;
      padding: 14px 16px 0;
    }

    .media-add input {
      flex: 1;
      min-height: 36px;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 13px;
    }

    .media-upload {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 10px 16px 0;
      padding: 9px 12px;
      border: 1px dashed var(--xcron-line-strong);
      border-radius: 8px;
      color: var(--xcron-muted);
      font-size: 12px;
      cursor: pointer;
    }

    .media-upload:hover {
      border-color: var(--xcron-accent);
      color: var(--xcron-ink);
    }

    .media-upload--busy {
      opacity: 0.6;
      cursor: progress;
    }

    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: 10px;
      padding: 16px;
    }

    .media-card {
      position: relative;
      border-radius: 10px;
      border: 1px solid var(--xcron-line);
      overflow: hidden;
      background: var(--xcron-wash);
    }

    .media-card__pick {
      display: block;
      width: 100%;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: pointer;
    }

    .media-card__pick img {
      display: block;
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
    }

    .media-card__del {
      position: absolute;
      top: 4px;
      right: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border: 0;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      cursor: pointer;
    }
  `,
})
export class EditorMediaModalComponent {
  readonly visible = input(false);
  readonly assets = input<PortfolioMediaAsset[]>([]);
  readonly busy = input(false);

  readonly addUrl = output<string>();
  readonly uploadFile = output<File>();
  readonly pickUrl = output<string>();
  readonly deleteAsset = output<string>();
  readonly close = output<void>();

  newUrl = '';

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible()) this.close.emit();
  }

  submitUrl(): void {
    const trimmed = this.newUrl.trim();
    if (!trimmed) return;
    this.addUrl.emit(trimmed);
    this.newUrl = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.uploadFile.emit(file);
    input.value = '';
  }
}

/**
 * Spotlight Command Palette (Ctrl+K) — jump to sections, insert blocks, trigger actions.
 */
@Component({
  selector: 'app-editor-command-palette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, EditorIconComponent],
  template: `
    @if (visible()) {
      <div class="m-backdrop" (click)="close.emit()">
        <div class="cmd-dialog" role="dialog" aria-modal="true" aria-label="Command palette" (click)="$event.stopPropagation()">
          <div class="cmd-search">
            <app-editor-icon name="search" [size]="15" />
            <input
              class="cmd-input"
              [ngModel]="query()"
              (ngModelChange)="query.set($event)"
              placeholder="Search commands or sections…"
              autofocus
            />
          </div>

          <ul class="cmd-list" role="listbox">
            @for (item of filtered(); track item.id) {
              <li>
                <button type="button" class="cmd-item" (click)="runItem(item)">
                  <app-editor-icon [name]="item.icon" [size]="15" />
                  <span class="cmd-item__label">{{ item.label }}</span>
                  @if (item.kbd) {
                    <kbd class="cmd-item__kbd">{{ item.kbd }}</kbd>
                  }
                </button>
              </li>
            }
          </ul>
        </div>
      </div>
    }
  `,
  styles: `
    .m-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10600;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 12vh 16px 16px;
      background: rgba(5, 3, 14, 0.65);
      backdrop-filter: blur(4px);
    }

    .cmd-dialog {
      width: min(500px, 100%);
      border-radius: 14px;
      border: 1px solid var(--xcron-line-strong);
      background: var(--xcron-bg-elevated);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
      overflow: hidden;
    }

    .cmd-search {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-bottom: 1px solid var(--xcron-line);
      color: var(--xcron-muted);
    }

    .cmd-input {
      flex: 1;
      min-height: 28px !important;
      height: 28px;
      padding: 0 !important;
      border: 0 !important;
      background: transparent !important;
      font-size: 13.5px !important;
      box-shadow: none !important;
    }

    .cmd-list {
      margin: 0;
      padding: 6px;
      list-style: none;
      max-height: 320px;
      overflow-y: auto;
    }

    .cmd-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 8px 10px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--xcron-ink);
      font-size: 13px;
      text-align: left;
      cursor: pointer;
    }

    .cmd-item:hover {
      background: color-mix(in srgb, var(--xcron-primary) 13%, transparent);
    }

    .cmd-item__label {
      flex: 1;
    }

    .cmd-item__kbd {
      padding: 1px 6px;
      border-radius: 5px;
      border: 1px solid var(--xcron-line);
      background: var(--xcron-wash);
      color: var(--xcron-muted);
      font-family: ui-monospace, monospace;
      font-size: 10.5px;
    }
  `,
})
export class EditorCommandPaletteComponent {
  readonly visible = input(false);
  readonly sections = input<PortfolioSection[]>([]);
  readonly commands = input<CommandItem[]>([]);

  readonly selectSection = output<string>();
  readonly close = output<void>();

  readonly query = signal('');

  readonly filtered = computed<CommandItem[]>(() => {
    const q = this.query().trim().toLowerCase();
    const secItems: CommandItem[] = this.sections().map((s, i) => ({
      id: `jump-${s.id}`,
      label: `Select #${i + 1} ${sectionLabel(s.type)} (${s.variant})`,
      icon: iconForSectionType(s.type),
      run: () => this.selectSection.emit(s.id),
    }));
    const all = [...this.commands(), ...secItems];
    if (!q) return all.slice(0, 14);
    return all.filter((c) => c.label.toLowerCase().includes(q)).slice(0, 14);
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible()) {
      this.query.set('');
      this.close.emit();
    }
  }

  runItem(item: CommandItem): void {
    item.run();
    this.query.set('');
    this.close.emit();
  }
}

/**
 * Keyboard Shortcuts cheat-sheet modal.
 */
@Component({
  selector: 'app-editor-shortcuts-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EditorIconComponent, EditorTooltipDirective],
  template: `
    @if (visible()) {
      <div class="m-backdrop" (click)="close.emit()">
        <div class="m-dialog" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts" (click)="$event.stopPropagation()">
          <header class="m-head">
            <div class="m-head__title">
              <app-editor-icon name="keyboard" [size]="16" />
              <h3>Shortcuts</h3>
            </div>
            <button type="button" class="m-close" (click)="close.emit()" appTip="Close">
              <app-editor-icon name="x" [size]="16" />
            </button>
          </header>

          <div class="kbd-grid">
            @for (row of shortcuts; track row.label) {
              <div class="kbd-row">
                <span>{{ row.label }}</span>
                <kbd>{{ row.kbd }}</kbd>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .m-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10500;
      display: grid;
      place-items: center;
      padding: 16px;
      background: rgba(5, 3, 14, 0.65);
      backdrop-filter: blur(4px);
    }

    .m-dialog {
      width: min(440px, 100%);
      border-radius: 14px;
      border: 1px solid var(--xcron-line-strong);
      background: var(--xcron-bg-elevated);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
    }

    .m-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--xcron-line);
    }

    .m-head__title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .m-head h3 {
      margin: 0;
      font-family: var(--xcron-font-display);
      font-size: 14px;
      font-weight: 700;
    }

    .m-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: 0;
      border-radius: 7px;
      background: transparent;
      color: var(--xcron-muted);
      cursor: pointer;
    }

    .kbd-grid {
      display: grid;
      gap: 6px;
      padding: 14px 16px;
    }

    .kbd-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 12.5px;
      color: var(--xcron-ink);
    }

    .kbd-row kbd {
      padding: 2px 7px;
      border-radius: 5px;
      border: 1px solid var(--xcron-line-strong);
      background: var(--xcron-wash);
      color: var(--xcron-muted);
      font-family: ui-monospace, monospace;
      font-size: 11px;
    }
  `,
})
export class EditorShortcutsModalComponent {
  readonly visible = input(false);
  readonly close = output<void>();

  readonly shortcuts = [
    { label: 'Command palette', kbd: 'Ctrl+K' },
    { label: 'Undo / Redo', kbd: 'Ctrl+Z / Ctrl+Y' },
    { label: 'Duplicate section', kbd: 'Ctrl+D' },
    { label: 'Copy / Paste section', kbd: 'Ctrl+C / Ctrl+V' },
    { label: 'Copy / Paste style', kbd: 'Ctrl+Alt+C / V' },
    { label: 'Move section up / down', kbd: 'Alt+↑ / Alt+↓' },
    { label: 'Hide / Show section', kbd: 'H' },
    { label: 'Delete section', kbd: 'Del' },
    { label: 'Toggle Layers / Inspector', kbd: 'Ctrl+B / Ctrl+I' },
    { label: 'Toggle Preview mode', kbd: 'P' },
    { label: 'Zoom 100%', kbd: 'Ctrl+0' },
  ];

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible()) this.close.emit();
  }
}
