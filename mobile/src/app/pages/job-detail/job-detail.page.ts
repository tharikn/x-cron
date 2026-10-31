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
import { AdsService, type AdCreative } from '../../core/services/ads.service';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { PaymentsService } from '../../core/services/payments.service';
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
  private readonly payments = inject(PaymentsService);
  private readonly ads = inject(AdsService);
  private readonly auth = inject(AuthService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  readonly job = signal<Job | undefined>(undefined);
  readonly related = signal<Job[]>([]);
  readonly footerAd = signal<AdCreative | null>(null);
  readonly unlocking = signal(false);
  readonly revealed = signal<{
    phone: string | null;
    email: string | null;
    whatsapp: string | null;
  } | null>(null);

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
      this.footerAd.set(await this.ads.loadSlot('job_detail_footer'));
      if (this.auth.isSignedIn()) {
        await this.tryLoadEntitledContact(job.id);
      }
    }
  }

  async onFooterAdClick(): Promise<void> {
    const ad = this.footerAd();
    if (!ad) return;
    await this.ads.recordEvent(ad.id, 'job_detail_footer', 'click');
  }

  async unlockContact(): Promise<void> {
    const job = this.job();
    if (!job || this.unlocking()) {
      return;
    }

    if (!this.auth.isSignedIn()) {
      const toast = await this.toastController.create({
        message: 'Sign in to unlock employer contact.',
        duration: 2500,
        color: 'dark',
      });
      await toast.present();
      return;
    }

    const price = formatUnlockPrice(job.contact.unlockPricePaise);
    const alert = await this.alertController.create({
      header: 'Unlock employer contact',
      message: `Pay ${price} once to reveal contact for this job (life of listing). Stub checkout confirms locally until Razorpay keys are configured.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: `Pay ${price}`,
          handler: () => {
            void this.runUnlock(job.id);
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

  private async tryLoadEntitledContact(jobId: string): Promise<void> {
    try {
      const result = await this.payments.getContact(jobId);
      if (result.allowed && result.contact) {
        this.revealed.set(result.contact);
      }
    } catch {
      // Guest or no entitlement — keep masked.
    }
  }

  private async runUnlock(jobId: string): Promise<void> {
    this.unlocking.set(true);
    try {
      const orderResult = await this.payments.createContactOrder(jobId);
      if (orderResult.alreadyEntitled) {
        await this.tryLoadEntitledContact(jobId);
        await this.showToast('Contact already unlocked for your account.');
        return;
      }

      if (!orderResult.order || !orderResult.checkout) {
        await this.showToast('Could not create unlock order.');
        return;
      }

      if (orderResult.checkout.checkoutMode === 'stub') {
        await this.payments.confirmDevPayment(orderResult.order.id);
      } else {
        await this.showToast(
          'Razorpay checkout not wired in this build — set PAYMENT_MODE=stub for local unlocks.',
        );
        return;
      }

      const reveal = await this.payments.getContact(jobId);
      if (!reveal.allowed || !reveal.contact) {
        await this.showToast(reveal.message || 'Unlock succeeded but contact unavailable.');
        return;
      }
      this.revealed.set(reveal.contact);
      await this.showToast('Contact unlocked.');
    } catch {
      await this.showToast('Unlock failed. Sign in and try again.');
    } finally {
      this.unlocking.set(false);
    }
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color: 'dark',
    });
    await toast.present();
  }
}
