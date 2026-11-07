import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Injectable,
  Injector,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { csrfHeaders } from '../utils/csrf';
import { TabSessionService } from './tab-session.service';

export interface AuthUser {
  id: string;
  roles: Array<'seeker' | 'employer' | 'admin' | 'moderator'>;
  username?: string;
  email?: string;
  displayName?: string;
}

export interface EmployerProfile {
  id: string;
  name: string;
  verificationStatus: string;
  ownerUserId: string;
  createdAt: string;
}

interface AuthSessionResponse {
  token: string;
  refreshToken: string;
  expiresAt?: string;
  user: AuthUser;
  employer?: EmployerProfile | null;
}

interface TokenPairResponse {
  token: string;
  refreshToken: string;
  expiresAt?: string;
}

export interface AuthDeviceSession {
  id: string;
  createdAt: string;
  expiresAt: string;
  refreshExpiresAt: string;
  current: boolean;
}

/** Profile only in storage. Refresh may live in sessionStorage as cross-origin fallback. */
const USER_KEY = 'xcron.web.authUser';
const SESSION_REFRESH_KEY = 'xcron.web.sessionRefresh';
const LEGACY_TOKEN_KEY = 'xcron.web.authToken';
const LEGACY_REFRESH_KEY = 'xcron.web.refreshToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly tabs = inject(TabSessionService);
  /** Lazy — avoids circular DI with NotificationsService. */
  private readonly injector = inject(Injector);
  private ensurePromise: Promise<void> | null = null;
  private refreshPromise: Promise<boolean> | null = null;

  /** In-memory access token (also mirrored via HttpOnly cookie when same-site). */
  readonly token = signal<string | null>(null);
  readonly refreshToken = signal<string | null>(null);
  readonly user = signal<AuthUser | null>(null);
  /** True after browser hydrate + optional `/auth/me` round-trip. */
  readonly sessionValidated = signal(false);

  readonly isSignedIn = computed(() => !!this.user() && (!!this.token() || this.hasCookieSession()));
  /** Admin UI/nav — only after backend session validation. */
  readonly isAdmin = computed(
    () =>
      this.sessionValidated() && !!this.user()?.roles.includes('admin'),
  );
  /** Trust desk / Blog Approval — moderator or platform admin. */
  readonly isModerator = computed(
    () =>
      this.sessionValidated() &&
      (!!this.user()?.roles.includes('moderator') ||
        !!this.user()?.roles.includes('admin')),
  );
  readonly isEmployer = computed(
    () =>
      this.sessionValidated() &&
      (!!this.user()?.roles.includes('employer') ||
        !!this.user()?.roles.includes('admin')),
  );

  /** True when API set HttpOnly cookies (cross-check via CSRF twin). */
  hasCookieSession(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return document.cookie.split(';').some((part) => part.trim().startsWith('xcron_csrf='));
  }

  authHeaders(): Record<string, string> {
    const token = this.token();
    return {
      ...this.tabs.headers(),
      ...csrfHeaders(),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /**
   * Hydrate profile, claim one-tab lock, confirm session with the API.
   * Stale tokens (e.g. after API restart) are cleared — do not show admin chrome
   * from storage alone.
   */
  ensureSession(): Promise<void> {
    if (this.ensurePromise) return this.ensurePromise;
    this.ensurePromise = this.runEnsureSession().finally(() => {
      this.ensurePromise = null;
    });
    return this.ensurePromise;
  }

  async register(input: {
    username: string;
    password: string;
    confirmPassword: string;
    intendedRole?: 'seeker' | 'employer';
  }): Promise<void> {
    this.tabs.forceClaim();
    const response = await firstValueFrom(
      this.http.post<AuthSessionResponse>(
        `${environment.apiUrl}/auth/register`,
        input,
        { withCredentials: true, headers: this.authHeaders() },
      ),
    );
    this.persist(response.token, response.refreshToken, response.user);
    this.sessionValidated.set(true);
    await this.linkPushDevice();
  }

  async login(input: {
    username: string;
    password: string;
    intendedRole?: 'seeker' | 'employer';
  }): Promise<void> {
    this.tabs.forceClaim();
    const response = await firstValueFrom(
      this.http.post<AuthSessionResponse>(
        `${environment.apiUrl}/auth/login`,
        input,
        { withCredentials: true, headers: this.authHeaders() },
      ),
    );
    this.persist(response.token, response.refreshToken, response.user);
    this.sessionValidated.set(true);
    await this.linkPushDevice();
  }

  async signInWithGoogle(input: {
    idToken?: string;
    email?: string;
    displayName?: string;
    intendedRole?: 'seeker' | 'employer';
  }): Promise<void> {
    this.tabs.forceClaim();
    // Google idToken is exchanged once — never persisted client-side.
    const response = await firstValueFrom(
      this.http.post<AuthSessionResponse>(
        `${environment.apiUrl}/auth/google`,
        input,
        { withCredentials: true, headers: this.authHeaders() },
      ),
    );
    this.persist(response.token, response.refreshToken, response.user);
    this.sessionValidated.set(true);
    await this.linkPushDevice();
  }

  async signInAsAdmin(input: { email: string; password: string }): Promise<void> {
    this.tabs.forceClaim();
    const response = await firstValueFrom(
      this.http.post<AuthSessionResponse>(
        `${environment.apiUrl}/auth/admin/login`,
        input,
        { withCredentials: true, headers: this.authHeaders() },
      ),
    );
    this.persist(response.token, response.refreshToken, response.user);
    this.sessionValidated.set(true);
    await this.linkPushDevice();
  }

  async createEmployer(name: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<{ employer: EmployerProfile; user: AuthUser }>(
        `${environment.apiUrl}/employers`,
        { name },
        { withCredentials: true, headers: this.authHeaders() },
      ),
    );
    this.user.set(response.user);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
  }

  /**
   * Rotate access token via refresh token / cookie. Shared promise avoids stampedes.
   */
  refreshAccessToken(): Promise<boolean> {
    if (this.refreshPromise) return this.refreshPromise;
    this.refreshPromise = this.runRefreshAccessToken().finally(() => {
      this.refreshPromise = null;
    });
    return this.refreshPromise;
  }

  async logout(): Promise<void> {
    await this.unlinkPushDevice();
    try {
      await firstValueFrom(
        this.http.post(
          `${environment.apiUrl}/auth/logout`,
          {},
          { withCredentials: true, headers: this.authHeaders() },
        ),
      );
    } catch {
      // still clear local session
    } finally {
      this.clearSession({ unlinkPush: false });
    }
  }

  /** Revoke every refresh/access pair for this account. */
  async logoutAll(): Promise<void> {
    await this.unlinkPushDevice();
    try {
      await firstValueFrom(
        this.http.post(
          `${environment.apiUrl}/auth/logout-all`,
          {},
          { withCredentials: true, headers: this.authHeaders() },
        ),
      );
    } catch {
      // still clear local session
    } finally {
      this.clearSession({ unlinkPush: false });
    }
  }

  async listSessions(): Promise<AuthDeviceSession[]> {
    const response = await firstValueFrom(
      this.http.get<{ sessions: AuthDeviceSession[] }>(
        `${environment.apiUrl}/auth/sessions`,
        { withCredentials: true, headers: this.authHeaders() },
      ),
    );
    return response.sessions ?? [];
  }

  async revokeSession(sessionId: string): Promise<void> {
    const target = sessionId.trim();
    if (!target) return;
    await firstValueFrom(
      this.http.delete(
        `${environment.apiUrl}/auth/sessions/${encodeURIComponent(target)}`,
        { withCredentials: true, headers: this.authHeaders() },
      ),
    );
  }

  /** Local wipe only (used by 401 interceptor — avoid logout loops). */
  clearSession(options?: { unlinkPush?: boolean }): void {
    if (options?.unlinkPush !== false) {
      void this.unlinkPushDevice();
    }
    this.token.set(null);
    this.refreshToken.set(null);
    this.user.set(null);
    this.sessionValidated.set(true);
    this.tabs.release();
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(SESSION_REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
      localStorage.removeItem(LEGACY_REFRESH_KEY);
    }
  }

  private async linkPushDevice(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const { NotificationsService } = await import('./notifications.service');
      await this.injector.get(NotificationsService).registerDevice();
    } catch {
      // boot / preferences also re-register
    }
  }

  private async unlinkPushDevice(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const { NotificationsService } = await import('./notifications.service');
      await this.injector.get(NotificationsService).unlinkDevice();
    } catch {
      // API suppresses pushes when refresh session is gone
    }
  }

  private async runEnsureSession(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      this.sessionValidated.set(true);
      return;
    }

    this.scrubLegacyTokenStorage();
    this.hydrateUser();
    this.hydrateSessionRefresh();

    if (!this.tabs.claim()) {
      // Another tab owns the session — do not call authenticated APIs here.
      this.token.set(null);
      this.refreshToken.set(null);
      this.sessionValidated.set(true);
      return;
    }

    if (!this.token() && !this.refreshToken() && !this.hasCookieSession()) {
      this.sessionValidated.set(true);
      return;
    }

    try {
      await this.fetchMe();
    } catch {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        this.clearSession();
        return;
      }
      try {
        await this.fetchMe();
      } catch {
        this.clearSession();
        return;
      }
    }
    this.sessionValidated.set(true);
  }

  private async fetchMe(): Promise<void> {
    const response = await firstValueFrom(
      this.http.get<{ user: AuthUser }>(`${environment.apiUrl}/auth/me`, {
        withCredentials: true,
        headers: this.authHeaders(),
      }),
    );
    this.user.set(response.user);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
  }

  private async runRefreshAccessToken(): Promise<boolean> {
    const refreshToken = this.refreshToken();
    try {
      const response = await firstValueFrom(
        this.http.post<TokenPairResponse>(
          `${environment.apiUrl}/auth/refresh`,
          refreshToken ? { refreshToken } : {},
          { withCredentials: true, headers: this.authHeaders() },
        ),
      );
      this.token.set(response.token);
      this.refreshToken.set(response.refreshToken);
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.setItem(SESSION_REFRESH_KEY, response.refreshToken);
      }
      return true;
    } catch {
      return false;
    }
  }

  private hydrateUser(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const raw =
      sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    if (!raw) return;
    try {
      this.user.set(JSON.parse(raw) as AuthUser);
    } catch {
      sessionStorage.removeItem(USER_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  private hydrateSessionRefresh(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const refresh = sessionStorage.getItem(SESSION_REFRESH_KEY);
    if (refresh) this.refreshToken.set(refresh);
  }

  private persist(token: string, refreshToken: string, user: AuthUser): void {
    this.token.set(token);
    this.refreshToken.set(refreshToken);
    this.user.set(user);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      sessionStorage.setItem(SESSION_REFRESH_KEY, refreshToken);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
      localStorage.removeItem(LEGACY_REFRESH_KEY);
    }
  }

  private scrubLegacyTokenStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(LEGACY_REFRESH_KEY);
  }
}
