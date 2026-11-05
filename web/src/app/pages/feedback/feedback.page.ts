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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import {
  FeedbackService,
  type FeedbackAudience,
  type FeedbackCategory,
  type FeedbackMessage,
  type FeedbackThread,
  type FaqItem,
} from '../../core/services/feedback.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';

const THREAD_POLL_MS = 2_500;
const NEW_HIGHLIGHT_MS = 4_500;
const TYPING_HEARTBEAT_MS = 2_000;

@Component({
  selector: 'app-feedback',
  imports: [DatePipe, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './feedback.page.html',
  styleUrl: './feedback.page.scss',
})
export class FeedbackPage implements OnInit, OnDestroy {
  private readonly feedback = inject(FeedbackService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(LocaleService);
  private readonly toast = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('chatLog') private chatLog?: ElementRef<HTMLElement>;

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isEmployer = this.auth.isEmployer;
  readonly faq = signal<FaqItem[]>([]);
  readonly threads = signal<FeedbackThread[]>([]);
  readonly active = signal<FeedbackThread | null>(null);
  readonly messages = signal<FeedbackMessage[]>([]);
  readonly busy = signal(false);
  readonly sending = signal(false);
  readonly newIds = signal<ReadonlySet<string>>(new Set());
  readonly openFaqId = signal<string | null>(null);
  readonly panel = signal<'faq' | 'contact'>('faq');

  audience: FeedbackAudience = 'seeker';
  category: FeedbackCategory = 'question';
  subject = '';
  body = '';
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

  readonly canContactAsRecruiter = computed(() => this.isEmployer());
  readonly showPeerTyping = computed(() => {
    if (this.sending()) return false;
    return Boolean(this.active()?.presence?.peerTyping);
  });
  readonly peerPresenceLine = computed(() => {
    const p = this.active()?.presence;
    if (!p) return '';
    if (p.peerOnline) return this.locale.t('feedback.online');
    if (!p.peerLastSeenAt) return this.locale.t('feedback.offline');
    const mins = Math.floor(
      (Date.now() - new Date(p.peerLastSeenAt).getTime()) / 60_000,
    );
    if (mins < 1) return this.locale.t('feedback.lastActiveJustNow');
    if (mins < 60) {
      return this.locale
        .t('feedback.lastActiveMins')
        .replace('{n}', String(mins));
    }
    const hours = Math.floor(mins / 60);
    if (hours < 24) {
      return this.locale
        .t('feedback.lastActiveHours')
        .replace('{n}', String(hours));
    }
    return this.locale.t('feedback.offline');
  });
  readonly peerTypingLabel = computed(() => {
    const p = this.active()?.presence;
    const name = p?.peerLabel || this.locale.t('feedback.admin');
    return `${name} ${this.locale.t('feedback.typing')}`;
  });

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Feedback',
      description: 'FAQ and Contact Admin messenger on X Cron Jobs.',
      path: '/feedback',
      robots: 'noindex,follow',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
    await this.reloadFaq();
    if (this.isSignedIn()) {
      if (this.canContactAsRecruiter()) this.audience = 'employer';
      await this.reloadThreads();
      const threadId = this.route.snapshot.queryParamMap.get('thread')?.trim();
      if (threadId) {
        this.panel.set('contact');
        await this.openThread(threadId);
      }
    }
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
    return msg.senderRole === 'employer' ? 'Recruiter' : audienceLabel || 'You';
  }

  toggleFaq(id: string): void {
    this.openFaqId.set(this.openFaqId() === id ? null : id);
  }

  showContact(): void {
    this.panel.set('contact');
  }

  showFaq(): void {
    this.panel.set('faq');
    this.clearActive();
  }

  clearActive(): void {
    void this.clearTyping();
    this.active.set(null);
    this.messages.set([]);
    this.newIds.set(new Set());
    this.sending.set(false);
    this.stopPoll();
  }

  async reloadFaq(): Promise<void> {
    try {
      this.faq.set(await this.feedback.listFaq());
    } catch {
      this.faq.set([]);
    }
  }

  async reloadThreads(): Promise<void> {
    if (!this.isSignedIn()) return;
    this.busy.set(true);
    try {
      this.threads.set(await this.feedback.listMine());
    } catch {
      this.toast.error('Could not load conversations.');
    } finally {
      this.busy.set(false);
    }
  }

  async openThread(id: string): Promise<void> {
    this.busy.set(true);
    try {
      const detail = await this.feedback.getMine(id);
      this.active.set(detail);
      this.replaceMessages(detail.messages ?? [], { highlightNew: false });
      this.panel.set('contact');
      this.startPoll();
      this.scrollChatToEnd();
    } catch {
      this.toast.error('Could not open conversation.');
    } finally {
      this.busy.set(false);
    }
  }

  async startThread(): Promise<void> {
    if (!this.isSignedIn()) return;
    const subject = this.subject.trim();
    const body = this.body.trim();
    if (subject.length < 3 || !body) {
      this.toast.error('Add a short subject and message.');
      return;
    }
    this.busy.set(true);
    try {
      const detail = await this.feedback.createThread({
        audience: this.audience,
        category: this.category,
        subject,
        body,
      });
      this.subject = '';
      this.body = '';
      this.active.set(detail);
      this.replaceMessages(detail.messages ?? [], { highlightNew: false });
      this.startPoll();
      await this.reloadThreads();
      this.scrollChatToEnd();
      this.toast.success('Message sent to admin.');
    } catch {
      this.toast.error('Could not start conversation.');
    } finally {
      this.busy.set(false);
    }
  }

  async sendChat(): Promise<void> {
    const thread = this.active();
    const body = this.chatBody.trim();
    if (!thread || !body) return;
    this.busy.set(true);
    this.sending.set(true);
    await this.clearTyping();
    try {
      const msg = await this.feedback.sendMessage(thread.id, body);
      this.chatBody = '';
      this.replaceMessages([...this.messages(), msg], { highlightNew: true });
      this.active.set({
        ...thread,
        status: 'awaiting_admin',
        statusLabel: 'Waiting for admin',
        lastMessageAt: msg.createdAt,
        lastSenderRole: msg.senderRole,
      });
      await this.reloadThreads();
      this.scrollChatToEnd();
    } catch {
      this.toast.error('Could not send message.');
    } finally {
      this.sending.set(false);
      this.busy.set(false);
    }
  }

  async closeActive(): Promise<void> {
    const thread = this.active();
    if (!thread) return;
    this.busy.set(true);
    try {
      const updated = await this.feedback.closeMine(thread.id);
      this.active.set({ ...thread, ...updated, messages: this.messages() });
      await this.reloadThreads();
    } catch {
      this.toast.error('Could not close conversation.');
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
    if (!thread || !this.isSignedIn() || this.pollInFlight || this.busy()) return;
    this.pollInFlight = true;
    try {
      const detail = await this.feedback.getMine(thread.id);
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
        this.threads.set(await this.feedback.listMine());
      } catch {
        // list refresh is best-effort while chat is open
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
      const res = await this.feedback.setTyping(thread.id, true);
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
      await this.feedback.setTyping(thread.id, false);
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
