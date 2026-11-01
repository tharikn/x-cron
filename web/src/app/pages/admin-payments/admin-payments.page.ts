import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  PaymentsService,
  type PaymentHistoryRow,
} from '../../core/services/payments.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-payments',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './admin-payments.page.html',
  styleUrl: './admin-payments.page.scss',
})
export class AdminPaymentsPage implements OnInit {
  private readonly payments = inject(PaymentsService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(LocaleService);
  private readonly toast = inject(ToastService);

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly rows = signal<PaymentHistoryRow[]>([]);
  readonly total = signal(0);

  statusFilter = '';

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Payment history',
      description: 'Admin payment confirmation and order history for X Cron Jobs.',
      path: '/admin/payments',
      robots: 'noindex,follow',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
    await this.auth.ensureSession();
    if (!this.auth.isAdmin()) {
      await this.router.navigate(['/sign-in'], {
        queryParams: { returnUrl: '/admin/payments', mode: 'admin' },
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
      const res = await this.payments.listAdminHistory({
        status: this.statusFilter || undefined,
        limit: 500,
      });
      this.rows.set(res.items);
      this.total.set(res.total);
    } catch {
      await this.router.navigate(['/sign-in'], {
        queryParams: { returnUrl: '/admin/payments', mode: 'admin' },
        replaceUrl: true,
      });
    } finally {
      this.busy.set(false);
    }
  }

  async export(format: 'csv' | 'pdf'): Promise<void> {
    const url = this.payments.exportHistoryUrl(format, {
      status: this.statusFilter || undefined,
    });
    try {
      const token = this.auth.token();
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 401 || res.status === 403) {
        await this.router.navigate(['/sign-in'], {
          queryParams: { returnUrl: '/admin/payments', mode: 'admin' },
          replaceUrl: true,
        });
        return;
      }
      if (!res.ok) throw new Error('export failed');
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download =
        format === 'csv'
          ? 'xcron-payment-history.csv'
          : 'xcron-payment-history.pdf';
      a.click();
      URL.revokeObjectURL(a.href);
      this.toast.show(`Exported ${format.toUpperCase()}`);
    } catch {
      this.toast.show('Export failed', 'error');
    }
  }

  formatInr(paise?: number): string {
    if (paise == null) return '—';
    return `₹${(paise / 100).toFixed(0)}`;
  }
}
