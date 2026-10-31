import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import type { JobType } from '../../core/models/job.model';
import { JOB_TYPE_LABELS } from '../../core/models/job.model';
import { AuthService } from '../../core/services/auth.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { PreferencesService } from '../../core/services/preferences.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonButton,
    IonNote,
  ],
})
export class PreferencesPage implements OnInit {
  private readonly preferencesService = inject(PreferencesService);
  private readonly notifications = inject(NotificationsService);
  private readonly auth = inject(AuthService);
  private readonly toastController = inject(ToastController);

  readonly jobTypeEntries = Object.entries(JOB_TYPE_LABELS) as Array<[JobType, string]>;
  readonly syncScope = this.preferencesService.syncScope;
  readonly isSignedIn = this.auth.isSignedIn;
  readonly notifPrefs = this.notifications.prefs;
  readonly deviceRegistered = this.notifications.deviceRegistered;

  location = this.preferencesService.preferences().locations[0] ?? 'Palani';
  jobType: JobType | '' = this.preferencesService.preferences().jobTypes[0] ?? '';
  language = this.preferencesService.preferences().languages[0] ?? 'en';
  salaryMin: number | null = this.preferencesService.preferences().salaryMin ?? null;
  remotePreferred = this.preferencesService.preferences().remotePreferred;
  interfaceLocale = this.preferencesService.preferences().interfaceLocale;

  async ngOnInit(): Promise<void> {
    await this.preferencesService.hydrate();
    const prefs = this.preferencesService.preferences();
    this.location = prefs.locations[0] ?? '';
    this.jobType = prefs.jobTypes[0] ?? '';
    this.language = prefs.languages[0] ?? 'en';
    this.salaryMin = prefs.salaryMin ?? null;
    this.remotePreferred = prefs.remotePreferred;
    this.interfaceLocale = prefs.interfaceLocale;
    await this.notifications.registerDevice();
    if (this.auth.isSignedIn()) {
      try {
        await this.notifications.loadPrefs();
      } catch {
        // ignore
      }
    }
  }

  async save(): Promise<void> {
    try {
      await this.preferencesService.save({
        locations: this.location.trim() ? [this.location.trim()] : [],
        jobTypes: this.jobType ? [this.jobType] : [],
        languages: this.language ? [this.language] : ['en'],
        salaryMin: this.salaryMin,
        remotePreferred: this.remotePreferred,
        interfaceLocale: this.interfaceLocale,
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
    this.language = 'en';
    this.salaryMin = null;
    this.remotePreferred = false;
    this.interfaceLocale = 'en';
    await this.showToast('Preferences cleared.');
  }

  async toggleJobAlerts(enabled: boolean): Promise<void> {
    if (!this.auth.isSignedIn()) {
      await this.showToast('Sign in to manage job alert notifications.');
      return;
    }
    try {
      await this.notifications.savePrefs({ jobAlertsEnabled: enabled });
      await this.showToast(enabled ? 'Job alerts on.' : 'Job alerts off.');
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
