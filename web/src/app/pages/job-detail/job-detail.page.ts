import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { Job } from '../../core/models/job.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeekerService } from '../../core/services/seeker.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { ViewedJobsService } from '../../core/services/viewed-jobs.service';
import {
  formatJobType,
  formatLocation,
  formatPostedDate,
  formatSalary,
  jobPath,
} from '../../core/utils/format';
import {
  GoogleSignInSheetComponent,
  type GoogleSignInReason,
} from '../../shared/google-sign-in-sheet/google-sign-in-sheet.component';

type PendingAction = 'save' | 'share';

@Component({
  selector: 'app-job-detail',
  imports: [RouterLink, TranslatePipe, GoogleSignInSheetComponent],
  templateUrl: './job-detail.page.html',
  styleUrl: './job-detail.page.scss',
})
export class JobDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly jobsService = inject(JobsService);
  private readonly seeker = inject(SeekerService);
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(LocaleService);
  private readonly toast = inject(ToastService);
  private readonly viewed = inject(ViewedJobsService);

  readonly job = signal<Job | null>(null);
  readonly related = signal<Job[]>([]);
  readonly error = signal<string | null>(null);
  readonly saved = signal(false);
  readonly signInOpen = signal(false);
  readonly signInReason = signal<GoogleSignInReason>('generic');

  private pendingAction: PendingAction | null = null;

  readonly formatLocation = formatLocation;
  readonly formatSalary = formatSalary;
  readonly formatJobType = formatJobType;
  readonly formatPostedDate = formatPostedDate;
  readonly jobPath = jobPath;
  readonly languageLabel = (code: string) => this.locale.label(code);

  onSignInOpenChange(open: boolean): void {
    this.signInOpen.set(open);
    if (!open) this.pendingAction = null;
  }

  async onSignedIn(): Promise<void> {
    const action = this.pendingAction;
    this.pendingAction = null;
    const job = this.job();
    if (job) {
      try {
        const saved = await this.seeker.loadSaved();
        this.saved.set(saved.some((item) => item.id === job.id));
      } catch {
        /* ignore */
      }
    }
    if (action === 'save') await this.toggleSave();
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

  async reportJob(): Promise<void> {
    const job = this.job();
    if (!job) return;
    try {
      await this.seeker.report(
        job.id,
        'Reported as suspicious or incorrect from web',
      );
      this.toast.show('Report submitted for moderation.');
    } catch {
      this.toast.show('Could not submit report.', 'error');
    }
  }

  async markContacted(channel: 'phone' | 'whatsapp' | 'email' | 'website'): Promise<void> {
    const job = this.job();
    if (!job || !this.auth.isSignedIn()) return;
    try {
      await this.seeker.markApplication(job.id, { status: 'contacted', channel });
    } catch {
      /* non-blocking */
    }
  }

  async hideJob(): Promise<void> {
    const job = this.job();
    if (!job) return;
    if (!this.auth.isSignedIn()) {
      this.openSignIn('save');
      return;
    }
    try {
      await this.seeker.hideJob(job.id);
      this.toast.show('Job hidden from your feed.');
    } catch {
      this.toast.show('Could not hide job.', 'error');
    }
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
      this.viewed.track(job);
      this.seo.setJob(job);
      this.related.set(await this.jobsService.related(job.id));
      if (this.auth.isSignedIn()) {
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
}
