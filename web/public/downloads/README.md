# Android APK downloads

Sideload build served by the public web site at `/downloads/xcron-jobs.apk`.

Update manifest (read by the mobile app): `/downloads/version.json`.

`*.apk` is gitignored (binary). `version.json` is committed so clients can check for updates even before an APK is synced locally.

## Publish a bug-fix build

1. Bump `versionCode` (required) and `versionName` in `mobile/android/app/build.gradle`.
2. Build the debug APK:

```bash
cd mobile
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

3. Copy APK + refresh `version.json` + web CTA labels:

```bash
cd web
npm run sync:apk
# optional: SITE_URL=https://your-host APK_NOTES="Fix Google sign-in" npm run sync:apk
```

4. Deploy the web site so `/downloads/xcron-jobs.apk` and `/downloads/version.json` update together.

Source path: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`.

Override the public APK/base URL via `SITE_URL` when syncing, or `environment.androidApkUrl` for the web CTA.

## How users update

- **New install / re-download:** site **Download APK** CTA.
- **Already installed:** native app checks `version.json` on launch. If `versionCode` is higher than the installed build, it prompts **Update** (opens `apkUrl`) or **Later** (skipped until a newer code ships). If installed build is below `minVersionCode`, **Later** is hidden.
