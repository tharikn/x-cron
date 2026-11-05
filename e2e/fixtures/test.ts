import { test as base, expect } from '@playwright/test';
import type { ClientKind } from '../helpers/env';
import { AuthPage } from '../pages/auth.page';
import { ChromePage } from '../pages/chrome.page';
import { DiscoverPage } from '../pages/discover.page';
import { JobDetailPage } from '../pages/job-detail.page';
import { PostJobPage } from '../pages/post-job.page';

type Fixtures = {
  client: ClientKind;
  auth: AuthPage;
  discover: DiscoverPage;
  jobDetail: JobDetailPage;
  postJob: PostJobPage;
  chrome: ChromePage;
};

export const test = base.extend<Fixtures>({
  client: [
    async ({}, use, testInfo) => {
      const project = testInfo.project.name;
      const client: ClientKind = project.startsWith('web') ? 'web' : 'mobile';
      await use(client);
    },
    { scope: 'test' },
  ],
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
  chrome: async ({ page, client }, use) => {
    await use(new ChromePage(page, client));
  },
});

export { expect };
