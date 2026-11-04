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

export interface AuthUser {
  id: string;
  roles: Array<'seeker' | 'employer' | 'admin'>;
  email?: string;
  displayName?: string;
}

interface AuthSessionResponse {
  token: string;
  refreshToken: string;
  expiresAt?: string;
  user: AuthUser;
}

interface TokenPairResponse {
  token: string;
  refreshToken: string;
  expiresAt?: string;
}

const TOKEN_KEY = 'xcron.web.authToken';
const REFRESH_KEY = 'xcron.web.refreshToken';
const USER_KEY = 'xcron.web.authUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  /** Lazy — avoids circular DI with NotificationsService. */
  private readonly injector = inject(Injector);
  private ensurePromise: Promise<void> | null = null;
  private refreshPromise: Promise<boolean> | null = null;
  private storageHydrated = false;

  /** Null until browser hydrate; never trust SSR for auth chrome. */
  readonly token = signal<string | null>(null);
  readonly refreshToken = signal<string | null>(null);
  readonly user = signal<AuthUser | null>(null);
  /** True after local hydrate + optional `/auth/me` round-trip. */
  readonly sessionValidated = signal(false);

  readonly isSignedIn = computed(() => !!this.token() && !!this.user());
  /** Admin UI/nav — only after backend session validation. */
  readonly isAdmin = computed(
    () =>
      this.sessionValidated() && !!this.user()?.roles.includes('admin'),
  );
  readonly isEmployer = computed(
    () =>
      this.sessionValidated() &&
      (!!this.user()?.roles.includes('employer') ||
        !!this.user()?.roles.includes('admin')),
  );

  authHeaders(): Record<string, string> {
    const token = this.token();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Hydrate from localStorage, then confirm the session with the API.
   * Stale tokens (e.g. after API restart) are cleared — do not show admin chrome
   * from localStorage alone.
   */
  ensureSession(): Promise<void> {
    if (this.ensurePromise) return this.ensurePromise;
    this.ensurePromise = this.runEnsureSession().finally(() => {
      this.ensurePromise = null;
    });
    return this.ensurePromise;
  }

  async signInWithGoogle(input: {
    idToken?: string;
    email?: string;
    displayName?: string;
  }): Promise<void> {
    // Google idToken is exchanged once — never persisted client-side.
    const response = await firstValueFrom(
      this.http.post<AuthSessionResponse>(
        `${environment.apiUrl}/auth/google`,
        input,
      ),
    );
    this.persist(response.token, response.refreshToken, response.user);
    this.sessionValidated.set(true);
    await this.linkPushDevice();
  }

  async signInAsAdmin(input: { email: string; password: string }): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthSessionResponse>(
        `${environment.apiUrl}/auth/admin/login`,
        input,
      ),
    );
    this.persist(response.token, response.refreshToken, response.user);
    this.sessionValidated.set(true);
    await this.linkPushDevice();
  }

  /**
   * Rotate access token via refresh token. Shared promise avoids stampedes.
   * Returns false when refresh is missing or rejected.
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
    const token = this.token();
    try {
      if (token) {
        await firstValueFrom(
          this.http.post(
            `${environment.apiUrl}/auth/logout`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
          ),
        );
      }
    } catch {
      // still clear local session
    } finally {
      this.clearSession({ unlinkPush: false });
    }
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
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
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

    this.hydrateFromStorage();
    if (!this.token() && !this.refreshToken()) {
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
    const token = this.token();
    if (!token) throw new Error('no_access_token');
    const response = await firstValueFrom(
      this.http.get<{ user: AuthUser }>(`${environment.apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    const refresh = this.refreshToken();
    if (refresh) {
      this.persist(token, refresh, response.user);
    } else {
      this.user.set(response.user);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
    }
  }

  private async runRefreshAccessToken(): Promise<boolean> {
    const refreshToken = this.refreshToken();
    if (!refreshToken) return false;
    try {
      const response = await firstValueFrom(
        this.http.post<TokenPairResponse>(
          `${environment.apiUrl}/auth/refresh`,
          { refreshToken },
        ),
      );
      this.token.set(response.token);
      this.refreshToken.set(response.refreshToken);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(REFRESH_KEY, response.refreshToken);
      }
      return true;
    } catch {
      return false;
    }
  }

  private hydrateFromStorage(): void {
    if (this.storageHydrated || !isPlatformBrowser(this.platformId)) return;
    this.storageHydrated = true;
    this.token.set(this.read(TOKEN_KEY));
    this.refreshToken.set(this.read(REFRESH_KEY));
    this.user.set(this.readJson<AuthUser>(USER_KEY));
  }

  private persist(token: string, refreshToken: string, user: AuthUser): void {
    this.token.set(token);
    this.refreshToken.set(refreshToken);
    this.user.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REFRESH_KEY, refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  private read(key: string): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(key);
  }

  private readJson<T>(key: string): T | null {
    try {
      const raw = this.read(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }
}
