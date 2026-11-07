import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet, ToastController } from '@ionic/angular';
import { AndroidBackService } from './core/services/android-back.service';
import { ApiLoadingService } from './core/services/api-loading.service';
import { AppUpdateService } from './core/services/app-update.service';
import { AuthService } from './core/services/auth.service';
import { ConnectivityService } from './core/services/connectivity.service';
import { DeepLinkService } from './core/services/deep-link.service';
import { LocaleService } from './core/services/locale.service';
import { NotificationsService } from './core/services/notifications.service';
import { OnboardingService } from './core/services/onboarding.service';
import { PreferencesService } from './core/services/preferences.service';
import { SeekerService } from './core/services/seeker.service';
import { ThemeService } from './core/services/theme.service';
import { TrackingService } from './core/services/tracking.service';
import { HelpChatComponent } from './shared/help-chat/help-chat.component';
import { ApiLoadingSkeletonComponent } from './shared/skeleton/api-loading-skeleton.component';
import { ThemePromptComponent } from './shared/theme-prompt/theme-prompt.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    IonApp,
    IonRouterOutlet,
    HelpChatComponent,
    ApiLoadingSkeletonComponent,
    ThemePromptComponent,
  ],
})
export class AppComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly preferences = inject(PreferencesService);
  private readonly theme = inject(ThemeService);
  private readonly notifications = inject(NotificationsService);
  private readonly onboarding = inject(OnboardingService);
  private readonly seeker = inject(SeekerService);
  private readonly router = inject(Router);
  private readonly apiLoading = inject(ApiLoadingService);
  private readonly locale = inject(LocaleService);
  private readonly appUpdate = inject(AppUpdateService);
  private readonly toastController = inject(ToastController);
  private readonly deepLinks = inject(DeepLinkService);
  private readonly androidBack = inject(AndroidBackService);
  private readonly connectivity = inject(ConnectivityService);
  private readonly tracking = inject(TrackingService);

  readonly busy = this.apiLoading.visible;
  readonly themePromptOpen = this.onboarding.themePromptOpen;
  readonly online = this.connectivity.online;

  async ngOnInit(): Promise<void> {
    this.theme.init();
    this.connectivity.start();
    this.tracking.start();
    this.deepLinks.start();
    this.androidBack.start();
    await this.auth.ensureSession();
    await this.preferences.hydrate();
    this.theme.syncFromRemote(this.preferences.preferences().theme);
    await this.locale.hydrate(this.preferences.preferences().interfaceLocale);
    // Session + prefs ready — drop HTML + native launch splash.
    void this.dismissBootSplash();
    this.onboarding.openThemePromptIfNeeded();
    if (!this.onboarding.themePromptOpen()) {
      void this.maybeForceProfileSetup();
    }
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

  onThemePromptClosed(): void {
    void this.maybeForceProfileSetup();
  }

  private async maybeForceProfileSetup(): Promise<void> {
    if (!this.auth.isSignedIn()) return;
    if (this.auth.isEmployer() || this.auth.isAdmin()) return;
    const path = this.router.url.split('?')[0] ?? '';
    if (
      path.startsWith('/onboarding/profile') ||
      path.startsWith('/tabs/account')
    ) {
      return;
    }
    try {
      const profile = await this.seeker.loadProfile();
      if (this.onboarding.shouldForceProfileSetup(profile)) {
        await this.router.navigateByUrl('/onboarding/profile');
      }
    } catch {
      // optional until API ready
    }
  }

  /** Remove index.html boot splash and hide Capacitor SplashScreen when native. */
  private async dismissBootSplash(): Promise<void> {
    const el = document.getElementById('boot-splash');
    if (el) {
      el.classList.add('boot-splash--done');
      window.setTimeout(() => el.remove(), 300);
    }
    try {
      const { Capacitor } = await import('@capacitor/core');
      if (!Capacitor.isNativePlatform()) return;
      const { SplashScreen } = await import('@capacitor/splash-screen');
      await SplashScreen.hide({ fadeOutDuration: 280 });
    } catch {
      // Browser / plugin unavailable — HTML splash already handled.
    }
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
