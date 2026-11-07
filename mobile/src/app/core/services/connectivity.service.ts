import { Injectable, signal } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/** Browser + Capacitor online/offline for retry banners. */
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

    if (Capacitor.isNativePlatform()) {
      void App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) this.online.set(navigator.onLine);
      });
    }
  }
}
