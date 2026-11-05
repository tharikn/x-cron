import { Injectable, inject, signal } from '@angular/core';
import { PreferencesService } from './preferences.service';
import { AuthService } from './auth.service';

export type ThemePreference = 'system' | 'light' | 'dark' | 'warm';
export type ResolvedTheme = 'light' | 'dark' | 'warm';

const KEY = 'xcron.theme';
const VALID: ThemePreference[] = ['system', 'light', 'dark', 'warm'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly prefs = inject(PreferencesService);
  private readonly auth = inject(AuthService);
  private mediaQuery: MediaQueryList | null = null;

  readonly preference = signal<ThemePreference>(this.read());
  readonly resolved = signal<ResolvedTheme>('dark');

  /** Apply local preference immediately. */
  init(): void {
    this.apply(this.preference());
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQuery.addEventListener('change', () => {
      if (this.preference() === 'system') {
        this.apply('system');
      }
    });
  }

  /** Pull theme from hydrated account preferences after sign-in. */
  syncFromRemote(theme: string | undefined | null): void {
    if (!theme || !VALID.includes(theme as ThemePreference)) return;
    const next = theme as ThemePreference;
    this.preference.set(next);
    localStorage.setItem(KEY, next);
    this.apply(next);
  }

  async setPreference(next: ThemePreference): Promise<void> {
    if (!VALID.includes(next)) return;
    this.preference.set(next);
    localStorage.setItem(KEY, next);
    this.apply(next);
    if (!this.auth.isSignedIn()) return;
    await this.prefs.save({ theme: next });
  }

  labelKey(pref: ThemePreference): string {
    return `theme.${pref}`;
  }

  hintKey(pref: ThemePreference): string {
    return `theme.${pref}Hint`;
  }

  private apply(pref: ThemePreference): void {
    const resolved = this.resolve(pref);
    this.resolved.set(resolved);
    const root = document.documentElement;
    root.dataset['theme'] = resolved;
    root.style.colorScheme = resolved === 'dark' ? 'dark' : 'light';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute(
        'content',
        resolved === 'dark' ? '#070412' : resolved === 'warm' ? '#f6efe6' : '#f7f5fc',
      );
    }
  }

  private resolve(pref: ThemePreference): ResolvedTheme {
    if (pref === 'light' || pref === 'dark' || pref === 'warm') return pref;
    const dark =
      this.mediaQuery?.matches ??
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    return dark ? 'dark' : 'light';
  }

  private read(): ThemePreference {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw && VALID.includes(raw as ThemePreference)) {
        return raw as ThemePreference;
      }
    } catch {
      // ignore
    }
    return 'system';
  }
}
