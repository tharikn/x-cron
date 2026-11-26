import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  HostListener,
  Injectable,
  OnDestroy,
  inject,
  input,
  signal,
} from '@angular/core';

export interface ActiveTooltip {
  text: string;
  kbd?: string;
  desc?: string;
  x: number;
  y: number;
  placement: 'top' | 'bottom';
}

/**
 * Portfolio-local tooltip state so icon-only controls can show rich, unclipped
 * floating labels, shortcuts, and descriptions on hover/focus without adding
 * clutter to the UI.
 */
@Injectable({ providedIn: 'root' })
export class EditorTooltipService {
  readonly active = signal<ActiveTooltip | null>(null);
  private showTimer: ReturnType<typeof setTimeout> | null = null;

  show(
    anchor: HTMLElement,
    text: string,
    kbd?: string,
    desc?: string,
    preferred: 'top' | 'bottom' = 'bottom',
  ): void {
    if (!text) return;
    this.clearTimer();
    this.showTimer = setTimeout(() => {
      if (typeof window === 'undefined') return;
      const rect = anchor.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const margin = 12;
      const clampedX = Math.max(margin, Math.min(window.innerWidth - margin, centerX));

      let placement = preferred;
      if (preferred === 'bottom' && rect.bottom + 56 > window.innerHeight) {
        placement = 'top';
      } else if (preferred === 'top' && rect.top - 56 < 0) {
        placement = 'bottom';
      }

      const y = placement === 'bottom' ? rect.bottom + 8 : rect.top - 8;
      this.active.set({ text, kbd, desc, x: clampedX, y, placement });
    }, 110);
  }

  hide(): void {
    this.clearTimer();
    this.active.set(null);
  }

  private clearTimer(): void {
    if (this.showTimer != null) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
  }
}

@Directive({
  selector: '[appTip]',
  host: {
    '[attr.aria-label]': 'ariaLabel() || null',
  },
})
export class EditorTooltipDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly service = inject(EditorTooltipService);

  readonly appTip = input.required<string>();
  readonly appTipKbd = input<string>('');
  readonly appTipDesc = input<string>('');
  readonly appTipPos = input<'top' | 'bottom'>('bottom');

  protected ariaLabel(): string {
    const kbd = this.appTipKbd();
    return kbd ? `${this.appTip()} (${kbd})` : this.appTip();
  }

  @HostListener('mouseenter')
  onEnter(): void {
    this.service.show(
      this.el.nativeElement,
      this.appTip(),
      this.appTipKbd() || undefined,
      this.appTipDesc() || undefined,
      this.appTipPos(),
    );
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this.service.show(
      this.el.nativeElement,
      this.appTip(),
      this.appTipKbd() || undefined,
      this.appTipDesc() || undefined,
      this.appTipPos(),
    );
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  @HostListener('mousedown')
  @HostListener('click')
  onLeave(): void {
    this.service.hide();
  }

  ngOnDestroy(): void {
    this.service.hide();
  }
}

@Component({
  selector: 'app-editor-tooltip-overlay',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tooltip(); as tip) {
      <div
        class="pf-tip"
        [class.pf-tip--top]="tip.placement === 'top'"
        [style.left.px]="tip.x"
        [style.top.px]="tip.y"
        role="tooltip"
      >
        <div class="pf-tip__row">
          <span class="pf-tip__text">{{ tip.text }}</span>
          @if (tip.kbd) {
            <kbd class="pf-tip__kbd">{{ tip.kbd }}</kbd>
          }
        </div>
        @if (tip.desc) {
          <div class="pf-tip__desc">{{ tip.desc }}</div>
        }
      </div>
    }
  `,
  styles: `
    .pf-tip {
      position: fixed;
      z-index: 12000;
      transform: translate(-50%, 0);
      max-width: 260px;
      padding: 6px 10px;
      border-radius: var(--xcron-radius-sm);
      border: 1px solid var(--xcron-line-strong);
      background: color-mix(in srgb, var(--xcron-bg-elevated) 96%, var(--xcron-bg));
      color: var(--xcron-ink);
      box-shadow: var(--xcron-shadow);
      pointer-events: none;
      animation: pf-tip-in 90ms ease-out both;
    }

    .pf-tip--top {
      transform: translate(-50%, -100%);
    }

    @keyframes pf-tip-in {
      from {
        opacity: 0;
        scale: 0.96;
      }
      to {
        opacity: 1;
        scale: 1;
      }
    }

    .pf-tip__row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pf-tip__text {
      font-size: 11.5px;
      font-weight: 600;
      line-height: 1.3;
      white-space: nowrap;
    }

    .pf-tip__kbd {
      padding: 1px 5px;
      border-radius: 4px;
      border: 1px solid var(--xcron-line-strong);
      background: var(--xcron-wash);
      color: var(--xcron-muted);
      font-family: ui-monospace, 'Cascadia Code', monospace;
      font-size: 10px;
      font-weight: 600;
      line-height: 1.35;
      white-space: nowrap;
    }

    .pf-tip__desc {
      margin-top: 3px;
      font-size: 11px;
      line-height: 1.35;
      color: var(--xcron-muted);
      white-space: normal;
    }
  `,
})
export class EditorTooltipOverlayComponent {
  private readonly service = inject(EditorTooltipService);
  readonly tooltip = this.service.active;
}
