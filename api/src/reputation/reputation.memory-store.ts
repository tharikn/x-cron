import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ReputationStore } from './reputation.store';
import {
  REPUTATION_BASE,
  ReputationEvent,
  ReputationEventType,
  ReputationRole,
  ReputationScore,
} from './reputation.types';

@Injectable()
export class ReputationMemoryStore extends ReputationStore {
  private readonly scores = new Map<string, ReputationScore>();
  private readonly events: ReputationEvent[] = [];

  private key(userId: string, role: ReputationRole) {
    return `${userId}:${role}`;
  }

  async getScore(userId: string, role: ReputationRole): Promise<ReputationScore> {
    const existing = this.scores.get(this.key(userId, role));
    if (existing) return { ...existing };
    const now = new Date().toISOString();
    const fresh: ReputationScore = {
      userId,
      role,
      score: REPUTATION_BASE,
      updatedAt: now,
    };
    this.scores.set(this.key(userId, role), fresh);
    return { ...fresh };
  }

  async setScore(row: ReputationScore): Promise<ReputationScore> {
    const next = { ...row };
    this.scores.set(this.key(row.userId, row.role), next);
    return { ...next };
  }

  async appendEvent(
    input: Omit<ReputationEvent, 'id' | 'createdAt'> & { createdAt?: string },
  ): Promise<ReputationEvent> {
    const event: ReputationEvent = {
      id: randomUUID(),
      userId: input.userId,
      role: input.role,
      type: input.type,
      delta: input.delta,
      scoreAfter: input.scoreAfter,
      applicationId: input.applicationId,
      jobId: input.jobId,
      matchPercent: input.matchPercent,
      note: input.note,
      createdAt: input.createdAt ?? new Date().toISOString(),
    };
    this.events.push(event);
    return { ...event };
  }

  async listEvents(
    userId: string,
    role: ReputationRole,
    limit = 40,
  ): Promise<ReputationEvent[]> {
    return this.events
      .filter((e) => e.userId === userId && e.role === role)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, limit)
      .map((e) => ({ ...e }));
  }

  async countEventsToday(
    userId: string,
    role: ReputationRole,
    type: ReputationEventType,
  ): Promise<number> {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const iso = start.toISOString();
    return this.events.filter(
      (e) =>
        e.userId === userId &&
        e.role === role &&
        e.type === type &&
        e.createdAt >= iso,
    ).length;
  }

  async clearForUser(userId: string): Promise<void> {
    for (const key of [...this.scores.keys()]) {
      if (key.startsWith(`${userId}:`)) this.scores.delete(key);
    }
    for (let i = this.events.length - 1; i >= 0; i -= 1) {
      if (this.events[i].userId === userId) this.events.splice(i, 1);
    }
  }
}
