import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
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

export interface TrackingEngagementPct {
  searchPct: number;
  applyPct: number;
  sharePct: number;
  pageViewPct: number;
}

export interface TrackingSummary {
  usersCreated: number;
  usersAccessed: number;
  guestsAccessed: number;
  accessorsTotal: number;
  totalHours: number;
  totalDurationMs: number;
  eventsTotal: number;
  engagement: TrackingEngagementPct;
  actionTotals: {
    access: number;
    search: number;
    share: number;
    apply: number;
    pageView: number;
    heartbeat: number;
  };
  time: string;
}

export interface TrackingUserRow {
  key: string;
  kind: 'user' | 'guest';
  userId?: string;
  visitorKey?: string;
  email?: string;
  username?: string;
  displayName?: string;
  roles: string[];
  accountCreatedAt?: string;
  firstSeenAt: string;
  lastSeenAt: string;
  ips: string[];
  hoursSpent: number;
  durationMs: number;
  counts: {
    access: number;
    search: number;
    share: number;
    apply: number;
    pageView: number;
  };
  usagePct: {
    search: number;
    share: number;
    apply: number;
    pageView: number;
  };
}

export interface TrackingUsersResponse {
  total: number;
  limit: number;
  offset: number;
  items: TrackingUserRow[];
  summary: TrackingSummary;
  time: string;
}

const HEARTBEAT_MS = 60_000;

@Injectable({ providedIn: 'root' })
export class TrackingService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly tab = inject(TabSessionService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly browser = isPlatformBrowser(this.platformId);

  private started = false;
  private heartbeatId: ReturnType<typeof setInterval> | null = null;
  private navSub?: Subscription;
  private lastHeartbeatAt = 0;
  private accessSent = false;

  start(): void {
    if (!this.browser || this.started) return;
    this.started = true;
    this.lastHeartbeatAt = Date.now();
    void this.track('access', { path: this.router.url });
    this.accessSent = true;

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

  async adminUsers(input: {
    q?: string;
    limit?: number;
    offset?: number;
    from?: string;
    to?: string;
  } = {}): Promise<TrackingUsersResponse> {
    const params: Record<string, string> = {};
    if (input.q) params['q'] = input.q;
    if (input.limit != null) params['limit'] = String(input.limit);
    if (input.offset != null) params['offset'] = String(input.offset);
    if (input.from) params['from'] = input.from;
    if (input.to) params['to'] = input.to;
    return firstValueFrom(
      this.http.get<TrackingUsersResponse>(
        `${environment.apiUrl}/admin/tracking/users`,
        { params, headers: this.auth.authHeaders() },
      ),
    );
  }

  async adminSummary(input: { from?: string; to?: string } = {}): Promise<TrackingSummary> {
    const params: Record<string, string> = {};
    if (input.from) params['from'] = input.from;
    if (input.to) params['to'] = input.to;
    return firstValueFrom(
      this.http.get<TrackingSummary>(
        `${environment.apiUrl}/admin/tracking/summary`,
        { params, headers: this.auth.authHeaders() },
      ),
    );
  }

  private readonly onVisibility = () => {
    if (typeof document === 'undefined') return;
    if (document.visibilityState === 'visible') {
      this.lastHeartbeatAt = Date.now();
      if (!this.accessSent) {
        void this.track('access', { path: this.router.url });
        this.accessSent = true;
      }
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
    if (!this.browser) return;
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
      // Fire-and-forget — never block UX on analytics.
    }
  }
}
