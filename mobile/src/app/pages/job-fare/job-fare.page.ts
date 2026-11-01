import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import {
  ChannelsService,
  type ChannelMessage,
  type ChannelSource,
  type ChannelWorkflow,
  type PullRun,
  type PullSchedule,
} from '../../core/services/channels.service';

type Panel = 'inbox' | 'sources' | 'schedule' | 'history';

@Component({
  selector: 'app-job-fare',
  templateUrl: './job-fare.page.html',
  styleUrls: ['./job-fare.page.scss'],
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonInput,
    IonTextarea,
    IonToggle,
  ],
})
export class JobFarePage implements OnInit {
  private readonly channels = inject(ChannelsService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);

  readonly busy = signal(false);
  readonly panel = signal<Panel>('inbox');
  readonly workflow = signal<ChannelWorkflow | null>(null);
  readonly messages = signal<ChannelMessage[]>([]);
  readonly sources = signal<ChannelSource[]>([]);
  readonly pulls = signal<PullRun[]>([]);
  readonly selected = signal<Set<string>>(new Set());

  pasteText = '';
  morningTime = '07:30';
  eveningTime = '18:30';
  morningEnabled = true;
  eveningEnabled = true;
  newLabel = '';
  newExternalId = '';
  newProvider: 'telegram' | 'whatsapp_manual' = 'telegram';

  readonly isAdmin = computed(() => this.auth.isAdmin());
  readonly stages = computed(() => this.workflow()?.stages ?? []);

  async ngOnInit() {
    if (!this.auth.isAdmin()) {
      await this.router.navigate(['/tabs/account'], {
        queryParams: { mode: 'admin', returnUrl: '/tabs/job-fare' },
      });
      return;
    }
    await this.reload();
  }

  async reload(): Promise<void> {
    this.busy.set(true);
    try {
      const [workflow, messages, sources, pulls] = await Promise.all([
        this.channels.workflow(),
        this.channels.listMessages('pending'),
        this.channels.listSources(),
        this.channels.listPulls(),
      ]);
      this.workflow.set(workflow);
      this.messages.set(messages.items);
      this.sources.set(sources.items);
      this.pulls.set(pulls.items);
      this.applySchedule(workflow.schedule);
      this.selected.set(new Set());
    } catch {
      await this.showToast('Could not load Job Fare. Sign in as admin.');
    } finally {
      this.busy.set(false);
    }
  }

  setPanel(next: Panel) {
    this.panel.set(next);
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

  async addPaste(): Promise<void> {
    if (!this.pasteText.trim()) {
      await this.showToast('Paste WhatsApp / Telegram job text first.');
      return;
    }
    this.busy.set(true);
    try {
      await this.channels.addManual({ text: this.pasteText.trim() });
      this.pasteText = '';
      await this.showToast('Added to Job Fare inbox.');
      await this.reload();
    } catch {
      await this.showToast('Could not add message.');
    } finally {
      this.busy.set(false);
    }
  }

  async skipSelected(): Promise<void> {
    const ids = [...this.selected()];
    if (!ids.length) {
      await this.showToast('Select messages to skip.');
      return;
    }
    this.busy.set(true);
    try {
      const result = await this.channels.skipMessages(ids);
      await this.showToast(`Skipped ${result.skipped}.`);
      await this.reload();
    } catch {
      await this.showToast('Skip failed.');
    } finally {
      this.busy.set(false);
    }
  }

  async pullNow(): Promise<void> {
    this.busy.set(true);
    try {
      const run = await this.channels.pullNow();
      if (run.status === 'empty') {
        await this.showToast('Inbox empty — nothing to pull.');
      } else if (run.importBatchId) {
        await this.showToast(
          `Pulled ${run.messageCount} posts → ${run.recordCount} drafts. Open review.`,
        );
        await this.router.navigate(['/tabs/import'], {
          queryParams: { batchId: run.importBatchId },
        });
        return;
      } else {
        await this.showToast(`Pull finished: ${run.status}`);
      }
      await this.reload();
    } catch (err) {
      const msg =
        err && typeof err === 'object' && 'error' in err
          ? String((err as { error?: { message?: string } }).error?.message ?? '')
          : '';
      await this.showToast(msg || 'Pull failed. Save schedule once as admin first.');
    } finally {
      this.busy.set(false);
    }
  }

  async saveSchedule(): Promise<void> {
    this.busy.set(true);
    try {
      await this.channels.updateSchedule({
        morningEnabled: this.morningEnabled,
        morningTime: this.morningTime,
        eveningEnabled: this.eveningEnabled,
        eveningTime: this.eveningTime,
        timezone: 'Asia/Kolkata',
      });
      await this.showToast('Schedule saved. This admin owns auto-pull digests.');
      await this.reload();
    } catch {
      await this.showToast('Could not save schedule.');
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
      await this.showToast('Could not update source.');
    } finally {
      this.busy.set(false);
    }
  }

  async addSource(): Promise<void> {
    if (!this.newLabel.trim() || !this.newExternalId.trim()) {
      await this.showToast('Label and external id required.');
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
      await this.showToast('Source added.');
      this.panel.set('sources');
      await this.reload();
    } catch {
      await this.showToast('Could not add source.');
    } finally {
      this.busy.set(false);
    }
  }

  openBatch(run: PullRun) {
    if (!run.importBatchId) return;
    void this.router.navigate(['/tabs/import'], {
      queryParams: { batchId: run.importBatchId },
    });
  }

  providerLabel(provider: ChannelSource['provider'] | ChannelMessage['provider']) {
    return provider === 'telegram' ? 'Telegram' : 'WhatsApp bridge';
  }

  private applySchedule(schedule: PullSchedule) {
    this.morningEnabled = schedule.morningEnabled;
    this.eveningEnabled = schedule.eveningEnabled;
    this.morningTime = schedule.morningTime;
    this.eveningTime = schedule.eveningTime;
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2600,
      color: 'dark',
    });
    await toast.present();
  }
}
