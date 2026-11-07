import type { Page } from '@playwright/test';
import type { ClientKind } from '../helpers/env';
import { pathsFor } from '../helpers/env';
import { dismissThemePromptIfOpen } from '../helpers/theme-prompt';

/** Company workspace (web `/company`, mobile `/tabs/company`). */
export class CompanyPage {
  constructor(
    readonly page: Page,
    readonly client: ClientKind,
  ) {}

  async goto(): Promise<void> {
    const path = pathsFor(this.client).company;
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await dismissThemePromptIfOpen(this.page);
    // SPA soft-nav can leave Account hub if the lazy chunk fails — retry once.
    const onCompany = /\/(?:tabs\/)?company/.test(this.page.url());
    if (!onCompany || !(await this.workspaceBody().isVisible().catch(() => false))) {
      await this.page.goto(path, { waitUntil: 'domcontentloaded' });
      await dismissThemePromptIfOpen(this.page);
    }
  }

  /**
   * Web uses h1 "Company workspace"; mobile uses ion-title "Company"
   * plus Dashboard / verification chrome.
   */
  heading() {
    return this.page
      .getByRole('heading', { name: /Company workspace|^Company$/i })
      .or(this.page.locator('ion-title').filter({ hasText: /^Company$/i }))
      .or(this.page.getByText(/Company workspace|Manage your company profile/i))
      .first();
  }

  /** Stable body chrome once the workspace has loaded (either client). */
  workspaceBody() {
    return this.page
      .locator('.cw__tabs, nav[aria-label="Company sections"]')
      .getByRole('button', { name: /^Dashboard$/i })
      .first();
  }

  /** Prefer company section tabs — avoid Account hub Profile/Activity segments. */
  tab(name: RegExp) {
    return this.page
      .locator('.cw__tabs, nav[aria-label="Company sections"]')
      .getByRole('button', { name })
      .first();
  }

  async openTab(tab: 'dashboard' | 'profile' | 'team' | 'verification'): Promise<void> {
    const labels: Record<typeof tab, RegExp> = {
      dashboard: /^Dashboard$/i,
      profile: /^Profile$/i,
      team: /^Team$/i,
      verification: /^(Verification|Verify)$/i,
    };
    await this.workspaceBody().waitFor({ state: 'visible', timeout: 25_000 });
    await this.tab(labels[tab]).click();
  }
}
