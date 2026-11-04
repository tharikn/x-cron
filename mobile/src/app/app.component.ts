import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { ApiLoadingService } from './core/services/api-loading.service';
import { AppUpdateService } from './core/services/app-update.service';
import { AuthService } from './core/services/auth.service';
import { LocaleService } from './core/services/locale.service';
import { NotificationsService } from './core/services/notifications.service';
import { PreferencesService } from './core/services/preferences.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly preferences = inject(PreferencesService);
  private readonly notifications = inject(NotificationsService);
  private readonly apiLoading = inject(ApiLoadingService);
  private readonly locale = inject(LocaleService);
  private readonly appUpdate = inject(AppUpdateService);

  readonly busy = this.apiLoading.visible;

  async ngOnInit(): Promise<void> {
    await this.auth.ensureSession();
    await this.preferences.hydrate();
    await this.locale.hydrate(this.preferences.preferences().interfaceLocale);
    await this.notifications.registerDevice();
    if (this.auth.isSignedIn()) {
      try {
        await this.notifications.loadPrefs();
        if (this.notifications.prefs().pushAlertsEnabled !== false) {
          await this.notifications.ensurePushPermission();
          // Re-link after FCM token arrives — first registerDevice may have
          // exited early on stub_fcm_* while PushNotifications.register() ran.
          await this.notifications.registerDevice();
        }
        await this.notifications.refreshInbox({ announce: true });
      } catch {
        // optional until signed in with API
      }
    }
    this.notifications.startPolling();
    void this.appUpdate.checkForUpdate();
  }
}
