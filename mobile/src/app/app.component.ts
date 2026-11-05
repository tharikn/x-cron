import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, ToastController } from '@ionic/angular';
import { ApiLoadingService } from './core/services/api-loading.service';
import { AppUpdateService } from './core/services/app-update.service';
import { AuthService } from './core/services/auth.service';
import { LocaleService } from './core/services/locale.service';
import { NotificationsService } from './core/services/notifications.service';
import { PreferencesService } from './core/services/preferences.service';
import { ThemeService } from './core/services/theme.service';
import { HelpChatComponent } from './shared/help-chat/help-chat.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, HelpChatComponent],
})
export class AppComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly preferences = inject(PreferencesService);
  private readonly theme = inject(ThemeService);
  private readonly notifications = inject(NotificationsService);
  private readonly apiLoading = inject(ApiLoadingService);
  private readonly locale = inject(LocaleService);
  private readonly appUpdate = inject(AppUpdateService);
  private readonly toastController = inject(ToastController);

  readonly busy = this.apiLoading.visible;

  async ngOnInit(): Promise<void> {
    this.theme.init();
    await this.auth.ensureSession();
    await this.preferences.hydrate();
    this.theme.syncFromRemote(this.preferences.preferences().theme);
    await this.locale.hydrate(this.preferences.preferences().interfaceLocale);
    this.notifications.watchOsPermission((status) => {
      void this.toastOsPermission(status);
    });
    await this.notifications.registerDevice();
    if (this.auth.isSignedIn()) {
      try {
        await this.notifications.loadPrefs();
        if (this.notifications.prefs().pushAlertsEnabled !== false) {
          const result = await this.notifications.promptOsPermissionAfterSignIn();
          if (result.asked) {
            await this.toastOsPermission(result.status);
          }
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

  private async toastOsPermission(
    status: 'granted' | 'denied' | 'prompt' | 'unsupported',
  ): Promise<void> {
    let message: string | null = null;
    let cssClass = 'xcron-toast--success';
    if (status === 'granted') {
      message = 'System notifications enabled';
    } else if (status === 'denied') {
      message =
        'System notifications blocked — enable them in phone settings';
      cssClass = 'xcron-toast--error';
    } else if (status === 'unsupported') {
      message = 'This device does not support system notifications';
      cssClass = 'xcron-toast--error';
    }
    if (!message) return;
    const toast = await this.toastController.create({
      message,
      duration: 2800,
      position: 'bottom',
      cssClass,
    });
    await toast.present();
  }
}
