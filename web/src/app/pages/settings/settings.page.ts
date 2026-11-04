import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import type { PostJobPaymentMode } from '../../core/models/site.model';
import { AuthService } from '../../core/services/auth.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { SiteService } from '../../core/services/site.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, RouterLink],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
})
export class SettingsPage implements OnInit {
  private readonly site = inject(SiteService);
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(LocaleService);
  private readonly toast = inject(ToastService);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly commerceBusy = signal(false);
  readonly authBusy = signal(false);
  readonly commerceSaved = signal(false);
  readonly authSaved = signal(false);
  readonly commerceError = signal<string | null>(null);
  readonly authError = signal<string | null>(null);

  unlockPriceInr = 5;
  paymentsEnabled = true;
  postJobPaymentMode: PostJobPaymentMode = 'optional';
  postJobPriceInr = 5;
  sessionTtlDays = 30;
  otpTtlMinutes = 10;

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Settings',
      description: 'Configure payments, unlock pricing, and auth session expiry for X Cron Jobs.',
      path: '/settings/site',
      robots: 'noindex,follow',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
    if (this.auth.isSignedIn() && this.auth.isAdmin()) {
      const [commerce, authCfg] = await Promise.all([
        this.site.hydrateCommerce(),
        this.site.hydrateAuth(),
      ]);
      this.unlockPriceInr = commerce.unlockPriceInr;
      this.paymentsEnabled = commerce.paymentsEnabled !== false;
      this.postJobPaymentMode = commerce.postJobPaymentMode ?? 'optional';
      this.postJobPriceInr = commerce.postJobPriceInr ?? 5;
      this.sessionTtlDays = authCfg.sessionTtlDays;
      this.otpTtlMinutes = authCfg.otpTtlMinutes;
    }
  }

  async saveCommerce(): Promise<void> {
    const value = Math.round(Number(this.unlockPriceInr));
    const postFee = Math.round(Number(this.postJobPriceInr));
    if (!Number.isFinite(value) || value < 1 || value > 9999) {
      this.commerceError.set('Unlock price must be 1–9999 rupees.');
      return;
    }
    if (!Number.isFinite(postFee) || postFee < 0 || postFee > 9999) {
      this.commerceError.set('Post-job fee must be 0–9999 rupees.');
      return;
    }

    this.commerceBusy.set(true);
    this.commerceError.set(null);
    this.commerceSaved.set(false);
    try {
      const doc = await this.site.updateCommerce({
        unlockPriceInr: value,
        paymentsEnabled: this.paymentsEnabled,
        postJobPaymentMode: this.postJobPaymentMode,
        postJobPriceInr: postFee,
      });
      this.unlockPriceInr = doc.unlockPriceInr;
      this.paymentsEnabled = doc.paymentsEnabled;
      this.postJobPaymentMode = doc.postJobPaymentMode;
      this.postJobPriceInr = doc.postJobPriceInr;
      this.commerceSaved.set(true);
      this.toast.show(
        doc.paymentsEnabled
          ? `Payments on · unlock ₹${doc.unlockPriceInr} · post ${doc.postJobPaymentMode}`
          : 'Payments turned off globally',
      );
    } catch {
      this.commerceError.set('Could not save. Sign in as admin and ensure the API is running.');
    } finally {
      this.commerceBusy.set(false);
    }
  }

  async saveAuth(): Promise<void> {
    const sessionTtlDays = Math.round(Number(this.sessionTtlDays));
    const otpTtlMinutes = Math.round(Number(this.otpTtlMinutes));
    if (!Number.isFinite(sessionTtlDays) || sessionTtlDays < 1 || sessionTtlDays > 365) {
      this.authError.set('Session expiry must be 1–365 days.');
      return;
    }
    if (!Number.isFinite(otpTtlMinutes) || otpTtlMinutes < 1 || otpTtlMinutes > 60) {
      this.authError.set('OTP expiry must be 1–60 minutes.');
      return;
    }

    this.authBusy.set(true);
    this.authError.set(null);
    this.authSaved.set(false);
    try {
      const doc = await this.site.updateAuth({ sessionTtlDays, otpTtlMinutes });
      this.sessionTtlDays = doc.sessionTtlDays;
      this.otpTtlMinutes = doc.otpTtlMinutes;
      this.authSaved.set(true);
      this.toast.show(
        `Auth TTLs set to ${doc.sessionTtlDays}d session / ${doc.otpTtlMinutes}m OTP`,
      );
    } catch {
      this.authError.set('Could not save. Sign in as admin and ensure the API is running.');
    } finally {
      this.authBusy.set(false);
    }
  }
}
