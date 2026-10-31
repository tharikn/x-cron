import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
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

const TOKEN_KEY = 'xcron.authToken';
const USER_KEY = 'xcron.authUser';
const EMPLOYER_KEY = 'xcron.employer';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly user = signal<AuthUser | null>(this.readJson<AuthUser>(USER_KEY));
  readonly employer = signal<EmployerProfile | null>(
    this.readJson<EmployerProfile>(EMPLOYER_KEY),
  );

  readonly isSignedIn = computed(() => !!this.token() && !!this.user());
  readonly isEmployer = computed(
    () =>
      !!this.user()?.roles.includes('employer') ||
      !!this.user()?.roles.includes('admin') ||
      !!this.employer(),
  );
  readonly isAdmin = computed(() => !!this.user()?.roles.includes('admin'));

  authHeaders(): Record<string, string> {
    const token = this.token();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async signInWithGoogle(input: {
    idToken?: string;
    email?: string;
    displayName?: string;
  }): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<{
        token: string;
        user: AuthUser;
        employer: EmployerProfile | null;
      }>(`${environment.apiUrl}/auth/google`, input),
    );
    this.persist(response.token, response.user, response.employer);
  }

  async signInAsAdmin(input: { email: string; password: string }): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<{
        token: string;
        user: AuthUser;
        employer: EmployerProfile | null;
      }>(`${environment.apiUrl}/auth/admin/login`, input),
    );
    this.persist(response.token, response.user, response.employer);
  }

  async refreshMe(): Promise<void> {
    if (!this.token()) return;
    try {
      const response = await firstValueFrom(
        this.http.get<{ user: AuthUser; employer: EmployerProfile | null }>(
          `${environment.apiUrl}/auth/me`,
          { headers: this.authHeaders() },
        ),
      );
      this.persist(this.token()!, response.user, response.employer);
    } catch {
      this.clear();
    }
  }

  async createEmployer(name: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<{ employer: EmployerProfile; user: AuthUser }>(
        `${environment.apiUrl}/employers`,
        { name },
        { headers: this.authHeaders() },
      ),
    );
    this.persist(this.token()!, response.user, response.employer);
  }

  async logout(): Promise<void> {
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
      this.clear();
    }
  }

  private persist(
    token: string,
    user: AuthUser,
    employer: EmployerProfile | null,
  ): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (employer) localStorage.setItem(EMPLOYER_KEY, JSON.stringify(employer));
    else localStorage.removeItem(EMPLOYER_KEY);
    this.token.set(token);
    this.user.set(user);
    this.employer.set(employer);
  }

  private clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EMPLOYER_KEY);
    this.token.set(null);
    this.user.set(null);
    this.employer.set(null);
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
