import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import type { SeekerProfile } from './seeker.service';

const THEME_PROMPT_KEY = 'xcron.web.themePromptDone';
const PORTAL_CHOICE_KEY = 'xcron.web.portalChoiceDone';
const PROFILE_REMIND_KEY = 'xcron.web.profileRemindUntil';
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
  private readonly platformId = inject(PLATFORM_ID);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly themePromptOpen = signal(false);
  readonly portalChoiceOpen = signal(false);

  /** First-open portal choice prompt (Jobs vs Resume Builder). */
  needsPortalChoice(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    try {
      return localStorage.getItem(PORTAL_CHOICE_KEY) !== '1';
    } catch {
      return true;
    }
  }

  openPortalChoiceIfNeeded(): void {
    if (this.needsPortalChoice()) {
      this.portalChoiceOpen.set(true);
    }
  }

  completePortalChoice(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(PORTAL_CHOICE_KEY, '1');
      } catch {
        // ignore
      }
    }
    this.portalChoiceOpen.set(false);
  }

  /** Theme chooser for every new browser session. */
  needsThemePrompt(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    try {
      return sessionStorage.getItem(THEME_PROMPT_KEY) !== '1';
    } catch {
      return true;
    }
  }

  /**
   * Published portfolio URLs are standalone sites. Never interrupt a visitor
   * (or the editor's "Open live site" tab) with the app-level theme chooser.
   */
  private isPublicPortfolioRoute(): boolean {
    const isPublicPath = (path: string): boolean =>
      /^\/p\/[^/]+(?:\/|$)/.test(path.split('?')[0] ?? '');
    if (isPublicPath(this.router.url)) return true;
    // Initial navigation may still be pending when onboarding starts.
    return isPlatformBrowser(this.platformId)
      ? isPublicPath(window.location.pathname)
      : false;
  }

  openThemePromptIfNeeded(): void {
    if (this.isPublicPortfolioRoute()) return;
    if (this.needsThemePrompt()) {
      this.themePromptOpen.set(true);
    }
  }

  completeThemePrompt(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        sessionStorage.setItem(THEME_PROMPT_KEY, '1');
      } catch {
        // ignore
      }
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
    if (!isPlatformBrowser(this.platformId)) return false;
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
    if (!isPlatformBrowser(this.platformId)) return;
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
    if (!isPlatformBrowser(this.platformId)) return;
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
