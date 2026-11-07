import type { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { employerGuard } from './core/guards/employer.guard';
import { TabsPage } from './tabs/tabs.page';

function settingsRedirect(
  tab: 'language' | 'preferences' | 'saved',
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
    path: 'onboarding/profile',
    loadComponent: () =>
      import('./pages/profile-setup/profile-setup.page').then(
        (m) => m.ProfileSetupPage,
      ),
  },
  // Doc 10 UX aliases → Ionic tab paths (deep links also mapped in DeepLinkService).
  { path: 'login', redirectTo: 'tabs/account', pathMatch: 'full' },
  { path: 'register', redirectTo: 'tabs/account', pathMatch: 'full' },
  { path: 'profile', redirectTo: 'tabs/account', pathMatch: 'full' },
  { path: 'applications', redirectTo: 'tabs/applied', pathMatch: 'full' },
  { path: 'saved-jobs', redirectTo: 'tabs/settings', pathMatch: 'full' },
  { path: 'alerts', redirectTo: 'tabs/notifications', pathMatch: 'full' },
  { path: 'messages', redirectTo: 'tabs/feedback', pathMatch: 'full' },
  { path: 'settings/privacy', redirectTo: 'tabs/privacy', pathMatch: 'full' },
  { path: 'privacy', redirectTo: 'tabs/privacy', pathMatch: 'full' },
  { path: 'recruiter/dashboard', redirectTo: 'tabs/company', pathMatch: 'full' },
  { path: 'recruiter/jobs', redirectTo: 'tabs/my-jobs', pathMatch: 'full' },
  { path: 'recruiter/jobs/new', redirectTo: 'tabs/post', pathMatch: 'full' },
  {
    path: 'applications/:id',
    redirectTo: ({ params }) => `/tabs/applications/${params['id'] ?? ''}`,
  },
  {
    path: 'jobs/:id',
    redirectTo: ({ params }) => `/tabs/jobs/${params['id'] ?? ''}`,
  },
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
        loadComponent: () =>
          import('./pages/account/account.page').then((m) => m.AccountPage),
      },
      {
        path: 'privacy',
        loadComponent: () =>
          import('./pages/privacy/privacy.page').then((m) => m.PrivacyPage),
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
        path: 'applied',
        loadComponent: () =>
          import('./pages/applied-jobs/applied-jobs.page').then(
            (m) => m.AppliedJobsPage,
          ),
      },
      {
        path: 'applications/:id',
        loadComponent: () =>
          import('./pages/application-detail/application-detail.page').then(
            (m) => m.ApplicationDetailPage,
          ),
      },
      {
        path: 'my-jobs',
        canActivate: [employerGuard],
        loadComponent: () =>
          import('./pages/my-jobs/my-jobs.page').then((m) => m.MyJobsPage),
      },
      {
        path: 'my-jobs/:id',
        canActivate: [employerGuard],
        loadComponent: () =>
          import('./pages/my-job-analytics/my-job-analytics.page').then(
            (m) => m.MyJobAnalyticsPage,
          ),
      },
      {
        path: 'employer-applications',
        canActivate: [employerGuard],
        loadComponent: () =>
          import('./pages/employer-applications/employer-applications.page').then(
            (m) => m.EmployerApplicationsPage,
          ),
      },
      {
        path: 'company',
        canActivate: [employerGuard],
        loadComponent: () =>
          import('./pages/company-workspace/company-workspace.page').then(
            (m) => m.CompanyWorkspacePage,
          ),
      },
      {
        path: 'company-invitations/:token/accept',
        loadComponent: () =>
          import('./pages/company-invite/company-invite.page').then(
            (m) => m.CompanyInvitePage,
          ),
      },
      {
        path: 'performance',
        loadComponent: () =>
          import('./pages/performance/performance.page').then(
            (m) => m.PerformancePage,
          ),
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import('./pages/feedback/feedback.page').then((m) => m.FeedbackPage),
      },
      {
        path: 'admin-feedback',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/admin-feedback/admin-feedback.page').then(
            (m) => m.AdminFeedbackPage,
          ),
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
