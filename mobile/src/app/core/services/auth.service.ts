import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  id: string;
  status: string;
  preferredLocale: string;
  roles: Array<'seeker' | 'employer' | 'admin'>;
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

const TOKEN_KEY = 'xcron.authToken';
const REFRESH_KEY = 'xcron.refreshToken';
const USER_KEY = 'xcron.authUser';
const EMPLOYER_KEY = 'xcron.employer';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  /** Lazy — avoids circular DI with NotificationsService. */
  private readonly injector = inject(Injector);
  private ensurePromise: Promise<void> | null = null;
  private refreshPromise: Promise<boolean> | null = null;

  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly refreshToken = signal<string | null>(localStorage.getItem(REFRESH_KEY));
  readonly user = signal<AuthUser | null>(this.readJson<AuthUser>(USER_KEY));
  readonly employer = signal<EmployerProfile | null>(
    this.readJson<EmployerProfile>(EMPLOYER_KEY),
  );
  readonly sessionValidated = signal(false);

  readonly isSignedIn = computed(() => !!this.token() && !!this.user());
  readonly isEmployer = computed(
    () =>
      !!this.user()?.roles.includes('employer') ||
      !!this.user()?.roles.includes('admin') ||
      !!this.employer(),
  );
  /** Admin tabs/routes — only after `/auth/me` confirms the role. */
  readonly isAdmin = computed(
    () =>
      this.sessionValidated() && !!this.user()?.roles.includes('admin'),
  );

  authHeaders(): Record<string, string> {
    const token = this.token();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

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
    const response = await firstValueFrom(
      this.http.post<AuthSessionResponse>(
        `${environment.apiUrl}/auth/admin/login`,
        input,
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
    if (!this.token() && !this.refreshToken()) {
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

  async createEmployer(name: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<{ employer: EmployerProfile; user: AuthUser }>(
        `${environment.apiUrl}/employers`,
        { name },
        { headers: this.authHeaders() },
      ),
    );
    const refresh = this.refreshToken();
    if (!this.token() || !refresh) return;
    this.persist(this.token()!, refresh, response.user, response.employer);
  }

  async logout(): Promise<void> {
    await this.unlinkPushDevice();
    try {
      if (this.token()) {
        await firstValueFrom(
          this.http.post(
            `${environment.apiUrl}/auth/logout`,
            {},
            { headers: this.authHeaders() },
          ),
        );
      }
    } finally {
      this.clearSession({ unlinkPush: false });
    }
  }

  clearSession(options?: { unlinkPush?: boolean }): void {
    if (options?.unlinkPush !== false) {
      void this.unlinkPushDevice();
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EMPLOYER_KEY);
    this.token.set(null);
    this.refreshToken.set(null);
    this.user.set(null);
    this.employer.set(null);
    this.sessionValidated.set(true);
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
    if (!this.token() && !this.refreshToken()) {
      this.sessionValidated.set(true);
      return;
    }
    await this.refreshMe();
  }

  private async fetchMe(): Promise<void> {
    const token = this.token();
    const refresh = this.refreshToken();
    if (!token) throw new Error('no_access_token');
    const response = await firstValueFrom(
      this.http.get<{ user: AuthUser; employer: EmployerProfile | null }>(
        `${environment.apiUrl}/auth/me`,
        { headers: this.authHeaders() },
      ),
    );
    if (refresh) {
      this.persist(token, refresh, response.user, response.employer);
    } else {
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      if (response.employer) {
        localStorage.setItem(EMPLOYER_KEY, JSON.stringify(response.employer));
      } else {
        localStorage.removeItem(EMPLOYER_KEY);
      }
      this.user.set(response.user);
      this.employer.set(response.employer);
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
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(REFRESH_KEY, response.refreshToken);
      this.token.set(response.token);
      this.refreshToken.set(response.refreshToken);
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
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (employer) localStorage.setItem(EMPLOYER_KEY, JSON.stringify(employer));
    else localStorage.removeItem(EMPLOYER_KEY);
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
