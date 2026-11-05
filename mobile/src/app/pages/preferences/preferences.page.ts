import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonToggle,
  ToastController,
} from '@ionic/angular';
import type { JobType } from '../../core/models/job.model';
import { JOB_TYPE_LABELS } from '../../core/models/job.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { LocationTypeaheadComponent } from '../../shared/location-typeahead/location-typeahead.component';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
  imports: [
    FormsModule,
    RouterLink,
    IonList,
    IonItem,
    IonInput,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonButton,
    IonNote,
    LocationTypeaheadComponent,
    TranslatePipe,
  ],
})
export class PreferencesPage implements OnInit {
  private readonly preferencesService = inject(PreferencesService);
  private readonly notifications = inject(NotificationsService);
  private readonly auth = inject(AuthService);
  private readonly toastController = inject(ToastController);
  private readonly locale = inject(LocaleService);
  private readonly jobs = inject(JobsService);

  readonly jobTypeEntries = Object.entries(JOB_TYPE_LABELS) as Array<[JobType, string]>;
  readonly syncScope = this.preferencesService.syncScope;
  readonly isSignedIn = this.auth.isSignedIn;
  readonly notifPrefs = this.notifications.prefs;
  readonly pushPermission = this.notifications.pushPermission;
  readonly deviceRegistered = this.notifications.deviceRegistered;
  readonly languages = this.locale.languages;

  location = this.preferencesService.preferences().locations[0] ?? '';
  jobType: JobType | '' = this.preferencesService.preferences().jobTypes[0] ?? '';
  category = this.preferencesService.preferences().categories[0] ?? '';
  language = this.preferencesService.preferences().languages[0] ?? 'en';
  salaryMin: number | null = this.preferencesService.preferences().salaryMin ?? null;
  remotePreferred = this.preferencesService.preferences().remotePreferred;
  sort: 'newest' | 'oldest' | 'salary-desc' | 'salary-asc' | 'relevance' | 'distance' =
    this.preferencesService.preferences().sort ?? 'newest';
  interfaceLocale = this.preferencesService.preferences().interfaceLocale;
  readonly categories = signal<string[]>([]);

  async ngOnInit(): Promise<void> {
    await this.preferencesService.hydrate();
    this.categories.set(await this.jobs.categories());
    if (!this.locale.ready()) {
      await this.locale.hydrate(this.preferencesService.preferences().interfaceLocale);
    }
    const prefs = this.preferencesService.preferences();
    this.location = prefs.locations[0] ?? '';
    this.jobType = prefs.jobTypes[0] ?? '';
    this.category = prefs.categories[0] ?? '';
    this.language = prefs.languages[0] ?? 'en';
    this.salaryMin = prefs.salaryMin ?? null;
    this.remotePreferred = prefs.remotePreferred;
    this.sort = prefs.sort ?? 'newest';
    this.interfaceLocale = prefs.interfaceLocale || this.locale.language();
    this.locale.setLanguage(this.interfaceLocale);
    await this.notifications.registerDevice();
    await this.notifications.refreshPushPermissionState();
    if (this.auth.isSignedIn()) {
      try {
        await this.notifications.loadPrefs();
      } catch {
        // ignore
      }
    }
  }

  osPermissionLabel(): string {
    switch (this.pushPermission()) {
      case 'granted':
        return 'System notifications: Allowed';
      case 'denied':
        return 'System notifications: Blocked — enable in phone settings';
      case 'unsupported':
        return 'System notifications: Not supported on this device';
      default:
        return 'System notifications: Not decided yet';
    }
  }

  async enableSystemNotifications(): Promise<void> {
    const result = await this.notifications.promptOsPermissionAfterSignIn();
    if (result.status === 'granted') {
      await this.showToast('System notifications enabled');
      return;
    }
    if (result.status === 'denied') {
      await this.showToast(
        'System notifications blocked — enable them in phone settings',
      );
      return;
    }
    if (result.status === 'unsupported') {
      await this.showToast('This device does not support system notifications');
    }
  }

  async save(): Promise<void> {
    try {
      const interfaceLocale = this.locale.language() || this.interfaceLocale || 'en';
      this.interfaceLocale = interfaceLocale;
      await this.preferencesService.save({
        locations: this.location.trim() ? [this.location.trim()] : [],
        jobTypes: this.jobType ? [this.jobType] : [],
        categories: this.category ? [this.category] : [],
        languages: this.language ? [this.language] : ['en'],
        salaryMin: this.salaryMin,
        remotePreferred: this.remotePreferred,
        sort: this.sort,
        interfaceLocale,
      });
      const scope = this.syncScope();
      await this.showToast(
        scope === 'account'
          ? 'Preferences synced to your account.'
          : scope === 'device'
            ? 'Preferences saved for this device.'
            : 'Preferences saved locally on this device.',
      );
    } catch {
      await this.showToast('Could not save preferences.');
    }
  }

  async clear(): Promise<void> {
    await this.preferencesService.clear();
    this.location = '';
    this.jobType = '';
    this.category = '';
    this.language = 'en';
    this.salaryMin = null;
    this.remotePreferred = false;
    this.sort = 'newest';
    this.interfaceLocale = 'en';
    this.locale.setLanguage('en');
    await this.showToast('Preferences cleared.');
  }

  async toggleAlert(
    key:
      | 'jobAlertsEnabled'
      | 'inAppEnabled'
      | 'pushAlertsEnabled'
      | 'emailAlertsEnabled',
    enabled: boolean,
  ): Promise<void> {
    if (!this.auth.isSignedIn()) {
      await this.showToast('Sign in to manage job alert notifications.');
      return;
    }
    try {
      await this.notifications.savePrefs({ [key]: enabled });
      if (key === 'pushAlertsEnabled' && enabled) {
        const result = await this.notifications.promptOsPermissionAfterSignIn();
        await this.showToast(
          result.status === 'granted'
            ? 'Push alerts on — system notifications enabled.'
            : result.status === 'denied'
              ? 'Push preference saved, but system notifications are blocked in phone settings.'
              : 'Push preference saved, but notification permission was not granted.',
        );
        return;
      }
      await this.showToast(enabled ? 'Alert preference saved.' : 'Alert preference off.');
    } catch {
      await this.showToast('Could not update notification preferences.');
    }
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'dark',
    });
    await toast.present();
  }
}
