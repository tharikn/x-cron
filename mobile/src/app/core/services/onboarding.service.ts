import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import type { SeekerProfile } from './seeker.service';

const THEME_PROMPT_KEY = 'xcron.themePromptDone';
const PROFILE_REMIND_KEY = 'xcron.profileRemindUntil';
/** Soft snooze after Remind later — inbox nudges still fire. */
const REMIND_MS = 24 * 60 * 60 * 1000;

export type ProfileSetupStep = 'personal' | 'location' | 'career' | 'skills';

export const PROFILE_SETUP_STEPS: ProfileSetupStep[] = [
  'personal',
  'location',
  'career',
  'skills',
];

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private readonly auth = inject(AuthService);

  readonly themePromptOpen = signal(false);

  /** First-open theme chooser for guests and signed-in users. */
  needsThemePrompt(): boolean {
    try {
      return localStorage.getItem(THEME_PROMPT_KEY) !== '1';
    } catch {
      return true;
    }
  }

  openThemePromptIfNeeded(): void {
    if (this.needsThemePrompt()) {
      this.themePromptOpen.set(true);
    }
  }

  completeThemePrompt(): void {
    try {
      localStorage.setItem(THEME_PROMPT_KEY, '1');
    } catch {
      // ignore
    }
    this.themePromptOpen.set(false);
  }

  /** Matches API profile_complete nudge criteria. */
  isProfileComplete(
    profile: Pick<
      SeekerProfile,
      'experienceBand' | 'skills' | 'preferredCities' | 'careerStage'
    > | null | undefined,
  ): boolean {
    if (!profile) return false;
    const band =
      profile.experienceBand ||
      (profile.careerStage === 'fresher' ? 'fresher' : undefined);
    return Boolean(
      band &&
        (profile.skills?.length ?? 0) > 0 &&
        (profile.preferredCities?.length ?? 0) > 0,
    );
  }

  isRemindLaterActive(): boolean {
    try {
      const raw = localStorage.getItem(PROFILE_REMIND_KEY);
      if (!raw) return false;
      const until = Date.parse(raw);
      if (Number.isNaN(until)) return false;
      return Date.now() < until;
    } catch {
      return false;
    }
  }

  remindLater(): void {
    try {
      localStorage.setItem(
        PROFILE_REMIND_KEY,
        new Date(Date.now() + REMIND_MS).toISOString(),
      );
    } catch {
      // ignore
    }
  }

  clearRemindLater(): void {
    try {
      localStorage.removeItem(PROFILE_REMIND_KEY);
    } catch {
      // ignore
    }
  }

  /**
   * Seeker-only mandatory setup when incomplete and not snoozed.
   * Employers / admins skip.
   */
  shouldForceProfileSetup(
    profile: Pick<
      SeekerProfile,
      'experienceBand' | 'skills' | 'preferredCities' | 'careerStage'
    > | null | undefined,
  ): boolean {
    if (!this.auth.isSignedIn()) return false;
    if (this.auth.isEmployer() || this.auth.isAdmin()) return false;
    if (this.isRemindLaterActive()) return false;
    return !this.isProfileComplete(profile);
  }

  progressPercent(step: ProfileSetupStep): number {
    const index = PROFILE_SETUP_STEPS.indexOf(step);
    if (index < 0) return 0;
    return Math.round(((index + 1) / PROFILE_SETUP_STEPS.length) * 100);
  }

  stepLabelKey(step: ProfileSetupStep): string {
    return `onboarding.step.${step}`;
  }
}
