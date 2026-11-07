/** Shared env for Playwright journeys. Override via process.env when running. */

export const API_BASE =
  process.env.XCRON_API_URL?.replace(/\/$/, '') || 'http://localhost:3000/v1';

export const MOBILE_BASE =
  process.env.XCRON_MOBILE_URL?.replace(/\/$/, '') || 'http://localhost:4200';

export const WEB_BASE =
  process.env.XCRON_WEB_URL?.replace(/\/$/, '') || 'http://localhost:4201';

export const SUPER_ADMIN_EMAIL =
  process.env.SUPER_ADMIN_EMAIL || 'superadmin@xcron.app';

export const SUPER_ADMIN_PASSWORD =
  process.env.SUPER_ADMIN_PASSWORD || 'Password@123';

export const DEFAULT_PASSWORD = 'TestPass1!';

export type ClientKind = 'mobile' | 'web';

export type ClientPaths = {
  home: string;
  account: string;
  signIn: string;
  post: string;
  job: (id: string) => string;
  applied: string;
  application: (id: string) => string;
  myJobs: string;
  myJob: (id: string) => string;
  employerApplications: string;
  company: string;
  companyInvite: (token: string) => string;
  performance: string;
  feedback: string;
  adminFeedback: string;
  /** Present on web; Trust desk / Tracking admin are web-only. */
  adminTrust?: string;
  adminTracking?: string;
  notifications: string;
  settings: string;
  settingsTheme: string;
  settingsPrefs: string;
  settingsSaved: string;
  import: string;
  jobFare: string;
  me: string;
};

export function pathsFor(client: ClientKind): ClientPaths {
  if (client === 'mobile') {
    return {
      home: '/tabs/discover',
      account: '/tabs/account',
      signIn: '/tabs/account',
      post: '/tabs/post',
      job: (id: string) => `/tabs/jobs/${id}`,
      applied: '/tabs/applied',
      application: (id: string) => `/tabs/applications/${id}`,
      myJobs: '/tabs/my-jobs',
      myJob: (id: string) => `/tabs/my-jobs/${id}`,
      employerApplications: '/tabs/employer-applications',
      company: '/tabs/company',
      companyInvite: (token: string) => `/tabs/company-invitations/${token}/accept`,
      performance: '/tabs/performance',
      feedback: '/tabs/feedback',
      adminFeedback: '/tabs/admin-feedback',
      notifications: '/tabs/notifications',
      settings: '/tabs/settings',
      settingsTheme: '/tabs/settings?tab=theme',
      settingsPrefs: '/tabs/settings?tab=preferences',
      settingsSaved: '/tabs/settings?tab=saved',
      import: '/tabs/import',
      jobFare: '/tabs/job-fare',
      me: '/tabs/account?tab=activity',
    };
  }
  return {
    home: '/',
    account: '/sign-in',
    signIn: '/sign-in',
    post: '/post',
    job: (id: string) => `/jobs/${id}`,
    applied: '/me/applied',
    application: (id: string) => `/me/applications/${id}`,
    myJobs: '/my-jobs',
    myJob: (id: string) => `/my-jobs/${id}`,
    employerApplications: '/employer-applications',
    company: '/company',
    companyInvite: (token: string) => `/company-invitations/${token}/accept`,
    performance: '/performance',
    feedback: '/feedback',
    adminFeedback: '/admin/feedback',
    adminTrust: '/admin/trust',
    adminTracking: '/admin/tracking',
    notifications: '/notifications',
    settings: '/settings',
    settingsTheme: '/settings/theme',
    settingsPrefs: '/settings/preferences',
    settingsSaved: '/me?tab=saved',
    import: '/import',
    jobFare: '/admin/job-fare',
    me: '/me',
  };
}
