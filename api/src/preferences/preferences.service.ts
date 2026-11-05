import { Injectable } from '@nestjs/common';
import { AuthUser } from '../auth/auth.types';
import {
  PreferenceInput,
  PreferenceRecord,
  ThemePreference,
} from './preferences.types';

const THEMES: ThemePreference[] = ['system', 'light', 'dark', 'warm'];

const DEFAULTS: Omit<PreferenceRecord, 'updatedAt'> = {
  locations: [],
  jobTypes: [],
  categories: [],
  languages: ['en', 'ta'],
  salaryMin: null,
  remotePreferred: false,
  interfaceLocale: 'en',
  sort: 'newest',
  theme: 'system',
};

function normalizeTheme(value: unknown): ThemePreference {
  return THEMES.includes(value as ThemePreference)
    ? (value as ThemePreference)
    : 'system';
}

@Injectable()
export class PreferencesService {
  private readonly byDevice = new Map<string, PreferenceRecord>();
  private readonly byUser = new Map<string, PreferenceRecord>();

  saveGuest(deviceId: string, input: PreferenceInput): PreferenceRecord {
    return this.write(this.byDevice, deviceId, input);
  }

  getGuest(deviceId: string): PreferenceRecord {
    return this.read(this.byDevice, deviceId);
  }

  saveForUser(user: AuthUser, input: PreferenceInput): PreferenceRecord {
    return this.write(this.byUser, user.id, input);
  }

  getForUser(user: AuthUser): PreferenceRecord {
    return this.read(this.byUser, user.id);
  }

  /**
   * Merge guest device preferences into the signed-in account (account wins on conflicts).
   */
  claimDevice(user: AuthUser, deviceId: string): PreferenceRecord {
    const guest = this.byDevice.get(deviceId);
    const account = this.byUser.get(user.id);
    if (!guest && !account) {
      return this.write(this.byUser, user.id, {});
    }
    if (!guest) {
      return account!;
    }
    if (!account) {
      const claimed = this.write(this.byUser, user.id, guest);
      this.byDevice.delete(deviceId);
      return claimed;
    }
    const merged: PreferenceInput = {
      locations: account.locations.length ? account.locations : guest.locations,
      jobTypes: account.jobTypes.length ? account.jobTypes : guest.jobTypes,
      categories: account.categories.length
        ? account.categories
        : guest.categories,
      languages: account.languages.length ? account.languages : guest.languages,
      salaryMin:
        account.salaryMin != null ? account.salaryMin : guest.salaryMin,
      remotePreferred: account.remotePreferred || guest.remotePreferred,
      interfaceLocale: account.interfaceLocale || guest.interfaceLocale,
      sort: account.sort || guest.sort,
      theme: account.theme || guest.theme,
    };
    const next = this.write(this.byUser, user.id, merged);
    this.byDevice.delete(deviceId);
    return next;
  }

  clearForUser(user: AuthUser): PreferenceRecord {
    this.byUser.delete(user.id);
    return this.read(this.byUser, user.id);
  }

  /** Used by notification matcher — all accounts with saved location/job filters. */
  listUserPreferences(): Array<{ userId: string; preferences: PreferenceRecord }> {
    return [...this.byUser.entries()].map(([userId, preferences]) => ({
      userId,
      preferences,
    }));
  }

  private read(
    map: Map<string, PreferenceRecord>,
    key: string,
  ): PreferenceRecord {
    return (
      map.get(key) ?? {
        ...DEFAULTS,
        updatedAt: new Date(0).toISOString(),
      }
    );
  }

  private write(
    map: Map<string, PreferenceRecord>,
    key: string,
    input: PreferenceInput,
  ): PreferenceRecord {
    const existing = this.read(map, key);
    const next: PreferenceRecord = {
      locations: input.locations ?? existing.locations,
      jobTypes: input.jobTypes ?? existing.jobTypes,
      categories: input.categories ?? existing.categories,
      languages: input.languages ?? existing.languages,
      salaryMin:
        input.salaryMin !== undefined ? input.salaryMin : existing.salaryMin,
      remotePreferred:
        input.remotePreferred !== undefined
          ? input.remotePreferred
          : existing.remotePreferred,
      interfaceLocale: input.interfaceLocale ?? existing.interfaceLocale,
      sort: input.sort ?? existing.sort,
      theme:
        input.theme !== undefined
          ? normalizeTheme(input.theme)
          : normalizeTheme(existing.theme),
      updatedAt: new Date().toISOString(),
    };
    map.set(key, next);
    return next;
  }
}
