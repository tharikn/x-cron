import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, computed, inject, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { useApiCredentials } from '../utils/api-credentials';
import { csrfHeaders } from '../utils/csrf';
import { TabSessionService } from './tab-session.service';
import { TokenVaultService } from './token-vault.service';

export interface AuthUser {
  id: string;
  status: string;
  preferredLocale: string;
  roles: Array<'seeker' | 'employer' | 'admin' | 'moderator'>;
  username?: string;
  phone?: string;
  email?: string;
  displayName?: string;
  createdAt: string;
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
  employer: EmployerProfile | null;
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

const USER_KEY = 'xcron.authUser';
const EMPLOYER_KEY = 'xcron.employer';
const LEGACY_TOKEN_KEY = 'xcron.authToken';
const LEGACY_REFRESH_KEY = 'xcron.refreshToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tabs = inject(TabSessionService);
  private readonly vault = inject(TokenVaultService);
  private readonly injector = inject(Injector);
  private ensurePromise: Promise<void> | null = null;
  private refreshPromise: Promise<boolean> | null = null;

  readonly token = signal<string | null>(null);
  readonly refreshToken = signal<string | null>(null);
  readonly user = signal<AuthUser | null>(this.readJson<AuthUser>(USER_KEY));
  readonly employer = signal<EmployerProfile | null>(
    this.readJson<EmployerProfile>(EMPLOYER_KEY),
  );
  readonly sessionValidated = signal(false);

  readonly isSignedIn = computed(
    () => !!this.user() && (!!this.token() || this.hasCookieSession()),
  );
  readonly isEmployer = computed(
    () =>
      !!this.user()?.roles.includes('employer') ||
      !!this.user()?.roles.includes('admin') ||
      !!this.employer(),
  );
  readonly isAdmin = computed(
    () =>
      this.sessionValidated() && !!this.user()?.roles.includes('admin'),
  );
  readonly isModerator = computed(
    () =>
      this.sessionValidated() &&
      (!!this.user()?.roles.includes('moderator') ||
        !!this.user()?.roles.includes('admin')),
  );

  hasCookieSession(): boolean {
    // Native never uses cookie dual-auth (cross-origin CSRF trap).
    if (Capacitor.isNativePlatform()) return false;
    return document.cookie.split(';').some((part) => part.trim().startsWith('xcron_csrf='));
  }

  authHeaders(): Record<string, string> {
    const token = this.token();
    return {
      ...this.tabs.headers(),
      ...(useApiCredentials() ? csrfHeaders() : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private credOpts(): { withCredentials: boolean } {
    return { withCredentials: useApiCredentials() };
  }

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
        { ...this.credOpts(), headers: this.authHeaders() },
      ),
    );
    this.persist(
      response.token,
      response.refreshToken,
      response.user,
      response.employer,
    );
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
        { ...this.credOpts(), headers: this.authHeaders() },
      ),
    );
    this.persist(
      response.token,
      response.refreshToken,
      response.user,
      response.employer,
    );
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
    const response = await firstValueFrom(
      this.http.post<AuthSessionResponse>(
        `${environment.apiUrl}/auth/google`,
        input,
        { ...this.credOpts(), headers: this.authHeaders() },
      ),
    );
    this.persist(
      response.token,
      response.refreshToken,
      response.user,
      response.employer,
    );
    this.sessionValidated.set(true);
    await this.linkPushDevice();
  }

  async signInAsAdmin(input: { email: string; password: string }): Promise<void> {
    this.tabs.forceClaim();
    const response = await firstValueFrom(
      this.http.post<AuthSessionResponse>(
        `${environment.apiUrl}/auth/admin/login`,
        input,
        { ...this.credOpts(), headers: this.authHeaders() },
      ),
    );
    this.persist(
      response.token,
      response.refreshToken,
      response.user,
      response.employer,
    );
    this.sessionValidated.set(true);
    await this.linkPushDevice();
  }

  async refreshMe(): Promise<void> {
    if (!this.token() && !this.refreshToken() && !this.hasCookieSession()) {
      this.sessionValidated.set(true);
      return;
    }
    try {
      await this.fetchMe();
      this.sessionValidated.set(true);
    } catch {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        this.clearSession();
        return;
      }
      try {
        await this.fetchMe();
        this.sessionValidated.set(true);
      } catch {
        this.clearSession();
      }
    }
  }

  refreshAccessToken(): Promise<boolean> {
    if (this.refreshPromise) return this.refreshPromise;
    this.refreshPromise = this.runRefreshAccessToken().finally(() => {
      this.refreshPromise = null;
    });
    return this.refreshPromise;
  }

  /** Proactive refresh on foreground resume so long-lived alert sessions stay warm. */
  async slideSessionIfNeeded(): Promise<void> {
    if (!this.refreshToken() && !this.hasCookieSession()) return;
    await this.refreshAccessToken();
  }

  async createEmployer(name: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<{ employer: EmployerProfile; user: AuthUser }>(
        `${environment.apiUrl}/employers`,
        { name },
        { ...this.credOpts(), headers: this.authHeaders() },
      ),
    );
    const refresh = this.refreshToken();
    const access = this.token();
    if (!access || !refresh) {
      this.user.set(response.user);
      this.employer.set(response.employer);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      if (response.employer) {
        localStorage.setItem(EMPLOYER_KEY, JSON.stringify(response.employer));
      }
      return;
    }
    this.persist(access, refresh, response.user, response.employer);
  }

  async logout(): Promise<void> {
    await this.unlinkPushDevice();
    try {
      await firstValueFrom(
        this.http.post(
          `${environment.apiUrl}/auth/logout`,
          {},
          { ...this.credOpts(), headers: this.authHeaders() },
        ),
      );
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
          { ...this.credOpts(), headers: this.authHeaders() },
        ),
      );
    } finally {
      this.clearSession({ unlinkPush: false });
    }
  }

  async listSessions(): Promise<AuthDeviceSession[]> {
    const response = await firstValueFrom(
      this.http.get<{ sessions: AuthDeviceSession[] }>(
        `${environment.apiUrl}/auth/sessions`,
        { ...this.credOpts(), headers: this.authHeaders() },
      ),
    );
    return response.sessions ?? [];
  }

  async revokeSession(sessionId: string): Promise<void> {
    const target = sessionId.trim();
    if (!target) return;
    await firstValueFrom(
      this.http.delete(`${environment.apiUrl}/auth/sessions/${encodeURIComponent(target)}`, {
        ...this.credOpts(),
        headers: this.authHeaders(),
      }),
    );
  }

  clearSession(options?: { unlinkPush?: boolean }): void {
    if (options?.unlinkPush !== false) {
      void this.unlinkPushDevice();
    }
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EMPLOYER_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(LEGACY_REFRESH_KEY);
    void this.vault.clearRefresh();
    this.token.set(null);
    this.refreshToken.set(null);
    this.user.set(null);
    this.employer.set(null);
    this.sessionValidated.set(true);
    this.tabs.release();
  }

  private async linkPushDevice(): Promise<void> {
    try {
      const { NotificationsService } = await import('./notifications.service');
      await this.injector.get(NotificationsService).registerDevice();
    } catch {
      // Prefs / Account / boot also re-register
    }
  }

  private async unlinkPushDevice(): Promise<void> {
    try {
      const { NotificationsService } = await import('./notifications.service');
      await this.injector.get(NotificationsService).unlinkDevice();
    } catch {
      // server suppresses pushes when refresh session is gone
    }
  }

  private async runEnsureSession(): Promise<void> {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(LEGACY_REFRESH_KEY);
    const sessionRefresh = await this.vault.readRefresh();
    if (sessionRefresh) this.refreshToken.set(sessionRefresh);

    if (!this.tabs.claim()) {
      this.token.set(null);
      this.refreshToken.set(null);
      this.sessionValidated.set(true);
      return;
    }

    if (!this.token() && !this.refreshToken() && !this.hasCookieSession()) {
      this.sessionValidated.set(true);
      return;
    }
    await this.refreshMe();
  }

  private async fetchMe(): Promise<void> {
    const response = await firstValueFrom(
      this.http.get<{ user: AuthUser; employer: EmployerProfile | null }>(
        `${environment.apiUrl}/auth/me`,
        { ...this.credOpts(), headers: this.authHeaders() },
      ),
    );
    this.user.set(response.user);
    this.employer.set(response.employer);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    if (response.employer) {
      localStorage.setItem(EMPLOYER_KEY, JSON.stringify(response.employer));
    } else {
      localStorage.removeItem(EMPLOYER_KEY);
    }
  }

  private async runRefreshAccessToken(): Promise<boolean> {
    const refreshToken = this.refreshToken();
    try {
      const response = await firstValueFrom(
        this.http.post<TokenPairResponse>(
          `${environment.apiUrl}/auth/refresh`,
          refreshToken ? { refreshToken } : {},
          { ...this.credOpts(), headers: this.authHeaders() },
        ),
      );
      this.token.set(response.token);
      this.refreshToken.set(response.refreshToken);
      void this.vault.writeRefresh(response.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  private persist(
    token: string,
    refreshToken: string,
    user: AuthUser,
    employer: EmployerProfile | null,
  ): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (employer) localStorage.setItem(EMPLOYER_KEY, JSON.stringify(employer));
    else localStorage.removeItem(EMPLOYER_KEY);
    void this.vault.writeRefresh(refreshToken);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(LEGACY_REFRESH_KEY);
    this.token.set(token);
    this.refreshToken.set(refreshToken);
    this.user.set(user);
    this.employer.set(employer);
  }

  private readJson<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }
}
