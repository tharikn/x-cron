import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import type { ApplyProfileSnapshot } from '../apply-profiles/apply-profiles.types';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationsStore } from './applications.store';
import {
  ApplicationEvent,
  ApplicationEventType,
  ApplicationMessage,
  ApplicationStatus,
  JobApplication,
} from './applications.types';

function toIso(value: Date | string | null | undefined): string | undefined {
  if (value == null) return undefined;
  if (value instanceof Date) return value.toISOString();
  return value;
}

function asMeta(
  value: Prisma.JsonValue | null | undefined,
): Record<string, string | number | boolean | null> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  const out: Record<string, string | number | boolean | null> = {};
  for (const [k, v] of Object.entries(value)) {
    if (
      v === null ||
      typeof v === 'string' ||
      typeof v === 'number' ||
      typeof v === 'boolean'
    ) {
      out[k] = v;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

function asSnapshot(
  value: Prisma.JsonValue | null | undefined,
): ApplyProfileSnapshot | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  const id = typeof value.id === 'string' ? value.id : '';
  const name = typeof value.name === 'string' ? value.name : '';
  if (!id || !name) return undefined;
  return value as unknown as ApplyProfileSnapshot;
}

function asStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function mapApp(row: {
  id: string;
  jobId: string;
  employerId: string;
  seekerUserId: string;
  ownerUserId: string;
  status: string;
  coverNote: string | null;
  resumeUrl: string | null;
  applyProfileId: string | null;
  applyProfileSnapshotJson: Prisma.JsonValue | null;
  seekerName: string | null;
  seekerPhone: string | null;
  seekerEmail: string | null;
  screeningAnswer: string | null;
  likelySpam: boolean;
  spamReasonsJson: Prisma.JsonValue | null;
  offerLetterText: string | null;
  viewedAt: Date | null;
  matchPercent: number | null;
  createdAt: Date;
  updatedAt: Date;
}): JobApplication {
  return {
    id: row.id,
    jobId: row.jobId,
    employerId: row.employerId,
    seekerUserId: row.seekerUserId,
    ownerUserId: row.ownerUserId,
    status: row.status as ApplicationStatus,
    coverNote: row.coverNote ?? undefined,
    resumeUrl: row.resumeUrl ?? undefined,
    applyProfileId: row.applyProfileId ?? undefined,
    applyProfileSnapshot: asSnapshot(row.applyProfileSnapshotJson),
    seekerName: row.seekerName ?? undefined,
    seekerPhone: row.seekerPhone ?? undefined,
    seekerEmail: row.seekerEmail ?? undefined,
    screeningAnswer: row.screeningAnswer ?? undefined,
    likelySpam: !!row.likelySpam,
    spamReasons: asStringArray(row.spamReasonsJson),
    offerLetterText: row.offerLetterText ?? undefined,
    viewedAt: toIso(row.viewedAt),
    matchPercent:
      typeof row.matchPercent === 'number' ? row.matchPercent : undefined,
    createdAt: toIso(row.createdAt)!,
    updatedAt: toIso(row.updatedAt)!,
  };
}

function mapEvent(row: {
  id: string;
  applicationId: string;
  type: string;
  fromStatus: string | null;
  toStatus: string | null;
  actorUserId: string | null;
  actorRole: string;
  note: string | null;
  metaJson: Prisma.JsonValue | null;
  at: Date;
}): ApplicationEvent {
  return {
    id: row.id,
    applicationId: row.applicationId,
    type: row.type as ApplicationEventType,
    fromStatus: (row.fromStatus as ApplicationStatus) || undefined,
    toStatus: (row.toStatus as ApplicationStatus) || undefined,
    actorUserId: row.actorUserId ?? undefined,
    actorRole: row.actorRole as ApplicationEvent['actorRole'],
    note: row.note ?? undefined,
    meta: asMeta(row.metaJson),
    at: toIso(row.at)!,
  };
}

function mapMessage(row: {
  id: string;
  applicationId: string;
  senderUserId: string;
  senderRole: string;
  body: string;
  createdAt: Date;
}): ApplicationMessage {
  return {
    id: row.id,
    applicationId: row.applicationId,
    senderUserId: row.senderUserId,
    senderRole: row.senderRole as ApplicationMessage['senderRole'],
    body: row.body,
    createdAt: toIso(row.createdAt)!,
  };
}

@Injectable()
export class ApplicationsPrismaStore extends ApplicationsStore {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private async ensureUser(userId: string): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    });
  }

  async createApplication(input: {
    jobId: string;
    employerId: string;
    seekerUserId: string;
    ownerUserId: string;
    coverNote?: string;
    applyProfileId?: string;
    applyProfileSnapshot?: ApplyProfileSnapshot;
    seekerName?: string;
    seekerPhone?: string;
    seekerEmail?: string;
    screeningAnswer?: string;
    likelySpam?: boolean;
    spamReasons?: string[];
    matchPercent?: number;
  }): Promise<JobApplication> {
    await this.ensureUser(input.seekerUserId);
    await this.ensureUser(input.ownerUserId);
    const row = await this.prisma.jobApplication.create({
      data: {
        id: randomUUID(),
        jobId: input.jobId,
        employerId: input.employerId,
        seekerUserId: input.seekerUserId,
        ownerUserId: input.ownerUserId,
        status: 'applied',
        coverNote: input.coverNote,
        applyProfileId: input.applyProfileId,
        applyProfileSnapshotJson: input.applyProfileSnapshot
          ? (input.applyProfileSnapshot as unknown as Prisma.InputJsonValue)
          : undefined,
        seekerName: input.seekerName,
        seekerPhone: input.seekerPhone,
        seekerEmail: input.seekerEmail,
        screeningAnswer: input.screeningAnswer,
        likelySpam: !!input.likelySpam,
        spamReasonsJson: input.spamReasons ?? [],
        matchPercent:
          typeof input.matchPercent === 'number' ? input.matchPercent : null,
      },
    });
    return mapApp(row);
  }

  async findById(id: string): Promise<JobApplication | undefined> {
    const row = await this.prisma.jobApplication.findUnique({ where: { id } });
    return row ? mapApp(row) : undefined;
  }

  async findBySeekerAndJob(
    seekerUserId: string,
    jobId: string,
  ): Promise<JobApplication | undefined> {
    const row = await this.prisma.jobApplication.findUnique({
      where: { seekerUserId_jobId: { seekerUserId, jobId } },
    });
    return row ? mapApp(row) : undefined;
  }

  async listForSeeker(seekerUserId: string): Promise<JobApplication[]> {
    const rows = await this.prisma.jobApplication.findMany({
      where: { seekerUserId },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(mapApp);
  }

  async countCreatedBySeekerSince(
    seekerUserId: string,
    sinceIso: string,
  ): Promise<number> {
    return this.prisma.jobApplication.count({
      where: {
        seekerUserId,
        createdAt: { gte: new Date(sinceIso) },
      },
    });
  }

  async latestCreatedAtForSeeker(
    seekerUserId: string,
  ): Promise<string | undefined> {
    const row = await this.prisma.jobApplication.findFirst({
      where: { seekerUserId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });
    return row ? row.createdAt.toISOString() : undefined;
  }

  async listCoverNotesBySeekerSince(
    seekerUserId: string,
    sinceIso: string,
  ): Promise<string[]> {
    const rows = await this.prisma.jobApplication.findMany({
      where: {
        seekerUserId,
        createdAt: { gte: new Date(sinceIso) },
        coverNote: { not: null },
      },
      select: { coverNote: true },
    });
    return rows
      .map((r) => r.coverNote?.trim() ?? '')
      .filter((n) => n.length > 0);
  }

  async listForJob(jobId: string): Promise<JobApplication[]> {
    const rows = await this.prisma.jobApplication.findMany({
      where: { jobId },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(mapApp);
  }

  async listForOwner(ownerUserId: string): Promise<JobApplication[]> {
    const rows = await this.prisma.jobApplication.findMany({
      where: { ownerUserId },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(mapApp);
  }

  async updateApplication(
    id: string,
    patch: Partial<
      Pick<
        JobApplication,
        | 'status'
        | 'coverNote'
        | 'seekerName'
        | 'seekerPhone'
        | 'seekerEmail'
        | 'offerLetterText'
        | 'viewedAt'
      >
    >,
  ): Promise<JobApplication | undefined> {
    try {
      const row = await this.prisma.jobApplication.update({
        where: { id },
        data: {
          status: patch.status,
          coverNote: patch.coverNote,
          seekerName: patch.seekerName,
          seekerPhone: patch.seekerPhone,
          seekerEmail: patch.seekerEmail,
          offerLetterText: patch.offerLetterText,
          viewedAt: patch.viewedAt ? new Date(patch.viewedAt) : undefined,
        },
      });
      return mapApp(row);
    } catch {
      return undefined;
    }
  }

  async appendEvent(input: {
    applicationId: string;
    type: ApplicationEventType;
    fromStatus?: ApplicationStatus;
    toStatus?: ApplicationStatus;
    actorUserId?: string;
    actorRole: ApplicationEvent['actorRole'];
    note?: string;
    meta?: Record<string, string | number | boolean | null>;
  }): Promise<ApplicationEvent> {
    if (input.actorUserId) await this.ensureUser(input.actorUserId);
    const row = await this.prisma.applicationEvent.create({
      data: {
        id: randomUUID(),
        applicationId: input.applicationId,
        type: input.type,
        fromStatus: input.fromStatus,
        toStatus: input.toStatus,
        actorUserId: input.actorUserId,
        actorRole: input.actorRole,
        note: input.note,
        metaJson: input.meta ?? undefined,
      },
    });
    return mapEvent(row);
  }

  async listEvents(applicationId: string): Promise<ApplicationEvent[]> {
    const rows = await this.prisma.applicationEvent.findMany({
      where: { applicationId },
      orderBy: { at: 'asc' },
    });
    return rows.map(mapEvent);
  }

  async appendMessage(input: {
    applicationId: string;
    senderUserId: string;
    senderRole: ApplicationMessage['senderRole'];
    body: string;
  }): Promise<ApplicationMessage> {
    await this.ensureUser(input.senderUserId);
    const row = await this.prisma.applicationMessage.create({
      data: {
        id: randomUUID(),
        applicationId: input.applicationId,
        senderUserId: input.senderUserId,
        senderRole: input.senderRole,
        body: input.body,
      },
    });
    await this.prisma.jobApplication.update({
      where: { id: input.applicationId },
      data: { updatedAt: new Date() },
    });
    return mapMessage(row);
  }

  async listMessages(applicationId: string): Promise<ApplicationMessage[]> {
    const rows = await this.prisma.applicationMessage.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(mapMessage);
  }

  async clearForUser(userId: string): Promise<void> {
    await this.prisma.jobApplication.deleteMany({
      where: {
        OR: [{ seekerUserId: userId }, { ownerUserId: userId }],
      },
    });
  }
}
