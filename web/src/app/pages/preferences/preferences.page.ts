import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { SeoService } from '../../core/services/seo.service';

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

  locationsText = '';
  categoriesText = '';
  notifyEmail = false;
  saved = false;

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Preferences',
      description: 'Save job search preferences on X Cron Jobs.',
      path: '/preferences',
    });
    const prefs = this.preferences.prefs();
    this.locationsText = prefs.locations.join(', ');
    this.categoriesText = prefs.categories.join(', ');
    this.notifyEmail = prefs.notifyEmail;
  }

  async save(): Promise<void> {
    this.preferences.save({
      locations: this.split(this.locationsText),
      categories: this.split(this.categoriesText),
      notifyEmail: this.notifyEmail,
    });
    if (this.auth.isSignedIn()) {
      try {
        await this.notifications.savePrefs({
          emailAlertsEnabled: this.notifyEmail,
          jobAlertsEnabled: true,
        });
      } catch {
        // local prefs still saved
      }
    }
    this.saved = true;
  }

  clear(): void {
    this.preferences.clear();
    this.locationsText = '';
    this.categoriesText = '';
    this.notifyEmail = false;
    this.saved = false;
  }

  private split(value: string): string[] {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
}
