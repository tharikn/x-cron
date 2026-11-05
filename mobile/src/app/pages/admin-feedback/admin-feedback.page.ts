import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController,
  ViewWillEnter,
} from '@ionic/angular';
import {
  FeedbackService,
  type FeedbackMessage,
  type FeedbackThread,
} from '../../core/services/feedback.service';

const THREAD_POLL_MS = 2_500;
const NEW_HIGHLIGHT_MS = 4_500;
const TYPING_HEARTBEAT_MS = 2_000;

@Component({
  selector: 'app-admin-feedback',
  imports: [
    DatePipe,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonSelect,
    IonSelectOption,
    IonTextarea,
  ],
  templateUrl: './admin-feedback.page.html',
  styleUrl: './admin-feedback.page.scss',
})
export class AdminFeedbackPage implements OnInit, OnDestroy, ViewWillEnter {
  private readonly feedback = inject(FeedbackService);
  private readonly route = inject(ActivatedRoute);
  private readonly toastController = inject(ToastController);

  @ViewChild('chatLog') private chatLog?: ElementRef<HTMLElement>;

  readonly items = signal<FeedbackThread[]>([]);
  readonly active = signal<FeedbackThread | null>(null);
  readonly messages = signal<FeedbackMessage[]>([]);
  readonly busy = signal(false);
  readonly sending = signal(false);
  readonly newIds = signal<ReadonlySet<string>>(new Set());

  statusFilter: 'all' | 'awaiting_admin' | 'awaiting_user' | 'closed' =
    'awaiting_admin';
  audienceFilter: '' | 'seeker' | 'employer' = '';
  chatBody = '';

  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private pollInFlight = false;
  private highlightTimer: ReturnType<typeof setTimeout> | null = null;
  private typingSent = false;
  private lastTypingAt = 0;
  private readonly onVisibility = (): void => {
    if (document.visibilityState === 'visible') {
      void this.refreshActiveQuiet();
    }
  };

  readonly showPeerTyping = computed(() => {
    if (this.sending()) return false;
    return Boolean(this.active()?.presence?.peerTyping);
  });
  readonly peerPresenceLine = computed(() => {
    const p = this.active()?.presence;
    if (!p) return '';
    if (p.peerOnline) return 'Online';
    if (!p.peerLastSeenAt) return 'Offline';
    const mins = Math.floor(
      (Date.now() - new Date(p.peerLastSeenAt).getTime()) / 60_000,
    );
    if (mins < 1) return 'Last active just now';
    if (mins < 60) return `Last active ${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Last active ${hours}h ago`;
    return 'Offline';
  });
  readonly peerTypingLabel = computed(() => {
    const name = this.active()?.presence?.peerLabel || 'User';
    return `${name} is typing…`;
  });

  async ngOnInit(): Promise<void> {
    await this.reload();
    await this.openThreadFromQuery();
  }

  ionViewWillEnter(): void {
    void this.openFromDeepLinkOrRefresh();
  }

  private async openFromDeepLinkOrRefresh(): Promise<void> {
    if (await this.openThreadFromQuery()) return;
    void this.refreshActiveQuiet();
    if (this.active()) this.startPoll();
  }

  /** Inbox / OS tap `?thread=` — also on re-enter (Ionic may reuse the page). */
  private async openThreadFromQuery(): Promise<boolean> {
    const threadId = this.route.snapshot.queryParamMap.get('thread')?.trim();
    if (!threadId) return false;
    if (this.active()?.id === threadId) {
      this.startPoll();
      return true;
    }
    await this.open(threadId);
    return true;
  }

  ngOnDestroy(): void {
    void this.clearTyping();
    this.stopPoll();
    if (this.highlightTimer != null) clearTimeout(this.highlightTimer);
  }

  onComposerInput(): void {
    void this.pulseTyping(this.chatBody.trim().length > 0);
  }

  isNewMessage(id: string): boolean {
    return this.newIds().has(id);
  }

  isPendingMessage(id: string): boolean {
    return id.startsWith('local-');
  }

  senderLabel(msg: FeedbackMessage, audienceLabel: string): string {
    if (msg.senderRole === 'admin') return 'Admin';
    return msg.senderRole === 'employer' ? 'Recruiter' : audienceLabel || 'User';
  }

  clearActive(): void {
    void this.clearTyping();
    this.active.set(null);
    this.messages.set([]);
    this.newIds.set(new Set());
    this.sending.set(false);
    this.stopPoll();
  }

  async reload(): Promise<void> {
    this.busy.set(true);
    try {
      await this.reloadQuiet();
    } catch {
      await this.showToast('Could not load feedback threads.');
    } finally {
      this.busy.set(false);
    }
  }

  private async reloadQuiet(): Promise<void> {
    this.items.set(
      await this.feedback.listAdmin({
        status: this.statusFilter,
        audience: this.audienceFilter || undefined,
      }),
    );
  }

  async open(id: string): Promise<void> {
    const preview = this.items().find((row) => row.id === id);
    if (preview) {
      this.active.set(preview);
      this.messages.set([]);
    }
    try {
      const detail = await this.feedback.getAdmin(id);
      this.active.set(detail);
      this.replaceMessages(detail.messages ?? [], { highlightNew: false });
      this.startPoll();
      this.scrollChatToEnd();
    } catch {
      if (!preview) this.clearActive();
      await this.showToast('Could not open thread.');
    }
  }

  async send(): Promise<void> {
    const thread = this.active();
    const body = this.chatBody.trim();
    if (!thread || !body || this.sending()) return;

    const tempId = `local-${Date.now()}`;
    const pending: FeedbackMessage = {
      id: tempId,
      threadId: thread.id,
      senderUserId: '',
      senderRole: 'admin',
      body,
      createdAt: new Date().toISOString(),
    };

    this.chatBody = '';
    this.sending.set(true);
    await this.clearTyping();
    this.replaceMessages([...this.messages(), pending], { highlightNew: true });
    this.scrollChatToEnd();

    try {
      const res = await this.feedback.sendAdminMessage(thread.id, body);
      this.replaceMessages(
        this.messages().map((m) => (m.id === tempId ? res.message : m)),
        { highlightNew: true },
      );
      this.active.set({ ...thread, ...res.thread, messages: this.messages() });
      void this.reloadQuiet().catch(() => undefined);
      this.scrollChatToEnd();
    } catch {
      this.messages.set(this.messages().filter((m) => m.id !== tempId));
      this.chatBody = body;
      await this.showToast('Could not send reply.');
    } finally {
      this.sending.set(false);
    }
  }

  async close(): Promise<void> {
    const thread = this.active();
    if (!thread) return;
    this.busy.set(true);
    try {
      const updated = await this.feedback.closeAdmin(thread.id);
      this.active.set({ ...thread, ...updated, messages: this.messages() });
      await this.reload();
    } catch {
      await this.showToast('Could not close thread.');
    } finally {
      this.busy.set(false);
    }
  }

  async reopen(): Promise<void> {
    const thread = this.active();
    if (!thread) return;
    this.busy.set(true);
    try {
      const updated = await this.feedback.reopenAdmin(thread.id);
      this.active.set({ ...thread, ...updated, messages: this.messages() });
      await this.reload();
    } catch {
      await this.showToast('Could not reopen thread.');
    } finally {
      this.busy.set(false);
    }
  }

  private startPoll(): void {
    this.stopPoll();
    document.addEventListener('visibilitychange', this.onVisibility);
    this.pollTimer = setInterval(() => {
      void this.refreshActiveQuiet();
    }, THREAD_POLL_MS);
  }

  private stopPoll(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  private async refreshActiveQuiet(): Promise<void> {
    const thread = this.active();
    if (!thread || this.pollInFlight || this.busy() || this.sending()) return;
    this.pollInFlight = true;
    try {
      const detail = await this.feedback.getAdmin(thread.id);
      const next = detail.messages ?? [];
      const prev = this.messages();
      const msgChanged =
        next.length !== prev.length ||
        next[next.length - 1]?.id !== prev[prev.length - 1]?.id ||
        detail.status !== thread.status;
      const presenceChanged =
        detail.presence?.peerOnline !== thread.presence?.peerOnline ||
        detail.presence?.peerTyping !== thread.presence?.peerTyping ||
        detail.presence?.peerLastSeenAt !== thread.presence?.peerLastSeenAt;
      if (!msgChanged && !presenceChanged) return;
      this.active.set(detail);
      if (!msgChanged) return;
      this.replaceMessages(next, { highlightNew: true });
      this.scrollChatToEnd();
      try {
        await this.reloadQuiet();
      } catch {
        // inbox list refresh is best-effort
      }
    } catch {
      // keep open chat; transient API blips are fine
    } finally {
      this.pollInFlight = false;
    }
  }

  private async pulseTyping(active: boolean): Promise<void> {
    const thread = this.active();
    if (!thread || thread.status === 'closed') return;
    if (!active) {
      await this.clearTyping();
      return;
    }
    const now = Date.now();
    if (this.typingSent && now - this.lastTypingAt < TYPING_HEARTBEAT_MS) {
      return;
    }
    this.lastTypingAt = now;
    this.typingSent = true;
    try {
      const res = await this.feedback.setAdminTyping(thread.id, true);
      this.active.set({ ...thread, presence: res.presence });
    } catch {
      // typing is best-effort
    }
  }

  private async clearTyping(): Promise<void> {
    const thread = this.active();
    if (!thread || !this.typingSent) {
      this.typingSent = false;
      return;
    }
    this.typingSent = false;
    try {
      await this.feedback.setAdminTyping(thread.id, false);
    } catch {
      // ignore
    }
  }

  private replaceMessages(
    next: FeedbackMessage[],
    options: { highlightNew: boolean },
  ): void {
    const prevIds = new Set(this.messages().map((m) => m.id));
    this.messages.set(next);
    if (!options.highlightNew) {
      this.newIds.set(new Set());
      return;
    }
    const fresh = next.filter((m) => !prevIds.has(m.id)).map((m) => m.id);
    if (!fresh.length) return;
    this.newIds.set(new Set(fresh));
    if (this.highlightTimer != null) clearTimeout(this.highlightTimer);
    this.highlightTimer = setTimeout(() => {
      this.newIds.set(new Set());
      this.highlightTimer = null;
    }, NEW_HIGHLIGHT_MS);
  }

  private scrollChatToEnd(): void {
    queueMicrotask(() => {
      const el = this.chatLog?.nativeElement;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    });
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      position: 'bottom',
      cssClass: 'xcron-toast--error',
    });
    await toast.present();
  }
}
