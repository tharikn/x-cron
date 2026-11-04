import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { ApplyProfileSnapshot } from '../apply-profiles/apply-profiles.types';
import { ApplicationsStore } from './applications.store';
import {
  ApplicationEvent,
  ApplicationEventType,
  ApplicationMessage,
  ApplicationStatus,
  JobApplication,
} from './applications.types';

@Injectable()
export class ApplicationsMemoryStore extends ApplicationsStore {
  private readonly applications = new Map<string, JobApplication>();
  private readonly events = new Map<string, ApplicationEvent[]>();
  private readonly messages = new Map<string, ApplicationMessage[]>();

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
    const now = new Date().toISOString();
    const row: JobApplication = {
      id: randomUUID(),
      jobId: input.jobId,
      employerId: input.employerId,
      seekerUserId: input.seekerUserId,
      ownerUserId: input.ownerUserId,
      status: 'applied',
      coverNote: input.coverNote,
      applyProfileId: input.applyProfileId,
      applyProfileSnapshot: input.applyProfileSnapshot
        ? structuredClone(input.applyProfileSnapshot)
        : undefined,
      seekerName: input.seekerName,
      seekerPhone: input.seekerPhone,
      seekerEmail: input.seekerEmail,
      screeningAnswer: input.screeningAnswer,
      likelySpam: !!input.likelySpam,
      spamReasons: input.spamReasons?.length
        ? [...input.spamReasons]
        : undefined,
      matchPercent:
        typeof input.matchPercent === 'number' ? input.matchPercent : undefined,
      createdAt: now,
      updatedAt: now,
    };
    this.applications.set(row.id, row);
    this.events.set(row.id, []);
    this.messages.set(row.id, []);
    return { ...row, applyProfileSnapshot: row.applyProfileSnapshot
      ? structuredClone(row.applyProfileSnapshot)
      : undefined };
  }

  async findById(id: string): Promise<JobApplication | undefined> {
    const row = this.applications.get(id);
    return row ? this.cloneApp(row) : undefined;
  }

  async findBySeekerAndJob(
    seekerUserId: string,
    jobId: string,
  ): Promise<JobApplication | undefined> {
    for (const row of this.applications.values()) {
      if (row.seekerUserId === seekerUserId && row.jobId === jobId) {
        return this.cloneApp(row);
      }
    }
    return undefined;
  }

  async listForSeeker(seekerUserId: string): Promise<JobApplication[]> {
    return [...this.applications.values()]
      .filter((a) => a.seekerUserId === seekerUserId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((a) => this.cloneApp(a));
  }

  async countCreatedBySeekerSince(
    seekerUserId: string,
    sinceIso: string,
  ): Promise<number> {
    let n = 0;
    for (const row of this.applications.values()) {
      if (row.seekerUserId === seekerUserId && row.createdAt >= sinceIso) {
        n += 1;
      }
    }
    return n;
  }

  async latestCreatedAtForSeeker(
    seekerUserId: string,
  ): Promise<string | undefined> {
    let latest: string | undefined;
    for (const row of this.applications.values()) {
      if (row.seekerUserId !== seekerUserId) continue;
      if (!latest || row.createdAt > latest) latest = row.createdAt;
    }
    return latest;
  }

  async listCoverNotesBySeekerSince(
    seekerUserId: string,
    sinceIso: string,
  ): Promise<string[]> {
    const out: string[] = [];
    for (const row of this.applications.values()) {
      if (row.seekerUserId !== seekerUserId || row.createdAt < sinceIso) {
        continue;
      }
      const note = row.coverNote?.trim();
      if (note) out.push(note);
    }
    return out;
  }

  async listForJob(jobId: string): Promise<JobApplication[]> {
    return [...this.applications.values()]
      .filter((a) => a.jobId === jobId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((a) => this.cloneApp(a));
  }

  async listForOwner(ownerUserId: string): Promise<JobApplication[]> {
    return [...this.applications.values()]
      .filter((a) => a.ownerUserId === ownerUserId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((a) => this.cloneApp(a));
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
    const existing = this.applications.get(id);
    if (!existing) return undefined;
    const next: JobApplication = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.applications.set(id, next);
    return this.cloneApp(next);
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
    const event: ApplicationEvent = {
      id: randomUUID(),
      applicationId: input.applicationId,
      type: input.type,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      actorUserId: input.actorUserId,
      actorRole: input.actorRole,
      note: input.note,
      meta: input.meta,
      at: new Date().toISOString(),
    };
    const list = this.events.get(input.applicationId) ?? [];
    list.push(event);
    this.events.set(input.applicationId, list);
    return { ...event };
  }

  async listEvents(applicationId: string): Promise<ApplicationEvent[]> {
    return [...(this.events.get(applicationId) ?? [])].sort((a, b) =>
      a.at.localeCompare(b.at),
    );
  }

  async appendMessage(input: {
    applicationId: string;
    senderUserId: string;
    senderRole: ApplicationMessage['senderRole'];
    body: string;
  }): Promise<ApplicationMessage> {
    const msg: ApplicationMessage = {
      id: randomUUID(),
      applicationId: input.applicationId,
      senderUserId: input.senderUserId,
      senderRole: input.senderRole,
      body: input.body,
      createdAt: new Date().toISOString(),
    };
    const list = this.messages.get(input.applicationId) ?? [];
    list.push(msg);
    this.messages.set(input.applicationId, list);
    const app = this.applications.get(input.applicationId);
    if (app) {
      app.updatedAt = msg.createdAt;
      this.applications.set(app.id, app);
    }
    return { ...msg };
  }

  async listMessages(applicationId: string): Promise<ApplicationMessage[]> {
    return [...(this.messages.get(applicationId) ?? [])].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt),
    );
  }

  async clearForUser(userId: string): Promise<void> {
    const toRemove: string[] = [];
    for (const row of this.applications.values()) {
      if (row.seekerUserId === userId || row.ownerUserId === userId) {
        toRemove.push(row.id);
      }
    }
    for (const id of toRemove) {
      this.applications.delete(id);
      this.events.delete(id);
      this.messages.delete(id);
    }
  }

  private cloneApp(row: JobApplication): JobApplication {
    return {
      ...row,
      applyProfileSnapshot: row.applyProfileSnapshot
        ? structuredClone(row.applyProfileSnapshot)
        : undefined,
      spamReasons: row.spamReasons ? [...row.spamReasons] : undefined,
    };
  }
}
