import { test as base, expect } from '@playwright/test';
import type { ClientKind } from '../helpers/env';
import { MOBILE_BASE } from '../helpers/env';
import {
  closeAndroidDevice,
  openAndroidChrome,
} from '../helpers/android-device';
import { skipThemePrompt } from '../helpers/theme-prompt';
import { AuthPage } from '../pages/auth.page';
import { ChromePage } from '../pages/chrome.page';
import { CompanyPage } from '../pages/company.page';
import { DiscoverPage } from '../pages/discover.page';
import { JobDetailPage } from '../pages/job-detail.page';
import { PostJobPage } from '../pages/post-job.page';

type Fixtures = {
  client: ClientKind;
  auth: AuthPage;
  discover: DiscoverPage;
  jobDetail: JobDetailPage;
  postJob: PostJobPage;
  company: CompanyPage;
  chrome: ChromePage;
};

export const test = base.extend<Fixtures>({
  client: [
    async ({}, use, testInfo) => {
      const project = testInfo.project.name;
      // android + mobile share Ionic routes / client chrome rules
      const client: ClientKind = project.startsWith('web') ? 'web' : 'mobile';
      await use(client);
    },
    { scope: 'test' },
  ],

  page: async ({ page }, use, testInfo) => {
    if (testInfo.project.name !== 'android') {
      await skipThemePrompt(page);
      await use(page);
      return;
    }

    // Desktop Chromium was launched for the project shell — replace with Android Chrome.
    await page.context().browser()?.close().catch(() => undefined);

    const session = await openAndroidChrome(MOBILE_BASE);
    await skipThemePrompt(session.page);
    await use(session.page);
    await session.close();
    await closeAndroidDevice(session.device);
  },

  auth: async ({ page, client }, use) => {
    await use(new AuthPage(page, client));
  },
  discover: async ({ page, client }, use) => {
    await use(new DiscoverPage(page, client));
  },
  jobDetail: async ({ page, client }, use) => {
    await use(new JobDetailPage(page, client));
  },
  postJob: async ({ page, client }, use) => {
    await use(new PostJobPage(page, client));
  },
  company: async ({ page, client }, use) => {
    await use(new CompanyPage(page, client));
  },
  chrome: async ({ page, client }, use) => {
    await use(new ChromePage(page, client));
  },
});

export { expect };
