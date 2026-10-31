import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import type { JobType } from '../../core/models/job.model';
import { JOB_TYPE_LABELS } from '../../core/models/job.model';
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
  ],
})
export class PreferencesPage {
  private readonly preferencesService = inject(PreferencesService);
  private readonly toastController = inject(ToastController);

  readonly jobTypeEntries = Object.entries(JOB_TYPE_LABELS) as Array<[JobType, string]>;

  location = this.preferencesService.preferences().locations[0] ?? 'Palani';
  jobType: JobType | '' = this.preferencesService.preferences().jobTypes[0] ?? '';
  language = this.preferencesService.preferences().languages[0] ?? 'en';
  salaryMin: number | null = this.preferencesService.preferences().salaryMin ?? null;
  remotePreferred = this.preferencesService.preferences().remotePreferred;
  interfaceLocale = this.preferencesService.preferences().interfaceLocale;

  async save(): Promise<void> {
    this.preferencesService.save({
      locations: this.location.trim() ? [this.location.trim()] : [],
      jobTypes: this.jobType ? [this.jobType] : [],
      languages: this.language ? [this.language] : ['en'],
      salaryMin: this.salaryMin,
      remotePreferred: this.remotePreferred,
      interfaceLocale: this.interfaceLocale,
    });
    const toast = await this.toastController.create({
      message: 'Preferences saved locally on this device.',
      duration: 2000,
      color: 'dark',
    });
    await toast.present();
  }

  async clear(): Promise<void> {
    this.preferencesService.clear();
    this.location = '';
    this.jobType = '';
    this.language = 'en';
    this.salaryMin = null;
    this.remotePreferred = false;
    this.interfaceLocale = 'en';
    const toast = await this.toastController.create({
      message: 'Preferences cleared.',
      duration: 1800,
      color: 'dark',
    });
    await toast.present();
  }
}
