import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import type { Job } from '../../core/models/job.model';
import { AdsService, type AdCreative } from '../../core/services/ads.service';
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
  selector: 'app-home',
  imports: [FormsModule, RouterLink],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit {
  private readonly jobsService = inject(JobsService);
  private readonly ads = inject(AdsService);
  private readonly seo = inject(SeoService);

  readonly jobs = signal<Job[]>([]);
  readonly railAds = signal<AdCreative[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  keyword = '';
  location = 'Palani';
  sort = 'newest';

  readonly formatLocation = formatLocation;
  readonly formatSalary = formatSalary;
  readonly formatJobType = formatJobType;
  readonly formatPostedDate = formatPostedDate;
  readonly jobPath = jobPath;

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Local jobs near you',
      description:
        'X Cron Jobs — local-first, multilingual job discovery for India. Browse without signing in.',
      path: '/',
    });
    this.railAds.set(await this.ads.loadHomeRail());
    await this.search();
  }

  async search(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const items = await this.jobsService.search({
        keyword: this.keyword.trim() || undefined,
        location: this.location.trim() || undefined,
        sort: this.sort,
      });
      this.jobs.set(items);
    } catch {
      this.error.set('Could not load jobs. Start the API on port 3000.');
      this.jobs.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
