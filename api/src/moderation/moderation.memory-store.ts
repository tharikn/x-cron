import { randomUUID } from 'crypto';
import { ModerationStore } from './moderation.store';
import {
  DEFAULT_MODERATION_CONFIG,
  type AccountSuspension,
  type ModerationCase,
  type ModerationConfig,
  type ModerationQueue,
  type ModerationReport,
  type TrustAuditEvent,
} from './moderation.types';

export class ModerationMemoryStore extends ModerationStore {
  private config: ModerationConfig = structuredClone(DEFAULT_MODERATION_CONFIG);
  private readonly cases = new Map<string, ModerationCase>();
  private readonly reports = new Map<string, ModerationReport>();
  private readonly audits: TrustAuditEvent[] = [];
  private readonly suspensions = new Map<string, AccountSuspension>();

  async getConfig(): Promise<ModerationConfig> {
    return structuredClone(this.config);
  }

  async saveConfig(config: ModerationConfig): Promise<ModerationConfig> {
    this.config = structuredClone(config);
    return this.getConfig();
  }

  async createCase(
    input: Omit<ModerationCase, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ModerationCase> {
    const now = new Date().toISOString();
    const row: ModerationCase = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.cases.set(row.id, row);
    return { ...row };
  }

  async updateCase(
    id: string,
    patch: Partial<ModerationCase>,
  ): Promise<ModerationCase | undefined> {
    const existing = this.cases.get(id);
    if (!existing) return undefined;
    const next: ModerationCase = {
      ...existing,
      ...patch,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.cases.set(id, next);
    return { ...next };
  }

  async getCase(id: string): Promise<ModerationCase | undefined> {
    const row = this.cases.get(id);
    return row ? { ...row } : undefined;
  }

  async listCases(filter: {
    queue?: ModerationQueue;
    status?: string;
    assigneeUserId?: string;
    targetType?: string;
    targetId?: string;
  }): Promise<ModerationCase[]> {
    let rows = [...this.cases.values()];
    if (filter.queue) rows = rows.filter((c) => c.queue === filter.queue);
    if (filter.status) rows = rows.filter((c) => c.status === filter.status);
    if (filter.assigneeUserId) {
      rows = rows.filter((c) => c.assigneeUserId === filter.assigneeUserId);
    }
    if (filter.targetType) {
      rows = rows.filter((c) => c.targetType === filter.targetType);
    }
    if (filter.targetId) {
      rows = rows.filter((c) => c.targetId === filter.targetId);
    }
    return rows
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((c) => ({ ...c }));
  }

  async findOpenCase(
    queue: ModerationQueue,
    targetType: string,
    targetId: string,
  ): Promise<ModerationCase | undefined> {
    const row = [...this.cases.values()].find(
      (c) =>
        c.queue === queue &&
        c.targetType === targetType &&
        c.targetId === targetId &&
        (c.status === 'open' || c.status === 'in_review'),
    );
    return row ? { ...row } : undefined;
  }

  async addReport(
    input: Omit<ModerationReport, 'id' | 'createdAt'>,
  ): Promise<ModerationReport> {
    const row: ModerationReport = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.reports.set(row.id, row);
    return { ...row };
  }

  async listReportsForCase(caseId: string): Promise<ModerationReport[]> {
    return [...this.reports.values()]
      .filter((r) => r.caseId === caseId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((r) => ({ ...r }));
  }

  async countReportsForTarget(
    targetType: string,
    targetId: string,
  ): Promise<number> {
    return [...this.reports.values()].filter(
      (r) => r.targetType === targetType && r.targetId === targetId,
    ).length;
  }

  async appendAudit(
    input: Omit<TrustAuditEvent, 'id' | 'createdAt'>,
  ): Promise<TrustAuditEvent> {
    const row: TrustAuditEvent = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.audits.push(row);
    return { ...row };
  }

  async listAudit(filter: {
    resourceType?: string;
    resourceId?: string;
    limit?: number;
  }): Promise<TrustAuditEvent[]> {
    let rows = [...this.audits];
    if (filter.resourceType) {
      rows = rows.filter((a) => a.resourceType === filter.resourceType);
    }
    if (filter.resourceId) {
      rows = rows.filter((a) => a.resourceId === filter.resourceId);
    }
    rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return rows.slice(0, filter.limit ?? 100).map((a) => ({ ...a }));
  }

  async createSuspension(
    input: Omit<AccountSuspension, 'id' | 'createdAt'>,
  ): Promise<AccountSuspension> {
    const row: AccountSuspension = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.suspensions.set(row.id, row);
    return { ...row };
  }

  async updateSuspension(
    id: string,
    patch: Partial<AccountSuspension>,
  ): Promise<AccountSuspension | undefined> {
    const existing = this.suspensions.get(id);
    if (!existing) return undefined;
    const next = { ...existing, ...patch, id: existing.id };
    this.suspensions.set(id, next);
    return { ...next };
  }

  async getActiveSuspension(
    userId: string,
  ): Promise<AccountSuspension | undefined> {
    const row = [...this.suspensions.values()].find(
      (s) => s.userId === userId && s.active,
    );
    return row ? { ...row } : undefined;
  }

  async listActiveSuspensions(): Promise<AccountSuspension[]> {
    return [...this.suspensions.values()]
      .filter((s) => s.active)
      .map((s) => ({ ...s }));
  }

  async queueCounts(): Promise<Record<ModerationQueue, number>> {
    const counts: Record<ModerationQueue, number> = {
      employer_verification: 0,
      new_job_review: 0,
      reported_target: 0,
      suspected_duplicate: 0,
      suspicious_account: 0,
      appeal: 0,
    };
    for (const c of this.cases.values()) {
      if (c.status === 'open' || c.status === 'in_review') {
        counts[c.queue] += 1;
      }
    }
    return counts;
  }
}
