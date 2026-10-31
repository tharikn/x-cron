import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JOB_TYPE_LABELS, type JobType } from '../../core/models/job.model';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';

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

  readonly languages = this.locale.languages;

  readonly mode = signal<PostMode>('quick');
  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly busy = signal(false);
  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly jobTypeEntries = Object.entries(JOB_TYPE_LABELS) as Array<[JobType, string]>;

  title = '';
  employerName = 'X Cron Moderation Desk';
  locationCity = 'Palani';
  jobType: JobType = 'full-time';
  salaryText = '';
  description = '';
  contentLanguage = 'en';
  contactPhone = '';
  contactEmail = '';
  contactWebsite = '';
  pasteText = '';
  priority = 0;
  effectiveFromLocal = this.defaultEffectiveLocal();
  expiresAtLocal = this.defaultExpiresLocal();

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Post a job',
      description: 'Admin job posting for X Cron Jobs. Quick form or paste a message.',
      path: '/post',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
  }

  setMode(value: PostMode): void {
    this.mode.set(value);
    this.message.set(null);
    this.error.set(null);
  }

  async submitQuick(): Promise<void> {
    if (!this.ensureAdminReady()) return;
    if (!this.title.trim() || !this.employerName.trim() || !this.description.trim()) {
      this.error.set('Title, employer and description are required.');
      return;
    }

    this.busy.set(true);
    this.error.set(null);
    this.message.set(null);
    try {
      await this.jobsService.createQuickPost({
        title: this.title.trim(),
        employerName: this.employerName.trim(),
        locationCity: this.locationCity.trim() || 'Palani',
        jobType: this.jobType,
        salaryText: this.salaryText.trim() || undefined,
        description: this.description.trim(),
        contentLanguage: this.contentLanguage,
        contactPhone: this.contactPhone.trim() || undefined,
        contactEmail: this.contactEmail.trim() || undefined,
        contactWebsite: this.contactWebsite.trim() || undefined,
        priority: Number(this.priority) || 0,
        effectiveFrom: this.fromLocalInput(this.effectiveFromLocal),
        expiresAt: this.fromLocalInput(this.expiresAtLocal),
      });
      this.message.set('Submitted for Blog Approval. Approve it before it appears in search.');
      this.title = '';
      this.description = '';
      this.salaryText = '';
      this.contactPhone = '';
      this.contactEmail = '';
      this.contactWebsite = '';
      this.priority = 0;
      this.effectiveFromLocal = this.defaultEffectiveLocal();
      this.expiresAtLocal = this.defaultExpiresLocal();
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
      await this.jobsService.createFromPaste(this.pasteText.trim(), this.contentLanguage);
      this.message.set('Extracted and queued for Blog Approval. Contact stays private.');
      this.pasteText = '';
    } catch {
      this.error.set('Paste publish failed. Sign in as admin first.');
    } finally {
      this.busy.set(false);
    }
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
