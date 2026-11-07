import type { Page } from '@playwright/test';

/** Matches web `xcron.web.themePromptDone` + mobile `xcron.themePromptDone`. */
const THEME_DONE_KEYS = ['xcron.web.themePromptDone', 'xcron.themePromptDone'] as const;

/** Seed before first navigation so `app-theme-prompt` never overlays auth/chrome. */
export async function skipThemePrompt(page: Page): Promise<void> {
  await page.addInitScript((keys: readonly string[]) => {
    for (const key of keys) {
      try {
        localStorage.setItem(key, '1');
      } catch {
        /* ignore */
      }
    }
  }, THEME_DONE_KEYS);
}

/** Dismiss if a prior navigation already opened the dialog. */
export async function dismissThemePromptIfOpen(page: Page): Promise<void> {
  const dialog = page.locator('.theme-prompt[role="dialog"]');
  if (!(await dialog.isVisible().catch(() => false))) return;
  const cta = dialog.locator('button.theme-prompt__cta').first();
  if (await cta.isVisible().catch(() => false)) {
    await cta.click({ timeout: 5_000 });
  }
  await dialog.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
}
