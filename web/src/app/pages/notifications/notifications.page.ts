import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LocaleService } from '../../core/services/locale.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-notifications',
  imports: [DatePipe, RouterLink],
  templateUrl: './notifications.page.html',
  styleUrl: './notifications.page.scss',
})
export class NotificationsPage implements OnInit {
  private readonly notifications = inject(NotificationsService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(LocaleService);
  private readonly toast = inject(ToastService);

  readonly busy = signal(false);
  readonly isSignedIn = this.auth.isSignedIn;
  readonly items = this.notifications.items;
  readonly unread = this.notifications.unreadCount;

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Notifications',
      description: 'In-app job alerts for your X Cron Jobs account.',
      path: '/notifications',
      robots: 'noindex,follow',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
    await this.auth.ensureSession();
    if (!this.auth.isSignedIn()) {
      return;
    }
    await this.reload();
  }

  async reload(): Promise<void> {
    if (!this.auth.isSignedIn()) return;
    this.busy.set(true);
    try {
      await this.notifications.registerDevice();
      await this.notifications.refreshInbox();
    } catch {
      this.toast.show('Could not load notifications', 'error');
    } finally {
      this.busy.set(false);
    }
  }

  async markRead(id: string): Promise<void> {
    try {
      await this.notifications.markRead(id);
    } catch {
      this.toast.show('Could not mark read', 'error');
    }
  }

  goSignIn(): void {
    void this.router.navigate(['/sign-in'], {
      queryParams: { returnUrl: '/notifications' },
    });
  }

  jobPath(item: {
    jobId: string | null;
    data?: Record<string, string> | null;
  }): string | null {
    const slug = item.data?.['slug']?.trim();
    if (slug) return `/jobs/${slug}`;
    return item.jobId ? `/jobs/${item.jobId}` : null;
  }
}
