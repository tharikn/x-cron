export const environment = {
  production: true,
  apiUrl: 'https://x-cron-api.onrender.com/v1',
  siteUrl: 'https://x-cron.onrender.com',
  siteName: 'X Cron',
  /** Set at build time to your Google OAuth Web client ID. */
  googleClientId:
    '199090164542-ina98t21c5d8mm081gnj0j9fo5qvgsd0.apps.googleusercontent.com',
  /** GitHub repo that hosts APK Releases (binary download source). */
  githubRepo: 'tharikn/x-cron',
  androidReleasesApiUrl: 'https://api.github.com/repos/tharikn/x-cron/releases',
  /** Latest APK — GitHub Release asset (direct binary). */
  androidApkUrl:
    'https://github.com/tharikn/x-cron/releases/latest/download/xcron-jobs.apk',
  androidApkVersion: '1.0',
  androidApkSizeLabel: '~13 MB',
};
