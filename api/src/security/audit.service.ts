import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type AuditAction =
  | 'admin.login'
  | 'admin.login_failed'
  | 'account.export'
  | 'account.delete'
  | 'import.upload'
  | 'payments.export'
  | 'privileged.access'
  | 'staff.roles';

export interface AuditEventRecord {
  id: string;
  action: AuditAction;
  actorUserId?: string;
  targetUserId?: string;
  meta?: Record<string, string | number | boolean | null>;
  createdAt: string;
}

const MAX_EVENTS = 500;

/**
 * In-process privileged-access audit ring (MVP). Not a substitute for a
 * durable SIEM — persists only while the API process lives. Higher envs
 * should ship logs to the host logger / future AuditEvent table.
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);
  private readonly events: AuditEventRecord[] = [];

  record(
    action: AuditAction,
    input: {
      actorUserId?: string;
      targetUserId?: string;
      meta?: Record<string, string | number | boolean | null>;
    } = {},
  ): AuditEventRecord {
    const event: AuditEventRecord = {
      id: randomUUID(),
      action,
      actorUserId: input.actorUserId,
      targetUserId: input.targetUserId,
      meta: input.meta,
      createdAt: new Date().toISOString(),
    };
    this.events.push(event);
    if (this.events.length > MAX_EVENTS) {
      this.events.splice(0, this.events.length - MAX_EVENTS);
    }
    this.logger.log(
      JSON.stringify({
        audit: true,
        ...event,
      }),
    );
    return event;
  }

  /** Newest first — admin / ops diagnostics only. */
  listRecent(limit = 50): AuditEventRecord[] {
    const n = Math.min(Math.max(limit, 1), MAX_EVENTS);
    return this.events.slice(-n).reverse();
  }
}
