import { DatePipe, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  FeedbackService,
  type FeedbackMessage,
  type FeedbackThread,
} from '../../core/services/feedback.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';

const THREAD_POLL_MS = 2_500;
const NEW_HIGHLIGHT_MS = 4_500;
const TYPING_HEARTBEAT_MS = 2_000;

@Component({
  selector: 'app-admin-feedback',
  imports: [DatePipe, FormsModule],
  templateUrl: './admin-feedback.page.html',
  styleUrl: './admin-feedback.page.scss',
})
export class AdminFeedbackPage implements OnInit, OnDestroy {
  private readonly feedback = inject(FeedbackService);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);

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
    this.seo.setPage({
      title: 'Feedback desk',
      description: 'Admin Contact Admin messenger inbox.',
      path: '/admin/feedback',
      robots: 'noindex,follow',
    });
    await this.reload();
    const threadId = this.route.snapshot.queryParamMap.get('thread')?.trim();
    if (threadId) await this.open(threadId);
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
      this.items.set(
        await this.feedback.listAdmin({
          status: this.statusFilter,
          audience: this.audienceFilter || undefined,
        }),
      );
    } catch {
      this.toast.error('Could not load feedback threads.');
    } finally {
      this.busy.set(false);
    }
  }

  async open(id: string): Promise<void> {
    this.busy.set(true);
    try {
      const detail = await this.feedback.getAdmin(id);
      this.active.set(detail);
      this.replaceMessages(detail.messages ?? [], { highlightNew: false });
      this.startPoll();
      this.scrollChatToEnd();
    } catch {
      this.toast.error('Could not open thread.');
    } finally {
      this.busy.set(false);
    }
  }

  async send(): Promise<void> {
    const thread = this.active();
    const body = this.chatBody.trim();
    if (!thread || !body) return;
    this.busy.set(true);
    this.sending.set(true);
    await this.clearTyping();
    try {
      const res = await this.feedback.sendAdminMessage(thread.id, body);
      this.chatBody = '';
      this.replaceMessages([...this.messages(), res.message], {
        highlightNew: true,
      });
      this.active.set({ ...thread, ...res.thread, messages: this.messages() });
      await this.reload();
      this.scrollChatToEnd();
    } catch {
      this.toast.error('Could not send reply.');
    } finally {
      this.sending.set(false);
      this.busy.set(false);
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
      this.toast.error('Could not close thread.');
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
      this.toast.error('Could not reopen thread.');
    } finally {
      this.busy.set(false);
    }
  }

  private startPoll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.stopPoll();
    document.addEventListener('visibilitychange', this.onVisibility);
    this.pollTimer = setInterval(() => {
      void this.refreshActiveQuiet();
    }, THREAD_POLL_MS);
  }

  private stopPoll(): void {
    if (this.pollTimer != null) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('visibilitychange', this.onVisibility);
    }
  }

  private async refreshActiveQuiet(): Promise<void> {
    const thread = this.active();
    if (!thread || this.pollInFlight || this.busy()) return;
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
        this.items.set(
          await this.feedback.listAdmin({
            status: this.statusFilter,
            audience: this.audienceFilter || undefined,
          }),
        );
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
    if (!isPlatformBrowser(this.platformId)) return;
    queueMicrotask(() => {
      const el = this.chatLog?.nativeElement;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    });
  }
}
