# Free FCM setup (closed-app system notifications)

**Cost:** ₹0 for FCM sends. You only need a free Firebase project.

Code is already wired:

- API: `PUSH_PROVIDER=fcm` + `firebase-admin` (`api/src/notifications/providers/fcm.provider.ts`)
- Mobile: `@capacitor/push-notifications` when `environment.fcmEnabled` is true
- CI: secret `GOOGLE_SERVICES_JSON` for release APKs

## You must create (once, ~5 minutes)

### A) Android client config — done when file is at `mobile/android/app/google-services.json`

1. Open [Firebase Console](https://console.firebase.google.com/) → create/select project (Spark / free).
2. Add **Android** app with package name exactly: `com.xcron.jobs`
3. Download **`google-services.json`**
4. Save as: `mobile/android/app/google-services.json` (gitignored)

### B) Server send key (still required for closed-app push)

1. Same Firebase project (`xcronjobs`) → gear icon → **Project settings**
2. Tab **Service accounts** → **Generate new private key** → confirm
3. Save the downloaded JSON as: `api/secrets/firebase-service-account.json`  
   (or tell the agent the Downloads path and we will copy it)

## Wire env (or run the helper)

```bash
node scripts/setup-fcm.mjs
```

This checks both files, sets `fcmEnabled: true` on mobile envs, and sets API `.env` + `env-dev`:

```env
PUSH_PROVIDER=fcm
FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-service-account.json
FCM_ANDROID_CHANNEL_ID=xcron-job-alerts-v2
```

## Ship

```bash
# API (local or Render env vars)
# PUSH_PROVIDER=fcm + paste FIREBASE_SERVICE_ACCOUNT_JSON on Render

# Mobile
cd mobile
npm run cap:sync
cd android && ./gradlew assembleDebug   # Windows: .\gradlew.bat assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Open the app once, allow notifications, sign in — device registers a real FCM token (not `stub_fcm_*`).

## GitHub release APK

Repo secret **`GOOGLE_SERVICES_JSON`** = full contents of `google-services.json`  
(CI already writes the file and flips `fcmEnabled`).

## Prove it

1. Force-stop X Cron on the phone  
2. Publish a job / `POST /v1/notifications/dev/send`  
3. System tray alert appears while app is closed  
