import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  ReputationMe,
  ReputationRole,
  ReputationService,
} from '../../core/services/reputation.service';
import { SeoService } from '../../core/services/seo.service';
import { ScoreSkeletonComponent } from '../../shared/skeleton/score-skeleton.component';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.page.html',
  styleUrls: ['./performance.page.scss'],
  imports: [DatePipe, RouterLink, ScoreSkeletonComponent],
})
export class PerformancePage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly reputation = inject(ReputationService);
  private readonly seo = inject(SeoService);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isEmployer = this.auth.isEmployer;
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly items = this.reputation.mine;
  readonly activeRole = signal<ReputationRole>('seeker');

  readonly active = computed(() => {
    const role = this.activeRole();
    return this.items().find((i) => i.role === role) ?? this.items()[0] ?? null;
  });

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'My Rating',
      description:
        'X Cron My Rating helps seekers and recruiters build trust with fit-aware applies and responsive chat.',
      path: '/performance',
    });
    if (this.auth.isEmployer()) this.activeRole.set('employer');
    await this.reload();
  }

  selectRole(role: ReputationRole): void {
    this.activeRole.set(role);
  }

  async reload(): Promise<void> {
    if (!this.auth.isSignedIn()) {
      this.reputation.mine.set([]);
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.reputation.loadMine();
    } catch {
      this.error.set('Could not load My Rating.');
    } finally {
      this.busy.set(false);
    }
  }

  deltaClass(delta: number): string {
    if (delta > 0) return 'up';
    if (delta < 0) return 'down';
    return '';
  }

  bandClass(item: ReputationMe | null): string {
    return item?.band ?? 'steady';
  }
}
