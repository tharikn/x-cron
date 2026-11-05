import type { FeedbackSenderRole } from './feedback.types';

/** Ephemeral WhatsApp-style presence for an open feedback thread (memory only). */
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
 * In-process presence + typing for Contact Admin messenger.
 * Not persisted — multi-instance deploys need Redis later.
 */
export class FeedbackPresenceTracker {
  private readonly presence = new Map<string, PresenceRow>();
  private readonly typing = new Map<string, TypingRow>();

  touch(
    threadId: string,
    userId: string,
    role: FeedbackSenderRole,
  ): void {
    this.presence.set(this.key(threadId, userId), {
      userId,
      role,
      at: Date.now(),
    });
  }

  setTyping(
    threadId: string,
    userId: string,
    role: FeedbackSenderRole,
    active: boolean,
  ): void {
    this.touch(threadId, userId, role);
    if (!active) {
      const cur = this.typing.get(threadId);
      if (cur && cur.userId === userId) this.typing.delete(threadId);
      return;
    }
    this.typing.set(threadId, {
      userId,
      role,
      until: Date.now() + TYPING_TTL_MS,
    });
  }

  /** Peer presence as seen by the current viewer (excludes self). */
  peerFor(input: {
    threadId: string;
    threadUserId: string;
    audience: 'seeker' | 'employer';
    viewerUserId: string;
    viewerIsAdmin: boolean;
  }): FeedbackPresenceDto {
    const now = Date.now();
    this.prune(now);

    if (input.viewerIsAdmin) {
      const row = this.presence.get(
        this.key(input.threadId, input.threadUserId),
      );
      const typing = this.typing.get(input.threadId);
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

    // Seeker/recruiter view: peer = most recently active admin on this thread.
    let best: PresenceRow | null = null;
    for (const [k, row] of this.presence) {
      if (!k.startsWith(`${input.threadId}:`)) continue;
      if (row.role !== 'admin') continue;
      if (row.userId === input.viewerUserId) continue;
      if (!best || row.at > best.at) best = row;
    }

    const typing = this.typing.get(input.threadId);
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
}
