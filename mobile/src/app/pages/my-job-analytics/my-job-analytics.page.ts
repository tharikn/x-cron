import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import type {
  Job,
  JobAnalyticsDashboard,
  JobAnalyticsSeriesPoint,
} from '../../core/models/job.model';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { AnalyticsSkeletonComponent } from '../../shared/skeleton/analytics-skeleton.component';

@Component({
  selector: 'app-my-job-analytics',
  templateUrl: './my-job-analytics.page.html',
  styleUrls: ['./my-job-analytics.page.scss'],
  imports: [
    DatePipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonButton,
    IonSelect,
    IonSelectOption,
    AnalyticsSkeletonComponent,
  ],
})
export class MyJobAnalyticsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly jobsService = inject(JobsService);
  private readonly auth = inject(AuthService);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isEmployer = this.auth.isEmployer;
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly job = signal<Job | null>(null);
  readonly dash = signal<JobAnalyticsDashboard | null>(null);
  readonly days = signal(30);
  readonly dayOptions = [7, 14, 30, 90];

  readonly chartMax = computed(() => {
    const series = this.dash()?.series ?? [];
    let max = 1;
    for (const p of series) {
      max = Math.max(max, p.views, p.applied, p.contacted);
    }
    return max;
  });

  async ngOnInit(): Promise<void> {
    if (this.auth.isSignedIn() && this.auth.isEmployer()) {
      await this.reload();
    }
  }

  async onDaysChange(raw: number | string | null | undefined): Promise<void> {
    const next = Number(raw) || 30;
    if (next === this.days()) return;
    this.days.set(next);
    await this.reload();
  }

  async reload(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    if (!id) {
      this.error.set('Missing job id.');
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      const [list, dash] = await Promise.all([
        this.jobsService.listMyJobs({ page: 1, limit: 100 }),
        this.jobsService.getJobAnalytics(id, this.days()),
      ]);
      this.job.set(list.items.find((j) => j.id === id) ?? null);
      this.dash.set(dash);
    } catch {
      this.error.set('Could not load analytics.');
      this.dash.set(null);
    } finally {
      this.busy.set(false);
    }
  }

  barHeight(value: number): string {
    const pct = Math.max(2, Math.round((value / this.chartMax()) * 100));
    return `${pct}%`;
  }

  shortLabel(point: JobAnalyticsSeriesPoint): string {
    const parts = point.date.split('-');
    if (parts.length !== 3) return point.date;
    return `${parts[1]}/${parts[2]}`;
  }
}
