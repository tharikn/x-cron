import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { Job } from '../../core/models/job.model';
import { JobsService } from '../../core/services/jobs.service';
import { SeoService } from '../../core/services/seo.service';
import { formatSalary, jobPath } from '../../core/utils/format';

@Component({
  selector: 'app-location',
  imports: [RouterLink],
  templateUrl: './location.page.html',
  styleUrl: './location.page.scss',
})
export class LocationPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly jobsService = inject(JobsService);
  private readonly seo = inject(SeoService);

  readonly city = signal('');
  readonly state = signal('');
  readonly jobs = signal<Job[]>([]);
  readonly formatSalary = formatSalary;
  readonly jobPath = jobPath;

  async ngOnInit(): Promise<void> {
    const state = this.route.snapshot.paramMap.get('state') ?? 'tamil-nadu';
    const city = this.route.snapshot.paramMap.get('city') ?? 'palani';
    const cityLabel = city.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const stateLabel = state.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    this.state.set(stateLabel);
    this.city.set(cityLabel);

    this.seo.setPage({
      title: `Jobs in ${cityLabel}, ${stateLabel}`,
      description: `Browse local jobs in ${cityLabel}, ${stateLabel} on X Cron Jobs.`,
      path: `/locations/${state}/${city}`,
    });

    try {
      this.jobs.set(await this.jobsService.search({ location: cityLabel, sort: 'newest' }));
    } catch {
      this.jobs.set([]);
    }
  }
}
