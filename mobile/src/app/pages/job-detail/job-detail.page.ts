import { Component, computed, inject } from '@angular/core';
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
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
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
export class JobDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly jobsService = inject(JobsService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  private readonly jobId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' },
  );

  readonly job = computed(() => this.jobsService.getById(this.jobId()));
  readonly related = computed(() => {
    const job = this.job();
    return job ? this.jobsService.related(job) : [];
  });

  readonly formatLocation = formatLocation;
  readonly formatSalary = formatSalary;
  readonly formatJobType = formatJobType;
  readonly formatPostedDate = formatPostedDate;
  readonly formatUnlockPrice = formatUnlockPrice;
  readonly languageLabel = languageLabel;

  async unlockContact(): Promise<void> {
    const job = this.job();
    if (!job) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Unlock employer contact',
      message: `Contact details stay private until purchase. Proposed price ${formatUnlockPrice(job.contact.unlockPricePaise)}. Payments and vault APIs land in a later release — this build only shows the masked state.`,
      buttons: [
        { text: 'Close', role: 'cancel' },
        {
          text: 'Simulate unlock UI',
          handler: async () => {
            const toast = await this.toastController.create({
              message: 'Entitlement flow is stubbed. No contact data is returned to the client.',
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
}
