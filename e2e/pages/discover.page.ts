import type { Page } from '@playwright/test';
import type { ClientKind } from '../helpers/env';
import { pathsFor } from '../helpers/env';

export class DiscoverPage {
  constructor(
    readonly page: Page,
    readonly client: ClientKind,
  ) {}

  async goto(): Promise<void> {
    await this.page.goto(pathsFor(this.client).home);
    await this.page.waitForLoadState('domcontentloaded');
  }

  brand(): ReturnType<Page['getByText']> {
    return this.page.getByText('X Cron').first();
  }

  jobCards(): ReturnType<Page['locator']> {
    return this.page.locator(
      'article, .job-card, app-job-card, a[href*="/jobs/"], a[href*="/tabs/jobs/"]',
    );
  }

  async openFirstJob(): Promise<void> {
    const link = this.page
      .locator('a[href*="/jobs/"], a[href*="/tabs/jobs/"]')
      .or(this.page.getByRole('link', { name: /View role|Open/i }))
      .first();
    await link.click();
  }

  async search(query: string): Promise<void> {
    const search = this.page
      .locator('ion-searchbar input')
      .or(this.page.locator('form.search input').first())
      .or(this.page.getByRole('searchbox'))
      .or(this.page.locator('input[type="search"], input[placeholder*="Search" i], input[placeholder*="keyword" i]'))
      .first();
    await search.waitFor({ state: 'visible', timeout: 15_000 });
    await search.fill(query);
    await search.press('Enter').catch(async () => {
      await this.page.locator('form.search button[type="submit"], .search__go').first().click();
    });
  }
}
