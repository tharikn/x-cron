import { spawnSync } from 'node:child_process';
import type { AndroidDevice, BrowserContext, Page } from 'playwright';
import { _android as android } from 'playwright';

export type AndroidSession = {
  device: AndroidDevice;
  context: BrowserContext;
  page: Page;
  close: () => Promise<void>;
};

function adb(args: string[]): { ok: boolean; out: string } {
  const r = spawnSync('adb', args, { encoding: 'utf8', shell: true });
  const out = `${r.stdout || ''}${r.stderr || ''}`.trim();
  return { ok: r.status === 0, out };
}

/** List serials in `device` state (excludes offline / unauthorized). */
export function listAdbDevices(): string[] {
  const { out } = adb(['devices']);
  return out
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim())
    .filter((line) => line.endsWith('\tdevice'))
    .map((line) => line.split(/\s+/)[0])
    .filter(Boolean);
}

/**
 * Map emulator/device localhost → host API + Ionic serve so the same
 * `environment.apiUrl` / `:4200` URLs work on Android Chrome.
 */
export function adbReversePorts(ports: number[] = [3000, 4200]): void {
  const serials = listAdbDevices();
  if (!serials.length) {
    throw new Error(
      'No Android device/emulator. Start an AVD (or plug in a phone with USB debugging), then: adb devices',
    );
  }
  for (const serial of serials) {
    for (const port of ports) {
      const { ok, out } = adb(['-s', serial, 'reverse', `tcp:${port}`, `tcp:${port}`]);
      if (!ok) {
        throw new Error(`adb reverse tcp:${port} failed on ${serial}: ${out}`);
      }
    }
  }
}

/**
 * Playwright experimental Android: Chrome on device/emulator, same Ionic
 * routes as project `mobile` (not the Capacitor APK WebView — see e2e/README).
 */
export async function openAndroidChrome(baseURL: string): Promise<AndroidSession> {
  adbReversePorts();
  const devices = await android.devices();
  if (!devices.length) {
    throw new Error(
      'Playwright found no Android devices via ADB. Start an emulator, install Chrome, enable USB debugging.',
    );
  }
  const serial = process.env.XCRON_ANDROID_SERIAL?.trim();
  const device = serial
    ? devices.find((d) => d.serial() === serial)
    : devices[0];
  if (!device) {
    throw new Error(
      `Android serial ${serial} not found. Connected: ${devices.map((d) => d.serial()).join(', ')}`,
    );
  }

  const context = await device.launchBrowser({
    // Prefer cleartext localhost after adb reverse.
    args: ['--disable-features=HttpsFirstBalancedModeAutoEnable'],
  });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

  return {
    device,
    context,
    page,
    close: async () => {
      await context.close().catch(() => undefined);
      // Leave the device attached for the next test in the worker.
    },
  };
}

export async function closeAndroidDevice(device: AndroidDevice | null): Promise<void> {
  if (!device) return;
  await device.close().catch(() => undefined);
}
