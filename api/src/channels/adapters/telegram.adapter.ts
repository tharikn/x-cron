import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import type { ChannelProvider, InboundChannelPost } from './channel-provider';

type TelegramUpdateHandler = (post: InboundChannelPost) => Promise<void> | void;

/**
 * Free Telegram Bot API adapter (Strategy/Adapter).
 * Uses long-poll getUpdates when TELEGRAM_BOT_TOKEN is set; webhook is handled in controller.
 */
@Injectable()
export class TelegramAdapter implements ChannelProvider, OnModuleDestroy {
  readonly kind = 'telegram' as const;
  private readonly logger = new Logger(TelegramAdapter.name);
  private offset = 0;
  private polling = false;
  private timer?: ReturnType<typeof setTimeout>;
  private handler?: TelegramUpdateHandler;

  get configured(): boolean {
    return !!process.env.TELEGRAM_BOT_TOKEN?.trim();
  }

  get token(): string | undefined {
    return process.env.TELEGRAM_BOT_TOKEN?.trim() || undefined;
  }

  onPosts(handler: TelegramUpdateHandler) {
    this.handler = handler;
  }

  async start() {
    if (!this.configured) {
      this.logger.log(
        'TELEGRAM_BOT_TOKEN unset — Telegram adapter idle (manual/WhatsApp bridge still works).',
      );
      return;
    }
    if ((process.env.TELEGRAM_MODE ?? 'poll') === 'webhook') {
      this.logger.log('TELEGRAM_MODE=webhook — skipping long poll.');
      return;
    }
    this.polling = true;
    this.logger.log('Telegram long-poll started (free Bot API).');
    void this.pollLoop();
  }

  stop() {
    this.polling = false;
    if (this.timer) clearTimeout(this.timer);
  }

  onModuleDestroy() {
    this.stop();
  }

  /** Map a Telegram Update JSON body into an inbound post (webhook or poll). */
  mapUpdate(update: Record<string, unknown>): InboundChannelPost | null {
    const message =
      (update.message as Record<string, unknown> | undefined) ??
      (update.channel_post as Record<string, unknown> | undefined) ??
      (update.edited_message as Record<string, unknown> | undefined) ??
      (update.edited_channel_post as Record<string, unknown> | undefined);
    if (!message) return null;

    const chat = message.chat as Record<string, unknown> | undefined;
    const from = message.from as Record<string, unknown> | undefined;
    const text =
      (typeof message.text === 'string' && message.text) ||
      (typeof message.caption === 'string' && message.caption) ||
      '';
    if (!text.trim() || !chat?.id) return null;

    const author =
      [from?.first_name, from?.last_name].filter(Boolean).join(' ') ||
      (typeof from?.username === 'string' ? from.username : undefined);

    const dateSec = typeof message.date === 'number' ? message.date : Date.now() / 1000;

    return {
      provider: 'telegram',
      externalChatId: String(chat.id),
      externalMessageId: String(message.message_id),
      text: text.trim(),
      authorName: author || undefined,
      receivedAt: new Date(dateSec * 1000).toISOString(),
      chatTitle:
        (typeof chat.title === 'string' && chat.title) ||
        (typeof chat.username === 'string' && chat.username) ||
        undefined,
    };
  }

  async handleWebhookUpdate(update: Record<string, unknown>) {
    const post = this.mapUpdate(update);
    if (post && this.handler) await this.handler(post);
  }

  private async pollLoop() {
    while (this.polling) {
      try {
        const updates = await this.getUpdates();
        for (const update of updates) {
          const updateId = Number(update.update_id);
          if (!Number.isNaN(updateId)) this.offset = updateId + 1;
          const post = this.mapUpdate(update);
          if (post && this.handler) await this.handler(post);
        }
      } catch (err) {
        this.logger.warn(
          `Telegram poll error: ${err instanceof Error ? err.message : String(err)}`,
        );
        await this.sleep(5000);
      }
      await this.sleep(1200);
    }
  }

  private async getUpdates(): Promise<Record<string, unknown>[]> {
    const token = this.token;
    if (!token) return [];
    const url = new URL(`https://api.telegram.org/bot${token}/getUpdates`);
    url.searchParams.set('offset', String(this.offset));
    url.searchParams.set('timeout', '25');
    url.searchParams.set('allowed_updates', JSON.stringify(['message', 'channel_post']));

    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      throw new Error(`getUpdates HTTP ${res.status}`);
    }
    const body = (await res.json()) as {
      ok?: boolean;
      result?: Record<string, unknown>[];
    };
    if (!body.ok) throw new Error('getUpdates not ok');
    return body.result ?? [];
  }

  private sleep(ms: number) {
    return new Promise<void>((resolve) => {
      this.timer = setTimeout(resolve, ms);
    });
  }
}
