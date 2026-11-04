import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReputationStore } from './reputation.store';
import {
  REPUTATION_BASE,
  ReputationEvent,
  ReputationEventType,
  ReputationRole,
  ReputationScore,
} from './reputation.types';

@Injectable()
export class ReputationPrismaStore extends ReputationStore {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async getScore(userId: string, role: ReputationRole): Promise<ReputationScore> {
    const row = await this.prisma.userReputation.findUnique({
      where: { userId_role: { userId, role } },
    });
    if (row) {
      return {
        userId: row.userId,
        role: row.role as ReputationRole,
        score: row.score,
        updatedAt: row.updatedAt.toISOString(),
      };
    }
    const created = await this.prisma.userReputation.create({
      data: { userId, role, score: REPUTATION_BASE },
    });
    return {
      userId: created.userId,
      role: created.role as ReputationRole,
      score: created.score,
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  async setScore(row: ReputationScore): Promise<ReputationScore> {
    const saved = await this.prisma.userReputation.upsert({
      where: { userId_role: { userId: row.userId, role: row.role } },
      create: {
        userId: row.userId,
        role: row.role,
        score: row.score,
      },
      update: { score: row.score },
    });
    return {
      userId: saved.userId,
      role: saved.role as ReputationRole,
      score: saved.score,
      updatedAt: saved.updatedAt.toISOString(),
    };
  }

  async appendEvent(
    input: Omit<ReputationEvent, 'id' | 'createdAt'> & { createdAt?: string },
  ): Promise<ReputationEvent> {
    const created = await this.prisma.reputationEvent.create({
      data: {
        userId: input.userId,
        role: input.role,
        type: input.type,
        delta: input.delta,
        scoreAfter: input.scoreAfter,
        applicationId: input.applicationId,
        jobId: input.jobId,
        matchPercent: input.matchPercent,
        note: input.note,
        ...(input.createdAt
          ? { createdAt: new Date(input.createdAt) }
          : {}),
      },
    });
    return this.mapEvent(created);
  }

  async listEvents(
    userId: string,
    role: ReputationRole,
    limit = 40,
  ): Promise<ReputationEvent[]> {
    const rows = await this.prisma.reputationEvent.findMany({
      where: { userId, role },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return rows.map((r) => this.mapEvent(r));
  }

  async countEventsToday(
    userId: string,
    role: ReputationRole,
    type: ReputationEventType,
  ): Promise<number> {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    return this.prisma.reputationEvent.count({
      where: {
        userId,
        role,
        type,
        createdAt: { gte: start },
      },
    });
  }

  async clearForUser(userId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.reputationEvent.deleteMany({ where: { userId } }),
      this.prisma.userReputation.deleteMany({ where: { userId } }),
    ]);
  }

  private mapEvent(row: {
    id: string;
    userId: string;
    role: string;
    type: string;
    delta: number;
    scoreAfter: number;
    applicationId: string | null;
    jobId: string | null;
    matchPercent: number | null;
    note: string | null;
    createdAt: Date;
  }): ReputationEvent {
    return {
      id: row.id,
      userId: row.userId,
      role: row.role as ReputationRole,
      type: row.type as ReputationEventType,
      delta: row.delta,
      scoreAfter: row.scoreAfter,
      applicationId: row.applicationId ?? undefined,
      jobId: row.jobId ?? undefined,
      matchPercent: row.matchPercent ?? undefined,
      note: row.note ?? undefined,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
