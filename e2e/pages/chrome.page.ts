import type { Page } from '@playwright/test';
import type { ClientKind } from '../helpers/env';

/** Guest / signed-in / role chrome assertions (xcron-ui-auth). */
export class ChromePage {
  constructor(
    readonly page: Page,
    readonly client: ClientKind,
  ) {}

  async openDrawerIfWeb(): Promise<void> {
    if (this.client !== 'web') return;
    const toggle = this.page
      .getByRole('button', { name: /Menu|Open menu|drawer/i })
      .or(this.page.locator('button.drawer-toggle, .top__menu, [aria-label*="menu" i]'))
      .first();
    if (await toggle.isVisible().catch(() => false)) {
      await toggle.click();
    }
  }

  navText(name: RegExp) {
    return this.page.getByRole('link', { name }).or(this.page.getByRole('button', { name }));
  }

  tabButton(name: RegExp) {
    return this.page.locator('ion-tab-button').filter({ hasText: name });
  }

  async guestShouldHideAuthChrome(): Promise<{ ok: boolean; issues: string[] }> {
    const issues: string[] = [];
    await this.openDrawerIfWeb();

    if (this.client === 'mobile') {
      if (await this.tabButton(/Notifications/i).isVisible().catch(() => false)) {
        issues.push('Guest sees Notifications tab');
      }
      if (await this.tabButton(/^Settings$/i).isVisible().catch(() => false)) {
        issues.push('Guest sees Settings tab');
      }
    } else {
      for (const label of [/Settings/i, /Notifications/i, /My Rating/i, /Applied jobs/i, /Saved jobs/i]) {
        const el = this.navText(label).first();
        if (await el.isVisible().catch(() => false)) {
          issues.push(`Guest drawer shows ${label}`);
        }
      }
    }
    return { ok: issues.length === 0, issues };
  }

  async seekerShouldHideRecruiterChrome(): Promise<{ ok: boolean; issues: string[] }> {
    const issues: string[] = [];
    await this.openDrawerIfWeb();
    if (this.client === 'mobile') {
      if (await this.tabButton(/^Post$/i).isVisible().catch(() => false)) {
        // Post may appear for employer only; seeker must not see it.
        issues.push('Seeker sees Post tab');
      }
    }
    return { ok: issues.length === 0, issues };
  }

  async recruiterShouldHideSeekerChrome(): Promise<{ ok: boolean; issues: string[] }> {
    const issues: string[] = [];
    await this.openDrawerIfWeb();
    if (this.client === 'web') {
      for (const label of [/Applied jobs/i, /Saved jobs/i]) {
        const el = this.navText(label).first();
        if (await el.isVisible().catch(() => false)) {
          issues.push(`Recruiter drawer shows ${label}`);
        }
      }
    }
    return { ok: issues.length === 0, issues };
  }
}
