import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-preferences',
  imports: [FormsModule, RouterLink],
  templateUrl: './preferences.page.html',
  styleUrl: './preferences.page.scss',
})
export class PreferencesPage implements OnInit {
  private readonly preferences = inject(PreferencesService);
  private readonly notifications = inject(NotificationsService);
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  locationsText = '';
  categoriesText = '';
  notifyEmail = false;
  saved = false;

  readonly isSignedIn = this.auth.isSignedIn;
  readonly notifPrefs = this.notifications.prefs;

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Preferences',
      description: 'Save job search preferences on X Cron Jobs.',
      path: '/settings/preferences',
    });
    await this.auth.ensureSession();
    if (this.auth.isSignedIn()) {
      try {
        await this.preferences.hydrateFromApi();
        await this.notifications.loadPrefs();
      } catch {
        // local search prefs still usable
      }
    }
    const prefs = this.preferences.prefs();
    this.locationsText = prefs.locations.join(', ');
    this.categoriesText = prefs.categories.join(', ');
    this.notifyEmail = prefs.notifyEmail;
  }

  async save(): Promise<void> {
    const next = {
      ...this.preferences.prefs(),
      locations: this.split(this.locationsText),
      categories: this.split(this.categoriesText),
      notifyEmail: this.notifyEmail,
    };
    try {
      await this.preferences.saveAndSync(next);
      if (this.auth.isSignedIn()) {
        await this.notifications.savePrefs({
          emailAlertsEnabled: this.notifyEmail,
          jobAlertsEnabled: true,
        });
      }
      this.saved = true;
      this.toast.show('Preferences saved');
    } catch {
      this.preferences.save(next);
      this.saved = true;
      this.toast.show('Saved locally; could not sync to account', 'error');
    }
  }

  clear(): void {
    this.preferences.clear();
    this.locationsText = '';
    this.categoriesText = '';
    this.notifyEmail = false;
    this.saved = false;
  }

  async toggleAlert(
    key:
      | 'jobAlertsEnabled'
      | 'inAppEnabled'
      | 'pushAlertsEnabled'
      | 'emailAlertsEnabled',
    value: boolean,
  ): Promise<void> {
    try {
      await this.notifications.savePrefs({ [key]: value });
      if (key === 'emailAlertsEnabled') {
        this.notifyEmail = value;
        const current = this.preferences.prefs();
        this.preferences.save({ ...current, notifyEmail: value });
      }
      this.toast.show('Alert preference saved');
    } catch {
      this.toast.show('Could not save preference', 'error');
    }
  }

  private split(value: string): string[] {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
}
