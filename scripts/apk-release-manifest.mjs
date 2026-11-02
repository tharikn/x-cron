/**
 * Reads mobile/android/app/build.gradle and writes version.json + release body
 * snippet for GitHub Releases (APK sideload).
 *
 * Usage:
 *   node scripts/apk-release-manifest.mjs [--out dir] [--notes "text"] [--repo tharikn/x-cron] [--tag v1.0.1]
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);

function argValue(flag, fallback = '') {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}

const outDir = resolve(root, argValue('--out', 'dist-apk-release'));
const repo = argValue('--repo', 'tharikn/x-cron');
const notes = argValue('--notes', process.env.APK_NOTES || '');
const gradlePath = join(root, 'mobile', 'android', 'app', 'build.gradle');
const apkSource = join(
  root,
  'mobile',
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'debug',
  'app-debug.apk',
);

const gradle = readFileSync(gradlePath, 'utf8');
const versionCodeMatch = gradle.match(/versionCode\s+(\d+)/);
const versionNameMatch = gradle.match(/versionName\s+"([^"]+)"/);
if (!versionCodeMatch || !versionNameMatch) {
  console.error(`Could not read versionCode/versionName from ${gradlePath}`);
  process.exit(1);
}

const versionCode = Number(versionCodeMatch[1]);
const versionName = versionNameMatch[1];
const tag = argValue('--tag', `v${versionName}`);
const apkUrl = `https://github.com/${repo}/releases/download/${tag}/xcron-jobs.apk`;

let sizeLabel = '~12 MB';
try {
  const { statSync } = await import('node:fs');
  if (statSync(apkSource).isFile()) {
    const mb = (statSync(apkSource).size / (1024 * 1024)).toFixed(1);
    sizeLabel = `~${mb} MB`;
  }
} catch {
  // APK may not exist yet when only generating the template
}

const manifest = {
  versionCode,
  versionName,
  apkPath: '/downloads/xcron-jobs.apk',
  apkUrl,
  sizeLabel,
  minVersionCode: 1,
  releasedAt: new Date().toISOString(),
  notes: notes || `X Cron Jobs ${versionName}`,
  tag,
  repo,
};

mkdirSync(outDir, { recursive: true });
const manifestPath = join(outDir, 'version.json');
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const bodyPath = join(outDir, 'release-body.md');
const humanNotes = notes.trim() || `Android sideload build **${versionName}** (versionCode ${versionCode}).`;
const body = [
  '```xcron-manifest',
  JSON.stringify(manifest),
  '```',
  '',
  '## Release notes',
  '',
  humanNotes,
  '',
  `Download: [${tag} APK](${apkUrl})`,
  '',
].join('\n');
writeFileSync(bodyPath, body);

writeFileSync(
  join(outDir, 'release-meta.env'),
  [
    `VERSION_CODE=${versionCode}`,
    `VERSION_NAME=${versionName}`,
    `RELEASE_TAG=${tag}`,
    `APK_URL=${apkUrl}`,
    `SIZE_LABEL=${sizeLabel}`,
    '',
  ].join('\n'),
);

console.log(`Wrote ${manifestPath}`);
console.log(`Wrote ${bodyPath}`);
console.log(`tag=${tag} versionCode=${versionCode} versionName=${versionName}`);
