/**
 * Automate sideload APK version bump + optional git tag/push for GitHub Releases.
 *
 * Usage (from repo root):
 *   node scripts/release-apk.mjs                 # bump patch (1.0.2 → 1.0.3), code+1
 *   node scripts/release-apk.mjs --version 1.1.0 # set versionName, code+1
 *   node scripts/release-apk.mjs --dry-run
 *   node scripts/release-apk.mjs --ship          # bump + commit + tag + push (main + tag)
 *   node scripts/release-apk.mjs --ship --notes "FCM tray fix"
 *
 * CI: push of tag `v{versionName}` → `.github/workflows/android-release.yml`
 * builds APK and creates the GitHub Release the site/app read.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const gradlePath = join(root, 'mobile', 'android', 'app', 'build.gradle');
const args = process.argv.slice(2);

function hasFlag(flag) {
  return args.includes(flag);
}

function argValue(flag, fallback = '') {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--')
    ? args[i + 1]
    : fallback;
}

function usage() {
  console.log(`Usage: node scripts/release-apk.mjs [options]

Options:
  --version X.Y.Z   Set versionName (default: bump patch)
  --code N          Set versionCode (default: current + 1)
  --notes "text"    Commit / release notes hint
  --dry-run         Print planned bump only
  --commit          git add build.gradle + commit
  --tag             create annotated tag v{versionName}
  --push            git push origin HEAD + tag
  --ship            shorthand for --commit --tag --push
`);
}

if (hasFlag('--help') || hasFlag('-h')) {
  usage();
  process.exit(0);
}

const dryRun = hasFlag('--dry-run');
const ship = hasFlag('--ship');
const doCommit = ship || hasFlag('--commit');
const doTag = ship || hasFlag('--tag');
const doPush = ship || hasFlag('--push');
const notes = argValue('--notes', 'Ship Android APK sideload build.');

const gradle = readFileSync(gradlePath, 'utf8');
const codeMatch = gradle.match(/versionCode\s+(\d+)/);
const nameMatch = gradle.match(/versionName\s+"([^"]+)"/);
if (!codeMatch || !nameMatch) {
  console.error(`Could not read versionCode/versionName from ${gradlePath}`);
  process.exit(1);
}

const prevCode = Number(codeMatch[1]);
const prevName = nameMatch[1];

function bumpPatch(name) {
  const parts = name.split('.').map((p) => Number(p));
  if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) {
    throw new Error(`versionName "${name}" is not semver-like (expected X.Y.Z)`);
  }
  while (parts.length < 3) parts.push(0);
  parts[2] += 1;
  return parts.join('.');
}

const nextName = argValue('--version') || bumpPatch(prevName);
const codeArg = argValue('--code');
const nextCode = codeArg ? Number(codeArg) : prevCode + 1;

if (!/^\d+\.\d+\.\d+$/.test(nextName)) {
  console.error(`versionName must look like X.Y.Z (got "${nextName}")`);
  process.exit(1);
}
if (!Number.isInteger(nextCode) || nextCode <= prevCode) {
  console.error(
    `versionCode must be an integer greater than ${prevCode} (got ${nextCode})`,
  );
  process.exit(1);
}

const tag = `v${nextName}`;
console.log(
  `APK version: ${prevName} (${prevCode}) → ${nextName} (${nextCode})  tag ${tag}`,
);

if (dryRun) {
  console.log('Dry run only — build.gradle unchanged.');
  process.exit(0);
}

const nextGradle = gradle
  .replace(/versionCode\s+\d+/, `versionCode ${nextCode}`)
  .replace(/versionName\s+"[^"]+"/, `versionName "${nextName}"`);
writeFileSync(gradlePath, nextGradle, 'utf8');
console.log(`Updated ${gradlePath}`);

function git(argv, opts = {}) {
  return execFileSync('git', argv, {
    cwd: root,
    stdio: opts.silent ? 'pipe' : 'inherit',
    encoding: 'utf8',
  });
}

if (doCommit) {
  git(['add', 'mobile/android/app/build.gradle']);
  const msg = `release(mobile): APK ${nextName} (versionCode ${nextCode})\n\n${notes}\n`;
  git(['commit', '-m', msg]);
}

if (doTag) {
  try {
    git(['rev-parse', tag], { silent: true });
    console.error(`Tag ${tag} already exists. Delete it or pick --version.`);
    process.exit(1);
  } catch {
    // tag missing — good
  }
  git(['tag', '-a', tag, '-m', `X Cron Jobs ${nextName}`]);
  console.log(`Created tag ${tag}`);
}

if (doPush) {
  git(['push', 'origin', 'HEAD']);
  if (doTag) git(['push', 'origin', tag]);
  console.log(
    `Pushed. Watch Actions → Android APK release for ${tag}.\n` +
      `Download: https://github.com/tharikn/x-cron/releases/latest`,
  );
} else if (doTag) {
  console.log(`Next: git push origin HEAD && git push origin ${tag}`);
} else {
  console.log(
    `Next: commit the bump, then:\n  git tag -a ${tag} -m "X Cron Jobs ${nextName}"\n  git push origin HEAD && git push origin ${tag}\nOr re-run with --ship`,
  );
}
