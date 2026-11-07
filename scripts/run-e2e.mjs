#!/usr/bin/env node
/**
 * One-command Playwright runner for X Cron.
 *
 * Boots (or reuses) API :3000, mobile :4200, web :4201, then runs e2e journeys.
 * Failure digest → e2e/test-results/ISSUES.md + HTML report.
 *
 * Usage:
 *   npm run test:e2e
 *   npm run test:e2e -- --project=mobile
 *   npm run test:e2e -- --grep @smoke
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const e2eDir = path.join(root, 'e2e');
const children = [];

const args = process.argv.slice(2);
const projectArg = args.find((a) => a.startsWith('--project='));
const project = projectArg?.split('=')[1];
const extra = args.filter((a) => !a.startsWith('--project='));

function log(msg) {
  console.log(`[e2e] ${msg}`);
}

function waitForUrl(url, { timeoutMs = 180_000, intervalMs = 1500 } = {}) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      const req = http.get(url, (res) => {
        res.resume();
        if (res.statusCode && res.statusCode < 500) {
          resolve(true);
          return;
        }
        retry();
      });
      req.on('error', retry);
      req.setTimeout(3000, () => {
        req.destroy();
        retry();
      });
    };
    const retry = () => {
      if (Date.now() - started > timeoutMs) {
        reject(new Error(`Timeout waiting for ${url}`));
        return;
      }
      setTimeout(tick, intervalMs);
    };
    tick();
  });
}

function spawnProc(command, cwd, env = {}, name = command) {
  const isWin = process.platform === 'win32';
  const child = spawn(command, {
    cwd,
    env: { ...process.env, ...env },
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', (d) => {
    if (process.env.XCRON_E2E_VERBOSE) process.stdout.write(`[${name}] ${d}`);
  });
  child.stderr.on('data', (d) => {
    if (process.env.XCRON_E2E_VERBOSE) process.stderr.write(`[${name}] ${d}`);
  });
  children.push(child);
  return child;
}

async function urlUp(url) {
  try {
    await waitForUrl(url, { timeoutMs: 2500, intervalMs: 400 });
    return true;
  } catch {
    return false;
  }
}

function shutdown() {
  for (const child of children) {
    try {
      if (!child.killed) child.kill('SIGTERM');
    } catch {
      /* ignore */
    }
  }
}

process.on('exit', shutdown);
process.on('SIGINT', () => {
  shutdown();
  process.exit(130);
});

async function ensureDeps() {
  if (!fs.existsSync(path.join(e2eDir, 'node_modules', '@playwright', 'test'))) {
    log('Installing e2e package + Chromium…');
    await run('npm install', e2eDir);
    await run('npx playwright install chromium', e2eDir);
  }
}

function run(command, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      cwd,
      shell: true,
      stdio: 'inherit',
      env: process.env,
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited ${code}`));
    });
  });
}

const e2eApiEnv = {
  PORT: '3000',
  NODE_ENV: 'development',
  JOBS_STORE: process.env.XCRON_E2E_JOBS_STORE || 'memory',
  AUTH_STORE: process.env.XCRON_E2E_AUTH_STORE || 'memory',
  NOTIFICATIONS_STORE: 'memory',
  PAYMENTS_STORE: 'memory',
  APPLICATIONS_STORE: 'memory',
  APPLY_PROFILES_STORE: 'memory',
  SEEKER_STORE: 'memory',
  REPUTATION_STORE: 'memory',
  FEEDBACK_STORE: 'memory',
  TRACKING_STORE: 'memory',
  MODERATION_STORE: 'memory',
  FILE_STORAGE: 'stub',
  OCR_PROVIDER: 'stub',
  AUTH_SINGLE_TAB: '0',
  AUTH_SINGLE_SESSION: '0',
  RATE_LIMIT_MAX: '1000',
  RATE_LIMIT_AUTH_MAX: '200',
  RATE_LIMIT_SENSITIVE_MAX: '50',
  APPLY_RATE_LIMIT_MAX: '100',
  // `0` falls back to the 30s default in ApplicationsService — 1ms effectively disables it.
  APPLY_COOLDOWN_MS: '1',
  APPLY_HOURLY_CAP: '1000',
  APPLY_DAILY_CAP: '1000',
  JOB_EXPIRE_SCHEDULE_ENABLED: '0',
  JOB_FEED_SCHEDULE_ENABLED: '0',
  PROFILE_REMINDER_SCHEDULE_ENABLED: '0',
  MODERATION_SCHEDULE_ENABLED: '0',
  CHANNEL_SCHEDULE_ENABLED: '0',
  // Never long-poll a real bot from e2e (would steal getUpdates from the dev API).
  TELEGRAM_BOT_TOKEN: '',
  TELEGRAM_MODE: 'webhook',
  AI_HELP_ENABLED: '0',
  AI_ENRICH_ENABLED: '0',
  ENABLE_SWAGGER: '0',
  PAYMENT_MODE: 'stub',
  PUSH_PROVIDER: 'stub',
  MAIL_PROVIDER: 'stub',
};

async function main() {
  await ensureDeps();

  const apiHealth = 'http://localhost:3000/v1/health';
  const mobileUrl = 'http://localhost:4200';
  const webUrl = 'http://localhost:4201';

  let startedApi = false;
  if (!(await urlUp(apiHealth))) {
    log('Starting API on :3000 (e2e-friendly memory store + raised rate limits)…');
    spawnProc('npm run start:dev', path.join(root, 'api'), e2eApiEnv, 'api');
    startedApi = true;
    await waitForUrl(apiHealth);
    log('API ready.');
  } else {
    log('Reusing existing API on :3000.');
  }

  const needMobile = !project || project === 'mobile' || project === 'android';
  const needWeb = !project || project === 'web';
  // project === 'api' needs only the API (started above).

  if (project === 'android') {
    const adbCheck = spawn('adb devices', {
      cwd: root,
      shell: true,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const adbOut = await new Promise((resolve) => {
      let buf = '';
      adbCheck.stdout?.on('data', (d) => {
        buf += d;
      });
      adbCheck.stderr?.on('data', (d) => {
        buf += d;
      });
      adbCheck.on('exit', () => resolve(buf));
    });
    const serials = adbOut
      .split(/\r?\n/)
      .slice(1)
      .map((l) => l.trim())
      .filter((l) => l.endsWith('device'))
      .map((l) => l.split(/\s+/)[0])
      .filter(Boolean);
    if (!serials.length) {
      console.error(
        '[e2e] Android project needs a running emulator or USB device.\n' +
          '  1) Start an AVD from Android Studio (Device Manager), or plug in a phone with USB debugging.\n' +
          '  2) Confirm: adb devices\n' +
          '  3) Chrome installed on the device; optional: chrome://flags → Enable command line on non-rooted devices\n' +
          '  4) Re-run: npm run test:e2e:android',
      );
      process.exit(1);
    }
    log(`Android device(s): ${serials.join(', ')} — adb reverse :3000 :4200 will run per test.`);
  }

  let startedMobile = false;
  if (needMobile && !(await urlUp(mobileUrl))) {
    log('Starting mobile on :4200…');
    spawnProc('npm start -- --port 4200', path.join(root, 'mobile'), {}, 'mobile');
    startedMobile = true;
    await waitForUrl(mobileUrl);
    log('Mobile ready.');
  } else if (needMobile) {
    log('Reusing existing mobile on :4200.');
  }

  let startedWeb = false;
  if (needWeb && !(await urlUp(webUrl))) {
    log('Starting web on :4201…');
    spawnProc('npm start', path.join(root, 'web'), {}, 'web');
    startedWeb = true;
    await waitForUrl(webUrl);
    log('Web ready.');
  } else if (needWeb) {
    log('Reusing existing web on :4201.');
  }

  const pwArgs = ['playwright', 'test'];
  if (project) {
    pwArgs.push(`--project=${project}`);
  } else {
    // Default suite is API contract + desktop Chromium mobile+web. Android needs a device — use test:e2e:android.
    pwArgs.push('--project=api', '--project=mobile', '--project=web');
  }
  pwArgs.push(...extra);

  log(`Running: npx ${pwArgs.join(' ')}`);
  const code = await new Promise((resolve) => {
    const child = spawn('npx', pwArgs, {
      cwd: e2eDir,
      shell: true,
      stdio: 'inherit',
      env: {
        ...process.env,
        XCRON_API_URL: 'http://localhost:3000/v1',
        XCRON_MOBILE_URL: mobileUrl,
        XCRON_WEB_URL: webUrl,
      },
    });
    child.on('exit', (c) => resolve(c ?? 1));
  });

  const issuesPath = path.join(e2eDir, 'test-results', 'ISSUES.md');
  if (fs.existsSync(issuesPath)) {
    log(`Issues digest: ${issuesPath}`);
  }
  log(`HTML report: ${path.join(e2eDir, 'playwright-report', 'index.html')}`);
  log(`Re-open report: npm run test:e2e:report`);

  if (startedApi || startedMobile || startedWeb) {
    log('Stopping processes started by this runner…');
    shutdown();
  }

  process.exit(code);
}

main().catch((err) => {
  console.error(err);
  shutdown();
  process.exit(1);
});
