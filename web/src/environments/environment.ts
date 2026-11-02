export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/v1',
  siteUrl: 'http://localhost:4000',
  siteName: 'X Cron',
  /** Google OAuth Web client ID. Empty = local email stub on Sign in → Google. */
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
};
