import {
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AiService,
  HelpChatStatus,
  HelpChatTurn,
} from '../../core/services/ai.service';
import { AuthService } from '../../core/services/auth.service';
import { friendlyHttpMessage } from '../../core/utils/friendly-http-message';

type UiMessage = HelpChatTurn & { id: number };

@Component({
  selector: 'app-help-chat',
  imports: [FormsModule],
  templateUrl: './help-chat.component.html',
  styleUrl: './help-chat.component.scss',
})
export class HelpChatComponent implements OnDestroy {
  private readonly ai = inject(AiService);
  private readonly auth = inject(AuthService);
  private readonly log = viewChild<ElementRef<HTMLElement>>('log');

  readonly isSignedIn = this.auth.isSignedIn;
  readonly open = signal(false);
  readonly busy = signal(false);
  readonly enabled = signal(false);
  readonly draft = signal('');
  readonly messages = signal<UiMessage[]>([]);
  readonly status = signal<HelpChatStatus | null>(null);
  readonly error = signal<string | null>(null);
  readonly cooldownLeft = signal(0);

  readonly suggestions = [
    'How do I search for jobs?',
    'How does Easy apply work?',
    'Where are my saved jobs?',
  ] as const;

  private msgSeq = 0;
  private loadedForUser: string | null = null;
  private cooldownTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    effect(() => {
      const signedIn = this.isSignedIn();
      const userId = this.auth.user()?.id ?? null;

      if (!signedIn || !userId) {
        this.resetLocal();
        return;
      }
      if (this.loadedForUser === userId) return;
      this.loadedForUser = userId;
      void this.hydrate();
    });

    effect(() => {
      this.messages();
      this.busy();
      if (!this.open()) return;
      queueMicrotask(() => this.scrollLogToEnd());
    });
  }

  ngOnDestroy(): void {
    this.clearCooldownTimer();
  }

  showSuggestions(): boolean {
    return this.messages().length <= 1 && !this.busy();
  }

  useSuggestion(text: string): void {
    if (this.busy() || this.cooldownLeft() > 0) return;
    this.draft.set(text);
    void this.send();
  }

  onComposerKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    void this.send();
  }

  toggle(): void {
    if (!this.enabled()) return;
    this.open.update((v) => !v);
    if (this.open() && this.messages().length === 0) {
      const welcome =
        this.status()?.welcome ||
        'Hi — I can help you use X Cron Jobs. What do you need?';
      this.pushAssistant(welcome);
    }
  }

  async send(): Promise<void> {
    const text = this.draft().trim();
    if (!text || this.busy() || !this.enabled()) return;
    if (this.cooldownLeft() > 0) {
      this.error.set(`Please wait ${this.cooldownLeft()}s before another message.`);
      return;
    }

    const maxChars = this.status()?.maxMessageChars ?? 400;
    if (text.length > maxChars) {
      this.error.set(`Keep messages under ${maxChars} characters.`);
      return;
    }

    this.error.set(null);
    this.draft.set('');
    this.pushUser(text);
    this.busy.set(true);

    const historyCap = this.status()?.maxHistoryTurns ?? 4;
    const history = this.messages()
      .slice(0, -1)
      .slice(-historyCap)
      .map(({ role, content }) => ({ role, content }));

    try {
      const result = await this.ai.helpChat(text, history);
      this.pushAssistant(result.reply);
      this.patchQuota(result);
    } catch (err) {
      this.error.set(
        friendlyHttpMessage(err, 'Help is busy. Try again in a moment.'),
      );
      this.applyHttpQuota(err);
    } finally {
      this.busy.set(false);
    }
  }

  remainingLabel(): string {
    const s = this.status();
    if (!s) return '';
    return `${s.remainingTokens} / ${s.dailyTokenBudget} tokens left today`;
  }

  private scrollLogToEnd(): void {
    const el = this.log()?.nativeElement;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }

  private async hydrate(): Promise<void> {
    try {
      const status = await this.ai.helpStatus();
      this.status.set(status);
      this.enabled.set(!!status.enabled);
      this.syncCooldown(status.cooldownSecondsRemaining);
      if (!status.enabled) {
        this.open.set(false);
      }
    } catch {
      this.enabled.set(false);
      this.open.set(false);
    }
  }

  private patchQuota(result: {
    remainingTokens: number;
    dailyTokenBudget: number;
    cooldownSecondsRemaining: number;
    coolDownUntil: string | null;
  }): void {
    const prev = this.status();
    if (!prev) return;
    this.status.set({
      ...prev,
      remainingTokens: result.remainingTokens,
      dailyTokenBudget: result.dailyTokenBudget,
      usedTokens: Math.max(
        0,
        result.dailyTokenBudget - result.remainingTokens,
      ),
      cooldownSecondsRemaining: result.cooldownSecondsRemaining,
      coolDownUntil: result.coolDownUntil,
    });
    this.syncCooldown(result.cooldownSecondsRemaining);
  }

  private applyHttpQuota(err: unknown): void {
    const body = (err as { error?: Record<string, unknown> })?.error;
    if (!body || typeof body !== 'object') return;
    const remaining = body['remainingTokens'];
    const budget = body['dailyTokenBudget'];
    const retry = body['retryAfterSeconds'];
    const until = body['coolDownUntil'];
    const prev = this.status();
    if (!prev) return;
    this.status.set({
      ...prev,
      remainingTokens:
        typeof remaining === 'number' ? remaining : prev.remainingTokens,
      dailyTokenBudget:
        typeof budget === 'number' ? budget : prev.dailyTokenBudget,
      coolDownUntil: typeof until === 'string' ? until : prev.coolDownUntil,
      cooldownSecondsRemaining:
        typeof retry === 'number' ? retry : prev.cooldownSecondsRemaining,
    });
    if (typeof retry === 'number' && retry > 0) {
      this.syncCooldown(retry);
    }
  }

  private syncCooldown(seconds: number): void {
    this.clearCooldownTimer();
    const left = Math.max(0, Math.floor(seconds));
    this.cooldownLeft.set(left);
    if (left <= 0) return;
    this.cooldownTimer = setInterval(() => {
      this.cooldownLeft.update((n) => {
        const next = Math.max(0, n - 1);
        if (next <= 0) this.clearCooldownTimer();
        return next;
      });
    }, 1000);
  }

  private clearCooldownTimer(): void {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
      this.cooldownTimer = null;
    }
  }

  private pushUser(content: string): void {
    this.msgSeq += 1;
    this.messages.update((list) => [
      ...list,
      { id: this.msgSeq, role: 'user', content },
    ]);
  }

  private pushAssistant(content: string): void {
    this.msgSeq += 1;
    this.messages.update((list) => [
      ...list,
      { id: this.msgSeq, role: 'assistant', content },
    ]);
  }

  private resetLocal(): void {
    this.loadedForUser = null;
    this.enabled.set(false);
    this.open.set(false);
    this.messages.set([]);
    this.status.set(null);
    this.error.set(null);
    this.draft.set('');
    this.busy.set(false);
    this.cooldownLeft.set(0);
    this.clearCooldownTimer();
  }
}
