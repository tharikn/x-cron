import type { Page } from '@playwright/test';
import type { ClientKind } from '../helpers/env';
import { pathsFor } from '../helpers/env';
import { dismissThemePromptIfOpen } from '../helpers/theme-prompt';

/** Sign-in / register UI shared patterns (mobile Account + web /sign-in). */
export class AuthPage {
  constructor(
    readonly page: Page,
    readonly client: ClientKind,
  ) {}

  paths() {
    return pathsFor(this.client);
  }

  async gotoSignIn(): Promise<void> {
    await this.page.goto(this.paths().signIn);
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissThemePromptIfOpen(this.page);
  }

  async openRegister(): Promise<void> {
    const alreadyRegister = this.page.locator(
      'input[name="confirmPassword"], ion-input[name="confirmPassword"]',
    );
    if (await alreadyRegister.first().isVisible().catch(() => false)) {
      return;
    }
    const signup = this.page
      .getByRole('button', { name: /Sign Up/i })
      .or(this.page.locator('button.signup-block__btn, .auth-block ion-button'));
    await signup.first().click({ timeout: 15_000 });
    await alreadyRegister.first().waitFor({ state: 'visible', timeout: 15_000 });
  }

  async chooseRole(role: 'seeker' | 'employer'): Promise<void> {
    const value = role === 'employer' ? 'employer' : 'seeker';
    const radio = this.page.locator(`input[name="intendedRole"][value="${value}"]`);
    if (await radio.count()) {
      await radio.check({ force: true });
      return;
    }
    const label = role === 'employer' ? /Recruiter/i : /Job Seeker/i;
    const btn = this.page.getByRole('button', { name: label });
    if (await btn.count()) {
      await btn.first().click();
    }
  }

  private async fillNamedInput(name: string, value: string): Promise<void> {
    const ion = this.page.locator(`ion-input[name="${name}"]`);
    if (await ion.count()) {
      const inner = ion.locator('input').first();
      if (await inner.count()) {
        await inner.fill(value);
        return;
      }
      await ion.click();
      await this.page.keyboard.type(value);
      return;
    }
    const native = this.page.locator(`input[name="${name}"]`);
    if (await native.count()) {
      await native.first().fill(value);
      return;
    }
    // Web stacked labels often use adjacent inputs without name on password confirm.
    const byPlaceholder = this.page.getByPlaceholder(/your_name|Enter Username|••••|Password/i);
    throw new Error(`Could not find input name=${name}; placeholders=${await byPlaceholder.count()}`);
  }

  async fillUsername(username: string): Promise<void> {
    const ion = this.page.locator('ion-input[name="username"] input').first();
    if (await ion.count()) {
      await ion.fill(username);
      return;
    }
    const web = this.page.locator('input[name="username"], input[autocomplete="username"]').first();
    if (await web.count()) {
      await web.fill(username);
      return;
    }
    await this.page.getByPlaceholder(/your_name|Enter Username/i).first().fill(username);
  }

  async fillPassword(password: string, confirm = false): Promise<void> {
    if (confirm) {
      const confirmIon = this.page.locator('ion-input[name="confirmPassword"] input').first();
      if (await confirmIon.count()) {
        await confirmIon.fill(password);
        return;
      }
      const confirmWeb = this.page.locator('input[name="confirmPassword"]').first();
      if (await confirmWeb.count()) {
        await confirmWeb.fill(password);
        return;
      }
    }
    const ion = this.page.locator('ion-input[name="password"] input').first();
    if (await ion.count()) {
      await ion.fill(password);
      return;
    }
    const web = this.page.locator('input[name="password"], input[type="password"]').first();
    await web.fill(password);
  }

  async fillConfirmPassword(password: string): Promise<void> {
    const ion = this.page.locator('ion-input[name="confirmPassword"] input').first();
    if (await ion.count()) {
      await ion.fill(password);
      return;
    }
    const web = this.page.locator('input[name="confirmPassword"], input[autocomplete="new-password"]').nth(1);
    if (await web.count()) {
      await web.fill(password);
      return;
    }
    // Fallback: second password field on register form
    const passwords = this.page.locator('input[type="password"]');
    await passwords.nth(1).fill(password);
  }

  async submitLogin(): Promise<void> {
    const btn = this.page.getByRole('button', {
      name: /^(Login|Employer sign in|Signing in…)$/i,
    });
    await btn.first().click();
  }

  async submitRegister(): Promise<void> {
    const btn = this.page.getByRole('button', {
      name: /Create (recruiter )?account|Creating…/i,
    });
    await btn.first().click();
  }

  async register(opts: {
    username: string;
    password: string;
    role: 'seeker' | 'employer';
  }): Promise<void> {
    await this.gotoSignIn();
    await this.openRegister();
    await this.chooseRole(opts.role);
    await this.fillUsername(opts.username);
    await this.fillPassword(opts.password);
    await this.fillConfirmPassword(opts.password);
    await this.submitRegister();
  }

  async login(opts: { username: string; password: string }): Promise<void> {
    await this.gotoSignIn();
    await this.fillUsername(opts.username);
    await this.fillPassword(opts.password);
    await this.submitLogin();
  }

  async expectSignedIn(): Promise<void> {
    // Hub shows Profile segment or Signed in row, not the Login CTA.
    const profile = this.page.getByText(/Profile|Signed in|Your profile|Manage your profile/i).first();
    await profile.waitFor({ state: 'visible', timeout: 20_000 });
  }

  async openAccountTab(tab: 'profile' | 'apply' | 'activity' | 'rating' | 'account'): Promise<void> {
    const labels: Record<typeof tab, RegExp> = {
      profile: /^Profile$/i,
      apply: /^Apply$/i,
      activity: /^Activity$/i,
      rating: /^Rating$/i,
      account: /^Account$/i,
    };
    const segment = this.page.getByRole('button', { name: labels[tab] }).or(
      this.page.locator(`ion-segment-button[value="${tab}"]`),
    );
    await segment.first().click();
  }

  async signOut(): Promise<void> {
    const loginCta = () =>
      this.page.getByRole('button', { name: /^(Login|Employer sign in)/i }).first();
    const signOutBtn = () =>
      this.page.getByRole('button', { name: /Sign out|Log out/i }).first();

    // Applied / Discover hide Sign out — open Account tab where it lives.
    if (!(await signOutBtn().isVisible().catch(() => false))) {
      await this.page.goto(`${this.paths().account}?tab=account`);
      await this.page.waitForLoadState('domcontentloaded').catch(() => undefined);
      await this.openAccountTab('account').catch(() => undefined);
    }
    if (await signOutBtn().isVisible().catch(() => false)) {
      await signOutBtn().click();
      if (await loginCta().isVisible({ timeout: 15_000 }).catch(() => false)) {
        return;
      }
    }

    // Guaranteed dual-role handoff: wipe client session then reload guest sign-in.
    await this.page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {
        /* ignore */
      }
    });
    await this.page.context().clearCookies();
    await this.gotoSignIn();
    await loginCta().waitFor({ state: 'visible', timeout: 20_000 });
  }
}
