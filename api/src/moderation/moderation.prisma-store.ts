import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ModerationStore } from './moderation.store';
import {
  DEFAULT_MODERATION_CONFIG,
  type AccountSuspension,
  type ModerationCase,
  type ModerationConfig,
  type ModerationQueue,
  type ModerationReport,
  type ReportCategory,
  type TrustAuditEvent,
} from './moderation.types';

function asStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string');
}

function asObject(value: Prisma.JsonValue | null | undefined): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function mapCase(row: {
  id: string;
  queue: string;
  status: string;
  priority: string;
  targetType: string;
  targetId: string;
  category: string | null;
  details: string | null;
  evidenceJson: Prisma.JsonValue;
  riskFlagsJson: Prisma.JsonValue;
  riskScore: number;
  dismissedRiskFlagsJson: Prisma.JsonValue;
  assigneeUserId: string | null;
  slaAt: Date | null;
  decision: string | null;
  reasonCode: string | null;
  reason: string | null;
  decidedByUserId: string | null;
  decidedAt: Date | null;
  relatedCaseId: string | null;
  feedbackThreadId: string | null;
  createdAt: Date;
  updatedAt: Date;
}): ModerationCase {
  return {
    id: row.id,
    queue: row.queue as ModerationQueue,
    status: row.status as ModerationCase['status'],
    priority: row.priority as ModerationCase['priority'],
    targetType: row.targetType as ModerationCase['targetType'],
    targetId: row.targetId,
    category: row.category || undefined,
    details: row.details || undefined,
    evidenceJson: asObject(row.evidenceJson),
    riskFlags: asStringArray(row.riskFlagsJson),
    riskScore: row.riskScore,
    dismissedRiskFlags: asStringArray(row.dismissedRiskFlagsJson),
    assigneeUserId: row.assigneeUserId || undefined,
    slaAt: row.slaAt?.toISOString(),
    decision: (row.decision as ModerationCase['decision']) || undefined,
    reasonCode: row.reasonCode || undefined,
    reason: row.reason || undefined,
    decidedByUserId: row.decidedByUserId || undefined,
    decidedAt: row.decidedAt?.toISOString(),
    relatedCaseId: row.relatedCaseId || undefined,
    feedbackThreadId: row.feedbackThreadId || undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export class ModerationPrismaStore extends ModerationStore {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async getConfig(): Promise<ModerationConfig> {
    const row = await this.prisma.moderationConfigRow.findUnique({
      where: { id: 'default' },
    });
    if (!row?.configJson || typeof row.configJson !== 'object') {
      return structuredClone(DEFAULT_MODERATION_CONFIG);
    }
    return {
      ...DEFAULT_MODERATION_CONFIG,
      ...(row.configJson as object),
    } as ModerationConfig;
  }

  async saveConfig(config: ModerationConfig): Promise<ModerationConfig> {
    await this.prisma.moderationConfigRow.upsert({
      where: { id: 'default' },
      create: { id: 'default', configJson: config as object },
      update: { configJson: config as object },
    });
    return structuredClone(config);
  }

  async createCase(
    input: Omit<ModerationCase, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ModerationCase> {
    const row = await this.prisma.moderationCase.create({
      data: {
        queue: input.queue,
        status: input.status,
        priority: input.priority,
        targetType: input.targetType,
        targetId: input.targetId,
        category: input.category,
        details: input.details,
        evidenceJson: input.evidenceJson as object,
        riskFlagsJson: input.riskFlags,
        riskScore: input.riskScore,
        dismissedRiskFlagsJson: input.dismissedRiskFlags,
        assigneeUserId: input.assigneeUserId,
        slaAt: input.slaAt ? new Date(input.slaAt) : undefined,
        relatedCaseId: input.relatedCaseId,
        feedbackThreadId: input.feedbackThreadId,
      },
    });
    return mapCase(row);
  }

  async updateCase(
    id: string,
    patch: Partial<ModerationCase>,
  ): Promise<ModerationCase | undefined> {
    try {
      const row = await this.prisma.moderationCase.update({
        where: { id },
        data: {
          ...(patch.queue !== undefined ? { queue: patch.queue } : {}),
          ...(patch.status !== undefined ? { status: patch.status } : {}),
          ...(patch.priority !== undefined ? { priority: patch.priority } : {}),
          ...(patch.category !== undefined ? { category: patch.category } : {}),
          ...(patch.details !== undefined ? { details: patch.details } : {}),
          ...(patch.evidenceJson !== undefined
            ? { evidenceJson: patch.evidenceJson as object }
            : {}),
          ...(patch.riskFlags !== undefined
            ? { riskFlagsJson: patch.riskFlags }
            : {}),
          ...(patch.riskScore !== undefined ? { riskScore: patch.riskScore } : {}),
          ...(patch.dismissedRiskFlags !== undefined
            ? { dismissedRiskFlagsJson: patch.dismissedRiskFlags }
            : {}),
          ...(patch.assigneeUserId !== undefined
            ? { assigneeUserId: patch.assigneeUserId || null }
            : {}),
          ...(patch.slaAt !== undefined
            ? { slaAt: patch.slaAt ? new Date(patch.slaAt) : null }
            : {}),
          ...(patch.decision !== undefined ? { decision: patch.decision } : {}),
          ...(patch.reasonCode !== undefined ? { reasonCode: patch.reasonCode } : {}),
          ...(patch.reason !== undefined ? { reason: patch.reason } : {}),
          ...(patch.decidedByUserId !== undefined
            ? { decidedByUserId: patch.decidedByUserId }
            : {}),
          ...(patch.decidedAt !== undefined
            ? { decidedAt: patch.decidedAt ? new Date(patch.decidedAt) : null }
            : {}),
          ...(patch.relatedCaseId !== undefined
            ? { relatedCaseId: patch.relatedCaseId }
            : {}),
          ...(patch.feedbackThreadId !== undefined
            ? { feedbackThreadId: patch.feedbackThreadId }
            : {}),
        },
      });
      return mapCase(row);
    } catch {
      return undefined;
    }
  }

  async getCase(id: string): Promise<ModerationCase | undefined> {
    const row = await this.prisma.moderationCase.findUnique({ where: { id } });
    return row ? mapCase(row) : undefined;
  }

  async listCases(filter: {
    queue?: ModerationQueue;
    status?: string;
    assigneeUserId?: string;
    targetType?: string;
    targetId?: string;
  }): Promise<ModerationCase[]> {
    const rows = await this.prisma.moderationCase.findMany({
      where: {
        ...(filter.queue ? { queue: filter.queue } : {}),
        ...(filter.status ? { status: filter.status } : {}),
        ...(filter.assigneeUserId
          ? { assigneeUserId: filter.assigneeUserId }
          : {}),
        ...(filter.targetType ? { targetType: filter.targetType } : {}),
        ...(filter.targetId ? { targetId: filter.targetId } : {}),
      },
      orderBy: { updatedAt: 'desc' },
      take: 200,
    });
    return rows.map(mapCase);
  }

  async findOpenCase(
    queue: ModerationQueue,
    targetType: string,
    targetId: string,
  ): Promise<ModerationCase | undefined> {
    const row = await this.prisma.moderationCase.findFirst({
      where: {
        queue,
        targetType,
        targetId,
        status: { in: ['open', 'in_review'] },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return row ? mapCase(row) : undefined;
  }

  async addReport(
    input: Omit<ModerationReport, 'id' | 'createdAt'>,
  ): Promise<ModerationReport> {
    const row = await this.prisma.moderationReport.create({
      data: {
        caseId: input.caseId,
        targetType: input.targetType,
        targetId: input.targetId,
        category: input.category,
        details: input.details,
        reporterUserId: input.reporterUserId,
      },
    });
    return {
      id: row.id,
      caseId: row.caseId,
      targetType: row.targetType as ModerationReport['targetType'],
      targetId: row.targetId,
      category: row.category as ReportCategory,
      details: row.details,
      reporterUserId: row.reporterUserId || undefined,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async listReportsForCase(caseId: string): Promise<ModerationReport[]> {
    const rows = await this.prisma.moderationReport.findMany({
      where: { caseId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((row) => ({
      id: row.id,
      caseId: row.caseId,
      targetType: row.targetType as ModerationReport['targetType'],
      targetId: row.targetId,
      category: row.category as ReportCategory,
      details: row.details,
      reporterUserId: row.reporterUserId || undefined,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async countReportsForTarget(
    targetType: string,
    targetId: string,
  ): Promise<number> {
    return this.prisma.moderationReport.count({
      where: { targetType, targetId },
    });
  }

  async appendAudit(
    input: Omit<TrustAuditEvent, 'id' | 'createdAt'>,
  ): Promise<TrustAuditEvent> {
    const row = await this.prisma.trustAuditEvent.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        reason: input.reason,
        reasonCode: input.reasonCode,
        correlationId: input.correlationId,
        beforeJson: input.beforeJson as object | undefined,
        afterJson: input.afterJson as object | undefined,
      },
    });
    return {
      id: row.id,
      actorId: row.actorId || undefined,
      action: row.action,
      resourceType: row.resourceType,
      resourceId: row.resourceId,
      reason: row.reason || undefined,
      reasonCode: row.reasonCode || undefined,
      correlationId: row.correlationId || undefined,
      beforeJson: asObject(row.beforeJson),
      afterJson: asObject(row.afterJson),
      createdAt: row.createdAt.toISOString(),
    };
  }

  async listAudit(filter: {
    resourceType?: string;
    resourceId?: string;
    limit?: number;
  }): Promise<TrustAuditEvent[]> {
    const rows = await this.prisma.trustAuditEvent.findMany({
      where: {
        ...(filter.resourceType ? { resourceType: filter.resourceType } : {}),
        ...(filter.resourceId ? { resourceId: filter.resourceId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: filter.limit ?? 100,
    });
    return rows.map((row) => ({
      id: row.id,
      actorId: row.actorId || undefined,
      action: row.action,
      resourceType: row.resourceType,
      resourceId: row.resourceId,
      reason: row.reason || undefined,
      reasonCode: row.reasonCode || undefined,
      correlationId: row.correlationId || undefined,
      beforeJson: row.beforeJson ? asObject(row.beforeJson) : undefined,
      afterJson: row.afterJson ? asObject(row.afterJson) : undefined,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async createSuspension(
    input: Omit<AccountSuspension, 'id' | 'createdAt'>,
  ): Promise<AccountSuspension> {
    const row = await this.prisma.accountSuspension.create({
      data: {
        userId: input.userId,
        reasonCode: input.reasonCode,
        reason: input.reason,
        startsAt: new Date(input.startsAt),
        endsAt: input.endsAt ? new Date(input.endsAt) : undefined,
        actorId: input.actorId,
        active: input.active,
      },
    });
    return this.mapSuspension(row);
  }

  async updateSuspension(
    id: string,
    patch: Partial<AccountSuspension>,
  ): Promise<AccountSuspension | undefined> {
    try {
      const row = await this.prisma.accountSuspension.update({
        where: { id },
        data: {
          ...(patch.active !== undefined ? { active: patch.active } : {}),
          ...(patch.clearedAt !== undefined
            ? { clearedAt: patch.clearedAt ? new Date(patch.clearedAt) : null }
            : {}),
          ...(patch.clearedByUserId !== undefined
            ? { clearedByUserId: patch.clearedByUserId }
            : {}),
          ...(patch.clearReason !== undefined
            ? { clearReason: patch.clearReason }
            : {}),
        },
      });
      return this.mapSuspension(row);
    } catch {
      return undefined;
    }
  }

  async getActiveSuspension(
    userId: string,
  ): Promise<AccountSuspension | undefined> {
    const row = await this.prisma.accountSuspension.findFirst({
      where: { userId, active: true },
      orderBy: { createdAt: 'desc' },
    });
    return row ? this.mapSuspension(row) : undefined;
  }

  async listActiveSuspensions(): Promise<AccountSuspension[]> {
    const rows = await this.prisma.accountSuspension.findMany({
      where: { active: true },
    });
    return rows.map((r) => this.mapSuspension(r));
  }

  async queueCounts(): Promise<Record<ModerationQueue, number>> {
    const rows = await this.prisma.moderationCase.groupBy({
      by: ['queue'],
      where: { status: { in: ['open', 'in_review'] } },
      _count: { _all: true },
    });
    const counts: Record<ModerationQueue, number> = {
      employer_verification: 0,
      new_job_review: 0,
      reported_target: 0,
      suspected_duplicate: 0,
      suspicious_account: 0,
      appeal: 0,
    };
    for (const row of rows) {
      const q = row.queue as ModerationQueue;
      if (q in counts) counts[q] = row._count._all;
    }
    return counts;
  }

  private mapSuspension(row: {
    id: string;
    userId: string;
    reasonCode: string;
    reason: string;
    startsAt: Date;
    endsAt: Date | null;
    actorId: string;
    active: boolean;
    clearedAt: Date | null;
    clearedByUserId: string | null;
    clearReason: string | null;
    createdAt: Date;
  }): AccountSuspension {
    return {
      id: row.id,
      userId: row.userId,
      reasonCode: row.reasonCode,
      reason: row.reason,
      startsAt: row.startsAt.toISOString(),
      endsAt: row.endsAt?.toISOString(),
      actorId: row.actorId,
      active: row.active,
      clearedAt: row.clearedAt?.toISOString(),
      clearedByUserId: row.clearedByUserId || undefined,
      clearReason: row.clearReason || undefined,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
