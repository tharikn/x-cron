import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
  readonly busy = signal(false);
  readonly saved = signal(false);
  readonly error = signal<string | null>(null);

  unlockPriceInr = 5;

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Settings',
      description: 'Configure contact unlock pricing for X Cron Jobs.',
      path: '/settings',
      robots: 'noindex,follow',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
    if (this.auth.isSignedIn() && this.auth.isAdmin()) {
      const commerce = await this.site.hydrateCommerce();
      this.unlockPriceInr = commerce.unlockPriceInr;
    }
  }

  async save(): Promise<void> {
    const value = Math.round(Number(this.unlockPriceInr));
    if (!Number.isFinite(value) || value < 1 || value > 9999) {
      this.error.set('Enter a whole rupee amount between 1 and 9999.');
      return;
    }

    this.busy.set(true);
    this.error.set(null);
    this.saved.set(false);
    try {
      const doc = await this.site.updateCommerce(value);
      this.unlockPriceInr = doc.unlockPriceInr;
      this.saved.set(true);
      this.toast.show(`Unlock price set to ₹${doc.unlockPriceInr}`);
    } catch {
      this.error.set('Could not save. Sign in as admin and ensure the API is running.');
    } finally {
      this.busy.set(false);
    }
  }
}
