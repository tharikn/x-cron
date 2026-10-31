import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import type { Job } from '../../core/models/job.model';
import { JobsService } from '../../core/services/jobs.service';
import {
  formatJobType,
  formatLocation,
  formatPostedDate,
  formatSalary,
  formatUnlockPrice,
  languageLabel,
} from '../../core/utils/format';
import { JobCardComponent } from '../../shared/job-card/job-card.component';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.page.html',
  styleUrls: ['./job-detail.page.scss'],
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonBadge,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    JobCardComponent,
  ],
})
export class JobDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly jobsService = inject(JobsService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  readonly job = signal<Job | undefined>(undefined);
  readonly related = signal<Job[]>([]);

  readonly formatLocation = formatLocation;
  readonly formatSalary = formatSalary;
  readonly formatJobType = formatJobType;
  readonly formatPostedDate = formatPostedDate;
  readonly formatUnlockPrice = formatUnlockPrice;
  readonly languageLabel = languageLabel;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const job = await this.jobsService.getById(id);
    this.job.set(job);
    if (job) {
      this.related.set(await this.jobsService.related(job.id));
    }
  }

  async unlockContact(): Promise<void> {
    const job = this.job();
    if (!job) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Unlock employer contact',
      message: `Contact details stay private until purchase. Proposed price ${formatUnlockPrice(job.contact.unlockPricePaise)}. Payments land in a later PRD release.`,
      buttons: [
        { text: 'Close', role: 'cancel' },
        {
          text: 'Check entitlement',
          handler: async () => {
            const toast = await this.toastController.create({
              message: 'API denied contact reveal — entitlement required.',
              duration: 2500,
              color: 'dark',
            });
            await toast.present();
          },
        },
      ],
    });
    await alert.present();
  }

  async shareJob(): Promise<void> {
    const job = this.job();
    if (!job) {
      return;
    }
    const url = `https://xcron.jobs/jobs/${job.slug}`;
    if (navigator.share) {
      await navigator.share({ title: job.title, text: `${job.title} at ${job.employerName}`, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    const toast = await this.toastController.create({
      message: 'Share link copied.',
      duration: 1800,
      color: 'dark',
    });
    await toast.present();
  }

  async reportJob(): Promise<void> {
    const job = this.job();
    if (!job) return;
    try {
      await this.jobsService.reportJob(job.id, 'Reported as suspicious or incorrect from mobile app');
      const toast = await this.toastController.create({
        message: 'Report submitted for moderation.',
        duration: 2000,
        color: 'dark',
      });
      await toast.present();
    } catch {
      const toast = await this.toastController.create({
        message: 'Could not submit report.',
        duration: 2000,
        color: 'dark',
      });
      await toast.present();
    }
  }
}
