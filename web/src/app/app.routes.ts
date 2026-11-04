import type { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { employerGuard } from './core/guards/employer.guard';

function withQuery(path: string, queryParams: Record<string, string>): string {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (value != null && value !== '') {
      q.set(key, String(value));
    }
  }
  const qs = q.toString();
  return qs ? `${path}?${qs}` : path;
}

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings-hub/settings-hub.page').then((m) => m.SettingsHubPage),
    children: [
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full',
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./pages/sign-in/sign-in.page').then((m) => m.SignInPage),
      },
      {
        path: 'language',
        loadComponent: () =>
          import('./pages/language/language.page').then((m) => m.LanguagePage),
      },
      {
        path: 'preferences',
        loadComponent: () =>
          import('./pages/preferences/preferences.page').then((m) => m.PreferencesPage),
      },
      {
        path: 'site',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/settings/settings.page').then((m) => m.SettingsPage),
      },
    ],
  },
  {
    path: 'preferences',
    redirectTo: 'settings/preferences',
    pathMatch: 'full',
  },
  {
    path: 'language',
    redirectTo: 'settings/language',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    redirectTo: ({ queryParams }) => withQuery('/settings/account', queryParams),
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
    path: 'post',
    canActivate: [employerGuard],
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
    path: 'my-jobs',
    canActivate: [employerGuard],
    loadComponent: () =>
      import('./pages/my-jobs/my-jobs.page').then((m) => m.MyJobsPage),
  },
  {
    path: 'me',
    loadComponent: () =>
      import('./pages/seeker/seeker.page').then((m) => m.SeekerPage),
  },
  {
    path: 'employers/:id',
    loadComponent: () =>
      import('./pages/employer/employer.page').then((m) => m.EmployerPage),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.page').then(
        (m) => m.AdminDashboardPage,
      ),
  },
  {
    path: 'admin/payments',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-payments/admin-payments.page').then(
        (m) => m.AdminPaymentsPage,
      ),
  },
  {
    path: 'admin/notifications',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-notifications/admin-notifications.page').then(
        (m) => m.AdminNotificationsPage,
      ),
  },
  {
    path: 'admin/job-fare',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-job-fare/admin-job-fare.page').then(
        (m) => m.AdminJobFarePage,
      ),
  },
  {
    path: 'blog-approval',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/blog-approval/blog-approval.page').then((m) => m.BlogApprovalPage),
  },
  {
    path: 'admin/settings',
    redirectTo: 'settings/site',
    pathMatch: 'full',
  },
  {
    path: 'locations/:state/:city',
    loadComponent: () =>
      import('./pages/location/location.page').then((m) => m.LocationPage),
  },
  {
    path: 'jobs',
    children: [
      {
        path: '**',
        loadComponent: () =>
          import('./pages/job-detail/job-detail.page').then((m) => m.JobDetailPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
