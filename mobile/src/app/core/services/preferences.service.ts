import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DEFAULT_PREFERENCES,
  type UserPreferences,
} from '../models/job.model';
import { AuthService } from './auth.service';

const PREFS_KEY = 'xcron.preferences';
const PROMPT_DISMISSED_KEY = 'xcron.prefPromptDismissed';
const DEVICE_ID_KEY = 'xcron.deviceId';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  readonly preferences = signal<UserPreferences>(this.readPreferences());
  readonly promptDismissed = signal(this.readDismissed());
  readonly syncScope = signal<'local' | 'device' | 'account'>('local');
  readonly lastSyncedAt = signal<string | null>(null);

  readonly hasSavedPreferences = computed(() => {
    const prefs = this.preferences();
    return (
      prefs.locations.length > 0 ||
      prefs.jobTypes.length > 0 ||
      prefs.categories.length > 0 ||
      prefs.salaryMin != null ||
      prefs.remotePreferred
    );
  });

  deviceId(): string {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = `web_${crypto.randomUUID?.() ?? String(Date.now())}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  }

  shouldShowPrompt(searchCount: number): boolean {
    return searchCount >= 3 && !this.promptDismissed() && !this.hasSavedPreferences();
  }

  async hydrate(): Promise<void> {
    if (this.auth.isSignedIn()) {
      try {
        await this.claimAndPull();
        return;
      } catch {
        // fall through to device/local
      }
    }
    try {
      const remote = await firstValueFrom(
        this.http.get<UserPreferences & { scope?: string; updatedAt?: string }>(
          `${environment.apiUrl}/preferences`,
          { params: { deviceId: this.deviceId() } },
        ),
      );
      this.applyRemote(remote, 'device');
    } catch {
      this.syncScope.set('local');
    }
  }

  async save(partial: Partial<UserPreferences>): Promise<void> {
    const next = { ...this.preferences(), ...partial };
    this.preferences.set(next);
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));

    if (this.auth.isSignedIn()) {
      const remote = await firstValueFrom(
        this.http.put<UserPreferences & { updatedAt?: string }>(
          `${environment.apiUrl}/me/preferences`,
          next,
          { headers: this.auth.authHeaders() },
        ),
      );
      this.applyRemote({ ...next, ...remote }, 'account');
      return;
    }

    try {
      const remote = await firstValueFrom(
        this.http.post<UserPreferences & { updatedAt?: string }>(
          `${environment.apiUrl}/preferences`,
          { deviceId: this.deviceId(), ...next },
        ),
      );
      this.applyRemote({ ...next, ...remote }, 'device');
    } catch {
      this.syncScope.set('local');
    }
  }

  async clear(): Promise<void> {
    this.preferences.set({ ...DEFAULT_PREFERENCES });
    localStorage.removeItem(PREFS_KEY);
    if (this.auth.isSignedIn()) {
      try {
        await firstValueFrom(
          this.http.delete(`${environment.apiUrl}/me/preferences`, {
            headers: this.auth.authHeaders(),
          }),
        );
        this.syncScope.set('account');
        this.lastSyncedAt.set(new Date().toISOString());
      } catch {
        this.syncScope.set('local');
      }
      return;
    }
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/preferences`, {
          deviceId: this.deviceId(),
          ...DEFAULT_PREFERENCES,
        }),
      );
      this.syncScope.set('device');
    } catch {
      this.syncScope.set('local');
    }
  }

  dismissPrompt(): void {
    this.promptDismissed.set(true);
    localStorage.setItem(PROMPT_DISMISSED_KEY, '1');
  }

  private async claimAndPull(): Promise<void> {
    await firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/me/preferences/claim`,
        { deviceId: this.deviceId() },
        { headers: this.auth.authHeaders() },
      ),
    );
    const remote = await firstValueFrom(
      this.http.get<UserPreferences & { updatedAt?: string }>(
        `${environment.apiUrl}/me/preferences`,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.applyRemote(remote, 'account');
  }

  private applyRemote(
    remote: Partial<UserPreferences> & { updatedAt?: string },
    scope: 'device' | 'account',
  ): void {
    const next: UserPreferences = {
      ...DEFAULT_PREFERENCES,
      locations: remote.locations ?? [],
      jobTypes: (remote.jobTypes as UserPreferences['jobTypes']) ?? [],
      categories: remote.categories ?? [],
      languages: (remote.languages as UserPreferences['languages']) ?? ['en', 'ta'],
      salaryMin: remote.salaryMin ?? null,
      remotePreferred: !!remote.remotePreferred,
      interfaceLocale:
        typeof remote.interfaceLocale === 'string' && remote.interfaceLocale.trim()
          ? remote.interfaceLocale.trim()
          : 'en',
    };
    this.preferences.set(next);
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    this.syncScope.set(scope);
    this.lastSyncedAt.set(remote.updatedAt ?? new Date().toISOString());
  }

  private readPreferences(): UserPreferences {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) {
        return { ...DEFAULT_PREFERENCES };
      }
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  private readDismissed(): boolean {
    return localStorage.getItem(PROMPT_DISMISSED_KEY) === '1';
  }
}
