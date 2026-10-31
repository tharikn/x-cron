import { Injectable, computed, signal } from '@angular/core';
import {
  DEFAULT_PREFERENCES,
  type UserPreferences,
} from '../models/job.model';

const PREFS_KEY = 'xcron.preferences';
const PROMPT_DISMISSED_KEY = 'xcron.prefPromptDismissed';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  readonly preferences = signal<UserPreferences>(this.readPreferences());
  readonly promptDismissed = signal(this.readDismissed());

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

  shouldShowPrompt(searchCount: number): boolean {
    return searchCount >= 3 && !this.promptDismissed() && !this.hasSavedPreferences();
  }

  save(partial: Partial<UserPreferences>): void {
    const next = { ...this.preferences(), ...partial };
    this.preferences.set(next);
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  }

  clear(): void {
    this.preferences.set({ ...DEFAULT_PREFERENCES });
    localStorage.removeItem(PREFS_KEY);
  }

  dismissPrompt(): void {
    this.promptDismissed.set(true);
    localStorage.setItem(PROMPT_DISMISSED_KEY, '1');
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
