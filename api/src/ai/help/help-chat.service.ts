import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  HelpChatProvider,
  HelpChatProviderId,
  HelpChatQuotaSnapshot,
  HelpChatResult,
  HelpChatTurn,
} from './help-chat.types';
import { HELP_CHAT_SYSTEM, HELP_CHAT_WELCOME } from './prompts/help-chat.prompt';
import { OpenAiCompatibleHelpProvider } from './providers/openai-compatible-help.provider';
import { StubHelpProvider } from './providers/stub-help.provider';

type UserQuota = {
  /** UTC day key YYYY-MM-DD */
  day: string;
  usedTokens: number;
  lastMessageAt: number;
  /** Soft cool-down after budget exhaust (ms epoch). */
  coolDownUntil: number | null;
};

function envFlag(name: string, fallback = false): boolean {
  const raw = (process.env[name] ?? '').trim().toLowerCase();
  if (!raw) return fallback;
  return raw === '1' || raw === 'true' || raw === 'yes' || raw === 'on';
}

function envInt(name: string, fallback: number): number {
  const n = Number(process.env[name] ?? '');
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function utcDayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

@Injectable()
export class HelpChatService {
  private readonly logger = new Logger(HelpChatService.name);
  private readonly provider: HelpChatProvider;
  private readonly quotas = new Map<string, UserQuota>();

  constructor() {
    this.provider = this.resolveProvider();
    this.logger.log(
      `AI help chat: enabled=${this.isEnabled()} provider=${this.provider.id}`,
    );
  }

  isEnabled(): boolean {
    return envFlag('AI_HELP_ENABLED', false);
  }

  welcomeMessage(): string {
    return HELP_CHAT_WELCOME;
  }

  statusForUser(userId: string): HelpChatQuotaSnapshot {
    const q = this.snapshotQuota(userId);
    return {
      enabled: this.isEnabled(),
      provider: this.provider.id,
      model:
        process.env.AI_HELP_MODEL?.trim() ||
        (this.provider.id === 'groq'
          ? 'openai/gpt-oss-20b'
          : this.provider.id === 'ollama'
            ? 'llama3.2:1b'
            : this.provider.id === 'openai'
              ? 'gpt-4o-mini'
              : null),
      remainingTokens: q.remainingTokens,
      dailyTokenBudget: q.dailyTokenBudget,
      usedTokens: q.usedTokens,
      cooldownSecondsRemaining: q.cooldownSecondsRemaining,
      coolDownUntil: q.coolDownUntil,
      maxMessageChars: envInt('AI_HELP_MAX_MESSAGE_CHARS', 400),
      maxHistoryTurns: envInt('AI_HELP_MAX_HISTORY_TURNS', 4),
    };
  }

  async chat(
    userId: string,
    message: string,
    history: HelpChatTurn[] = [],
  ): Promise<HelpChatResult> {
    if (!this.isEnabled()) {
      throw new ServiceUnavailableException(
        'In-app help is temporarily unavailable.',
      );
    }

    const trimmed = message.trim();
    const maxChars = envInt('AI_HELP_MAX_MESSAGE_CHARS', 400);
    if (!trimmed || trimmed.length > maxChars) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Message must be 1–${maxChars} characters.`,
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    this.assertAllowed(userId, trimmed);

    const maxHistory = envInt('AI_HELP_MAX_HISTORY_TURNS', 4);
    const safeHistory = history
      .filter(
        (t) =>
          (t.role === 'user' || t.role === 'assistant') &&
          typeof t.content === 'string' &&
          t.content.trim(),
      )
      .slice(-maxHistory)
      .map((t) => ({
        role: t.role,
        content: t.content.trim().slice(0, 800),
      }));

    const maxTokens = envInt('AI_HELP_MAX_COMPLETION_TOKENS', 220);

    let result: { reply: string; tokensUsed: number; provider: string };
    try {
      result = await this.provider.chat({
        system: HELP_CHAT_SYSTEM,
        history: safeHistory,
        message: trimmed,
        maxTokens,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'help_chat_failed';
      this.logger.warn(`Help chat failed for ${userId}: ${msg}`);
      throw new ServiceUnavailableException(
        'Help assistant is busy. Please try again shortly.',
      );
    }

    const tokensUsed = Math.max(1, result.tokensUsed);
    this.consume(userId, tokensUsed);

    const snap = this.snapshotQuota(userId);
    return {
      reply: result.reply,
      provider: result.provider,
      tokensUsed,
      remainingTokens: snap.remainingTokens,
      dailyTokenBudget: snap.dailyTokenBudget,
      cooldownSecondsRemaining: snap.cooldownSecondsRemaining,
      coolDownUntil: snap.coolDownUntil,
    };
  }

  private assertAllowed(userId: string, message: string): void {
    const now = Date.now();
    const budget = envInt('AI_HELP_DAILY_TOKEN_BUDGET', 2500);
    const cooldownMs = envInt('AI_HELP_COOLDOWN_MS', 20_000);
    const coolDownAfterExhaustMs = envInt(
      'AI_HELP_EXHAUST_COOLDOWN_MS',
      6 * 60 * 60 * 1000,
    );

    const state = this.ensureQuota(userId);
    if (state.coolDownUntil && state.coolDownUntil > now) {
      const retryAfterSeconds = Math.ceil((state.coolDownUntil - now) / 1000);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message:
            'Help token budget used for now. Please wait before asking again.',
          error: 'Too Many Requests',
          retryAfterSeconds,
          coolDownUntil: new Date(state.coolDownUntil).toISOString(),
          remainingTokens: 0,
          dailyTokenBudget: budget,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (state.usedTokens >= budget) {
      const until = now + coolDownAfterExhaustMs;
      state.coolDownUntil = until;
      const retryAfterSeconds = Math.ceil(coolDownAfterExhaustMs / 1000);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message:
            'Daily help token budget reached. Please wait before asking again.',
          error: 'Too Many Requests',
          retryAfterSeconds,
          coolDownUntil: new Date(until).toISOString(),
          remainingTokens: 0,
          dailyTokenBudget: budget,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Reserve a cheap estimate so burst abuse cannot stack unpaid calls.
    const estimate = Math.ceil(message.length / 4) + 80;
    if (state.usedTokens + estimate > budget + 200) {
      const until = now + coolDownAfterExhaustMs;
      state.coolDownUntil = until;
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message:
            'Help token budget almost empty. Please wait before asking again.',
          error: 'Too Many Requests',
          retryAfterSeconds: Math.ceil(coolDownAfterExhaustMs / 1000),
          coolDownUntil: new Date(until).toISOString(),
          remainingTokens: Math.max(0, budget - state.usedTokens),
          dailyTokenBudget: budget,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (cooldownMs > 0 && state.lastMessageAt > 0) {
      const elapsed = now - state.lastMessageAt;
      if (elapsed < cooldownMs) {
        const retryAfterSeconds = Math.ceil((cooldownMs - elapsed) / 1000);
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: `Please wait ${retryAfterSeconds}s before another help message.`,
            error: 'Too Many Requests',
            retryAfterSeconds,
            coolDownUntil: new Date(state.lastMessageAt + cooldownMs).toISOString(),
            remainingTokens: Math.max(0, budget - state.usedTokens),
            dailyTokenBudget: budget,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }
  }

  private consume(userId: string, tokensUsed: number): void {
    const budget = envInt('AI_HELP_DAILY_TOKEN_BUDGET', 2500);
    const coolDownAfterExhaustMs = envInt(
      'AI_HELP_EXHAUST_COOLDOWN_MS',
      6 * 60 * 60 * 1000,
    );
    const state = this.ensureQuota(userId);
    state.usedTokens += tokensUsed;
    state.lastMessageAt = Date.now();
    if (state.usedTokens >= budget) {
      state.coolDownUntil = Date.now() + coolDownAfterExhaustMs;
    }
  }

  private ensureQuota(userId: string): UserQuota {
    const day = utcDayKey();
    const existing = this.quotas.get(userId);
    if (!existing || existing.day !== day) {
      const fresh: UserQuota = {
        day,
        usedTokens: 0,
        lastMessageAt: 0,
        coolDownUntil: null,
      };
      this.quotas.set(userId, fresh);
      return fresh;
    }
    return existing;
  }

  private snapshotQuota(userId: string): {
    remainingTokens: number;
    dailyTokenBudget: number;
    usedTokens: number;
    cooldownSecondsRemaining: number;
    coolDownUntil: string | null;
  } {
    const budget = envInt('AI_HELP_DAILY_TOKEN_BUDGET', 2500);
    const cooldownMs = envInt('AI_HELP_COOLDOWN_MS', 20_000);
    const state = this.ensureQuota(userId);
    const now = Date.now();

    let coolDownUntilMs: number | null = null;
    if (state.coolDownUntil && state.coolDownUntil > now) {
      coolDownUntilMs = state.coolDownUntil;
    } else if (
      cooldownMs > 0 &&
      state.lastMessageAt > 0 &&
      now - state.lastMessageAt < cooldownMs
    ) {
      coolDownUntilMs = state.lastMessageAt + cooldownMs;
    }

    const cooldownSecondsRemaining = coolDownUntilMs
      ? Math.max(0, Math.ceil((coolDownUntilMs - now) / 1000))
      : 0;

    return {
      remainingTokens: Math.max(0, budget - state.usedTokens),
      dailyTokenBudget: budget,
      usedTokens: state.usedTokens,
      cooldownSecondsRemaining,
      coolDownUntil: coolDownUntilMs
        ? new Date(coolDownUntilMs).toISOString()
        : null,
    };
  }

  private resolveProvider(): HelpChatProvider {
    if (!this.isEnabled()) return new StubHelpProvider();

    const raw = (
      process.env.AI_HELP_PROVIDER?.trim() ||
      process.env.AI_ENRICH_PROVIDER?.trim() ||
      'stub'
    ).toLowerCase() as HelpChatProviderId;

    if (raw === 'stub') return new StubHelpProvider();
    if (raw === 'groq' || raw === 'ollama' || raw === 'openai') {
      return new OpenAiCompatibleHelpProvider(raw);
    }

    this.logger.warn(`Unknown AI_HELP_PROVIDER=${raw}; using stub`);
    return new StubHelpProvider();
  }
}
