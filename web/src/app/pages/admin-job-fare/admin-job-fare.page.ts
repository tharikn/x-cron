import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  ChannelsService,
  type ChannelMessage,
  type ChannelSource,
  type ChannelStatus,
  type ChannelWorkflow,
  type PullRun,
} from '../../core/services/channels.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';

type Panel = 'status' | 'pull' | 'inbox' | 'sources' | 'schedule' | 'history';

@Component({
  selector: 'app-admin-job-fare',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './admin-job-fare.page.html',
  styleUrl: './admin-job-fare.page.scss',
})
export class AdminJobFarePage implements OnInit {
  private readonly channels = inject(ChannelsService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(LocaleService);
  private readonly toast = inject(ToastService);

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly panel = signal<Panel>('status');
  readonly workflow = signal<ChannelWorkflow | null>(null);
  readonly status = signal<ChannelStatus | null>(null);
  readonly messages = signal<ChannelMessage[]>([]);
  readonly sources = signal<ChannelSource[]>([]);
  readonly pulls = signal<PullRun[]>([]);
  readonly selected = signal<Set<string>>(new Set());
  readonly lastBatchIds = signal<string[]>([]);

  pasteText = '';
  morningTime = '07:30';
  eveningTime = '18:30';
  morningEnabled = true;
  eveningEnabled = true;
  newLabel = '';
  newExternalId = '';
  newProvider: 'telegram' | 'whatsapp_manual' = 'telegram';
  /** Posts per digest when splitting a large inbox. */
  batchSize = 25;
  pullSourceFilter = '';

  readonly stages = computed(() => this.workflow()?.stages ?? []);
  readonly pendingCount = computed(
    () => this.workflow()?.pendingMessages ?? this.messages().length,
  );

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Job Fare pull',
      description: 'Admin Telegram + WhatsApp bridge pull, schedule, and history.',
      path: '/admin/job-fare',
      robots: 'noindex,follow',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
    await this.auth.ensureSession();
    if (!this.auth.isAdmin()) {
      await this.router.navigate(['/sign-in'], {
        queryParams: { returnUrl: '/admin/job-fare', mode: 'admin' },
        replaceUrl: true,
      });
      return;
    }
    await this.reload();
  }

  setPanel(next: Panel) {
    this.panel.set(next);
  }

  async reload(): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      const [workflow, status, messages, sources, pulls] = await Promise.all([
        this.channels.workflow(),
        this.channels.status(),
        this.channels.listMessages('pending'),
        this.channels.listSources(),
        this.channels.listPulls(),
      ]);
      this.workflow.set(workflow);
      this.status.set(status);
      this.messages.set(messages.items);
      this.sources.set(sources.items);
      this.pulls.set(pulls.items);
      this.morningEnabled = workflow.schedule.morningEnabled;
      this.eveningEnabled = workflow.schedule.eveningEnabled;
      this.morningTime = workflow.schedule.morningTime;
      this.eveningTime = workflow.schedule.eveningTime;
      this.selected.set(new Set());
    } catch {
      this.error.set('Could not load Job Fare. Sign in as admin and ensure the API is running.');
      await this.router.navigate(['/sign-in'], {
        queryParams: { returnUrl: '/admin/job-fare', mode: 'admin' },
        replaceUrl: true,
      });
    } finally {
      this.busy.set(false);
    }
  }

  toggleSelect(id: string) {
    const next = new Set(this.selected());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.selected.set(next);
  }

  isSelected(id: string) {
    return this.selected().has(id);
  }

  selectAllPending() {
    this.selected.set(new Set(this.messages().map((m) => m.id)));
  }

  clearSelection() {
    this.selected.set(new Set());
  }

  async addPaste(): Promise<void> {
    if (!this.pasteText.trim()) {
      this.toast.show('Paste WhatsApp / jobfare text first.');
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.channels.addManual({ text: this.pasteText.trim() });
      this.pasteText = '';
      this.toast.show('Added to Job Fare inbox.');
      await this.reload();
      this.panel.set('inbox');
    } catch {
      this.error.set('Could not add message to inbox.');
    } finally {
      this.busy.set(false);
    }
  }

  async skipSelected(): Promise<void> {
    const ids = [...this.selected()];
    if (!ids.length) {
      this.toast.show('Select messages to skip.');
      return;
    }
    this.busy.set(true);
    try {
      const result = await this.channels.skipMessages(ids);
      this.toast.show(`Skipped ${result.skipped}.`);
      await this.reload();
    } catch {
      this.error.set('Skip failed.');
    } finally {
      this.busy.set(false);
    }
  }

  private pullOpts(extra?: { messageIds?: string[]; maxMessages?: number }) {
    const sourceIds = this.pullSourceFilter.trim()
      ? [this.pullSourceFilter.trim()]
      : undefined;
    return {
      sourceIds,
      messageIds: extra?.messageIds,
      maxMessages: extra?.maxMessages,
    };
  }

  async pullNow(mode: 'all' | 'batch' | 'selected' = 'batch'): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    this.notice.set(null);
    try {
      const size = Math.max(1, Math.min(200, Math.floor(Number(this.batchSize) || 25)));
      let opts: { sourceIds?: string[]; messageIds?: string[]; maxMessages?: number };
      if (mode === 'selected') {
        const ids = [...this.selected()];
        if (!ids.length) {
          this.toast.show('Select inbox posts first.');
          return;
        }
        opts = this.pullOpts({ messageIds: ids });
      } else if (mode === 'batch') {
        opts = this.pullOpts({ maxMessages: size });
      } else {
        opts = this.pullOpts();
      }

      const run = await this.channels.pullNow(opts);
      if (run.status === 'empty') {
        this.notice.set('Inbox empty — nothing to pull.');
        this.toast.show('Inbox empty — nothing to pull.');
      } else if (run.importBatchId) {
        this.lastBatchIds.set([run.importBatchId]);
        this.notice.set(
          `Pulled ${run.messageCount} posts → ${run.recordCount} drafts (batch ${run.importBatchId}).`,
        );
        this.toast.show(`Pulled ${run.messageCount} posts into a review batch.`);
        await this.router.navigate(['/import'], {
          queryParams: { batchId: run.importBatchId, tab: 'review' },
        });
        return;
      } else {
        this.notice.set(`Pull finished: ${run.status}`);
      }
      await this.reload();
      this.panel.set('history');
    } catch (err) {
      const msg =
        err && typeof err === 'object' && 'error' in err
          ? String((err as { error?: { message?: string } }).error?.message ?? '')
          : '';
      this.error.set(msg || 'Pull failed. Save schedule once as admin first.');
    } finally {
      this.busy.set(false);
    }
  }

  /** Split the whole pending inbox into multiple import batches of batchSize. */
  async pullAllInBatches(): Promise<void> {
    const size = Math.max(1, Math.min(200, Math.floor(Number(this.batchSize) || 25)));
    this.busy.set(true);
    this.error.set(null);
    this.notice.set(null);
    const created: string[] = [];
    let totalPosts = 0;
    let totalDrafts = 0;
    let rounds = 0;
    try {
      while (rounds < 40) {
        rounds += 1;
        const run = await this.channels.pullNow(this.pullOpts({ maxMessages: size }));
        if (run.status === 'empty' || !run.importBatchId) break;
        created.push(run.importBatchId);
        totalPosts += run.messageCount;
        totalDrafts += run.recordCount;
        if (run.messageCount < size) break;
      }
      this.lastBatchIds.set(created);
      if (!created.length) {
        this.notice.set('Inbox empty — nothing to pull.');
        this.toast.show('Inbox empty — nothing to pull.');
      } else {
        this.notice.set(
          `Split into ${created.length} batch(es): ${totalPosts} posts → ${totalDrafts} drafts.`,
        );
        this.toast.show(`Created ${created.length} review batch(es).`);
        await this.router.navigate(['/import'], {
          queryParams: { batchId: created[0], tab: 'review' },
        });
        return;
      }
      await this.reload();
      this.panel.set('history');
    } catch (err) {
      const msg =
        err && typeof err === 'object' && 'error' in err
          ? String((err as { error?: { message?: string } }).error?.message ?? '')
          : '';
      this.error.set(msg || 'Batch pull failed.');
    } finally {
      this.busy.set(false);
    }
  }

  async saveSchedule(): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.channels.updateSchedule({
        morningEnabled: this.morningEnabled,
        morningTime: this.morningTime,
        eveningEnabled: this.eveningEnabled,
        eveningTime: this.eveningTime,
        timezone: 'Asia/Kolkata',
      });
      this.toast.show('Schedule saved. You own auto-pull digests.');
      await this.reload();
    } catch {
      this.error.set('Could not save schedule.');
    } finally {
      this.busy.set(false);
    }
  }

  async toggleSource(source: ChannelSource): Promise<void> {
    this.busy.set(true);
    try {
      await this.channels.updateSource(source.id, {
        status: source.status === 'active' ? 'paused' : 'active',
      });
      await this.reload();
    } catch {
      this.error.set('Could not update source.');
    } finally {
      this.busy.set(false);
    }
  }

  async addSource(): Promise<void> {
    if (!this.newLabel.trim() || !this.newExternalId.trim()) {
      this.toast.show('Label and external id required.');
      return;
    }
    this.busy.set(true);
    try {
      await this.channels.createSource({
        provider: this.newProvider,
        label: this.newLabel.trim(),
        externalId: this.newExternalId.trim(),
      });
      this.newLabel = '';
      this.newExternalId = '';
      this.toast.show('Source added.');
      await this.reload();
      this.panel.set('sources');
    } catch {
      this.error.set('Could not add source.');
    } finally {
      this.busy.set(false);
    }
  }

  openBatch(run: PullRun) {
    if (!run.importBatchId) return;
    void this.router.navigate(['/import'], {
      queryParams: { batchId: run.importBatchId, tab: 'review' },
    });
  }

  openBatchId(id: string) {
    void this.router.navigate(['/import'], {
      queryParams: { batchId: id, tab: 'review' },
    });
  }

  providerLabel(provider: ChannelSource['provider'] | ChannelMessage['provider']) {
    return provider === 'telegram' ? 'Telegram' : 'WhatsApp bridge';
  }
}
