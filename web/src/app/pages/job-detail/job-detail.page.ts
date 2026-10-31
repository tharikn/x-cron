import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { Job } from '../../core/models/job.model';
import { JobsService } from '../../core/services/jobs.service';
import { SeoService } from '../../core/services/seo.service';
import {
  formatJobType,
  formatLocation,
  formatPostedDate,
  formatSalary,
  jobPath,
} from '../../core/utils/format';

@Component({
  selector: 'app-job-detail',
  imports: [RouterLink],
  templateUrl: './job-detail.page.html',
  styleUrl: './job-detail.page.scss',
})
export class JobDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly jobsService = inject(JobsService);
  private readonly seo = inject(SeoService);

  readonly job = signal<Job | null>(null);
  readonly related = signal<Job[]>([]);
  readonly error = signal<string | null>(null);

  readonly formatLocation = formatLocation;
  readonly formatSalary = formatSalary;
  readonly formatJobType = formatJobType;
  readonly formatPostedDate = formatPostedDate;
  readonly jobPath = jobPath;

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.url.map((part) => part.path).join('/');

    try {
      const job = await this.jobsService.getBySlug(slug);
      this.job.set(job);
      this.seo.setJob(job);
      this.related.set(await this.jobsService.related(job.id));
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
}
