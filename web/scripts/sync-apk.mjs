import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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
const gradlePath = join(repoRoot, 'mobile', 'android', 'app', 'build.gradle');
const destDir = join(root, 'public', 'downloads');
const dest = join(destDir, 'xcron-jobs.apk');
const versionPath = join(destDir, 'version.json');
const siteUrl = (process.env.SITE_URL || 'https://x-cron.onrender.com').replace(/\/$/, '');

if (!existsSync(source)) {
  console.error(
    'APK not found. Build the Android debug APK first:\n' +
      '  cd mobile && npx cap sync android && cd android && .\\gradlew.bat assembleDebug',
  );
  process.exit(1);
}

const gradle = readFileSync(gradlePath, 'utf8');
const versionCodeMatch = gradle.match(/versionCode\s+(\d+)/);
const versionNameMatch = gradle.match(/versionName\s+"([^"]+)"/);
if (!versionCodeMatch || !versionNameMatch) {
  console.error(`Could not read versionCode/versionName from ${gradlePath}`);
  process.exit(1);
}

const versionCode = Number(versionCodeMatch[1]);
const versionName = versionNameMatch[1];

mkdirSync(destDir, { recursive: true });
copyFileSync(source, dest);
const mb = (statSync(dest).size / (1024 * 1024)).toFixed(1);
const sizeLabel = `~${mb} MB`;

const manifest = {
  versionCode,
  versionName,
  apkPath: '/downloads/xcron-jobs.apk',
  apkUrl: `${siteUrl}/downloads/xcron-jobs.apk`,
  sizeLabel,
  minVersionCode: 1,
  releasedAt: new Date().toISOString(),
  notes: process.env.APK_NOTES || `X Cron Jobs ${versionName}`,
};

writeFileSync(versionPath, `${JSON.stringify(manifest, null, 2)}\n`);

for (const envFile of [
  join(root, 'src', 'environments', 'environment.ts'),
  join(root, 'src', 'environments', 'environment.prod.ts'),
]) {
  if (!existsSync(envFile)) continue;
  let text = readFileSync(envFile, 'utf8');
  text = text.replace(
    /androidApkVersion:\s*'[^']*'/,
    `androidApkVersion: '${versionName}'`,
  );
  text = text.replace(
    /androidApkSizeLabel:\s*'[^']*'/,
    `androidApkSizeLabel: '${sizeLabel}'`,
  );
  writeFileSync(envFile, text);
}

console.log(`Synced APK → public/downloads/xcron-jobs.apk (${mb} MB)`);
console.log(
  `Wrote version.json → v${versionName} (versionCode ${versionCode}) apkUrl=${manifest.apkUrl}`,
);
console.log('Bumped web environment androidApkVersion / androidApkSizeLabel.');
console.log(
  'Ship checklist: bump mobile versionCode before the next bugfix, rebuild APK, re-run sync:apk, deploy web.',
);
