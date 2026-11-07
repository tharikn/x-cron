import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, firstValueFrom, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { TabSessionService } from './tab-session.service';

export type ClientTrackingType =
  | 'access'
  | 'heartbeat'
  | 'search'
  | 'share'
  | 'apply'
  | 'page_view';

const HEARTBEAT_MS = 60_000;

@Injectable({ providedIn: 'root' })
export class TrackingService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly tab = inject(TabSessionService);
  private readonly router = inject(Router);

  private started = false;
  private heartbeatId: ReturnType<typeof setInterval> | null = null;
  private navSub?: Subscription;
  private lastHeartbeatAt = 0;

  start(): void {
    if (this.started) return;
    this.started = true;
    this.lastHeartbeatAt = Date.now();
    void this.track('access', { path: this.router.url });

    this.navSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        void this.track('page_view', { path: e.urlAfterRedirects });
      });

    this.heartbeatId = setInterval(() => this.tickHeartbeat(), HEARTBEAT_MS);
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.onVisibility);
    }
  }

  ngOnDestroy(): void {
    if (this.heartbeatId) clearInterval(this.heartbeatId);
    this.navSub?.unsubscribe();
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibility);
    }
  }

  trackSearch(meta?: { keyword?: string; location?: string }): void {
    void this.track('search', { meta });
  }

  trackShare(jobId: string): void {
    void this.track('share', { jobId });
  }

  private readonly onVisibility = () => {
    if (typeof document === 'undefined') return;
    if (document.visibilityState === 'visible') {
      this.lastHeartbeatAt = Date.now();
    } else {
      this.tickHeartbeat();
    }
  };

  private tickHeartbeat(): void {
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
      return;
    }
    const now = Date.now();
    const durationMs = Math.min(Math.max(now - this.lastHeartbeatAt, 0), HEARTBEAT_MS);
    this.lastHeartbeatAt = now;
    if (durationMs < 1_000) return;
    void this.track('heartbeat', { durationMs, path: this.router.url });
  }

  private async track(
    type: ClientTrackingType,
    opts: {
      jobId?: string;
      path?: string;
      durationMs?: number;
      meta?: Record<string, unknown>;
    } = {},
  ): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(
          `${environment.apiUrl}/tracking/events`,
          {
            type,
            visitorKey: this.tab.tabId(),
            jobId: opts.jobId,
            path: opts.path,
            durationMs: opts.durationMs,
            meta: opts.meta,
          },
          { headers: this.auth.authHeaders() },
        ),
      );
    } catch {
      // Fire-and-forget
    }
  }
}
