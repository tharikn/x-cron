import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const REFRESH_KEY = 'xcron.sessionRefresh';

/**
 * Refresh-token vault.
 * Native Capacitor: `@capacitor/preferences` only (never leave refresh in
 * WebView `localStorage`). Browser: sessionStorage + localStorage so a tab
 * restart can still call `/auth/refresh` when cookies are cross-origin.
 */
@Injectable({ providedIn: 'root' })
export class TokenVaultService {
  async writeRefresh(token: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({ key: REFRESH_KEY, value: token });
      this.scrubWebStorage();
      return;
    }
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(REFRESH_KEY, token);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(REFRESH_KEY, token);
    }
  }

  async readRefresh(): Promise<string | null> {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key: REFRESH_KEY });
      if (value) {
        this.scrubWebStorage();
        return value;
      }
      // One-time migrate from older APK builds that wrote localStorage.
      const legacy = this.readWebStorage();
      if (legacy) {
        await Preferences.set({ key: REFRESH_KEY, value: legacy });
        this.scrubWebStorage();
        return legacy;
      }
      return null;
    }
    return this.readWebStorage();
  }

  async clearRefresh(): Promise<void> {
    this.scrubWebStorage();
    if (Capacitor.isNativePlatform()) {
      await Preferences.remove({ key: REFRESH_KEY });
    }
  }

  private readWebStorage(): string | null {
    if (typeof sessionStorage !== 'undefined') {
      const fromSession = sessionStorage.getItem(REFRESH_KEY);
      if (fromSession) return fromSession;
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(REFRESH_KEY);
    }
    return null;
  }

  private scrubWebStorage(): void {
    try {
      sessionStorage?.removeItem(REFRESH_KEY);
      localStorage?.removeItem(REFRESH_KEY);
    } catch {
      // private mode / SSR
    }
  }
}
