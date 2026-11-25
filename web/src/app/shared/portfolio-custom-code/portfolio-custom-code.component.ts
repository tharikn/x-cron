import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  afterNextRender,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CUSTOM_CODE_LIMITS,
  composeCustomCodeDocument,
  readCustomCodeProps,
} from './custom-code-frame';

interface FrameMessage {
  __pf?: string;
  type?: string;
  height?: number;
  message?: string;
}

function newToken(): string {
  const cryptoRef = globalThis.crypto as Crypto | undefined;
  if (cryptoRef?.randomUUID) return cryptoRef.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Renders one allow-listed `custom-code` section inside an opaque-origin frame.
 *
 * Security properties:
 *   • sandbox without `allow-same-origin` → no cookies, storage or parent DOM
 *   • CSP `default-src 'none'` inside the frame; external hosts only on request
 *   • messages are accepted only from this exact iframe and this instance token
 *   • author source is embedded as text, never interpolated into the app DOM
 */
@Component({
  selector: 'app-portfolio-custom-code',
  imports: [CommonModule],
  templateUrl: './portfolio-custom-code.component.html',
  styleUrl: './portfolio-custom-code.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioCustomCodeComponent implements OnDestroy {
  readonly props = input.required<Record<string, unknown>>();
  /** Editor preview: the frame is display-only so section selection still works. */
  readonly editable = input(false);
  readonly mode = input<'light' | 'dark'>('light');
  /** Show captured runtime errors under the frame (editor only). */
  readonly showDiagnostics = input(false);

  @ViewChild('frame')
  private frameRef?: ElementRef<HTMLIFrameElement>;

  private readonly token = newToken();
  private readonly measuredHeight = signal(0);
  private readonly ready = signal(false);
  private readonly deferredProps = signal<Record<string, unknown> | null>(null);
  /** False during SSR and the hydration pass, so both render the same srcdoc. */
  private readonly hydrated = signal(false);
  private timer: ReturnType<typeof setTimeout> | null = null;

  readonly resolved = computed(() => readCustomCodeProps(this.props()));

  /** Debounced copy so typing in the editor does not reload the frame per key. */
  private readonly displayProps = computed(
    () => this.deferredProps() ?? this.props(),
  );

  readonly source = computed(() =>
    this.hydrated()
      ? composeCustomCodeDocument(readCustomCodeProps(this.displayProps()), {
          mode: this.mode(),
          token: this.token,
        })
      : '',
  );

  readonly frameTitle = computed(() => this.resolved().title);
  readonly minHeight = computed(() => this.resolved().height);
  readonly isReady = computed(() => this.ready());
  readonly diagnostics = signal<string[]>([]);

  readonly frameHeight = computed(() => {
    const measured = this.measuredHeight();
    const clamped = Math.min(
      CUSTOM_CODE_LIMITS.maxHeight,
      Math.max(0, Math.round(measured)),
    );
    return Math.max(this.minHeight(), clamped);
  });

  constructor() {
    afterNextRender(() => this.hydrated.set(true));
    effect(() => {
      const next = this.props();
      if (typeof window === 'undefined') return;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.deferredProps.set(next);
        this.timer = null;
      }, 250);
    });
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleMessage);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', this.handleMessage);
    }
    if (this.timer) clearTimeout(this.timer);
  }

  private readonly handleMessage = (event: MessageEvent): void => {
    const frame = this.frameRef?.nativeElement;
    // Opaque-origin frames report `origin: "null"`, so identity of the source
    // window plus the per-instance token is the correct check.
    if (!frame || event.source !== frame.contentWindow) return;
    const data = event.data as FrameMessage | null;
    if (!data || data.__pf !== this.token || typeof data.type !== 'string') return;

    if (data.type === 'height') {
      const height = Number(data.height);
      if (Number.isFinite(height)) this.measuredHeight.set(height);
      return;
    }
    if (data.type === 'ready') {
      this.ready.set(true);
      return;
    }
    if (data.type === 'error') {
      const message = String(data.message ?? '').trim();
      if (!message) return;
      const current = this.diagnostics();
      if (current.includes(message)) return;
      this.diagnostics.set([...current.slice(-3), message]);
    }
  };
}
