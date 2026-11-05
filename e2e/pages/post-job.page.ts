import type { Page } from '@playwright/test';
import type { ClientKind } from '../helpers/env';
import { pathsFor } from '../helpers/env';

export class PostJobPage {
  constructor(
    readonly page: Page,
    readonly client: ClientKind,
  ) {}

  async goto(): Promise<void> {
    await this.page.goto(pathsFor(this.client).post);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillCompose(opts: {
    title: string;
    employerName: string;
    city: string;
    salary?: string;
    description?: string;
    phone?: string;
  }): Promise<void> {
    // Prefer labelled / stacked ion-inputs; fall back to sequential fills.
    await this.fillByLabel(/Job title|Title/i, opts.title);
    await this.fillByLabel(/Employer|Company/i, opts.employerName);
    const cityInput = this.page
      .getByPlaceholder(/City or district/i)
      .or(this.page.locator('input[placeholder*="City" i]'))
      .first();
    if (await cityInput.count()) {
      await cityInput.fill(opts.city);
    }
    if (opts.salary) {
      await this.fillByLabel(/Salary/i, opts.salary);
    }
    const desc = this.page.locator('ion-textarea textarea, textarea').first();
    if (await desc.count()) {
      await desc.fill(
        opts.description ||
          'Playwright recruiter desk post. Full-time role with growth path.',
      );
    }
    if (opts.phone) {
      await this.fillByLabel(/Phone/i, opts.phone);
    }
  }

  private async fillByLabel(label: RegExp, value: string): Promise<void> {
    const ion = this.page
      .locator('ion-input')
      .filter({ hasText: label })
      .locator('input')
      .first();
    if (await ion.count()) {
      await ion.fill(value);
      return;
    }
    const labelled = this.page.getByLabel(label);
    if (await labelled.count()) {
      const el = labelled.first();
      const tag = await el.evaluate((n) => n.tagName.toLowerCase());
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        await el.fill(value);
        return;
      }
    }
    // Web forms: label span + input
    const row = this.page.locator('label, .field, .form-row').filter({ hasText: label });
    const input = row.locator('input:not([type="radio"]):not([type="checkbox"]), textarea').first();
    if (await input.count()) {
      await input.fill(value);
    }
  }

  async goToPreview(): Promise<void> {
    const preview = this.page.getByRole('button', { name: /Preview/i });
    if (await preview.count()) {
      await preview.first().click();
    }
  }

  async publish(): Promise<void> {
    // Recruiter desk confirm may show alert “did you preview?”
    const publish = this.page.getByRole('button', {
      name: /Publish|Post job|Post live|Confirm/i,
    });
    await publish.first().click();
    const alertOk = this.page.getByRole('button', { name: /Yes|OK|Publish|Confirm/i });
    if (await alertOk.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await alertOk.first().click();
    }
  }
}
