import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FeedbackStore } from './feedback.store';
import type {
  FeedbackAudience,
  FeedbackCategory,
  FeedbackMessage,
  FeedbackSenderRole,
  FeedbackThread,
  FeedbackThreadStatus,
} from './feedback.types';

@Injectable()
export class FeedbackMemoryStore extends FeedbackStore {
  private readonly threads = new Map<string, FeedbackThread>();
  private readonly messages = new Map<string, FeedbackMessage[]>();

  async createThread(input: {
    userId: string;
    audience: FeedbackAudience;
    category: FeedbackCategory;
    subject: string;
    status: FeedbackThreadStatus;
    lastSenderRole: FeedbackSenderRole;
  }): Promise<FeedbackThread> {
    const now = new Date().toISOString();
    const row: FeedbackThread = {
      id: randomUUID(),
      userId: input.userId,
      audience: input.audience,
      category: input.category,
      subject: input.subject.trim(),
      status: input.status,
      lastMessageAt: now,
      lastSenderRole: input.lastSenderRole,
      createdAt: now,
      updatedAt: now,
    };
    this.threads.set(row.id, row);
    this.messages.set(row.id, []);
    return { ...row };
  }

  async updateThread(
    id: string,
    patch: {
      status?: FeedbackThreadStatus;
      lastMessageAt?: string;
      lastSenderRole?: FeedbackSenderRole;
      closedAt?: string | null;
      updatedAt?: string;
    },
  ): Promise<FeedbackThread | null> {
    const current = this.threads.get(id);
    if (!current) return null;
    const next: FeedbackThread = {
      ...current,
      status: patch.status ?? current.status,
      lastMessageAt: patch.lastMessageAt ?? current.lastMessageAt,
      lastSenderRole: patch.lastSenderRole ?? current.lastSenderRole,
      updatedAt: patch.updatedAt ?? new Date().toISOString(),
    };
    if (patch.closedAt === null) {
      delete next.closedAt;
    } else if (typeof patch.closedAt === 'string') {
      next.closedAt = patch.closedAt;
    }
    this.threads.set(id, next);
    return { ...next };
  }

  async getThread(id: string): Promise<FeedbackThread | null> {
    const row = this.threads.get(id);
    return row ? { ...row } : null;
  }

  async listThreadsForUser(userId: string): Promise<FeedbackThread[]> {
    return [...this.threads.values()]
      .filter((t) => t.userId === userId)
      .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))
      .map((t) => ({ ...t }));
  }

  async listThreadsAdmin(filter?: {
    status?: FeedbackThreadStatus | 'all';
    audience?: FeedbackAudience;
  }): Promise<FeedbackThread[]> {
    let rows = [...this.threads.values()];
    if (filter?.audience) {
      rows = rows.filter((t) => t.audience === filter.audience);
    }
    if (filter?.status && filter.status !== 'all') {
      rows = rows.filter((t) => t.status === filter.status);
    }
    return rows
      .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))
      .map((t) => ({ ...t }));
  }

  async appendMessage(input: {
    threadId: string;
    senderUserId: string;
    senderRole: FeedbackSenderRole;
    body: string;
  }): Promise<FeedbackMessage> {
    const msg: FeedbackMessage = {
      id: randomUUID(),
      threadId: input.threadId,
      senderUserId: input.senderUserId,
      senderRole: input.senderRole,
      body: input.body.trim(),
      createdAt: new Date().toISOString(),
    };
    const list = this.messages.get(input.threadId) ?? [];
    list.push(msg);
    this.messages.set(input.threadId, list);
    return { ...msg };
  }

  async listMessages(threadId: string): Promise<FeedbackMessage[]> {
    return [...(this.messages.get(threadId) ?? [])].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt),
    );
  }

  async clearForUser(userId: string): Promise<void> {
    for (const [id, thread] of this.threads) {
      if (thread.userId === userId) {
        this.threads.delete(id);
        this.messages.delete(id);
      }
    }
  }
}
