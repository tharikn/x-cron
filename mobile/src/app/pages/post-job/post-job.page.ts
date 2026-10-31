import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';

type PostMode = 'quick' | 'paste';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.page.html',
  styleUrls: ['./post-job.page.scss'],
  imports: [
    FormsModule,
    RouterLink,
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
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);

  readonly mode = signal<PostMode>('quick');
  readonly isSignedIn = this.auth.isSignedIn;
  readonly employer = this.auth.employer;
  readonly jobTypeEntries = Object.entries(JOB_TYPE_LABELS) as Array<[JobType, string]>;

  title = '';
  employerName = this.auth.employer()?.name ?? '';
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
    if (!(await this.ensureEmployerReady())) return;
    if (!this.title.trim() || !this.employerName.trim() || !this.description.trim()) {
      await this.showToast('Title, employer and description are required.');
      return;
    }

    try {
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
      await this.showToast('Submitted for moderation. Admins must approve before it appears in search.');
      await this.router.navigate(['/tabs/account']);
      void published;
    } catch {
      await this.showToast('Post failed. Sign in as employer and ensure API is running.');
    }
  }

  async submitPaste(): Promise<void> {
    if (!(await this.ensureEmployerReady())) return;
    if (!this.pasteText.trim()) {
      await this.showToast('Paste a WhatsApp/Telegram job message first.');
      return;
    }

    try {
      await this.jobsService.createFromPaste(this.pasteText, this.contentLanguage);
      await this.showToast('Extracted and queued for moderation. Contact stays private.');
      await this.router.navigate(['/tabs/account']);
    } catch {
      await this.showToast('Paste publish failed. Sign in as employer first.');
    }
  }

  private async ensureEmployerReady(): Promise<boolean> {
    if (!this.auth.isSignedIn()) {
      await this.showToast('Employers must sign in before posting.');
      await this.router.navigate(['/tabs/account']);
      return false;
    }
    if (!this.auth.employer()) {
      try {
        await this.auth.createEmployer(this.employerName || 'My Business');
      } catch {
        await this.showToast('Create an employer profile in Account first.');
        await this.router.navigate(['/tabs/account']);
        return false;
      }
    }
    return true;
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2400,
      color: 'dark',
    });
    await toast.present();
  }
}
