/**
 * Wire free FCM after you drop Firebase credentials in place.
 *
 * Required files (download from Firebase Console — see docs/FCM_SETUP.md):
 *   mobile/android/app/google-services.json
 *   api/secrets/firebase-service-account.json
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const googleServices = join(root, 'mobile', 'android', 'app', 'google-services.json');
const serviceAccount = join(root, 'api', 'secrets', 'firebase-service-account.json');

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  console.error('Follow docs/FCM_SETUP.md (free Spark plan). Then re-run:');
  console.error('  node scripts/setup-fcm.mjs\n');
  process.exit(1);
}

if (!existsSync(googleServices)) {
  fail(`Missing ${googleServices}`);
}
if (!existsSync(serviceAccount)) {
  fail(`Missing ${serviceAccount}`);
}

try {
  const gs = JSON.parse(readFileSync(googleServices, 'utf8'));
  const pkg = gs?.client?.[0]?.client_info?.android_client_info?.package_name;
  if (pkg && pkg !== 'com.xcron.jobs') {
    fail(`google-services.json package_name is "${pkg}", expected "com.xcron.jobs"`);
  }
} catch {
  fail('google-services.json is not valid JSON');
}

try {
  const sa = JSON.parse(readFileSync(serviceAccount, 'utf8'));
  if (sa.type !== 'service_account' || !sa.private_key) {
    fail('firebase-service-account.json does not look like a service account key');
  }
} catch {
  fail('firebase-service-account.json is not valid JSON');
}

function enableFcmInEnvTs(filePath) {
  let text = readFileSync(filePath, 'utf8');
  if (!text.includes('fcmEnabled')) {
    fail(`${filePath} missing fcmEnabled — unexpected`);
  }
  text = text.replace(/fcmEnabled:\s*false/g, 'fcmEnabled: true');
  writeFileSync(filePath, text);
}

enableFcmInEnvTs(join(root, 'mobile', 'src', 'environments', 'environment.ts'));
enableFcmInEnvTs(join(root, 'mobile', 'src', 'environments', 'environment.prod.ts'));

const fcmBlock = [
  '',
  '# --- FCM (free) — managed by scripts/setup-fcm.mjs ---',
  'PUSH_PROVIDER=fcm',
  'FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-service-account.json',
  'FCM_ANDROID_CHANNEL_ID=xcron-job-alerts-v2',
  '',
].join('\n');

function upsertApiEnv(filePath) {
  if (!existsSync(filePath)) {
    writeFileSync(filePath, fcmBlock.trimStart());
    return;
  }
  let text = readFileSync(filePath, 'utf8');
  // Drop prior FCM block / duplicate keys so re-runs stay clean.
  text = text
    .split(/\r?\n/)
    .filter(
      (line) =>
        !line.startsWith('PUSH_PROVIDER=') &&
        !line.startsWith('FIREBASE_SERVICE_ACCOUNT_PATH=') &&
        !line.startsWith('FIREBASE_SERVICE_ACCOUNT_JSON=') &&
        !line.startsWith('FCM_ANDROID_CHANNEL_ID=') &&
        !line.includes('managed by scripts/setup-fcm.mjs'),
    )
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd();

  const insertAfter = text.match(/^AI_ENRICH_MODEL=.*$/m);
  const lines = [
    'PUSH_PROVIDER=fcm',
    'FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-service-account.json',
    'FCM_ANDROID_CHANNEL_ID=xcron-job-alerts-v2',
  ];
  if (insertAfter) {
    text = text.replace(
      insertAfter[0],
      `${insertAfter[0]}\n${lines.join('\n')}`,
    );
  } else {
    text = `${text}\n${lines.join('\n')}`;
  }
  writeFileSync(filePath, `${text}\n`);
}

mkdirSync(join(root, 'api', 'secrets'), { recursive: true });
upsertApiEnv(join(root, 'api', '.env'));
upsertApiEnv(join(root, 'api', 'env-dev'));

const gitignoreSecrets = join(root, 'api', 'secrets', '.gitignore');
if (!existsSync(gitignoreSecrets)) {
  writeFileSync(gitignoreSecrets, '*\n!.gitignore\n');
}

console.log('✓ google-services.json OK');
console.log('✓ firebase-service-account.json OK');
console.log('✓ mobile fcmEnabled → true');
console.log('✓ api/.env + api/env-dev → PUSH_PROVIDER=fcm');
console.log('');
console.log('Next:');
console.log('  1. Restart API (npm run start:dev)');
console.log('  2. cd mobile && npm run cap:sync && cd android && .\\gradlew.bat assembleDebug');
console.log('  3. adb install -r app\\build\\outputs\\apk\\debug\\app-debug.apk');
console.log('  4. Open app, allow notifications, sign in');
console.log('  5. Force-stop app → publish a job → tray alert should appear');
console.log('');
console.log('Render: set PUSH_PROVIDER=fcm and FIREBASE_SERVICE_ACCOUNT_JSON=<paste service account JSON>');
console.log('GitHub: secret GOOGLE_SERVICES_JSON=<paste google-services.json>');
