export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/v1',
  /** Set to a Google OAuth Web client ID to use GIS; leave empty for local stub. */
  googleClientId:
    '199090164542-ina98t21c5d8mm081gnj0j9fo5qvgsd0.apps.googleusercontent.com',
  githubRepo: 'tharikn/x-cron',
  /** Latest GitHub Release JSON (CORS-friendly) — APK update check. */
  githubReleasesLatestUrl:
    'https://api.github.com/repos/tharikn/x-cron/releases/latest',
};
