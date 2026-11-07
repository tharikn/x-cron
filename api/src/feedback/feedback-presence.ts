import type { RedisService } from '../redis/redis.service';
import { RedisKeys } from '../redis/redis-keys';
import type { FeedbackSenderRole } from './feedback.types';

/** Ephemeral WhatsApp-style presence for an open feedback thread. */
export interface FeedbackPresenceDto {
  peerOnline: boolean;
  peerLastSeenAt: string | null;
  peerTyping: boolean;
  peerLabel: string;
}

type PresenceRow = {
  userId: string;
  role: FeedbackSenderRole;
  at: number;
};

type TypingRow = {
  userId: string;
  role: FeedbackSenderRole;
  until: number;
};

/** Online if seen within this window (clients poll ~2.5s). */
const ONLINE_MS = 20_000;
/** Typing indicator TTL — client re-heartbeats while composing. */
const TYPING_TTL_MS = 5_000;

/**
 * Presence + typing for Contact Admin messenger.
 * Uses Redis when connected (multi-instance); otherwise in-process Maps.
 */
export class FeedbackPresenceTracker {
  private readonly presence = new Map<string, PresenceRow>();
  private readonly typing = new Map<string, TypingRow>();

  constructor(private readonly redis?: RedisService) {}

  async touch(
    threadId: string,
    userId: string,
    role: FeedbackSenderRole,
  ): Promise<void> {
    const row: PresenceRow = { userId, role, at: Date.now() };
    this.presence.set(this.key(threadId, userId), row);
    const client = this.redis?.getClient();
    if (!client || !this.redis?.enabled) return;
    const key = RedisKeys.feedbackPresence(threadId, userId);
    const idx = RedisKeys.feedbackPresenceIndex(threadId);
    try {
      const ttlSec = Math.ceil((ONLINE_MS * 6) / 1000);
      await client
        .multi()
        .set(key, JSON.stringify(row), 'EX', ttlSec)
        .sadd(idx, userId)
        .expire(idx, ttlSec)
        .exec();
    } catch {
      /* memory already updated */
    }
  }

  async setTyping(
    threadId: string,
    userId: string,
    role: FeedbackSenderRole,
    active: boolean,
  ): Promise<void> {
    await this.touch(threadId, userId, role);
    if (!active) {
      const cur = this.typing.get(threadId);
      if (cur && cur.userId === userId) this.typing.delete(threadId);
      const client = this.redis?.getClient();
      if (client && this.redis?.enabled) {
        try {
          const raw = await client.get(RedisKeys.feedbackTyping(threadId));
          if (raw) {
            const parsed = JSON.parse(raw) as TypingRow;
            if (parsed.userId === userId) {
              await client.del(RedisKeys.feedbackTyping(threadId));
            }
          }
        } catch {
          /* ignore */
        }
      }
      return;
    }
    const row: TypingRow = {
      userId,
      role,
      until: Date.now() + TYPING_TTL_MS,
    };
    this.typing.set(threadId, row);
    const client = this.redis?.getClient();
    if (!client || !this.redis?.enabled) return;
    try {
      await client.set(
        RedisKeys.feedbackTyping(threadId),
        JSON.stringify(row),
        'EX',
        Math.ceil(TYPING_TTL_MS / 1000) + 1,
      );
    } catch {
      /* memory already updated */
    }
  }

  /** Peer presence as seen by the current viewer (excludes self). */
  async peerFor(input: {
    threadId: string;
    threadUserId: string;
    audience: 'seeker' | 'employer';
    viewerUserId: string;
    viewerIsAdmin: boolean;
  }): Promise<FeedbackPresenceDto> {
    const now = Date.now();
    this.prune(now);

    if (input.viewerIsAdmin) {
      const row =
        (await this.readPresence(input.threadId, input.threadUserId)) ??
        this.presence.get(this.key(input.threadId, input.threadUserId));
      const typing =
        (await this.readTyping(input.threadId)) ??
        this.typing.get(input.threadId);
      const peerTyping = Boolean(
        typing &&
          typing.userId === input.threadUserId &&
          typing.until > now,
      );
      return {
        peerOnline: Boolean(row && now - row.at <= ONLINE_MS),
        peerLastSeenAt: row ? new Date(row.at).toISOString() : null,
        peerTyping,
        peerLabel: input.audience === 'employer' ? 'Recruiter' : 'User',
      };
    }

    let best: PresenceRow | null = null;
    const redisRows = await this.listThreadPresence(input.threadId);
    const rows =
      redisRows.length > 0
        ? redisRows
        : [...this.presence.entries()]
            .filter(([k]) => k.startsWith(`${input.threadId}:`))
            .map(([, row]) => row);

    for (const row of rows) {
      if (row.role !== 'admin') continue;
      if (row.userId === input.viewerUserId) continue;
      if (!best || row.at > best.at) best = row;
    }

    const typing =
      (await this.readTyping(input.threadId)) ??
      this.typing.get(input.threadId);
    const peerTyping = Boolean(
      typing &&
        typing.role === 'admin' &&
        typing.userId !== input.viewerUserId &&
        typing.until > now,
    );

    return {
      peerOnline: Boolean(best && now - best.at <= ONLINE_MS),
      peerLastSeenAt: best ? new Date(best.at).toISOString() : null,
      peerTyping,
      peerLabel: 'Admin',
    };
  }

  private key(threadId: string, userId: string): string {
    return `${threadId}:${userId}`;
  }

  private prune(now: number): void {
    for (const [k, row] of this.presence) {
      if (now - row.at > ONLINE_MS * 6) this.presence.delete(k);
    }
    for (const [k, row] of this.typing) {
      if (row.until <= now) this.typing.delete(k);
    }
  }

  private async readPresence(
    threadId: string,
    userId: string,
  ): Promise<PresenceRow | null> {
    const client = this.redis?.getClient();
    if (!client || !this.redis?.enabled) return null;
    try {
      const raw = await client.get(RedisKeys.feedbackPresence(threadId, userId));
      return raw ? (JSON.parse(raw) as PresenceRow) : null;
    } catch {
      return null;
    }
  }

  private async readTyping(threadId: string): Promise<TypingRow | null> {
    const client = this.redis?.getClient();
    if (!client || !this.redis?.enabled) return null;
    try {
      const raw = await client.get(RedisKeys.feedbackTyping(threadId));
      return raw ? (JSON.parse(raw) as TypingRow) : null;
    } catch {
      return null;
    }
  }

  private async listThreadPresence(threadId: string): Promise<PresenceRow[]> {
    const client = this.redis?.getClient();
    if (!client || !this.redis?.enabled) return [];
    try {
      const userIds = await client.smembers(
        RedisKeys.feedbackPresenceIndex(threadId),
      );
      const rows: PresenceRow[] = [];
      for (const userId of userIds) {
        const row = await this.readPresence(threadId, userId);
        if (row) rows.push(row);
      }
      return rows;
    } catch {
      return [];
    }
  }
}
