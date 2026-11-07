import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LocaleService } from '../../core/services/locale.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { ListSkeletonComponent } from '../../shared/skeleton/list-skeleton.component';

@Component({
  selector: 'app-notifications',
  imports: [DatePipe, RouterLink, ListSkeletonComponent],
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
  readonly isAdmin = this.auth.isAdmin;
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
      await this.notifications.refreshInbox({ announce: false });
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

  actionPath(item: {
    jobId: string | null;
    data?: Record<string, string> | null;
  }): string | null {
    const action = item.data?.['action']?.trim();
    if (action === 'complete_profile') return '/onboarding/profile';
    if (action === 'browse_jobs') return '/';
    if (action === 'open_feedback') {
      return this.isAdmin() && item.data?.['eventType'] === 'user_message'
        ? '/admin/feedback'
        : '/feedback';
    }
    const applicationId = item.data?.['applicationId']?.trim();
    if (applicationId) return `/me/applications/${applicationId}`;
    return this.jobPath(item);
  }

  /** Query params for [routerLink] — never embed `?` in the path (Angular encodes it). */
  actionQueryParams(item: {
    data?: Record<string, string> | null;
  }): Record<string, string> | null {
    const action = item.data?.['action']?.trim();
    if (action === 'open_feedback') {
      const threadId = item.data?.['threadId']?.trim();
      return threadId ? { thread: threadId } : null;
    }
    const applicationId = item.data?.['applicationId']?.trim();
    if (applicationId && item.data?.['recipientRole'] === 'employer') {
      return { as: 'employer' };
    }
    return null;
  }

  actionLabel(item: { data?: Record<string, string> | null }): string {
    const action = item.data?.['action']?.trim();
    if (action === 'complete_profile') return 'Complete profile';
    if (action === 'browse_jobs') return 'Browse jobs';
    if (action === 'open_feedback') return 'Open feedback';
    if (item.data?.['applicationId']?.trim()) return 'View timeline';
    return 'View role';
  }
}
