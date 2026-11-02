import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { PreferencesService } from './preferences.service';

export interface NotificationPrefs {
  jobAlertsEnabled: boolean;
  inAppEnabled?: boolean;
  pushAlertsEnabled?: boolean;
  emailAlertsEnabled?: boolean;
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
const SEEN_IDS_KEY = 'xcron.notif.seenIds';
/** Bumped so Android recreates channel with sound (channel settings are immutable). */
const CHANNEL_ID = 'xcron-job-alerts-v2';
const POLL_MS = 8_000;

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly preferences = inject(PreferencesService);

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
  readonly deviceRegistered = signal(false);
  readonly pushPermission = signal<'granted' | 'denied' | 'prompt' | 'unsupported'>(
    'prompt',
  );
  readonly lastSyncedAt = signal<string | null>(null);
  /** True when a live FCM token was registered (not stub_fcm_*). */
  readonly remotePushReady = signal(false);

  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private channelReady = false;
  private seededSeen = false;
  private inFlight = false;
  private listenersBound = false;
  private pushListenersBound = false;
  private pushRegistering = false;
  private audioCtx: AudioContext | null = null;
  private fcmTokenWaiters: Array<(token: string | null) => void> = [];

  /** Stub token for browser / until native FCM registration succeeds. */
  stubToken(): string {
    const stored = localStorage.getItem(FCM_TOKEN_KEY);
    if (stored?.startsWith('stub_fcm_')) return stored;
    const token = `stub_fcm_${this.preferences.deviceId().replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}_${Date.now().toString(36)}`;
    if (!stored) localStorage.setItem(FCM_TOKEN_KEY, token);
    return token;
  }

  /** Prefer live FCM token; fall back to stub for web / missing Firebase. */
  currentPushToken(): string {
    const stored = localStorage.getItem(FCM_TOKEN_KEY);
    if (stored && !stored.startsWith('stub_fcm_')) return stored;
    return this.stubToken();
  }

  async registerDevice(): Promise<void> {
    try {
      // OS tray must work even when FCM/Firebase is absent.
      await this.ensureOsTrayPermission();
      if (Capacitor.isNativePlatform() && environment.fcmEnabled) {
        await this.ensureRemotePush();
      }
      const platform = Capacitor.getPlatform();
      const fcmToken = this.currentPushToken();
      // Never upload stub tokens when FCM is enabled — that caused prod `no_device`
      // / `stub_or_invalid_token` while a live token sat only on the phone.
      if (
        Capacitor.isNativePlatform() &&
        environment.fcmEnabled &&
        fcmToken.startsWith('stub_fcm_')
      ) {
        this.deviceRegistered.set(false);
        this.remotePushReady.set(false);
        return;
      }
      await firstValueFrom(
        this.http.post(
          `${environment.apiUrl}/devices`,
          {
            deviceId: this.preferences.deviceId(),
            fcmToken,
            platform: platform === 'ios' || platform === 'android' ? platform : 'web',
          },
          { headers: this.auth.authHeaders() },
        ),
      );
      this.deviceRegistered.set(true);
      this.remotePushReady.set(!fcmToken.startsWith('stub_fcm_'));
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
    if (partial.pushAlertsEnabled === true) {
      await this.ensurePushPermission();
      await this.registerDevice();
    }
    const remote = await firstValueFrom(
      this.http.put<NotificationPrefs>(
        `${environment.apiUrl}/notifications/preferences`,
        next,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.prefs.set(remote);
  }

  async refreshInbox(options?: { announce?: boolean }): Promise<void> {
    if (!this.auth.isSignedIn()) {
      this.items.set([]);
      this.unreadCount.set(0);
      return;
    }
    if (this.inFlight) return;
    this.inFlight = true;
    try {
      const response = await firstValueFrom(
        this.http.get<{ items: InAppNotification[] }>(
          `${environment.apiUrl}/notifications`,
          { headers: this.auth.authHeaders() },
        ),
      );
      const items = response.items ?? [];
      this.items.set(items);
      this.unreadCount.set(items.filter((n) => n.status !== 'read').length);
      this.lastSyncedAt.set(new Date().toISOString());

      const announce = options?.announce !== false;
      await this.syncOsAlerts(items, announce);
    } finally {
      this.inFlight = false;
    }
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

  startPolling(): void {
    this.stopPolling();
    this.bindLifecycleListeners();
    void this.refreshPushPermissionState();
    void this.tick();
    this.pollTimer = setInterval(() => {
      void this.tick();
    }, POLL_MS);
  }

  stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  /** Pull latest inbox now (used by tab enter / focus). */
  async pullNow(options?: { announce?: boolean }): Promise<void> {
    if (!this.auth.isSignedIn()) return;
    await this.refreshInbox(options ?? { announce: true });
  }

  /**
   * Public entry used by Prefs / app boot.
   * System tray permission is independent of FCM — never fail tray because Firebase is missing.
   */
  async ensurePushPermission(): Promise<boolean> {
    const trayOk = await this.ensureOsTrayPermission();
    if (Capacitor.isNativePlatform() && environment.fcmEnabled) {
      // Optional: killed-app delivery. Failure must not block LocalNotifications.
      void this.ensureRemotePush();
    }
    return trayOk;
  }

  /** Android/iOS system shade via LocalNotifications (or browser Notification API). */
  async ensureOsTrayPermission(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        await this.ensureNativeChannel();
        const current = await LocalNotifications.checkPermissions();
        let display = current.display;
        if (display !== 'granted') {
          const asked = await LocalNotifications.requestPermissions();
          display = asked.display;
        }
        this.pushPermission.set(display === 'granted' ? 'granted' : 'denied');
        return display === 'granted';
      } catch (err) {
        console.warn('[notifications] OS tray permission failed', err);
        this.pushPermission.set('unsupported');
        return false;
      }
    }

    if (typeof Notification === 'undefined') {
      this.pushPermission.set('unsupported');
      return false;
    }
    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }
    this.pushPermission.set(
      permission === 'granted'
        ? 'granted'
        : permission === 'denied'
          ? 'denied'
          : 'prompt',
    );
    return permission === 'granted';
  }

  /**
   * Optional FCM registration for killed-app delivery.
   * Requires environment.fcmEnabled + google-services.json. Never throws to JS callers
   * in a way that disables LocalNotifications; native register() is skipped when disabled.
   */
  private async ensureRemotePush(): Promise<boolean> {
    if (!Capacitor.isNativePlatform() || !environment.fcmEnabled) {
      this.remotePushReady.set(false);
      return false;
    }
    if (this.pushRegistering) {
      const existing = this.currentPushToken();
      if (!existing.startsWith('stub_fcm_')) return true;
      const waited = await this.waitForLiveFcmToken(8_000);
      return Boolean(waited);
    }

    try {
      await this.bindPushListeners();
      await this.ensureOsTrayPermission();

      const current = await PushNotifications.checkPermissions();
      let receive = current.receive;
      if (receive !== 'granted') {
        const asked = await PushNotifications.requestPermissions();
        receive = asked.receive;
      }
      if (receive !== 'granted') {
        this.remotePushReady.set(false);
        return false;
      }

      const already = this.currentPushToken();
      if (!already.startsWith('stub_fcm_')) {
        this.remotePushReady.set(true);
        return true;
      }

      this.pushRegistering = true;
      await PushNotifications.register();
      const token = await this.waitForLiveFcmToken(8_000);
      this.pushRegistering = false;
      this.remotePushReady.set(Boolean(token));
      return Boolean(token);
    } catch (err) {
      console.warn('[notifications] FCM register skipped/failed', err);
      this.pushRegistering = false;
      this.remotePushReady.set(false);
      return false;
    }
  }

  private waitForLiveFcmToken(timeoutMs: number): Promise<string | null> {
    const existing = localStorage.getItem(FCM_TOKEN_KEY);
    if (existing && !existing.startsWith('stub_fcm_')) {
      return Promise.resolve(existing);
    }
    return new Promise((resolve) => {
      let settled = false;
      const finish = (token: string | null) => {
        if (settled) return;
        settled = true;
        resolve(token);
      };
      const timer = setTimeout(() => {
        this.fcmTokenWaiters = this.fcmTokenWaiters.filter((w) => w !== onToken);
        finish(null);
      }, timeoutMs);
      const onToken = (token: string | null) => {
        clearTimeout(timer);
        finish(token);
      };
      this.fcmTokenWaiters.push(onToken);
    });
  }

  private resolveFcmTokenWaiters(token: string | null): void {
    const waiters = this.fcmTokenWaiters.splice(0);
    for (const w of waiters) w(token);
  }

  private async bindPushListeners(): Promise<void> {
    if (this.pushListenersBound || !Capacitor.isNativePlatform()) return;
    this.pushListenersBound = true;

    await PushNotifications.addListener('registration', (token) => {
      if (!token?.value) return;
      localStorage.setItem(FCM_TOKEN_KEY, token.value);
      this.remotePushReady.set(true);
      this.resolveFcmTokenWaiters(token.value);
      void this.registerDevice();
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.warn('[push] registrationError', err);
      this.remotePushReady.set(false);
      this.resolveFcmTokenWaiters(null);
    });

    // Foreground: OS does not auto-show notification payload — mirror via local tray.
    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      if (this.prefs().pushAlertsEnabled === false) return;
      if (this.prefs().jobAlertsEnabled === false) return;
      const id =
        (notification.data?.['notificationId'] as string | undefined) ||
        notification.id ||
        `fcm_${Date.now()}`;
      void this.showOsNotification({
        id,
        title: notification.title || 'X Cron Jobs',
        body: notification.body || 'New job match',
        status: 'sent',
        jobId: (notification.data?.['jobId'] as string | null) ?? null,
        createdAt: new Date().toISOString(),
        readAt: null,
      });
      this.playAlertTone();
      void this.refreshInbox({ announce: false });
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', () => {
      void this.refreshInbox({ announce: false });
    });
  }

  private async tick(): Promise<void> {
    if (!this.auth.isSignedIn()) return;
    try {
      await this.refreshInbox({ announce: true });
    } catch {
      // keep polling; transient API blips are fine
    }
  }

  private bindLifecycleListeners(): void {
    if (this.listenersBound || typeof document === 'undefined') return;
    this.listenersBound = true;

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        void this.tick();
      }
    });
    window.addEventListener('focus', () => {
      void this.tick();
    });

    if (Capacitor.isNativePlatform()) {
      void App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) void this.tick();
      });
    }
  }

  private async refreshPushPermissionState(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        const current = await LocalNotifications.checkPermissions();
        this.pushPermission.set(
          current.display === 'granted' ? 'granted' : 'denied',
        );
      } catch {
        this.pushPermission.set('unsupported');
      }
      return;
    }
    if (typeof Notification === 'undefined') {
      this.pushPermission.set('unsupported');
      return;
    }
    this.pushPermission.set(
      Notification.permission === 'granted'
        ? 'granted'
        : Notification.permission === 'denied'
          ? 'denied'
          : 'prompt',
    );
  }

  private async syncOsAlerts(
    items: InAppNotification[],
    announce: boolean,
  ): Promise<void> {
    const unread = items.filter((n) => n.status !== 'read');
    const seen = this.readSeenIds();

    if (!this.seededSeen && seen.size === 0) {
      for (const item of unread) seen.add(item.id);
      this.writeSeenIds(seen);
      this.seededSeen = true;
      return;
    }
    this.seededSeen = true;

    const fresh = unread.filter((n) => !seen.has(n.id));
    for (const item of unread) seen.add(item.id);
    this.writeSeenIds(seen);

    if (!announce || !fresh.length) return;
    if (this.prefs().pushAlertsEnabled === false) return;
    if (this.prefs().jobAlertsEnabled === false) return;

    // When live FCM is registered, the server already pushed to the system tray
    // (including while the app was closed). Skip poll-driven local duplicates.
    if (Capacitor.isNativePlatform() && this.remotePushReady()) {
      return;
    }

    const allowed = await this.ensureOsTrayPermission();
    if (!allowed) return;

    for (const item of fresh.slice(0, 5)) {
      await this.showOsNotification(item);
    }
    this.playAlertTone();
  }

  private async showOsNotification(item: InAppNotification): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        await this.ensureNativeChannel();
        await LocalNotifications.schedule({
          notifications: [
            {
              id: this.toNotifId(item.id),
              title: item.title || 'X Cron Jobs',
              body: item.body || 'New job match',
              sound: 'default',
              channelId: CHANNEL_ID,
              foreground: true,
              extra: { jobId: item.jobId, notificationId: item.id },
            },
          ],
        });
        return;
      }

      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
        return;
      }
      const note = new Notification(item.title || 'X Cron Jobs', {
        body: item.body || 'New job match',
        tag: item.id,
        silent: false,
        data: { jobId: item.jobId, notificationId: item.id },
      });
      note.onclick = () => {
        window.focus();
        note.close();
      };
    } catch (err) {
      console.warn('[notifications] showOsNotification failed', err);
    }
  }

  /** Short system-like chime — browsers often mute Notification sound when focused. */
  private playAlertTone(): void {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) this.audioCtx = new AudioCtx();
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      const now = ctx.currentTime;
      const beep = (freq: number, start: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, now + start);
        gain.gain.exponentialRampToValueAtTime(0.18, now + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur + 0.02);
      };
      beep(880, 0, 0.12);
      beep(1175, 0.14, 0.16);
    } catch {
      // Audio may be blocked until a user gesture; OS tray may still sound.
    }
  }

  private async ensureNativeChannel(): Promise<void> {
    if (this.channelReady || !Capacitor.isNativePlatform()) return;
    try {
      await LocalNotifications.createChannel({
        id: CHANNEL_ID,
        name: 'Job alerts',
        description: 'X Cron job match alerts',
        importance: 5,
        visibility: 1,
        sound: 'default',
        vibration: true,
      });
    } catch {
      // Channel API is Android-only; ignore on iOS.
    }
    this.channelReady = true;
  }

  private toNotifId(id: string): number {
    let hash = 0;
    for (let i = 0; i < id.length; i += 1) {
      hash = (hash * 31 + id.charCodeAt(i)) | 0;
    }
    const positive = Math.abs(hash) % 2_000_000_000;
    return positive === 0 ? 1 : positive;
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
}
