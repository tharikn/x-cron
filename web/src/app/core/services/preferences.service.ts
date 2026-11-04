import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface WebPreferences {
  locations: string[];
  categories: string[];
  jobTypes: string[];
  languages: string[];
  salaryMin: number | null;
  remotePreferred: boolean;
  sort: string;
  notifyEmail: boolean;
}

const KEY = 'xcron.web.preferences';

const DEFAULTS: WebPreferences = {
  locations: [],
  categories: [],
  jobTypes: [],
  languages: ['en'],
  salaryMin: null,
  remotePreferred: false,
  sort: 'newest',
  notifyEmail: false,
};

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  readonly prefs = signal<WebPreferences>(this.read());

  save(next: WebPreferences): void {
    this.prefs.set({ ...DEFAULTS, ...next });
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(KEY, JSON.stringify(this.prefs()));
    }
  }

  async saveAndSync(next: WebPreferences): Promise<void> {
    this.save(next);
    if (!this.auth.isSignedIn()) return;
    await firstValueFrom(
      this.http.put(
        `${environment.apiUrl}/me/preferences`,
        {
          locations: next.locations,
          categories: next.categories,
          jobTypes: next.jobTypes,
          languages: next.languages,
          salaryMin: next.salaryMin,
          remotePreferred: next.remotePreferred,
          sort: next.sort,
        },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  async hydrateFromApi(): Promise<void> {
    if (!this.auth.isSignedIn()) return;
    try {
      const remote = await firstValueFrom(
        this.http.get<Partial<WebPreferences>>(
          `${environment.apiUrl}/me/preferences`,
          { headers: this.auth.authHeaders() },
        ),
      );
      this.save({
        ...this.prefs(),
        locations: remote.locations ?? this.prefs().locations,
        categories: remote.categories ?? this.prefs().categories,
        jobTypes: remote.jobTypes ?? this.prefs().jobTypes,
        languages: remote.languages ?? this.prefs().languages,
        salaryMin: remote.salaryMin ?? this.prefs().salaryMin,
        remotePreferred: !!remote.remotePreferred,
        sort: remote.sort || this.prefs().sort,
      });
    } catch {
      // keep local
    }
  }

  clear(): void {
    this.save({ ...DEFAULTS });
  }

  private read(): WebPreferences {
    if (!isPlatformBrowser(this.platformId)) return { ...DEFAULTS };
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ...DEFAULTS };
      return { ...DEFAULTS, ...(JSON.parse(raw) as WebPreferences) };
    } catch {
      return { ...DEFAULTS };
    }
  }
}
