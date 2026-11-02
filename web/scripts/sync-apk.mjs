import { copyFileSync, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * LOCAL ONLY — copies debug APK for ng serve smoke tests.
 * Production APK = GitHub Releases (see .github/workflows/android-release.yml).
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(root, '..');
const source = join(
  repoRoot,
  'mobile',
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'debug',
  'app-debug.apk',
);
const destDir = join(root, 'public', 'downloads');
const dest = join(destDir, 'xcron-jobs.apk');

if (!existsSync(source)) {
  console.error(
    'APK not found. Build the Android debug APK first:\n' +
      '  cd mobile && npx cap sync android && cd android && .\\gradlew.bat assembleDebug',
  );
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(source, dest);
const mb = (statSync(dest).size / (1024 * 1024)).toFixed(1);
writeFileSync(
  join(destDir, '.local-apk-note.txt'),
  `Local smoke APK synced ${new Date().toISOString()} (~${mb} MB).\nProduction downloads use GitHub Releases, not this file.\n`,
);

console.log(`Synced local smoke APK → public/downloads/xcron-jobs.apk (${mb} MB)`);
console.log(
  'Note: production users download from GitHub Releases. Tag vX.Y.Z to publish.',
);
