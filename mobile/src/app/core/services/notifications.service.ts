import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { PreferencesService } from './preferences.service';

export interface NotificationPrefs {
  jobAlertsEnabled: boolean;
  marketingEnabled: boolean;
  quietHoursStart: number | null;
  quietHoursEnd: number | null;
  dailyCap: number;
}

export interface InAppNotification {
  id: string;
  title: string;
  body: string;
  status: string;
  jobId: string | null;
  createdAt: string;
  readAt: string | null;
}

const FCM_TOKEN_KEY = 'xcron.fcmToken';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly preferences = inject(PreferencesService);

  readonly prefs = signal<NotificationPrefs>({
    jobAlertsEnabled: true,
    marketingEnabled: false,
    quietHoursStart: null,
    quietHoursEnd: null,
    dailyCap: 20,
  });
  readonly items = signal<InAppNotification[]>([]);
  readonly deviceRegistered = signal(false);

  /** Stub FCM token for web/dev until Capacitor Push + Firebase are wired. */
  stubToken(): string {
    let token = localStorage.getItem(FCM_TOKEN_KEY);
    if (!token) {
      token = `stub_fcm_${this.preferences.deviceId().replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}_${Date.now().toString(36)}`;
      localStorage.setItem(FCM_TOKEN_KEY, token);
    }
    return token;
  }

  async registerDevice(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(
          `${environment.apiUrl}/devices`,
          {
            deviceId: this.preferences.deviceId(),
            fcmToken: this.stubToken(),
            platform: 'web',
          },
          { headers: this.auth.authHeaders() },
        ),
      );
      this.deviceRegistered.set(true);
    } catch {
      this.deviceRegistered.set(false);
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
    this.prefs.set(remote);
  }

  async savePrefs(partial: Partial<NotificationPrefs>): Promise<void> {
    const next = { ...this.prefs(), ...partial };
    const remote = await firstValueFrom(
      this.http.put<NotificationPrefs>(
        `${environment.apiUrl}/notifications/preferences`,
        next,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.prefs.set(remote);
  }

  async refreshInbox(): Promise<void> {
    if (!this.auth.isSignedIn()) {
      this.items.set([]);
      return;
    }
    const response = await firstValueFrom(
      this.http.get<{ items: InAppNotification[] }>(
        `${environment.apiUrl}/notifications`,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.items.set(response.items);
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
}
