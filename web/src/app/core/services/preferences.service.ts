import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export interface WebPreferences {
  locations: string[];
  categories: string[];
  notifyEmail: boolean;
}

const KEY = 'xcron.web.preferences';

const DEFAULTS: WebPreferences = {
  locations: [],
  categories: [],
  notifyEmail: false,
};

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly prefs = signal<WebPreferences>(this.read());

  save(next: WebPreferences): void {
    this.prefs.set({
      locations: [...next.locations],
      categories: [...next.categories],
      notifyEmail: next.notifyEmail,
    });
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(KEY, JSON.stringify(this.prefs()));
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
