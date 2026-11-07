import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import {
  TrackingService,
  type TrackingSummary,
  type TrackingUserRow,
} from '../../core/services/tracking.service';
import { TableSkeletonComponent } from '../../shared/skeleton/table-skeleton.component';

@Component({
  selector: 'app-admin-tracking',
  imports: [FormsModule, RouterLink, DatePipe, TableSkeletonComponent],
  templateUrl: './admin-tracking.page.html',
  styleUrl: './admin-tracking.page.scss',
})
export class AdminTrackingPage implements OnInit {
  private readonly tracking = inject(TrackingService);
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(LocaleService);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly summary = signal<TrackingSummary | null>(null);
  readonly rows = signal<TrackingUserRow[]>([]);
  readonly total = signal(0);

  q = '';
  limit = 50;

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'User tracking',
      description: 'Who accessed X Cron, engagement mix, and time spent.',
      path: '/admin/tracking',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
    if (this.auth.isSignedIn() && this.auth.isAdmin()) {
      await this.reload();
    }
  }

  async reload(): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      const res = await this.tracking.adminUsers({
        q: this.q.trim() || undefined,
        limit: this.limit,
        offset: 0,
      });
      this.summary.set(res.summary);
      this.rows.set(res.items);
      this.total.set(res.total);
    } catch {
      this.error.set(
        'Could not load user tracking. Sign in as admin and ensure the API is running.',
      );
      this.summary.set(null);
      this.rows.set([]);
      this.total.set(0);
    } finally {
      this.busy.set(false);
    }
  }

  labelOf(row: TrackingUserRow): string {
    return (
      row.displayName?.trim() ||
      row.username?.trim() ||
      row.email?.trim() ||
      row.userId ||
      row.visitorKey ||
      row.key
    );
  }
}
