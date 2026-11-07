import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/**
 * Hardware Android back: pop history, else return to Discover, else exit.
 */
@Injectable({ providedIn: 'root' })
export class AndroidBackService {
  private readonly router = inject(Router);
  private started = false;

  start(): void {
    if (this.started || typeof window === 'undefined') return;
    this.started = true;
    if (!Capacitor.isNativePlatform()) return;

    void App.addListener('backButton', () => {
      const path = (this.router.url.split('?')[0] ?? '').replace(/\/+$/, '') || '/';
      const onRoot =
        path === '/tabs/discover' ||
        path === '/tabs' ||
        path === '/' ||
        path === '';

      if (onRoot) {
        void App.exitApp();
        return;
      }

      if (typeof window !== 'undefined' && window.history.length > 1) {
        window.history.back();
        return;
      }

      void this.router.navigateByUrl('/tabs/discover');
    });
  }
}
