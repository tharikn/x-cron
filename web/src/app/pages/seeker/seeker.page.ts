import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SeekerService } from '../../core/services/seeker.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { ViewedJobsService } from '../../core/services/viewed-jobs.service';
import { jobPath } from '../../core/utils/format';

@Component({
  selector: 'app-seeker',
  imports: [RouterLink],
  templateUrl: './seeker.page.html',
  styleUrl: './seeker.page.scss',
})
export class SeekerPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly seeker = inject(SeekerService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  readonly viewed = inject(ViewedJobsService);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly saved = this.seeker.saved;
  readonly feed = this.seeker.feed;
  readonly error = signal<string | null>(null);
  readonly removingId = signal<string | null>(null);
  readonly jobPath = jobPath;

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Saved jobs',
      description: 'Saved jobs and personalised feed on X Cron.',
      path: '/me',
      robots: 'noindex,follow',
    });
    await this.auth.ensureSession();
    if (!this.auth.isSignedIn()) return;
    try {
      await Promise.all([this.seeker.loadSaved(), this.seeker.loadFeed()]);
    } catch {
      this.error.set('Could not load your jobs.');
    }
  }

  async removeSaved(jobId: string): Promise<void> {
    if (this.removingId()) return;
    this.removingId.set(jobId);
    try {
      await this.seeker.unsave(jobId);
      this.toast.show('Removed from saved jobs.');
    } catch {
      this.toast.show('Could not remove saved job.', 'error');
    } finally {
      this.removingId.set(null);
    }
  }
}
