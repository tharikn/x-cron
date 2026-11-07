import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApplicationsService } from '../../core/services/applications.service';
import { AuthService } from '../../core/services/auth.service';
import { SeoService } from '../../core/services/seo.service';
import { jobPath } from '../../core/utils/format';
import { ListSkeletonComponent } from '../../shared/skeleton/list-skeleton.component';

@Component({
  selector: 'app-applied-jobs',
  imports: [DatePipe, RouterLink, ListSkeletonComponent],
  templateUrl: './applied-jobs.page.html',
  styleUrl: './applied-jobs.page.scss',
})
export class AppliedJobsPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly applications = inject(ApplicationsService);
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isEmployer = this.auth.isEmployer;
  readonly items = this.applications.mine;
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly jobPath = jobPath;

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Applied jobs',
      description:
        'Track every application stage with date and time — from applied through offer.',
      path: '/me/applied',
      robots: 'noindex,follow',
    });
    await this.auth.ensureSession();
    if (!this.auth.isSignedIn()) return;
    if (this.auth.isEmployer()) {
      await this.router.navigate(['/employer-applications'], { replaceUrl: true });
      return;
    }
    await this.reload();
  }

  async reload(): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.applications.listMine();
    } catch {
      this.error.set('Could not load applied jobs.');
    } finally {
      this.busy.set(false);
    }
  }
}
