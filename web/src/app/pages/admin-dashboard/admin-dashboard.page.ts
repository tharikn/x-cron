import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  OpsService,
  type DashboardGranularity,
  type DashboardResponse,
} from '../../core/services/ops.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { DatetimePickerComponent } from '../../shared/datetime-picker/datetime-picker.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [FormsModule, RouterLink, DatePipe, DatetimePickerComponent],
  templateUrl: './admin-dashboard.page.html',
  styleUrl: './admin-dashboard.page.scss',
})
export class AdminDashboardPage implements OnInit {
  private readonly ops = inject(OpsService);
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(LocaleService);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly data = signal<DashboardResponse | null>(null);

  granularity: DashboardGranularity = 'day';
  fromDate = '';
  toDate = '';

  readonly maxSeriesValue = computed(() => {
    const series = this.data()?.series ?? [];
    let max = 1;
    for (const point of series) {
      max = Math.max(max, point.posts, point.signIns);
    }
    return max;
  });

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Admin dashboard',
      description: 'Analytics for sign-ins, posts uploaded, and job status counts.',
      path: '/admin',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
    this.applyDefaultDates('day');
    if (this.auth.isSignedIn() && this.auth.isAdmin()) {
      await this.reload();
    }
  }

  async onGranularityChange(value: DashboardGranularity): Promise<void> {
    this.granularity = value;
    this.applyDefaultDates(value);
    await this.reload();
  }

  async reload(): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      const res = await this.ops.dashboard({
        granularity: this.granularity,
        from: this.fromDate ? new Date(`${this.fromDate}T00:00:00.000Z`).toISOString() : undefined,
        to: this.toDate ? new Date(`${this.toDate}T23:59:59.999Z`).toISOString() : undefined,
      });
      this.data.set(res);
      this.fromDate = res.from.slice(0, 10);
      this.toDate = res.to.slice(0, 10);
    } catch {
      this.error.set('Could not load dashboard. Sign in as admin and ensure the API is running.');
    } finally {
      this.busy.set(false);
    }
  }

  barHeight(value: number): string {
    const pct = Math.round((value / this.maxSeriesValue()) * 100);
    return `${Math.max(value > 0 ? 8 : 2, pct)}%`;
  }

  private applyDefaultDates(granularity: DashboardGranularity): void {
    const to = new Date();
    const from = new Date(to);
    if (granularity === 'year') {
      from.setUTCFullYear(from.getUTCFullYear() - 4, 0, 1);
    } else if (granularity === 'month') {
      from.setUTCMonth(from.getUTCMonth() - 11, 1);
    } else {
      from.setUTCDate(from.getUTCDate() - 13);
    }
    this.fromDate = from.toISOString().slice(0, 10);
    this.toDate = to.toISOString().slice(0, 10);
  }
}
