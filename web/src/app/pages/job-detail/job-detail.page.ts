import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { Job } from '../../core/models/job.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import {
  PaymentsService,
  type CheckoutDto,
} from '../../core/services/payments.service';
import { SeekerService } from '../../core/services/seeker.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import {
  formatJobType,
  formatLocation,
  formatPostedDate,
  formatSalary,
  formatUnlockPrice,
  jobPath,
} from '../../core/utils/format';
import {
  GoogleSignInSheetComponent,
  type GoogleSignInReason,
} from '../../shared/google-sign-in-sheet/google-sign-in-sheet.component';

type PendingAction = 'unlock' | 'save' | 'share';

@Component({
  selector: 'app-job-detail',
  imports: [RouterLink, TranslatePipe, GoogleSignInSheetComponent],
  templateUrl: './job-detail.page.html',
  styleUrl: './job-detail.page.scss',
})
export class JobDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly jobsService = inject(JobsService);
  private readonly payments = inject(PaymentsService);
  private readonly seeker = inject(SeekerService);
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(LocaleService);
  private readonly toast = inject(ToastService);

  readonly job = signal<Job | null>(null);
  readonly related = signal<Job[]>([]);
  readonly error = signal<string | null>(null);
  readonly priceRevealed = signal(false);
  readonly unlocking = signal(false);
  readonly confirmingPay = signal(false);
  readonly saved = signal(false);
  readonly signInOpen = signal(false);
  readonly signInReason = signal<GoogleSignInReason>('generic');
  readonly revealed = signal<{
    phone: string | null;
    email: string | null;
    whatsapp: string | null;
    website: string | null;
  } | null>(null);
  readonly pendingCheckout = signal<{
    orderId: string;
    jobId: string;
    checkout: CheckoutDto;
  } | null>(null);

  private pendingAction: PendingAction | null = null;

  readonly formatLocation = formatLocation;
  readonly formatSalary = formatSalary;
  readonly formatJobType = formatJobType;
  readonly formatPostedDate = formatPostedDate;
  readonly formatUnlockPrice = formatUnlockPrice;
  readonly jobPath = jobPath;
  readonly languageLabel = (code: string) => this.locale.label(code);

  revealPrice(): void {
    this.priceRevealed.set(true);
  }

  onSignInOpenChange(open: boolean): void {
    this.signInOpen.set(open);
    if (!open) this.pendingAction = null;
  }

  async onSignedIn(): Promise<void> {
    const action = this.pendingAction;
    this.pendingAction = null;
    const job = this.job();
    if (job) {
      await this.tryLoadEntitledContact(job.id);
      try {
        const saved = await this.seeker.loadSaved();
        this.saved.set(saved.some((item) => item.id === job.id));
      } catch {
        /* ignore */
      }
    }
    if (action === 'unlock') await this.unlockContact();
    else if (action === 'save') await this.toggleSave();
    else if (action === 'share') await this.shareJob();
  }

  async toggleSave(): Promise<void> {
    const job = this.job();
    if (!job) return;
    if (!this.auth.isSignedIn()) {
      this.openSignIn('save');
      return;
    }
    try {
      if (this.saved()) {
        await this.seeker.unsave(job.id);
        this.saved.set(false);
        this.toast.show('Removed from saved jobs.');
      } else {
        await this.seeker.save(job.id);
        this.saved.set(true);
        this.toast.show('Job saved.');
      }
    } catch {
      this.toast.show('Could not update saved jobs.', 'error');
    }
  }

  async unlockContact(): Promise<void> {
    const job = this.job();
    if (!job || this.unlocking() || this.pendingCheckout()) return;

    if (!this.auth.isSignedIn()) {
      this.openSignIn('unlock');
      return;
    }

    this.unlocking.set(true);
    try {
      const orderResult = await this.payments.createContactOrder(job.id);
      if (orderResult.alreadyEntitled) {
        await this.tryLoadEntitledContact(job.id);
        this.toast.show('Contact already unlocked for your account.');
        return;
      }
      if (!orderResult.order || !orderResult.checkout) {
        this.toast.show('Could not create unlock order.', 'error');
        return;
      }

      this.pendingCheckout.set({
        orderId: orderResult.order.id,
        jobId: job.id,
        checkout: orderResult.checkout,
      });
      if (typeof document !== 'undefined') {
        queueMicrotask(() => {
          document
            .getElementById('payment-checkout')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    } catch {
      this.toast.show('Unlock failed. Sign in and try again.', 'error');
    } finally {
      this.unlocking.set(false);
    }
  }

  cancelCheckout(): void {
    this.pendingCheckout.set(null);
  }

  upiQrSrc(checkout: CheckoutDto): string | null {
    const payload = checkout.upi?.qrPayload;
    if (!payload) return null;
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(payload)}`;
  }

  async copyUpiId(): Promise<void> {
    const vpa = this.pendingCheckout()?.checkout.upi?.vpa;
    if (!vpa) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(vpa);
        this.toast.show('UPI ID copied.');
        return;
      }
    } catch {
      /* fall through */
    }
    this.toast.show(vpa);
  }

  openUpiApp(): void {
    const uri = this.pendingCheckout()?.checkout.upi?.intentUri;
    if (uri && typeof window !== 'undefined') {
      window.location.href = uri;
    }
  }

  async confirmCheckoutPayment(): Promise<void> {
    const pending = this.pendingCheckout();
    if (!pending || this.confirmingPay()) return;

    this.confirmingPay.set(true);
    try {
      const mode = pending.checkout.checkoutMode;
      if (mode === 'stub' || mode === 'upi') {
        await this.payments.confirmDevPayment(pending.orderId);
      } else {
        this.toast.show(
          'Hosted checkout not wired — use PAYMENT_GATEWAY=stub or upi.',
          'error',
        );
        return;
      }

      const reveal = await this.payments.getContact(pending.jobId);
      if (!reveal.allowed || !reveal.contact) {
        this.toast.show(
          reveal.message || 'Payment recorded but contact unavailable.',
          'error',
        );
        return;
      }
      this.revealed.set(reveal.contact);
      this.pendingCheckout.set(null);
      this.toast.show('Contact unlocked.');
    } catch {
      this.toast.show(
        'Payment not confirmed yet. For local UPI set PAYMENT_UPI_ALLOW_DEV_CONFIRM=1.',
        'error',
      );
    } finally {
      this.confirmingPay.set(false);
    }
  }

  async shareJob(): Promise<void> {
    const job = this.job();
    if (!job) return;
    if (!this.auth.isSignedIn()) {
      this.openSignIn('share');
      return;
    }
    const url = `${typeof location !== 'undefined' ? location.origin : 'https://xcron.jobs'}/jobs/${job.slug}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({
        title: job.title,
        text: `${job.title} at ${job.employerName}`,
        url,
      });
      return;
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      this.toast.show('Share link copied.');
      return;
    }
    this.toast.show(url);
  }

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.url.map((part) => part.path).join('/');

    try {
      // Prefer SEO slug; fall back to job id (inbox / deep links).
      let job: Job;
      try {
        job = await this.jobsService.getBySlug(slug);
      } catch {
        job = await this.jobsService.getById(slug);
      }
      this.job.set(job);
      this.seo.setJob(job);
      this.related.set(await this.jobsService.related(job.id));
      if (this.auth.isSignedIn()) {
        await this.tryLoadEntitledContact(job.id);
        try {
          const saved = await this.seeker.loadSaved();
          this.saved.set(saved.some((item) => item.id === job.id));
        } catch {
          this.saved.set(false);
        }
      }
    } catch {
      this.error.set('Job not found or no longer published.');
      this.seo.setPage({
        title: 'Job not found',
        description: 'This job listing is unavailable.',
        path: `/jobs/${slug}`,
        robots: 'noindex,follow',
      });
    }
  }

  private openSignIn(action: PendingAction): void {
    this.pendingAction = action;
    this.signInReason.set(action);
    this.signInOpen.set(true);
  }

  private async tryLoadEntitledContact(jobId: string): Promise<void> {
    try {
      const result = await this.payments.getContact(jobId);
      if (result.allowed && result.contact) {
        this.revealed.set(result.contact);
      }
    } catch {
      // keep masked
    }
  }
}
