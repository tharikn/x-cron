import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  id: string;
  roles: Array<'seeker' | 'employer' | 'admin'>;
  email?: string;
  displayName?: string;
}

const TOKEN_KEY = 'xcron.web.authToken';
const USER_KEY = 'xcron.web.authUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly token = signal<string | null>(this.read(TOKEN_KEY));
  readonly user = signal<AuthUser | null>(this.readJson<AuthUser>(USER_KEY));
  readonly isSignedIn = computed(() => !!this.token() && !!this.user());
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
      this.http.post<{ token: string; user: AuthUser }>(
        `${environment.apiUrl}/auth/google`,
        input,
      ),
    );
    this.persist(response.token, response.user);
  }

  async signInAsAdmin(input: { email: string; password: string }): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<{ token: string; user: AuthUser }>(
        `${environment.apiUrl}/auth/admin/login`,
        input,
      ),
    );
    this.persist(response.token, response.user);
  }

  logout(): void {
    this.token.set(null);
    this.user.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  private persist(token: string, user: AuthUser): void {
    this.token.set(token);
    this.user.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, token);
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
