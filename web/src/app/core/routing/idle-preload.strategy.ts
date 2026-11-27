import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, mergeMap, of, timer } from 'rxjs';

/**
 * Prefetch only routes that opt in with `data: { preload: true }`, and only
 * after the first paint has had a chance to settle. The old
 * `PreloadAllModules` strategy downloaded every lazy chunk (portfolio editor,
 * admin tools, etc.) on every visit, competing with the LCP image and the
 * startup API calls.
 */
const PRELOAD_DELAY_MS = 2_500;

@Injectable({ providedIn: 'root' })
export class IdlePreloadStrategy implements PreloadingStrategy {
  private readonly platformId = inject(PLATFORM_ID);

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    // The router preloader also runs during SSR; scheduling browser imports
    // there keeps the server render unstable and can stall the response.
    if (!isPlatformBrowser(this.platformId)) return of(null);
    if (route.data?.['preload'] !== true) return of(null);
    if (!this.isAllowed()) return of(null);
    return timer(PRELOAD_DELAY_MS).pipe(mergeMap(() => load()));
  }

  /** Respect data-saver and slow mobile connections. */
  private isAllowed(): boolean {
    if (typeof navigator === 'undefined') return false;
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (connection?.saveData) return false;
    return !connection?.effectiveType?.endsWith('2g');
  }
}
