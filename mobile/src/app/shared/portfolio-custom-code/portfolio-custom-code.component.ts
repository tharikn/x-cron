import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CUSTOM_CODE_LIMITS,
  CUSTOM_CODE_STORAGE_LIMITS,
  composeCustomCodeDocument,
  readCustomCodeProps,
  type CustomCodeStorage,
} from './custom-code-frame';

interface FrameMessage {
  __pf?: string;
  type?: string;
  height?: number;
  message?: string;
  store?: string;
  op?: string;
  key?: string;
  value?: string;
}

type StorageName = 'localStorage' | 'sessionStorage';

/** Parent-origin namespace for per-section browser storage. */
const STORAGE_PREFIX = 'xcron.pf-code.v1.';
const STORAGE_NAMES: readonly StorageName[] = ['localStorage', 'sessionStorage'];
const BLOCKED_STORAGE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function newToken(): string {
  const cryptoRef = globalThis.crypto as Crypto | undefined;
  if (cryptoRef?.randomUUID) return cryptoRef.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Renders one allow-listed `custom-code` section inside an opaque-origin frame.
 *
 * Security properties:
 *   • sandbox without `allow-same-origin` → no cookies, native storage or parent DOM
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
  /**
   * Stable namespace (site + section) for the author's localStorage and
   * sessionStorage. Empty disables persistence; the in-frame shim still works.
   */
  readonly storageKey = input<string>('');

  private readonly frame = viewChild<ElementRef<HTMLIFrameElement>>('frame');

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
          storage: this.readStorageSeed(),
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
    /**
     * Angular's HTML sanitizer treats `iframe[srcdoc]` as HTML and removes the
     * frame's `<style>` and `<script>` blocks. Never bind it in the template:
     * assign the property directly. The sandbox attribute is the security
     * boundary here, not Angular's sanitizer.
     */
    effect(() => {
      const frame = this.frame()?.nativeElement;
      const source = this.source();
      if (!frame || frame.srcdoc === source) return;
      frame.srcdoc = source;
    });
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
    const frame = this.frame()?.nativeElement;
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
      return;
    }
    if (data.type === 'storage') {
      this.persistStorage(data);
    }
  };

  private storageName(key: string, store: StorageName): string {
    return `${STORAGE_PREFIX}${key}.${store}`;
  }

  /** Read the persisted values once, before composing the frame document. */
  private readStorageSeed(): CustomCodeStorage {
    const seed: CustomCodeStorage = { localStorage: {}, sessionStorage: {} };
    const key = this.storageKey();
    if (!key || typeof window === 'undefined') return seed;
    for (const store of STORAGE_NAMES) {
      try {
        const raw = window[store].getItem(this.storageName(key, store));
        if (!raw || raw.length > CUSTOM_CODE_STORAGE_LIMITS.bytes) continue;
        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) continue;
        const values: Record<string, string> = {};
        for (const [entryKey, entryValue] of Object.entries(parsed)) {
          if (
            typeof entryValue === 'string' &&
            entryKey.length > 0 &&
            entryKey.length <= CUSTOM_CODE_STORAGE_LIMITS.keyLength &&
            entryValue.length <= CUSTOM_CODE_STORAGE_LIMITS.valueLength &&
            !BLOCKED_STORAGE_KEYS.has(entryKey)
          ) {
            values[entryKey] = entryValue;
          }
        }
        seed[store] = values;
      } catch {
        // Storage can be disabled (private mode, embedded browser); keep seed empty.
      }
    }
    return seed;
  }

  /**
   * Persist an author storage write under a namespaced parent-origin key. The
   * frame never sees app data: it only reads back its own section namespace.
   */
  private persistStorage(data: FrameMessage): void {
    const key = this.storageKey();
    if (!key || typeof window === 'undefined') return;
    const store: StorageName | null =
      data.store === 'localStorage' || data.store === 'sessionStorage' ? data.store : null;
    const op = data.op;
    if (!store || (op !== 'set' && op !== 'remove' && op !== 'clear')) return;

    const name = this.storageName(key, store);
    try {
      const raw = window[store].getItem(name);
      const parsed: unknown =
        raw && raw.length <= CUSTOM_CODE_STORAGE_LIMITS.bytes ? JSON.parse(raw) : null;
      const values: Record<string, string> =
        parsed && typeof parsed === 'object' && !Array.isArray(parsed)
          ? { ...(parsed as Record<string, string>) }
          : {};

      if (op === 'clear') {
        for (const entryKey of Object.keys(values)) delete values[entryKey];
      } else {
        const entryKey = String(data.key ?? '');
        if (
          !entryKey ||
          entryKey.length > CUSTOM_CODE_STORAGE_LIMITS.keyLength ||
          BLOCKED_STORAGE_KEYS.has(entryKey)
        ) {
          return;
        }
        if (op === 'remove') {
          delete values[entryKey];
        } else {
          const entryValue = String(data.value ?? '');
          if (entryValue.length > CUSTOM_CODE_STORAGE_LIMITS.valueLength) return;
          values[entryKey] = entryValue;
        }
      }

      const serialized = JSON.stringify(values);
      if (serialized.length > CUSTOM_CODE_STORAGE_LIMITS.bytes) return;
      window[store].setItem(name, serialized);
    } catch {
      // Quota exceeded or storage disabled: the in-frame shim keeps working.
    }
  }
}
