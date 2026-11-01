import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

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

  async refreshInbox(): Promise<void> {
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
    this.items.set(response.items);
    this.unreadCount.set(
      response.items.filter((n) => n.status !== 'read').length,
    );
  }

  async markRead(id: string): Promise<void> {
    await firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/notifications/${id}/read`,
        {},
        { headers: this.auth.authHeaders() },
      ),
    );
    await this.refreshInbox();
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
