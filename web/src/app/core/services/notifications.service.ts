import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface NotificationPrefs {
  userId?: string;
  jobAlertsEnabled: boolean;
  inAppEnabled: boolean;
  pushAlertsEnabled: boolean;
  emailAlertsEnabled: boolean;
  marketingEnabled: boolean;
  quietHoursStart: number | null;
  quietHoursEnd: number | null;
  dailyCap: number;
  updatedAt?: string;
}

export interface InAppNotification {
  id: string;
  title: string;
  body: string;
  status: string;
  jobId: string | null;
  createdAt: string;
  readAt: string | null;
  data?: Record<string, string> | null;
}

export interface NotificationDispatch {
  id: string;
  triggerType: string;
  jobId?: string;
  status: string;
  matchedCount: number;
  sentCount: number;
  suppressedCount: number;
  failedCount: number;
  skippedReason?: string;
  startedAt: string;
  finishedAt?: string;
}

export interface NotificationDelivery {
  id: string;
  dispatchId: string;
  userId: string;
  channel: string;
  status: string;
  provider?: string;
  providerMessageId?: string;
  title: string;
  body: string;
  dedupeKey: string;
  jobId?: string;
  error?: string;
  createdAt: string;
}

const FCM_TOKEN_KEY = 'xcron.web.fcmToken';
const DEVICE_KEY = 'xcron.web.deviceId';
const SEEN_IDS_KEY = 'xcron.web.notif.seenIds';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly prefs = signal<NotificationPrefs>({
    jobAlertsEnabled: true,
    inAppEnabled: true,
    pushAlertsEnabled: true,
    emailAlertsEnabled: true,
    marketingEnabled: false,
    quietHoursStart: null,
    quietHoursEnd: null,
    dailyCap: 20,
  });
  readonly items = signal<InAppNotification[]>([]);
  readonly unreadCount = signal(0);
  readonly pushPermission = signal<'granted' | 'denied' | 'prompt' | 'unsupported'>(
    'prompt',
  );

  private seededSeen = false;
  private permissionWatchBound = false;
  private lastAnnouncedPermission:
    | 'granted'
    | 'denied'
    | 'prompt'
    | 'unsupported'
    | null = null;

  deviceId(): string {
    if (typeof localStorage === 'undefined') {
      return `web_${Date.now().toString(36)}`;
    }
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = `web_${crypto.randomUUID?.() ?? Date.now().toString(36)}`;
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  }

  stubToken(): string {
    if (typeof localStorage === 'undefined') {
      return `stub_fcm_web_${Date.now().toString(36)}`;
    }
    let token = localStorage.getItem(FCM_TOKEN_KEY);
    if (!token) {
      const device = this.deviceId().replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
      token = `stub_fcm_${device}_${Date.now().toString(36)}`;
      localStorage.setItem(FCM_TOKEN_KEY, token);
    }
    return token;
  }

  /** Link stub/web device token to the signed-in user (in-app + future web push). */
  async registerDevice(): Promise<void> {
    if (!this.auth.isSignedIn()) return;
    await firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/devices`,
        {
          deviceId: this.deviceId(),
          fcmToken: this.stubToken(),
          platform: 'web',
        },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  /** Detach device after logout / refresh-session death (no Bearer required). */
  async unlinkDevice(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/devices/unlink`, {
          deviceId: this.deviceId(),
          fcmToken: this.stubToken(),
        }),
      );
    } catch {
      // best-effort — API also suppresses pushes without an active refresh session
    }
  }

  async loadPrefs(): Promise<void> {
    if (!this.auth.isSignedIn()) return;
    const remote = await firstValueFrom(
      this.http.get<NotificationPrefs>(
        `${environment.apiUrl}/notifications/preferences`,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.prefs.set({
      jobAlertsEnabled: remote.jobAlertsEnabled ?? true,
      inAppEnabled: remote.inAppEnabled ?? true,
      pushAlertsEnabled: remote.pushAlertsEnabled ?? true,
      emailAlertsEnabled: remote.emailAlertsEnabled ?? true,
      marketingEnabled: remote.marketingEnabled ?? false,
      quietHoursStart: remote.quietHoursStart ?? null,
      quietHoursEnd: remote.quietHoursEnd ?? null,
      dailyCap: remote.dailyCap ?? 20,
      userId: remote.userId,
      updatedAt: remote.updatedAt,
    });
  }

  async savePrefs(partial: Partial<NotificationPrefs>): Promise<void> {
    if (!this.auth.isSignedIn()) return;
    const next = { ...this.prefs(), ...partial };
    const remote = await firstValueFrom(
      this.http.put<NotificationPrefs>(
        `${environment.apiUrl}/notifications/preferences`,
        next,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.prefs.set({
      ...this.prefs(),
      ...remote,
      jobAlertsEnabled: remote.jobAlertsEnabled ?? next.jobAlertsEnabled,
      inAppEnabled: remote.inAppEnabled ?? next.inAppEnabled,
      pushAlertsEnabled: remote.pushAlertsEnabled ?? next.pushAlertsEnabled,
      emailAlertsEnabled: remote.emailAlertsEnabled ?? next.emailAlertsEnabled,
    });
  }

  async refreshInbox(options?: { announce?: boolean }): Promise<void> {
    if (!this.auth.isSignedIn()) {
      this.items.set([]);
      this.unreadCount.set(0);
      return;
    }
    const response = await firstValueFrom(
      this.http.get<{ items: InAppNotification[] }>(
        `${environment.apiUrl}/notifications`,
        { headers: this.auth.authHeaders() },
      ),
    );
    const items = response.items ?? [];
    this.items.set(items);
    this.unreadCount.set(items.filter((n) => n.status !== 'read').length);
    const announce = options?.announce !== false;
    await this.syncOsAlerts(items, announce);
  }

  async markRead(id: string): Promise<void> {
    await firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/notifications/${id}/read`,
        {},
        { headers: this.auth.authHeaders() },
      ),
    );
    await this.refreshInbox({ announce: false });
  }

  /** Read browser Notification permission without prompting. */
  refreshPushPermissionState(): void {
    if (!isPlatformBrowser(this.platformId) || typeof Notification === 'undefined') {
      this.pushPermission.set('unsupported');
      return;
    }
    this.pushPermission.set(this.mapBrowserPermission(Notification.permission));
  }

  /**
   * After sign-in: ask the browser for system notification permission once when
   * still undecided. Callers toast when `asked` (user answered the prompt).
   */
  async promptOsPermissionAfterSignIn(): Promise<{
    status: 'granted' | 'denied' | 'prompt' | 'unsupported';
    asked: boolean;
    granted: boolean;
  }> {
    this.refreshPushPermissionState();
    const before = this.pushPermission();
    if (before === 'prompt') {
      const granted = await this.ensureOsTrayPermission();
      const status = this.pushPermission();
      this.lastAnnouncedPermission = status;
      return { status, asked: true, granted };
    }
    this.lastAnnouncedPermission = before;
    return {
      status: before,
      asked: false,
      granted: before === 'granted',
    };
  }

  /**
   * Watch OS permission flips (browser settings) and invoke `onChange` once per
   * real change after the first seed — so prefs UI + toast stay in sync.
   */
  watchOsPermission(
    onChange?: (status: 'granted' | 'denied' | 'prompt' | 'unsupported') => void,
  ): void {
    if (!isPlatformBrowser(this.platformId) || this.permissionWatchBound) return;
    this.permissionWatchBound = true;
    this.refreshPushPermissionState();
    this.lastAnnouncedPermission = this.pushPermission();

    const emitIfChanged = () => {
      this.refreshPushPermissionState();
      const next = this.pushPermission();
      if (this.lastAnnouncedPermission === next) return;
      this.lastAnnouncedPermission = next;
      onChange?.(next);
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') emitIfChanged();
      });
    }

    const perms = (
      navigator as Navigator & {
        permissions?: {
          query: (desc: { name: string }) => Promise<{
            state: string;
            onchange: ((this: unknown, ev: Event) => void) | null;
          }>;
        };
      }
    ).permissions;
    if (!perms?.query) return;
    void perms
      .query({ name: 'notifications' })
      .then((status) => {
        status.onchange = () => emitIfChanged();
      })
      .catch(() => {
        // Permissions API may deny query for notifications in some browsers
      });
  }

  /** Browser Notification permission for Push alerts → OS shade. */
  async ensureOsTrayPermission(): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      this.pushPermission.set('unsupported');
      return false;
    }
    if (typeof Notification === 'undefined') {
      this.pushPermission.set('unsupported');
      return false;
    }
    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }
    const status = this.mapBrowserPermission(permission);
    this.pushPermission.set(status);
    // Suppress watch duplicate toast — callers announce when they asked.
    this.lastAnnouncedPermission = status;
    return permission === 'granted';
  }

  private mapBrowserPermission(
    permission: NotificationPermission,
  ): 'granted' | 'denied' | 'prompt' | 'unsupported' {
    if (permission === 'granted') return 'granted';
    if (permission === 'denied') return 'denied';
    return 'prompt';
  }

  private async syncOsAlerts(
    items: InAppNotification[],
    announce: boolean,
  ): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const unread = items.filter((n) => n.status !== 'read');
    const seen = this.readSeenIds();
    const recentMs = 15 * 60 * 1000;
    const now = Date.now();
    const isRecent = (n: InAppNotification) => {
      const t = Date.parse(n.createdAt);
      return Number.isFinite(t) && now - t <= recentMs;
    };

    if (!this.seededSeen && seen.size === 0) {
      for (const item of unread.filter((n) => !isRecent(n))) seen.add(item.id);
      this.writeSeenIds(seen);
      this.seededSeen = true;
    } else {
      this.seededSeen = true;
    }

    const fresh = unread.filter((n) => !seen.has(n.id));
    if (!announce || !fresh.length) return;
    if (this.prefs().pushAlertsEnabled === false) return;

    const eligible = fresh.filter((item) => {
      if (!this.isJobAlertPayload(item.data ?? undefined)) return true;
      return this.prefs().jobAlertsEnabled !== false;
    });
    if (!eligible.length) return;

    const allowed = await this.ensureOsTrayPermission();
    if (!allowed) {
      for (const item of eligible) seen.add(item.id);
      this.writeSeenIds(seen);
      return;
    }

    for (const item of eligible.slice(0, 5)) {
      this.showOsNotification(item);
      seen.add(item.id);
    }
    this.writeSeenIds(seen);
  }

  private isJobAlertPayload(data?: Record<string, string> | null): boolean {
    const action = data?.['action']?.trim();
    if (
      action === 'open_feedback' ||
      action === 'complete_profile' ||
      action === 'browse_jobs'
    ) {
      return false;
    }
    if (data?.['applicationId']?.trim()) return false;
    if (data?.['threadId']?.trim()) return false;
    return true;
  }

  private pathFromPayload(
    item: InAppNotification,
  ): string | null {
    const data = item.data ?? {};
    const action = data['action']?.trim();
    if (action === 'complete_profile') return '/settings/account';
    if (action === 'browse_jobs') return '/';
    if (action === 'open_feedback') {
      const threadId = data['threadId']?.trim();
      const qs = threadId ? `?thread=${encodeURIComponent(threadId)}` : '';
      return data['eventType'] === 'user_message'
        ? `/admin/feedback${qs}`
        : `/feedback${qs}`;
    }
    const applicationId = data['applicationId']?.trim();
    if (applicationId) {
      const asEmployer = data['recipientRole'] === 'employer';
      return asEmployer
        ? `/me/applications/${applicationId}?as=employer`
        : `/me/applications/${applicationId}`;
    }
    const slug = data['slug']?.trim();
    if (slug) return `/jobs/${slug}`;
    return item.jobId ? `/jobs/${item.jobId}` : null;
  }

  private showOsNotification(item: InAppNotification): void {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
      return;
    }
    const data: Record<string, string> = {
      ...(item.data ?? {}),
      notificationId: item.id,
    };
    if (item.jobId && !data['jobId']) data['jobId'] = item.jobId;
    const note = new Notification(item.title || 'X Cron Jobs', {
      body: item.body || 'New update',
      tag: item.id,
      silent: false,
      data,
    });
    note.onclick = () => {
      window.focus();
      const path = this.pathFromPayload(item);
      if (path) void this.router.navigateByUrl(path);
      note.close();
    };
  }

  private readSeenIds(): Set<string> {
    try {
      const raw = localStorage.getItem(SEEN_IDS_KEY);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw) as string[];
      return new Set(Array.isArray(parsed) ? parsed.slice(-200) : []);
    } catch {
      return new Set();
    }
  }

  private writeSeenIds(ids: Set<string>): void {
    localStorage.setItem(SEEN_IDS_KEY, JSON.stringify([...ids].slice(-200)));
  }

  listDispatches(limit = 50): Promise<{
    pushProvider: string;
    mailProvider: string;
    items: NotificationDispatch[];
  }> {
    return firstValueFrom(
      this.http.get<{
        pushProvider: string;
        mailProvider: string;
        items: NotificationDispatch[];
      }>(`${environment.apiUrl}/admin/notification-dispatches?limit=${limit}`, {
        headers: this.auth.authHeaders(),
      }),
    );
  }

  getDispatch(id: string): Promise<{
    dispatch: NotificationDispatch;
    deliveries: NotificationDelivery[];
  }> {
    return firstValueFrom(
      this.http.get<{
        dispatch: NotificationDispatch;
        deliveries: NotificationDelivery[];
      }>(`${environment.apiUrl}/admin/notification-dispatches/${id}`, {
        headers: this.auth.authHeaders(),
      }),
    );
  }
}
