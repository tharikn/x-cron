export const environment = {
  production: true,
  apiUrl: 'https://x-cron-api.onrender.com/v1',
  /** XCron CV microservice origin (handoff target). */
  resumeUrl: 'https://xcroncv-web-ui.onrender.com',
  siteUrl: 'https://x-cron.onrender.com',
  siteName: 'Xcron JOB',
  /** One-time "Welcome" portal prompt. Off by default; the homepage never shows it. */
  welcomePromptEnabled: false,
  /** Set at build time to your Google OAuth Web client ID. */
  googleClientId:
    '199090164542-ina98t21c5d8mm081gnj0j9fo5qvgsd0.apps.googleusercontent.com',
  /** GitHub repo that hosts APK Releases (binary download source). */
  githubRepo: 'tharikn/x-cron',
  androidReleasesApiUrl: 'https://api.github.com/repos/tharikn/x-cron/releases',
  /** Latest APK — GitHub Release asset (direct binary). */
  androidApkUrl:
    'https://github.com/tharikn/x-cron/releases/latest/download/xcron-jobs.apk',
  androidApkVersion: '1.0.4',
  androidApkSizeLabel: '~10 MB',
  /** XCron CV (resume builder) APK — separate repo + GitHub Releases. */
  resumeReleasesApiUrl: 'https://api.github.com/repos/tharikn/xcroncv/releases',
  resumeApkUrl:
    'https://github.com/tharikn/xcroncv/releases/latest/download/xcron-cv.apk',
};
