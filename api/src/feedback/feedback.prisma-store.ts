import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FeedbackStore } from './feedback.store';
import type {
  FeedbackAudience,
  FeedbackCategory,
  FeedbackMessage,
  FeedbackSenderRole,
  FeedbackThread,
  FeedbackThreadStatus,
} from './feedback.types';

function mapThread(row: {
  id: string;
  userId: string;
  audience: string;
  category: string;
  subject: string;
  status: string;
  lastMessageAt: Date;
  lastSenderRole: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
}): FeedbackThread {
  return {
    id: row.id,
    userId: row.userId,
    audience: row.audience as FeedbackAudience,
    category: row.category as FeedbackCategory,
    subject: row.subject,
    status: row.status as FeedbackThreadStatus,
    lastMessageAt: row.lastMessageAt.toISOString(),
    lastSenderRole: row.lastSenderRole as FeedbackSenderRole,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    closedAt: row.closedAt?.toISOString(),
  };
}

function mapMessage(row: {
  id: string;
  threadId: string;
  senderUserId: string;
  senderRole: string;
  body: string;
  createdAt: Date;
}): FeedbackMessage {
  return {
    id: row.id,
    threadId: row.threadId,
    senderUserId: row.senderUserId,
    senderRole: row.senderRole as FeedbackSenderRole,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  };
}

@Injectable()
export class FeedbackPrismaStore extends FeedbackStore {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async createThread(input: {
    userId: string;
    audience: FeedbackAudience;
    category: FeedbackCategory;
    subject: string;
    status: FeedbackThreadStatus;
    lastSenderRole: FeedbackSenderRole;
  }): Promise<FeedbackThread> {
    await this.ensureUser(input.userId);
    const row = await this.prisma.feedbackThread.create({
      data: {
        userId: input.userId,
        audience: input.audience,
        category: input.category,
        subject: input.subject.trim(),
        status: input.status,
        lastSenderRole: input.lastSenderRole,
      },
    });
    return mapThread(row);
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
    try {
      const row = await this.prisma.feedbackThread.update({
        where: { id },
        data: {
          status: patch.status,
          lastMessageAt: patch.lastMessageAt
            ? new Date(patch.lastMessageAt)
            : undefined,
          lastSenderRole: patch.lastSenderRole,
          closedAt:
            patch.closedAt === undefined
              ? undefined
              : patch.closedAt
                ? new Date(patch.closedAt)
                : null,
        },
      });
      return mapThread(row);
    } catch {
      return null;
    }
  }

  async getThread(id: string): Promise<FeedbackThread | null> {
    const row = await this.prisma.feedbackThread.findUnique({ where: { id } });
    return row ? mapThread(row) : null;
  }

  async listThreadsForUser(userId: string): Promise<FeedbackThread[]> {
    const rows = await this.prisma.feedbackThread.findMany({
      where: { userId },
      orderBy: { lastMessageAt: 'desc' },
    });
    return rows.map(mapThread);
  }

  async listThreadsAdmin(filter?: {
    status?: FeedbackThreadStatus | 'all';
    audience?: FeedbackAudience;
  }): Promise<FeedbackThread[]> {
    const rows = await this.prisma.feedbackThread.findMany({
      where: {
        audience: filter?.audience,
        status:
          filter?.status && filter.status !== 'all'
            ? filter.status
            : undefined,
      },
      orderBy: { lastMessageAt: 'desc' },
    });
    return rows.map(mapThread);
  }

  async appendMessage(input: {
    threadId: string;
    senderUserId: string;
    senderRole: FeedbackSenderRole;
    body: string;
  }): Promise<FeedbackMessage> {
    await this.ensureUser(input.senderUserId);
    const row = await this.prisma.feedbackMessage.create({
      data: {
        threadId: input.threadId,
        senderUserId: input.senderUserId,
        senderRole: input.senderRole,
        body: input.body.trim(),
      },
    });
    return mapMessage(row);
  }

  async listMessages(threadId: string): Promise<FeedbackMessage[]> {
    const rows = await this.prisma.feedbackMessage.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(mapMessage);
  }

  async clearForUser(userId: string): Promise<void> {
    await this.prisma.feedbackThread.deleteMany({ where: { userId } });
  }

  private async ensureUser(userId: string): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    });
  }
}
