import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { Job } from '../../core/models/job.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import { PaymentsService } from '../../core/services/payments.service';
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
  readonly saved = signal(false);
  readonly signInOpen = signal(false);
  readonly signInReason = signal<GoogleSignInReason>('generic');
  readonly revealed = signal<{
    phone: string | null;
    email: string | null;
    whatsapp: string | null;
    website: string | null;
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
    if (!job || this.unlocking()) return;

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
      if (orderResult.checkout.checkoutMode === 'stub') {
        await this.payments.confirmDevPayment(orderResult.order.id);
      } else {
        this.toast.show(
          'Razorpay checkout not wired — set PAYMENT_MODE=stub for local unlocks.',
          'error',
        );
        return;
      }
      const reveal = await this.payments.getContact(job.id);
      if (!reveal.allowed || !reveal.contact) {
        this.toast.show(reveal.message || 'Unlock succeeded but contact unavailable.', 'error');
        return;
      }
      this.revealed.set(reveal.contact);
      this.toast.show('Contact unlocked.');
    } catch {
      this.toast.show('Unlock failed. Sign in and try again.', 'error');
    } finally {
      this.unlocking.set(false);
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
      const job = await this.jobsService.getBySlug(slug);
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
