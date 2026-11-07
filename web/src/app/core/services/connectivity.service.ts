import { Injectable, signal } from '@angular/core';

/** Browser online/offline for shared retry banners (SSR-safe). */
@Injectable({ providedIn: 'root' })
export class ConnectivityService {
  readonly online = signal(
    typeof navigator === 'undefined' ? true : navigator.onLine,
  );

  private started = false;

  start(): void {
    if (this.started || typeof window === 'undefined') return;
    this.started = true;

    this.online.set(navigator.onLine);
    window.addEventListener('online', () => this.online.set(true));
    window.addEventListener('offline', () => this.online.set(false));
  }
}
