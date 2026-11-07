import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  ModerationService,
  QUEUE_LABELS,
  type ModerationCase,
  type ModerationQueue,
  type ModerationReport,
  type TrustAuditEvent,
} from '../../core/services/moderation.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';

const QUEUES = Object.keys(QUEUE_LABELS) as ModerationQueue[];

@Component({
  selector: 'app-admin-trust',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './admin-trust.page.html',
  styleUrl: './admin-trust.page.scss',
})
export class AdminTrustPage implements OnInit {
  private readonly moderation = inject(ModerationService);
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  readonly isModerator = this.auth.isModerator;
  readonly isAdmin = this.auth.isAdmin;
  readonly queues = QUEUES;
  readonly queueLabels = QUEUE_LABELS;

  readonly busy = signal(false);
  readonly dash = signal<{
    queues: Record<ModerationQueue, number>;
    overdue: number;
    openTotal: number;
  } | null>(null);
  readonly cases = signal<ModerationCase[]>([]);
  readonly active = signal<ModerationCase | null>(null);
  readonly reports = signal<ModerationReport[]>([]);
  readonly audit = signal<TrustAuditEvent[]>([]);
  readonly searchHits = signal<{
    users: Array<Record<string, unknown>>;
    employers: Array<Record<string, unknown>>;
    jobs: Array<Record<string, unknown>>;
  } | null>(null);

  activeQueue: ModerationQueue | 'all' = 'reported_target';
  statusFilter: 'open' | 'in_review' | 'resolved' | 'dismissed' | 'all' = 'open';
  decideReason = '';
  decideCode = 'staff_decision';
  searchQ = '';
  suspendHours: number | null = 72;

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Trust desk',
      description: 'Moderation queues, reports, risk flags, and appeals.',
      path: '/admin/trust',
    });
    if (this.auth.isModerator()) {
      await this.reload();
    }
  }

  async reload(): Promise<void> {
    this.busy.set(true);
    try {
      const [dash, list] = await Promise.all([
        this.moderation.dashboard(),
        this.moderation.listCases({
          queue: this.activeQueue === 'all' ? undefined : this.activeQueue,
          status: this.statusFilter === 'all' ? undefined : this.statusFilter,
        }),
      ]);
      this.dash.set(dash);
      this.cases.set(list.items);
    } catch {
      this.toast.show('Could not load trust desk.', 'error');
    } finally {
      this.busy.set(false);
    }
  }

  async selectQueue(queue: ModerationQueue | 'all'): Promise<void> {
    this.activeQueue = queue;
    this.active.set(null);
    await this.reload();
  }

  async openCase(row: ModerationCase): Promise<void> {
    this.busy.set(true);
    try {
      const detail = await this.moderation.getCase(row.id);
      this.active.set(detail.case);
      this.reports.set(detail.reports);
      this.audit.set(detail.audit);
      this.decideReason = '';
    } catch {
      this.toast.show('Could not open case.', 'error');
    } finally {
      this.busy.set(false);
    }
  }

  async assignToMe(): Promise<void> {
    const row = this.active();
    const me = this.auth.user();
    if (!row || !me) return;
    await this.moderation.assign(row.id, me.id);
    this.toast.show('Assigned to you.');
    await this.openCase(row);
    await this.reload();
  }

  async decide(decision: string): Promise<void> {
    const row = this.active();
    if (!row || this.decideReason.trim().length < 3) {
      this.toast.show('Reason required (min 3 chars).', 'error');
      return;
    }
    this.busy.set(true);
    try {
      await this.moderation.decide(row.id, {
        decision,
        reason: this.decideReason.trim(),
        reasonCode: this.decideCode || 'staff_decision',
      });
      this.toast.show(`Decision: ${decision}`);
      await this.reload();
      const refreshed = this.cases().find((c) => c.id === row.id);
      if (refreshed) await this.openCase(refreshed);
      else this.active.set(null);
    } catch {
      this.toast.show('Decision failed.', 'error');
    } finally {
      this.busy.set(false);
    }
  }

  async dismissFlags(): Promise<void> {
    const row = this.active();
    if (!row?.riskFlags.length) return;
    if (this.decideReason.trim().length < 3) {
      this.toast.show('Reason required to override risk flags.', 'error');
      return;
    }
    await this.moderation.decide(row.id, {
      decision: 'override_risk',
      reason: this.decideReason.trim(),
      reasonCode: 'risk_override',
      dismissRiskFlags: [...row.riskFlags],
    });
    this.toast.show('Risk flags dismissed.');
    await this.openCase(row);
  }

  async runSearch(): Promise<void> {
    if (this.searchQ.trim().length < 2) return;
    try {
      this.searchHits.set(await this.moderation.search(this.searchQ.trim()));
    } catch {
      this.toast.show('Search failed.', 'error');
    }
  }

  async suspendTargetUser(): Promise<void> {
    const row = this.active();
    if (!row || row.targetType !== 'user') return;
    if (this.decideReason.trim().length < 5) {
      this.toast.show('Suspension reason required.', 'error');
      return;
    }
    await this.moderation.suspendUser(row.targetId, {
      reasonCode: this.decideCode || 'moderation',
      reason: this.decideReason.trim(),
      durationHours: this.suspendHours || undefined,
    });
    this.toast.show('User suspended.');
    await this.decide('suspend_user');
  }

  overdue(row: ModerationCase): boolean {
    return !!row.slaAt && new Date(row.slaAt).getTime() < Date.now();
  }
}
