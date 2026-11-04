import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { Job } from '../../core/models/job.model';
import { JobsService } from '../../core/services/jobs.service';
import { SeoService } from '../../core/services/seo.service';
import { formatLocation, jobPath } from '../../core/utils/format';

@Component({
  selector: 'app-employer',
  imports: [RouterLink],
  templateUrl: './employer.page.html',
  styleUrl: './employer.page.scss',
})
export class EmployerPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly jobs = inject(JobsService);
  private readonly seo = inject(SeoService);

  readonly name = signal('Employer');
  readonly about = signal<string | null>(null);
  readonly verified = signal(false);
  readonly jobsList = signal<Job[]>([]);
  readonly error = signal<string | null>(null);
  readonly jobPath = jobPath;
  readonly formatLocation = formatLocation;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    try {
      const res = await this.jobs.getPublicEmployer(id);
      this.name.set(res.name);
      this.about.set(res.about);
      this.verified.set(res.verified);
      this.jobsList.set(res.jobs);
      this.seo.setPage({
        title: `${res.name} jobs`,
        description: res.about || `Open roles at ${res.name} on X Cron.`,
        path: `/employers/${id}`,
      });
    } catch {
      this.error.set('Employer not found.');
    }
  }
}
