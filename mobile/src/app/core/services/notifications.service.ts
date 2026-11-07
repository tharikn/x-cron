import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
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
  applicationUpdatesEnabled?: boolean;
  recruiterMessagesEnabled?: boolean;
  productAnnouncementsEnabled?: boolean;
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
  data?: Record<string, string> | null;
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
  private readonly router = inject(Router);

  readonly prefs = signal<NotificationPrefs>({
    jobAlertsEnabled: true,
    applicationUpdatesEnabled: true,
    recruiterMessagesEnabled: true,
    productAnnouncementsEnabled: false,
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
  private permissionWatchBound = false;
  private lastAnnouncedPermission:
    | 'granted'
    | 'denied'
    | 'prompt'
    | 'unsupported'
    | null = null;

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

  /**
   * Link this device's FCM token to the signed-in user.
   * Job system pushes only target linked devices while a refresh session is alive.
   */
  async registerDevice(): Promise<void> {
    try {
      // OS tray must work even when FCM/Firebase is absent.
      await this.ensureOsTrayPermission();
      if (Capacitor.isNativePlatform() && environment.fcmEnabled) {
        await this.ensureRemotePush();
      }
      // Anonymous devices never receive job fan-out — wait until signed in.
      if (!this.auth.isSignedIn()) {
        this.deviceRegistered.set(false);
        return;
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

  /**
   * Detach FCM from the user so system job pushes stop after logout / session death.
   * Uses deviceId + fcmToken proof (works without a live Bearer token).
   */
  async unlinkDevice(): Promise<void> {
    try {
      const fcmToken = localStorage.getItem(FCM_TOKEN_KEY) || this.stubToken();
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/devices/unlink`, {
          deviceId: this.preferences.deviceId(),
          fcmToken,
        }),
      );
    } catch {
      // best-effort — server also suppresses pushes when refresh session is gone
    } finally {
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
    const product =
      remote.productAnnouncementsEnabled === true ||
      remote.marketingEnabled === true;
    this.prefs.set({
      ...remote,
      applicationUpdatesEnabled: remote.applicationUpdatesEnabled ?? true,
      recruiterMessagesEnabled: remote.recruiterMessagesEnabled ?? true,
      productAnnouncementsEnabled: product,
      marketingEnabled: product,
    });
  }

  async savePrefs(partial: Partial<NotificationPrefs>): Promise<void> {
    const next = { ...this.prefs(), ...partial };
    if (
      partial.productAnnouncementsEnabled !== undefined ||
      partial.marketingEnabled !== undefined
    ) {
      const value =
        partial.productAnnouncementsEnabled ?? partial.marketingEnabled ?? false;
      next.productAnnouncementsEnabled = value;
      next.marketingEnabled = value;
    }
    if (partial.pushAlertsEnabled === true) {
      await this.ensurePushPermission();
      await this.registerDevice();
    }
    const {
      userId: _userId,
      updatedAt: _updatedAt,
      ...body
    } = next as NotificationPrefs & { userId?: string; updatedAt?: string };
    const remote = await firstValueFrom(
      this.http.put<NotificationPrefs>(
        `${environment.apiUrl}/notifications/preferences`,
        body,
        { headers: this.auth.authHeaders() },
      ),
    );
    const product =
      remote.productAnnouncementsEnabled === true ||
      remote.marketingEnabled === true;
    this.prefs.set({
      ...remote,
      productAnnouncementsEnabled: product,
      marketingEnabled: product,
    });
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
      await this.ensureRemotePush();
    }
    return trayOk;
  }

  /**
   * After sign-in: request OS notification permission when still undecided.
   * Callers should toast when `asked` is true.
   */
  async promptOsPermissionAfterSignIn(): Promise<{
    status: 'granted' | 'denied' | 'prompt' | 'unsupported';
    asked: boolean;
    granted: boolean;
  }> {
    await this.refreshPushPermissionState();
    const before = this.pushPermission();
    if (before === 'prompt') {
      const granted = await this.ensurePushPermission();
      const status = this.pushPermission();
      this.lastAnnouncedPermission = status;
      return { status, asked: true, granted };
    }
    // Already decided — still refresh remote push registration when allowed.
    if (before === 'granted') {
      await this.ensurePushPermission();
    }
    this.lastAnnouncedPermission = this.pushPermission();
    return {
      status: this.pushPermission(),
      asked: false,
      granted: this.pushPermission() === 'granted',
    };
  }

  /**
   * Re-check OS permission on resume / prefs open. Invokes `onChange` once per
   * real flip after the first seed (for toast + UI sync).
   */
  watchOsPermission(
    onChange?: (status: 'granted' | 'denied' | 'prompt' | 'unsupported') => void,
  ): void {
    if (this.permissionWatchBound || typeof document === 'undefined') return;
    this.permissionWatchBound = true;
    void this.refreshPushPermissionState().then(() => {
      this.lastAnnouncedPermission = this.pushPermission();
    });

    const emitIfChanged = async () => {
      await this.refreshPushPermissionState();
      const next = this.pushPermission();
      if (this.lastAnnouncedPermission === next) return;
      this.lastAnnouncedPermission = next;
      onChange?.(next);
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') void emitIfChanged();
    });
    window.addEventListener('focus', () => {
      void emitIfChanged();
    });

    if (Capacitor.isNativePlatform()) {
      void App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) void emitIfChanged();
      });
    }

    if (!Capacitor.isNativePlatform()) {
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
      if (perms?.query) {
        void perms
          .query({ name: 'notifications' })
          .then((status) => {
            status.onchange = () => {
              void emitIfChanged();
            };
          })
          .catch(() => {
            // ignore unsupported query
          });
      }
    }
  }

  /** Android/iOS system shade via LocalNotifications (or browser Notification API). */
  async ensureOsTrayPermission(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        await this.ensureNativeChannel();
        await this.bindLocalNotificationTap();
        const current = await LocalNotifications.checkPermissions();
        let display = current.display;
        if (display === 'prompt' || display === 'prompt-with-rationale') {
          const asked = await LocalNotifications.requestPermissions();
          display = asked.display;
        }
        const status = this.mapNativeDisplay(display);
        this.pushPermission.set(status);
        // Suppress watch duplicate toast — callers announce when they asked.
        this.lastAnnouncedPermission = status;
        return display === 'granted';
      } catch (err) {
        console.warn('[notifications] OS tray permission failed', err);
        this.pushPermission.set('unsupported');
        this.lastAnnouncedPermission = 'unsupported';
        return false;
      }
    }

    if (typeof Notification === 'undefined') {
      this.pushPermission.set('unsupported');
      this.lastAnnouncedPermission = 'unsupported';
      return false;
    }
    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }
    const status = this.mapBrowserPermission(permission);
    this.pushPermission.set(status);
    this.lastAnnouncedPermission = status;
    return permission === 'granted';
  }

  private mapNativeDisplay(
    display: string,
  ): 'granted' | 'denied' | 'prompt' | 'unsupported' {
    if (display === 'granted') return 'granted';
    if (display === 'prompt' || display === 'prompt-with-rationale') return 'prompt';
    if (display === 'denied') return 'denied';
    return 'denied';
  }

  private mapBrowserPermission(
    permission: NotificationPermission,
  ): 'granted' | 'denied' | 'prompt' | 'unsupported' {
    if (permission === 'granted') return 'granted';
    if (permission === 'denied') return 'denied';
    return 'prompt';
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
      const data = (notification.data ?? {}) as Record<string, string>;
      const isJobAlert = this.isJobAlertPayload(data);
      if (isJobAlert && this.prefs().jobAlertsEnabled === false) return;
      const id =
        (data['notificationId'] as string | undefined) ||
        notification.id ||
        `fcm_${Date.now()}`;
      void this.showOsNotification({
        id,
        title: notification.title || 'X Cron Jobs',
        body: notification.body || (isJobAlert ? 'New job match' : 'New update'),
        status: 'sent',
        jobId: (data['jobId'] as string | null) ?? null,
        createdAt: new Date().toISOString(),
        readAt: null,
        data,
      });
      this.playAlertTone();
      void this.refreshInbox({ announce: false });
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (event) => {
      this.navigateFromPayload(
        (event.notification?.data ?? {}) as Record<string, string>,
      );
      void this.onForegroundResume();
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

  /** Silent access refresh + inbox when the app (or a push tap) comes to foreground. */
  private async onForegroundResume(): Promise<void> {
    try {
      await this.auth.slideSessionIfNeeded();
      await this.auth.ensureSession();
    } catch {
      // session clear handled inside auth
    }
    if (!this.auth.isSignedIn()) return;
    await this.tick();
  }

  private bindLifecycleListeners(): void {
    if (this.listenersBound || typeof document === 'undefined') return;
    this.listenersBound = true;

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        void this.onForegroundResume();
      }
    });
    window.addEventListener('focus', () => {
      void this.onForegroundResume();
    });

    if (Capacitor.isNativePlatform()) {
      void App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) void this.onForegroundResume();
      });
    }
  }

  async refreshPushPermissionState(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        const current = await LocalNotifications.checkPermissions();
        this.pushPermission.set(this.mapNativeDisplay(current.display));
      } catch {
        this.pushPermission.set('unsupported');
      }
      return;
    }
    if (typeof Notification === 'undefined') {
      this.pushPermission.set('unsupported');
      return;
    }
    this.pushPermission.set(this.mapBrowserPermission(Notification.permission));
  }

  private async syncOsAlerts(
    items: InAppNotification[],
    announce: boolean,
  ): Promise<void> {
    const unread = items.filter((n) => n.status !== 'read');
    const seen = this.readSeenIds();
    /** Missed while process was dead / FCM failed — still worth a tray ping. */
    const recentMs = 15 * 60 * 1000;
    const now = Date.now();
    const isRecent = (n: InAppNotification) => {
      const t = Date.parse(n.createdAt);
      return Number.isFinite(t) && now - t <= recentMs;
    };

    if (!this.seededSeen && seen.size === 0) {
      // Remember older history so first open does not spam the shade, but do
      // not swallow alerts that landed while the app was closed.
      for (const item of unread.filter((n) => !isRecent(n))) seen.add(item.id);
      this.writeSeenIds(seen);
      this.seededSeen = true;
    } else {
      this.seededSeen = true;
    }

    const fresh = unread.filter((n) => !seen.has(n.id));
    // Silent inbox pulls must not burn tray eligibility — only mark seen when
    // we announce (or after a successful tray attempt below).
    if (!announce || !fresh.length) return;
    if (this.prefs().pushAlertsEnabled === false) return;

    const eligible = fresh.filter((item) => {
      if (!this.isJobAlertPayload(item.data ?? undefined)) return true;
      return this.prefs().jobAlertsEnabled !== false;
    });
    if (!eligible.length) return;

    // Trust background FCM only when the device is linked on the API and the
    // app is not visible. Otherwise poll-driven LocalNotifications must fill
    // the tray (common failures: no_device, stub token, FCM send error).
    const appHidden =
      typeof document !== 'undefined' && document.visibilityState === 'hidden';
    if (
      Capacitor.isNativePlatform() &&
      this.remotePushReady() &&
      this.deviceRegistered() &&
      appHidden
    ) {
      for (const item of eligible) seen.add(item.id);
      this.writeSeenIds(seen);
      return;
    }

    const allowed = await this.ensureOsTrayPermission();
    if (!allowed) {
      // Permission denied — don't hammer every poll; in-app badge still shows.
      for (const item of eligible) seen.add(item.id);
      this.writeSeenIds(seen);
      return;
    }

    for (const item of eligible.slice(0, 5)) {
      await this.showOsNotification(item);
      seen.add(item.id);
    }
    this.writeSeenIds(seen);
    this.playAlertTone();
  }

  /** Job-match rows respect jobAlertsEnabled; support / ATS / onboarding always may tray. */
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

  private pathFromPayload(data?: Record<string, string> | null): string | null {
    const action = data?.['action']?.trim();
    if (action === 'complete_profile') return '/onboarding/profile';
    if (action === 'browse_jobs') return '/tabs/discover';
    if (action === 'open_feedback') {
      const threadId = data?.['threadId']?.trim();
      const qs = threadId ? `?thread=${encodeURIComponent(threadId)}` : '';
      return data?.['eventType'] === 'user_message'
        ? `/tabs/admin-feedback${qs}`
        : `/tabs/feedback${qs}`;
    }
    const applicationId = data?.['applicationId']?.trim();
    if (applicationId) {
      const asEmployer = data?.['recipientRole'] === 'employer';
      return asEmployer
        ? `/tabs/applications/${applicationId}?as=employer`
        : `/tabs/applications/${applicationId}`;
    }
    const jobId = data?.['jobId']?.trim();
    return jobId ? `/tabs/jobs/${jobId}` : null;
  }

  private navigateFromPayload(data?: Record<string, string> | null): void {
    const path = this.pathFromPayload(data);
    if (!path) return;
    void this.router.navigateByUrl(path);
  }

  private async showOsNotification(item: InAppNotification): Promise<void> {
    const data: Record<string, string> = {
      ...(item.data ?? {}),
      notificationId: item.id,
    };
    if (item.jobId && !data['jobId']) data['jobId'] = item.jobId;
    const fallbackBody = this.isJobAlertPayload(data)
      ? 'New job match'
      : 'New update';
    const { title, body } = this.formatOsNotificationText(
      item,
      fallbackBody,
    );
    const icon = this.osIconUrl();

    try {
      if (Capacitor.isNativePlatform()) {
        await this.ensureNativeChannel();
        await this.bindLocalNotificationTap();
        await LocalNotifications.schedule({
          notifications: [
            {
              id: this.toNotifId(item.id),
              title,
              body,
              sound: 'default',
              channelId: CHANNEL_ID,
              // Status-bar: white silhouette. Expanded shade: full X Cron square mark.
              smallIcon: 'ic_stat_xcron',
              largeIcon: 'ic_notification_large',
              iconColor: '#7c5cff',
              foreground: true,
              extra: data,
            },
          ],
        });
        return;
      }

      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
        return;
      }
      const note = new Notification(title, {
        body,
        icon,
        badge: icon,
        tag: item.id,
        silent: false,
        data,
      });
      note.onclick = () => {
        window.focus();
        this.navigateFromPayload(data);
        note.close();
      };
    } catch (err) {
      console.warn('[notifications] showOsNotification failed', err);
    }
  }

  /** Square X Cron mark — browser shade (Ionic serve / PWA). */
  private osIconUrl(): string {
    if (typeof window === 'undefined') {
      return '/assets/icon/xcron-logo-mark-square.png';
    }
    return `${window.location.origin}/assets/icon/xcron-logo-mark-square.png`;
  }

  /**
   * Keep the shade title short; put facts on separate body lines so Windows /
   * Android wrap cleanly (middot runs become line breaks).
   */
  private formatOsNotificationText(
    item: InAppNotification,
    fallbackBody: string,
  ): { title: string; body: string } {
    const title = (item.title || 'X Cron Jobs').trim();
    const raw = (item.body || fallbackBody).trim();
    const body = raw
      .replace(/\s*[·•]\s*/g, '\n')
      .replace(/\s*\|\s*/g, '\n')
      .replace(/\n{2,}/g, '\n')
      .trim();
    return { title, body: body || fallbackBody };
  }

  private localTapBound = false;

  private async bindLocalNotificationTap(): Promise<void> {
    if (this.localTapBound || !Capacitor.isNativePlatform()) return;
    this.localTapBound = true;
    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (event) => {
        const extra = (event.notification?.extra ?? {}) as Record<string, string>;
        this.navigateFromPayload(extra);
        void this.onForegroundResume();
      },
    );
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
