import type {
  AccountSuspension,
  ModerationCase,
  ModerationConfig,
  ModerationQueue,
  ModerationReport,
  TrustAuditEvent,
} from './moderation.types';

export abstract class ModerationStore {
  abstract getConfig(): Promise<ModerationConfig>;
  abstract saveConfig(config: ModerationConfig): Promise<ModerationConfig>;

  abstract createCase(
    input: Omit<ModerationCase, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ModerationCase>;
  abstract updateCase(
    id: string,
    patch: Partial<ModerationCase>,
  ): Promise<ModerationCase | undefined>;
  abstract getCase(id: string): Promise<ModerationCase | undefined>;
  abstract listCases(filter: {
    queue?: ModerationQueue;
    status?: string;
    assigneeUserId?: string;
    targetType?: string;
    targetId?: string;
  }): Promise<ModerationCase[]>;
  abstract findOpenCase(
    queue: ModerationQueue,
    targetType: string,
    targetId: string,
  ): Promise<ModerationCase | undefined>;

  abstract addReport(
    input: Omit<ModerationReport, 'id' | 'createdAt'>,
  ): Promise<ModerationReport>;
  abstract listReportsForCase(caseId: string): Promise<ModerationReport[]>;
  abstract countReportsForTarget(
    targetType: string,
    targetId: string,
  ): Promise<number>;

  abstract appendAudit(
    input: Omit<TrustAuditEvent, 'id' | 'createdAt'>,
  ): Promise<TrustAuditEvent>;
  abstract listAudit(filter: {
    resourceType?: string;
    resourceId?: string;
    limit?: number;
  }): Promise<TrustAuditEvent[]>;

  abstract createSuspension(
    input: Omit<AccountSuspension, 'id' | 'createdAt'>,
  ): Promise<AccountSuspension>;
  abstract updateSuspension(
    id: string,
    patch: Partial<AccountSuspension>,
  ): Promise<AccountSuspension | undefined>;
  abstract getActiveSuspension(
    userId: string,
  ): Promise<AccountSuspension | undefined>;
  abstract listActiveSuspensions(): Promise<AccountSuspension[]>;

  abstract queueCounts(): Promise<Record<ModerationQueue, number>>;
}
