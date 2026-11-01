import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
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
    path: 'language',
    loadComponent: () =>
      import('./pages/language/language.page').then((m) => m.LanguagePage),
  },
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./pages/sign-in/sign-in.page').then((m) => m.SignInPage),
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
    path: 'my-jobs',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/my-jobs/my-jobs.page').then((m) => m.MyJobsPage),
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
    path: 'settings',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/settings/settings.page').then((m) => m.SettingsPage),
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
