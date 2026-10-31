import { Injectable, DestroyRef, inject, signal } from '@angular/core';

/** Keep the brand overlay up long enough to register on fast localhost responses. */
const MIN_VISIBLE_MS = 500;

@Injectable({ providedIn: 'root' })
export class ApiLoadingService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly pending = signal(0);
  private shownAt = 0;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  readonly visible = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => this.clearHideTimer());
  }

  begin(): void {
    this.pending.update((n) => n + 1);
    if (this.pending() === 1) {
      this.clearHideTimer();
      if (!this.visible()) {
        this.visible.set(true);
        this.shownAt = Date.now();
      }
    }
  }

  end(): void {
    this.pending.update((n) => Math.max(0, n - 1));
    if (this.pending() !== 0) {
      return;
    }

    const remaining = MIN_VISIBLE_MS - (Date.now() - this.shownAt);
    if (remaining <= 0 || !this.visible()) {
      this.visible.set(false);
      return;
    }

    this.clearHideTimer();
    this.hideTimer = setTimeout(() => {
      this.hideTimer = null;
      if (this.pending() === 0) {
        this.visible.set(false);
      }
    }, remaining);
  }

  private clearHideTimer(): void {
    if (this.hideTimer != null) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }
}
