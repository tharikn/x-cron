import type { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { employerGuard } from './core/guards/employer.guard';
import { moderatorGuard } from './core/guards/moderator.guard';

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
  // Doc 10 UX aliases → X Cron routes (do not rename canonical paths).
  { path: 'login', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'register', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'profile', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'profile/resume', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'applications', redirectTo: 'me/applied', pathMatch: 'full' },
  { path: 'saved-jobs', redirectTo: 'me', pathMatch: 'full' },
  { path: 'alerts', redirectTo: 'notifications', pathMatch: 'full' },
  { path: 'messages', redirectTo: 'feedback', pathMatch: 'full' },
  { path: 'recruiter/dashboard', redirectTo: 'post', pathMatch: 'full' },
  { path: 'recruiter/jobs', redirectTo: 'my-jobs', pathMatch: 'full' },
  { path: 'recruiter/jobs/new', redirectTo: 'post', pathMatch: 'full' },
  { path: 'recruiter/company', redirectTo: 'post', pathMatch: 'full' },
  { path: 'recruiter/team', redirectTo: 'post', pathMatch: 'full' },
  { path: 'admin/dashboard', redirectTo: 'admin', pathMatch: 'full' },
  { path: 'admin/jobs/review', redirectTo: 'blog-approval', pathMatch: 'full' },
  { path: 'admin/companies/verification', redirectTo: 'admin', pathMatch: 'full' },
  { path: 'admin/reports', redirectTo: 'admin', pathMatch: 'full' },
  { path: 'admin/audit', redirectTo: 'admin/notifications', pathMatch: 'full' },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings-hub/settings-hub.page').then((m) => m.SettingsHubPage),
    children: [
      {
        path: '',
        redirectTo: 'language',
        pathMatch: 'full',
      },
      {
        path: 'account',
        redirectTo: ({ queryParams }) => withQuery('/sign-in', queryParams),
        pathMatch: 'full',
      },
      {
        path: 'language',
        loadComponent: () =>
          import('./pages/language/language.page').then((m) => m.LanguagePage),
      },
      {
        path: 'theme',
        loadComponent: () =>
          import('./pages/theme/theme.page').then((m) => m.ThemePage),
      },
      {
        path: 'preferences',
        loadComponent: () =>
          import('./pages/preferences/preferences.page').then((m) => m.PreferencesPage),
      },
      {
        path: 'privacy',
        loadComponent: () =>
          import('./pages/privacy/privacy.page').then((m) => m.PrivacyPage),
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
    loadComponent: () =>
      import('./pages/sign-in/sign-in.page').then((m) => m.SignInPage),
  },
  {
    path: 'recruiter/jobs/:id/applicants',
    redirectTo: 'employer-applications',
  },
  {
    path: 'recruiter/jobs/:id',
    redirectTo: ({ params }) => `/my-jobs/${params['id'] ?? ''}`,
  },
  {
    path: 'applications/:id',
    redirectTo: ({ params }) => `/me/applications/${params['id'] ?? ''}`,
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./pages/privacy/privacy.page').then((m) => m.PrivacyPage),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./pages/terms/terms.page').then((m) => m.TermsPage),
  },
  {
    path: 'onboarding/profile',
    loadComponent: () =>
      import('./pages/profile-setup/profile-setup.page').then(
        (m) => m.ProfileSetupPage,
      ),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./pages/notifications/notifications.page').then(
        (m) => m.NotificationsPage,
      ),
  },
  {
    path: 'feedback',
    loadComponent: () =>
      import('./pages/feedback/feedback.page').then((m) => m.FeedbackPage),
  },
  {
    path: 'admin/feedback',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-feedback/admin-feedback.page').then(
        (m) => m.AdminFeedbackPage,
      ),
  },
  {
    path: 'admin/trust',
    canActivate: [moderatorGuard],
    loadComponent: () =>
      import('./pages/admin-trust/admin-trust.page').then(
        (m) => m.AdminTrustPage,
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
    path: 'me',
    loadComponent: () =>
      import('./pages/seeker/seeker.page').then((m) => m.SeekerPage),
  },
  {
    path: 'me/applied',
    loadComponent: () =>
      import('./pages/applied-jobs/applied-jobs.page').then(
        (m) => m.AppliedJobsPage,
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
    path: 'me/applications/:id',
    loadComponent: () =>
      import('./pages/application-detail/application-detail.page').then(
        (m) => m.ApplicationDetailPage,
      ),
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
    path: 'admin/tracking',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-tracking/admin-tracking.page').then(
        (m) => m.AdminTrackingPage,
      ),
  },
  {
    path: 'admin/users',
    redirectTo: 'admin/tracking',
    pathMatch: 'full',
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
    canActivate: [moderatorGuard],
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
