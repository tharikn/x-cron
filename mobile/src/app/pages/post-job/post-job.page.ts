import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import type { JobType } from '../../core/models/job.model';
import { JOB_TYPE_LABELS } from '../../core/models/job.model';
import { JobsService } from '../../core/services/jobs.service';

type PostMode = 'quick' | 'paste';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.page.html',
  styleUrls: ['./post-job.page.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
  ],
})
export class PostJobPage {
  private readonly jobsService = inject(JobsService);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);

  readonly mode = signal<PostMode>('quick');
  readonly jobTypeEntries = Object.entries(JOB_TYPE_LABELS) as Array<[JobType, string]>;

  title = '';
  employerName = '';
  locationCity = 'Palani';
  jobType: JobType = 'full-time';
  salaryText = '';
  description = '';
  contentLanguage = 'en';
  contactPhone = '';
  pasteText = '';

  setMode(value: string | number | undefined): void {
    if (value === 'quick' || value === 'paste') {
      this.mode.set(value);
    }
  }

  async submitQuick(): Promise<void> {
    if (!this.title.trim() || !this.employerName.trim() || !this.description.trim()) {
      await this.showToast('Title, employer and description are required.');
      return;
    }

    const published = await this.jobsService.createQuickPost({
      title: this.title,
      employerName: this.employerName,
      locationCity: this.locationCity,
      jobType: this.jobType,
      salaryText: this.salaryText,
      description: this.description,
      contentLanguage: this.contentLanguage,
      contactPhone: this.contactPhone,
    });

    await this.showToast(
      this.jobsService.usingApi()
        ? 'Job published via API (contact stays private).'
        : 'Job saved locally (API offline).',
    );
    await this.router.navigate(['/tabs/jobs', published.id]);
  }

  async submitPaste(): Promise<void> {
    if (!this.pasteText.trim()) {
      await this.showToast('Paste a WhatsApp/Telegram job message first.');
      return;
    }

    const published = await this.jobsService.createFromPaste(
      this.pasteText,
      this.contentLanguage,
    );
    await this.showToast('Extracted and published. Contact stays private.');
    await this.router.navigate(['/tabs/jobs', published.id]);
  }

  async onPickImageStub(): Promise<void> {
    await this.showToast('Camera / image OCR will connect via Capacitor plugins next.');
  }

  async onPickFileStub(): Promise<void> {
    await this.showToast('PDF / spreadsheet import will connect via Capacitor file picker next.');
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      color: 'dark',
    });
    await toast.present();
  }
}
