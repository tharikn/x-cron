import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JOB_TYPE_LABELS, type Job, type JobType } from '../../core/models/job.model';
import type { PostJobPaymentMode } from '../../core/models/site.model';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import {
  PaymentsService,
  type CheckoutDto,
} from '../../core/services/payments.service';
import { SeoService } from '../../core/services/seo.service';
import { SiteService } from '../../core/services/site.service';
import {
  type FieldErrors,
  parseVacancies,
  validateQuickPostFields,
} from '../../core/utils/job-form.validation';

type PostMode = 'quick' | 'paste';

@Component({
  selector: 'app-post-job',
  imports: [FormsModule, RouterLink],
  templateUrl: './post-job.page.html',
  styleUrl: './post-job.page.scss',
})
export class PostJobPage implements OnInit {
  private readonly jobsService = inject(JobsService);
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);
  private readonly locale = inject(LocaleService);
  private readonly site = inject(SiteService);
  private readonly payments = inject(PaymentsService);

  readonly languages = this.locale.languages;

  readonly mode = signal<PostMode>('quick');
  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly busy = signal(false);
  readonly confirmingPay = signal(false);
  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly jobTypeEntries = Object.entries(JOB_TYPE_LABELS) as Array<[JobType, string]>;
  readonly pendingCheckout = signal<{
    orderId: string;
    jobId: string;
    checkout: CheckoutDto;
    mode: PostJobPaymentMode;
  } | null>(null);

  paymentsEnabled = true;
  postJobPaymentMode: PostJobPaymentMode = 'none';

  title = '';
  employerName = 'X Cron Moderation Desk';
  locationCity = 'Palani';
  jobType: JobType = 'full-time';
  salaryText = '';
  vacancies = '';
  description = '';
  contentLanguage = 'en';
  contactPhone = '';
  contactEmail = '';
  contactWebsite = '';
  pasteText = '';
  priority = 0;
  effectiveFromLocal = this.defaultEffectiveLocal();
  expiresAtLocal = this.defaultExpiresLocal();
  readonly fieldErrors = signal<FieldErrors>({});

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Post a job',
      description: 'Admin job posting for X Cron Jobs. Quick form or paste a message.',
      path: '/post',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
    try {
      const commerce = await this.site.hydrateCommerce();
      this.paymentsEnabled = commerce.paymentsEnabled !== false;
      this.postJobPaymentMode = commerce.postJobPaymentMode ?? 'none';
    } catch {
      /* fallbacks */
    }
  }

  setMode(value: PostMode): void {
    this.mode.set(value);
    this.message.set(null);
    this.error.set(null);
  }

  clearFieldError(key: string): void {
    if (!this.fieldErrors()[key]) return;
    this.fieldErrors.update((errors) => {
      const next = { ...errors };
      delete next[key];
      return next;
    });
  }

  async submitQuick(): Promise<void> {
    if (!this.ensureAdminReady()) return;
    const errors = validateQuickPostFields({
      title: this.title,
      employerName: this.employerName,
      locationCity: this.locationCity,
      salaryText: this.salaryText,
      description: this.description,
      contactPhone: this.contactPhone,
      contactEmail: this.contactEmail,
      contactWebsite: this.contactWebsite,
      vacancies: this.vacancies,
    });
    this.fieldErrors.set(errors);
    if (Object.keys(errors).length) {
      this.error.set(Object.values(errors)[0] ?? 'Fix the highlighted fields.');
      return;
    }

    this.busy.set(true);
    this.error.set(null);
    this.message.set(null);
    try {
      const job = await this.jobsService.createQuickPost({
        title: this.title.trim(),
        employerName: this.employerName.trim(),
        locationCity: this.locationCity.trim() || 'Palani',
        jobType: this.jobType,
        salaryText: this.salaryText.trim() || undefined,
        vacancies: parseVacancies(this.vacancies),
        description: this.description.trim(),
        contentLanguage: this.contentLanguage,
        contactPhone: this.contactPhone.trim() || undefined,
        contactEmail: this.contactEmail.trim() || undefined,
        contactWebsite: this.contactWebsite.trim() || undefined,
        priority: Number(this.priority) || 0,
        effectiveFrom: this.fromLocalInput(this.effectiveFromLocal),
        expiresAt: this.fromLocalInput(this.expiresAtLocal),
      });
      this.fieldErrors.set({});
      this.resetQuickForm();
      await this.afterJobCreated(job);
    } catch {
      this.error.set('Post failed. Sign in as admin@xcron.local and ensure the API is running.');
    } finally {
      this.busy.set(false);
    }
  }

  async submitPaste(): Promise<void> {
    if (!this.ensureAdminReady()) return;
    if (!this.pasteText.trim()) {
      this.error.set('Paste a WhatsApp/Telegram job message first.');
      return;
    }

    this.busy.set(true);
    this.error.set(null);
    this.message.set(null);
    try {
      const job = await this.jobsService.createFromPaste(
        this.pasteText.trim(),
        this.contentLanguage,
      );
      this.pasteText = '';
      await this.afterJobCreated(job);
    } catch {
      this.error.set('Paste publish failed. Sign in as admin first.');
    } finally {
      this.busy.set(false);
    }
  }

  cancelCheckout(): void {
    this.pendingCheckout.set(null);
    this.message.set(
      'Job queued for Blog Approval. Post fee skipped (optional mode) or cancelled.',
    );
  }

  upiQrSrc(checkout: CheckoutDto): string | null {
    const payload = checkout.upi?.qrPayload;
    if (!payload) return null;
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(payload)}`;
  }

  openUpiApp(): void {
    const uri = this.pendingCheckout()?.checkout.upi?.intentUri;
    if (uri) window.location.href = uri;
  }

  async confirmCheckoutPayment(): Promise<void> {
    const pending = this.pendingCheckout();
    if (!pending || this.confirmingPay()) return;
    this.confirmingPay.set(true);
    try {
      await this.payments.confirmDevPayment(pending.orderId);
      this.pendingCheckout.set(null);
      this.message.set('Post fee paid. Job remains in Blog Approval until published.');
    } catch {
      this.error.set('Payment confirm failed. Check Payment history for confirm_failed.');
    } finally {
      this.confirmingPay.set(false);
    }
  }

  private async afterJobCreated(job: Job): Promise<void> {
    const needsPay =
      this.paymentsEnabled &&
      (this.postJobPaymentMode === 'mandatory' ||
        this.postJobPaymentMode === 'optional');
    if (!needsPay) {
      this.message.set('Submitted for Blog Approval. Approve it before it appears in search.');
      return;
    }
    try {
      const pay = await this.payments.createPostJobOrder(job.id);
      this.pendingCheckout.set({
        orderId: pay.order.id,
        jobId: job.id,
        checkout: pay.checkout,
        mode: (pay.mode as PostJobPaymentMode) || this.postJobPaymentMode,
      });
      this.message.set(
        pay.mode === 'mandatory'
          ? 'Job created. Complete the mandatory post fee below.'
          : 'Job created. Optional post fee — pay or skip.',
      );
      queueMicrotask(() => {
        document
          .getElementById('post-payment-checkout')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch {
      this.message.set(
        'Job created for Blog Approval. Post-fee checkout unavailable — check Settings.',
      );
    }
  }

  private resetQuickForm(): void {
    this.title = '';
    this.description = '';
    this.salaryText = '';
    this.vacancies = '';
    this.contactPhone = '';
    this.contactEmail = '';
    this.contactWebsite = '';
    this.priority = 0;
    this.effectiveFromLocal = this.defaultEffectiveLocal();
    this.expiresAtLocal = this.defaultExpiresLocal();
  }

  private ensureAdminReady(): boolean {
    if (!this.auth.isSignedIn()) {
      this.error.set('Admins must sign in before posting.');
      void this.router.navigateByUrl('/sign-in');
      return false;
    }
    if (!this.auth.isAdmin()) {
      this.error.set('Posting is admin-only. Use admin@xcron.local on Sign in.');
      return false;
    }
    return true;
  }

  private defaultEffectiveLocal(): string {
    return this.toLocalInput(new Date().toISOString());
  }

  private defaultExpiresLocal(): string {
    return this.toLocalInput(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    );
  }

  private toLocalInput(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  private fromLocalInput(local: string): string | undefined {
    if (!local?.trim()) return undefined;
    const d = new Date(local);
    if (Number.isNaN(d.getTime())) return undefined;
    return d.toISOString();
  }
}
