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

export function pathsFor(client: ClientKind) {
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
    } as const;
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
    performance: '/performance',
    feedback: '/feedback',
    adminFeedback: '/admin/feedback',
    notifications: '/notifications',
    settings: '/settings',
    settingsTheme: '/settings/theme',
    settingsPrefs: '/settings/preferences',
    settingsSaved: '/me?tab=saved',
    import: '/import',
    jobFare: '/admin/job-fare',
    me: '/me',
  } as const;
}
