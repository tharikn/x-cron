import type { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { employerGuard } from './core/guards/employer.guard';
import { TabsPage } from './tabs/tabs.page';

function settingsRedirect(
  tab: 'language' | 'preferences' | 'account' | 'saved',
  queryParams: Record<string, string>,
): string {
  const q = new URLSearchParams();
  q.set('tab', tab);
  for (const [key, value] of Object.entries(queryParams)) {
    if (key === 'tab' || value == null || value === '') continue;
    q.set(key, String(value));
  }
  return `/tabs/settings?${q.toString()}`;
}

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'discover',
        loadComponent: () =>
          import('./pages/discover/discover.page').then((m) => m.DiscoverPage),
      },
      {
        path: 'post',
        canActivate: [employerGuard],
        loadComponent: () =>
          import('./pages/post-job/post-job.page').then((m) => m.PostJobPage),
      },
      {
        path: 'employers/:id',
        loadComponent: () =>
          import('./pages/employer/employer.page').then((m) => m.EmployerPage),
      },
      {
        path: 'import',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/import-batch/import-batch.page').then((m) => m.ImportBatchPage),
      },
      {
        path: 'job-fare',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/job-fare/job-fare.page').then((m) => m.JobFarePage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: 'preferences',
        redirectTo: ({ queryParams }) =>
          settingsRedirect('preferences', queryParams),
        pathMatch: 'full',
      },
      {
        path: 'account',
        redirectTo: ({ queryParams }) => settingsRedirect('account', queryParams),
        pathMatch: 'full',
      },
      {
        path: 'saved',
        redirectTo: ({ queryParams }) => settingsRedirect('saved', queryParams),
        pathMatch: 'full',
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./pages/notifications/notifications.page').then(
            (m) => m.NotificationsPage,
          ),
      },
      {
        path: 'jobs/:id',
        loadComponent: () =>
          import('./pages/job-detail/job-detail.page').then((m) => m.JobDetailPage),
      },
      {
        path: '',
        redirectTo: 'discover',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/discover',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'tabs/discover',
  },
];
