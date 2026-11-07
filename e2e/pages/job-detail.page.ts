import type { Page } from '@playwright/test';
import type { ClientKind } from '../helpers/env';
import { pathsFor } from '../helpers/env';

export class JobDetailPage {
  constructor(
    readonly page: Page,
    readonly client: ClientKind,
  ) {}

  async goto(jobId: string): Promise<void> {
    await this.page.goto(pathsFor(this.client).job(jobId));
    await this.page.waitForLoadState('domcontentloaded');
  }

  easyApply(): ReturnType<Page['getByRole']> {
    return this.page.getByRole('button', { name: /Easy apply/i });
  }

  saveButton(): ReturnType<Page['getByRole']> {
    return this.page.getByRole('button', { name: /Save/i });
  }

  contactBlock(): ReturnType<Page['locator']> {
    return this.page
      .getByText(/Phone|WhatsApp|Email|Website|Contact/i)
      .first();
  }

  async easyApplyClick(): Promise<void> {
    // Ionic ion-button animates; force avoids "element is not stable" on mobile.
    await this.easyApply().click({ force: true, timeout: 20_000 });
  }
}
