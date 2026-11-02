export const environment = {
  production: true,
  apiUrl: 'https://x-cron-api.onrender.com/v1',
  googleClientId:
    '199090164542-ina98t21c5d8mm081gnj0j9fo5qvgsd0.apps.googleusercontent.com',
  githubRepo: 'tharikn/x-cron',
  /** Latest GitHub Release JSON (CORS-friendly) — APK update check. */
  githubReleasesLatestUrl:
    'https://api.github.com/repos/tharikn/x-cron/releases/latest',
  /**
   * Remote FCM. Requires `android/app/google-services.json` in the APK build.
   * False until CI injects that file — otherwise PushNotifications.register()
   * fatally crashes (Default FirebaseApp is not initialized).
   */
  fcmEnabled: true,
};
