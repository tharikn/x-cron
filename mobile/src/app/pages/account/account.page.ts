import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import type { Job } from '../../core/models/job.model';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonButton,
    IonInput,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
  ],
})
export class AccountPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly jobsService = inject(JobsService);
  private readonly toastController = inject(ToastController);

  readonly user = this.auth.user;
  readonly employer = this.auth.employer;
  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly queue = signal<Job[]>([]);

  channel: 'phone' | 'email' = 'email';
  destination = '';
  intendedRole: 'seeker' | 'employer' = 'seeker';
  challengeId = '';
  code = '';
  devCode = '';
  employerName = '';

  async ngOnInit(): Promise<void> {
    await this.auth.refreshMe();
    if (this.isAdmin()) {
      await this.reloadQueue();
    }
  }

  async startOtp(): Promise<void> {
    if (!this.destination.trim()) {
      await this.showToast('Enter phone or email first.');
      return;
    }
    try {
      const result = await this.auth.startOtp({
        channel: this.channel,
        destination: this.destination.trim(),
        intendedRole: this.intendedRole,
      });
      this.challengeId = result.challengeId;
      this.devCode = result.devCode ?? '';
      this.code = result.devCode ?? '';
      await this.showToast(
        result.devCode
          ? `OTP sent (dev code ${result.devCode}).`
          : 'OTP sent. Check your phone/email.',
      );
    } catch {
      await this.showToast('Could not start OTP. Is the API running?');
    }
  }

  async verifyOtp(): Promise<void> {
    if (!this.challengeId || !this.code.trim()) {
      await this.showToast('Enter the OTP code.');
      return;
    }
    try {
      await this.auth.verifyOtp(this.challengeId, this.code.trim());
      this.challengeId = '';
      this.code = '';
      this.devCode = '';
      if (this.intendedRole === 'employer' && !this.auth.employer()) {
        await this.auth.createEmployer(this.employerName || 'My Business');
      }
      if (this.isAdmin()) await this.reloadQueue();
      await this.showToast('Signed in.');
    } catch {
      await this.showToast('Invalid or expired OTP.');
    }
  }

  async createEmployer(): Promise<void> {
    if (!this.employerName.trim()) {
      await this.showToast('Enter a business name.');
      return;
    }
    try {
      await this.auth.createEmployer(this.employerName.trim());
      await this.showToast('Employer profile created.');
    } catch {
      await this.showToast('Could not create employer profile.');
    }
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.queue.set([]);
    await this.showToast('Signed out. Guest browsing still works.');
  }

  async continueAsGuest(): Promise<void> {
    await this.auth.logout();
    await this.showToast('Browsing as guest. Sign-in is optional.');
  }

  async startGoogleStub(): Promise<void> {
    await this.showToast('Google sign-in is optional and not required for browsing.');
  }

  async reloadQueue(): Promise<void> {
    try {
      this.queue.set(await this.jobsService.moderationQueue('needs-review'));
    } catch {
      this.queue.set([]);
    }
  }

  async approve(job: Job): Promise<void> {
    await this.jobsService.approveJob(job.id, 'Approved');
    await this.reloadQueue();
    await this.showToast(`Approved ${job.title}`);
  }

  async reject(job: Job): Promise<void> {
    await this.jobsService.rejectJob(job.id, 'Rejected by moderator');
    await this.reloadQueue();
    await this.showToast(`Rejected ${job.title}`);
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
