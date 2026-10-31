import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Job } from '../../core/models/job.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import {
  formatJobType,
  formatLocation,
  formatPostedDate,
  formatSalary,
} from '../../core/utils/format';

@Component({
  selector: 'app-blog-approval',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './blog-approval.page.html',
  styleUrl: './blog-approval.page.scss',
})
export class BlogApprovalPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly jobsService = inject(JobsService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly locale = inject(LocaleService);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly queueBusy = signal(false);
  readonly queue = signal<Job[]>([]);
  readonly previewJob = signal<Job | null>(null);

  readonly formatLocation = formatLocation;
  readonly formatSalary = formatSalary;
  readonly formatJobType = formatJobType;
  readonly formatPostedDate = formatPostedDate;
  readonly languageLabel = (code: string) => this.locale.label(code);

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Blog Approval',
      description: 'Approve or reject jobs waiting for review on X Cron Jobs.',
      path: '/blog-approval',
    });
    if (this.isAdmin()) {
      void this.reloadQueue();
    }
  }

  openPreview(job: Job): void {
    this.previewJob.set(job);
  }

  closePreview(): void {
    this.previewJob.set(null);
  }

  async reloadQueue(announce = false): Promise<void> {
    if (!this.isAdmin()) {
      this.queue.set([]);
      this.previewJob.set(null);
      return;
    }
    this.queueBusy.set(true);
    try {
      const items = await this.jobsService.moderationQueue('needs-review');
      this.queue.set(items);
      const preview = this.previewJob();
      if (preview && !items.some((item) => item.id === preview.id)) {
        this.previewJob.set(null);
      } else if (preview) {
        this.previewJob.set(items.find((item) => item.id === preview.id) ?? null);
      }
      if (announce) {
        this.toast.show(
          items.length
            ? `Queue refreshed · ${items.length} waiting`
            : 'Queue refreshed · nothing waiting',
        );
      }
    } catch {
      this.queue.set([]);
      this.previewJob.set(null);
      this.toast.error('Could not load the approval queue. Is the API running?');
    } finally {
      this.queueBusy.set(false);
    }
  }

  async approve(job: Job): Promise<void> {
    this.queueBusy.set(true);
    try {
      await this.jobsService.approveJob(job.id, 'Approved');
      if (this.previewJob()?.id === job.id) {
        this.previewJob.set(null);
      }
      await this.reloadQueue();
      this.toast.show(`Approved · ${job.title}`);
    } catch {
      this.toast.error('Approve failed.');
      this.queueBusy.set(false);
    }
  }

  async reject(job: Job): Promise<void> {
    this.queueBusy.set(true);
    try {
      await this.jobsService.rejectJob(job.id, 'Rejected by moderator');
      if (this.previewJob()?.id === job.id) {
        this.previewJob.set(null);
      }
      await this.reloadQueue();
      this.toast.show(`Rejected · ${job.title}`);
    } catch {
      this.toast.error('Reject failed.');
      this.queueBusy.set(false);
    }
  }
}
