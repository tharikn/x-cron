import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LocaleService } from '../../core/services/locale.service';
import {
  NotificationsService,
  type NotificationDelivery,
  type NotificationDispatch,
} from '../../core/services/notifications.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-admin-notifications',
  imports: [DatePipe, RouterLink],
  templateUrl: './admin-notifications.page.html',
  styleUrl: './admin-notifications.page.scss',
})
export class AdminNotificationsPage implements OnInit {
  private readonly notifications = inject(NotificationsService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(LocaleService);

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly rows = signal<NotificationDispatch[]>([]);
  readonly pushProvider = signal('—');
  readonly mailProvider = signal('—');
  readonly selectedId = signal<string | null>(null);
  readonly selected = signal<NotificationDispatch | null>(null);
  readonly deliveries = signal<NotificationDelivery[]>([]);
  readonly page = signal(1);
  readonly limit = signal(25);
  readonly total = signal(0);
  readonly totalPages = signal(1);

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Notification dispatches',
      description: 'Admin job-alert fan-out history for X Cron Jobs.',
      path: '/admin/notifications',
      robots: 'noindex,follow',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
    await this.auth.ensureSession();
    if (!this.auth.isAdmin()) {
      await this.router.navigate(['/sign-in'], {
        queryParams: { returnUrl: '/admin/notifications', mode: 'admin' },
        replaceUrl: true,
      });
      return;
    }
    await this.reload();
  }

  async reload(): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      const limit = this.limit();
      const offset = (this.page() - 1) * limit;
      const res = await this.notifications.listDispatches({ limit, offset });
      this.rows.set(res.items);
      this.pushProvider.set(res.pushProvider);
      this.mailProvider.set(res.mailProvider);
      this.total.set(res.total);
      this.limit.set(res.limit);
      const pages = Math.max(1, Math.ceil(res.total / res.limit) || 1);
      this.totalPages.set(pages);
      if (this.page() > pages) {
        this.page.set(pages);
      }
      const current = this.selectedId();
      if (current && !res.items.some((row) => row.id === current)) {
        this.selectedId.set(null);
        this.selected.set(null);
        this.deliveries.set([]);
      } else if (current) {
        await this.openDispatch(current);
      }
    } catch {
      await this.router.navigate(['/sign-in'], {
        queryParams: { returnUrl: '/admin/notifications', mode: 'admin' },
        replaceUrl: true,
      });
    } finally {
      this.busy.set(false);
    }
  }

  async goToPage(next: number): Promise<void> {
    const page = Math.min(this.totalPages(), Math.max(1, next));
    if (page === this.page()) return;
    this.page.set(page);
    await this.reload();
  }

  async openDispatch(id: string): Promise<void> {
    this.selectedId.set(id);
    this.busy.set(true);
    this.error.set(null);
    try {
      const res = await this.notifications.getDispatch(id);
      this.selected.set(res.dispatch);
      this.deliveries.set(res.deliveries);
    } catch {
      this.error.set('Could not load dispatch detail.');
      this.selected.set(null);
      this.deliveries.set([]);
    } finally {
      this.busy.set(false);
    }
  }

  clearSelection(): void {
    this.selectedId.set(null);
    this.selected.set(null);
    this.deliveries.set([]);
  }

  rangeFrom(): number {
    if (this.total() === 0) return 0;
    return (this.page() - 1) * this.limit() + 1;
  }

  rangeTo(): number {
    return Math.min(this.page() * this.limit(), this.total());
  }
}
