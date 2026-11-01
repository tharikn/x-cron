import type { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { TabsPage } from './tabs/tabs.page';

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
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/post-job/post-job.page').then((m) => m.PostJobPage),
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
        path: 'ads',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/ads-admin/ads-admin.page').then((m) => m.AdsAdminPage),
      },
      {
        path: 'preferences',
        loadComponent: () =>
          import('./pages/preferences/preferences.page').then((m) => m.PreferencesPage),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./pages/notifications/notifications.page').then(
            (m) => m.NotificationsPage,
          ),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./pages/account/account.page').then((m) => m.AccountPage),
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
