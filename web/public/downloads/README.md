# Android APK downloads

**Production source of truth: GitHub Releases** on `tharikn/x-cron`.

| What | URL |
| --- | --- |
| Latest APK | `https://github.com/tharikn/x-cron/releases/latest/download/xcron-jobs.apk` |
| Latest manifest | release body `xcron-manifest` fence + asset `version.json` |
| All versions | `https://github.com/tharikn/x-cron/releases` |

Website **Download APK** links straight to the GitHub asset (browser downloads the binary). The home panel also lists prior releases via the GitHub Releases API.

`*.apk` stays gitignored. Do **not** rely on Render hosting the binary.

## Ship a version (CI)

1. Bump `versionCode` + `versionName` in `mobile/android/app/build.gradle`.
2. Commit and tag matching `versionName`:

```bash
git tag v1.0.1
git push origin v1.0.1
```

3. Workflow [`.github/workflows/android-release.yml`](../../../.github/workflows/android-release.yml) builds the debug APK, creates the GitHub Release (notes + `xcron-jobs.apk` + `version.json`).

Or run **Android APK release** → **Run workflow** and paste release notes.

Tag must equal `v` + `versionName` (e.g. gradle `1.0.1` → tag `v1.0.1`).

## Local only (`sync:apk`)

`cd web && npm run sync:apk` still copies a debug APK into this folder for **local** `ng serve` smoke tests. It does **not** publish to production. Production = GitHub Release.

## In-app updates

Native app `AppUpdateService` reads `GET /repos/tharikn/x-cron/releases/latest`, parses the `xcron-manifest` fence, and prompts Update when `versionCode` is higher.
