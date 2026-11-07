import { Injectable } from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CompanyInternalNote,
  CompanyInterview,
  CompanyInvitation,
  CompanyInviteRole,
  CompanyMember,
  CompanyMemberRole,
  CompanyMemberStatus,
  CompanyProfile,
  CompanyTrustTier,
  CompanyVerificationStatus,
  CompanyWorkspaceSettings,
  VerificationAudit,
  VerificationEvidence,
} from './companies.types';

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v)
      ? v.filter((x): x is string => typeof x === 'string')
      : [];
  } catch {
    return [];
  }
}

function parseJsonObject(raw: string | null | undefined): Record<string, unknown> {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw) as unknown;
    return v && typeof v === 'object' && !Array.isArray(v)
      ? (v as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function inviteToken(): string {
  return randomBytes(24).toString('hex');
}

@Injectable()
export class CompaniesStore {
  private readonly members = new Map<string, CompanyMember>();
  private readonly invitations = new Map<string, CompanyInvitation>();
  private readonly evidence = new Map<string, VerificationEvidence>();
  private readonly audits = new Map<string, VerificationAudit>();
  private readonly notes = new Map<string, CompanyInternalNote>();
  private readonly interviews = new Map<string, CompanyInterview>();
  private readonly persistenceEnabled: boolean;

  constructor(private readonly prisma: PrismaService) {
    const auth = (process.env.AUTH_STORE ?? '').trim().toLowerCase();
    const jobs = (process.env.JOBS_STORE ?? 'memory').trim().toLowerCase();
    this.persistenceEnabled =
      auth === 'prisma' || (auth === '' && jobs === 'prisma');
    if (this.persistenceEnabled) {
      void this.hydrate();
    }
  }

  /* ── Members ─────────────────────────────────────────────── */

  ensureOwnerMember(employerId: string, ownerUserId: string): CompanyMember {
    const existing = this.findActiveMember(employerId, ownerUserId);
    if (existing) {
      if (existing.role !== 'owner') {
        existing.role = 'owner';
        existing.status = 'active';
        existing.updatedAt = nowIso();
        this.members.set(existing.id, existing);
        void this.persistMember(existing);
      }
      return existing;
    }
    const member: CompanyMember = {
      id: `mem_${randomUUID().slice(0, 10)}`,
      employerId,
      userId: ownerUserId,
      role: 'owner',
      status: 'active',
      joinedAt: nowIso(),
      savedFilters: {},
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.members.set(member.id, member);
    void this.persistMember(member);
    return member;
  }

  upsertMember(input: {
    employerId: string;
    userId: string;
    role: CompanyMemberRole;
    status?: CompanyMemberStatus;
    invitedByUserId?: string;
  }): CompanyMember {
    const found = [...this.members.values()].find(
      (m) => m.employerId === input.employerId && m.userId === input.userId,
    );
    if (found) {
      found.role = input.role;
      found.status = input.status ?? 'active';
      found.invitedByUserId = input.invitedByUserId ?? found.invitedByUserId;
      if (found.status === 'active' && !found.joinedAt) {
        found.joinedAt = nowIso();
      }
      if (found.status === 'revoked') {
        found.revokedAt = nowIso();
      } else {
        found.revokedAt = undefined;
      }
      found.updatedAt = nowIso();
      this.members.set(found.id, found);
      void this.persistMember(found);
      return found;
    }
    const member: CompanyMember = {
      id: `mem_${randomUUID().slice(0, 10)}`,
      employerId: input.employerId,
      userId: input.userId,
      role: input.role,
      status: input.status ?? 'active',
      invitedByUserId: input.invitedByUserId,
      joinedAt: (input.status ?? 'active') === 'active' ? nowIso() : undefined,
      savedFilters: {},
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.members.set(member.id, member);
    void this.persistMember(member);
    return member;
  }

  getMember(id: string): CompanyMember | undefined {
    return this.members.get(id);
  }

  findActiveMember(
    employerId: string,
    userId: string,
  ): CompanyMember | undefined {
    return [...this.members.values()].find(
      (m) =>
        m.employerId === employerId &&
        m.userId === userId &&
        m.status === 'active',
    );
  }

  listMembers(employerId: string): CompanyMember[] {
    return [...this.members.values()]
      .filter((m) => m.employerId === employerId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  listActiveMembershipsForUser(userId: string): CompanyMember[] {
    return [...this.members.values()].filter(
      (m) => m.userId === userId && m.status === 'active',
    );
  }

  listActiveEmployerIdsForUser(userId: string): string[] {
    return this.listActiveMembershipsForUser(userId).map((m) => m.employerId);
  }

  patchMember(
    id: string,
    patch: Partial<
      Pick<CompanyMember, 'role' | 'status' | 'savedFilters' | 'revokedAt'>
    >,
  ): CompanyMember | undefined {
    const m = this.members.get(id);
    if (!m) return undefined;
    if (patch.role) m.role = patch.role;
    if (patch.status) {
      m.status = patch.status;
      if (patch.status === 'revoked') m.revokedAt = nowIso();
      if (patch.status === 'active') {
        m.revokedAt = undefined;
        if (!m.joinedAt) m.joinedAt = nowIso();
      }
    }
    if (patch.savedFilters) m.savedFilters = patch.savedFilters;
    m.updatedAt = nowIso();
    this.members.set(m.id, m);
    void this.persistMember(m);
    return m;
  }

  revokeAllMembershipsForUser(userId: string): void {
    for (const m of this.members.values()) {
      if (m.userId === userId && m.status === 'active') {
        m.status = 'revoked';
        m.revokedAt = nowIso();
        m.updatedAt = nowIso();
        this.members.set(m.id, m);
        void this.persistMember(m);
      }
    }
  }

  /* ── Invitations ─────────────────────────────────────────── */

  createInvitation(input: {
    employerId: string;
    email: string;
    role: CompanyInviteRole;
    invitedByUserId: string;
    expiresInDays?: number;
  }): CompanyInvitation {
    const days = input.expiresInDays ?? 7;
    const expires = new Date();
    expires.setUTCDate(expires.getUTCDate() + days);
    const inv: CompanyInvitation = {
      id: `inv_${randomUUID().slice(0, 10)}`,
      employerId: input.employerId,
      email: input.email.trim().toLowerCase(),
      role: input.role,
      token: inviteToken(),
      invitedByUserId: input.invitedByUserId,
      status: 'pending',
      expiresAt: expires.toISOString(),
      createdAt: nowIso(),
    };
    this.invitations.set(inv.id, inv);
    void this.persistInvitation(inv);
    return inv;
  }

  getInvitationByToken(token: string): CompanyInvitation | undefined {
    const inv = [...this.invitations.values()].find((i) => i.token === token);
    if (!inv) return undefined;
    if (
      inv.status === 'pending' &&
      Date.parse(inv.expiresAt) < Date.now()
    ) {
      inv.status = 'expired';
      this.invitations.set(inv.id, inv);
      void this.persistInvitation(inv);
    }
    return inv;
  }

  listInvitations(employerId: string): CompanyInvitation[] {
    return [...this.invitations.values()]
      .filter((i) => i.employerId === employerId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  patchInvitation(
    id: string,
    patch: Partial<
      Pick<CompanyInvitation, 'status' | 'acceptedAt' | 'revokedAt'>
    >,
  ): CompanyInvitation | undefined {
    const inv = this.invitations.get(id);
    if (!inv) return undefined;
    Object.assign(inv, patch);
    this.invitations.set(inv.id, inv);
    void this.persistInvitation(inv);
    return inv;
  }

  /* ── Verification ────────────────────────────────────────── */

  addEvidence(input: Omit<VerificationEvidence, 'id' | 'createdAt'>): VerificationEvidence {
    const row: VerificationEvidence = {
      ...input,
      id: `ev_${randomUUID().slice(0, 10)}`,
      createdAt: nowIso(),
    };
    this.evidence.set(row.id, row);
    void this.persistEvidence(row);
    return row;
  }

  listEvidence(employerId: string): VerificationEvidence[] {
    return [...this.evidence.values()]
      .filter((e) => e.employerId === employerId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  addAudit(input: Omit<VerificationAudit, 'id' | 'createdAt'>): VerificationAudit {
    const row: VerificationAudit = {
      ...input,
      id: `va_${randomUUID().slice(0, 10)}`,
      createdAt: nowIso(),
    };
    this.audits.set(row.id, row);
    void this.persistAudit(row);
    return row;
  }

  listAudits(employerId: string): VerificationAudit[] {
    return [...this.audits.values()]
      .filter((a) => a.employerId === employerId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  /* ── Internal notes ──────────────────────────────────────── */

  addNote(input: Omit<CompanyInternalNote, 'id' | 'createdAt'>): CompanyInternalNote {
    const row: CompanyInternalNote = {
      ...input,
      id: `cin_${randomUUID().slice(0, 10)}`,
      createdAt: nowIso(),
    };
    this.notes.set(row.id, row);
    void this.persistNote(row);
    return row;
  }

  listNotes(employerId: string, applicationId?: string): CompanyInternalNote[] {
    return [...this.notes.values()]
      .filter((n) => {
        if (n.employerId !== employerId) return false;
        if (applicationId) return n.applicationId === applicationId;
        return true;
      })
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  /* ── Interviews ──────────────────────────────────────────── */

  addInterview(
    input: Omit<CompanyInterview, 'id' | 'createdAt' | 'updatedAt'>,
  ): CompanyInterview {
    const row: CompanyInterview = {
      ...input,
      id: `int_${randomUUID().slice(0, 10)}`,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.interviews.set(row.id, row);
    void this.persistInterview(row);
    return row;
  }

  getInterview(id: string): CompanyInterview | undefined {
    return this.interviews.get(id);
  }

  patchInterview(
    id: string,
    patch: Partial<
      Pick<
        CompanyInterview,
        'scheduledAt' | 'mode' | 'locationOrLink' | 'notes' | 'status'
      >
    >,
  ): CompanyInterview | undefined {
    const row = this.interviews.get(id);
    if (!row) return undefined;
    Object.assign(row, patch);
    row.updatedAt = nowIso();
    this.interviews.set(row.id, row);
    void this.persistInterview(row);
    return row;
  }

  listInterviews(employerId: string, applicationId?: string): CompanyInterview[] {
    return [...this.interviews.values()]
      .filter((i) => {
        if (i.employerId !== employerId) return false;
        if (applicationId) return i.applicationId === applicationId;
        return true;
      })
      .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  }

  listUpcomingInterviews(employerId: string, limit = 10): CompanyInterview[] {
    const now = nowIso();
    return this.listInterviews(employerId)
      .filter((i) => i.status === 'scheduled' && i.scheduledAt >= now)
      .slice(0, limit);
  }

  /* ── Hydrate / persist (Prisma) ──────────────────────────── */

  private async hydrate(): Promise<void> {
    try {
      const [members, invites, evidence, audits, notes, interviews] =
        await Promise.all([
          this.prisma.employerMember.findMany(),
          this.prisma.employerInvitation.findMany(),
          this.prisma.employerVerificationEvidence.findMany(),
          this.prisma.employerVerificationAudit.findMany(),
          this.prisma.companyInternalNote.findMany(),
          this.prisma.companyInterview.findMany(),
        ]);

      for (const row of members) {
        const m: CompanyMember = {
          id: row.id,
          employerId: row.employerId,
          userId: row.userId,
          role: (row.role as CompanyMemberRole) || 'recruiter',
          status: (row.status as CompanyMemberStatus) || 'active',
          invitedByUserId: row.invitedByUserId ?? undefined,
          joinedAt: row.joinedAt?.toISOString(),
          revokedAt: row.revokedAt?.toISOString(),
          savedFilters: parseJsonObject(row.savedFiltersJson),
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        };
        this.members.set(m.id, m);
      }
      for (const row of invites) {
        const inv: CompanyInvitation = {
          id: row.id,
          employerId: row.employerId,
          email: row.email,
          role: row.role as CompanyInviteRole,
          token: row.token,
          invitedByUserId: row.invitedByUserId,
          status: row.status as CompanyInvitation['status'],
          expiresAt: row.expiresAt.toISOString(),
          acceptedAt: row.acceptedAt?.toISOString(),
          revokedAt: row.revokedAt?.toISOString(),
          createdAt: row.createdAt.toISOString(),
        };
        this.invitations.set(inv.id, inv);
      }
      for (const row of evidence) {
        this.evidence.set(row.id, {
          id: row.id,
          employerId: row.employerId,
          kind: row.kind as VerificationEvidence['kind'],
          label: row.label,
          reference: row.reference,
          submittedBy: row.submittedBy,
          createdAt: row.createdAt.toISOString(),
        });
      }
      for (const row of audits) {
        this.audits.set(row.id, {
          id: row.id,
          employerId: row.employerId,
          actorUserId: row.actorUserId,
          action: row.action,
          detail: row.detail,
          createdAt: row.createdAt.toISOString(),
        });
      }
      for (const row of notes) {
        this.notes.set(row.id, {
          id: row.id,
          employerId: row.employerId,
          applicationId: row.applicationId ?? undefined,
          body: row.body,
          authorUserId: row.authorUserId,
          createdAt: row.createdAt.toISOString(),
        });
      }
      for (const row of interviews) {
        this.interviews.set(row.id, {
          id: row.id,
          employerId: row.employerId,
          applicationId: row.applicationId,
          scheduledAt: row.scheduledAt,
          mode: row.mode as CompanyInterview['mode'],
          locationOrLink: row.locationOrLink,
          notes: row.notes,
          status: row.status as CompanyInterview['status'],
          createdByUserId: row.createdByUserId,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        '[companies] hydrate failed — memory only',
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async persistMember(m: CompanyMember): Promise<void> {
    if (!this.persistenceEnabled) return;
    try {
      await this.prisma.employerMember.upsert({
        where: { id: m.id },
        create: {
          id: m.id,
          employerId: m.employerId,
          userId: m.userId,
          role: m.role,
          status: m.status,
          invitedByUserId: m.invitedByUserId,
          joinedAt: m.joinedAt ? new Date(m.joinedAt) : null,
          revokedAt: m.revokedAt ? new Date(m.revokedAt) : null,
          savedFiltersJson: JSON.stringify(m.savedFilters ?? {}),
          createdAt: new Date(m.createdAt),
          updatedAt: new Date(m.updatedAt),
        },
        update: {
          role: m.role,
          status: m.status,
          invitedByUserId: m.invitedByUserId,
          joinedAt: m.joinedAt ? new Date(m.joinedAt) : null,
          revokedAt: m.revokedAt ? new Date(m.revokedAt) : null,
          savedFiltersJson: JSON.stringify(m.savedFilters ?? {}),
          updatedAt: new Date(m.updatedAt),
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        '[companies] persistMember failed',
        m.id,
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async persistInvitation(inv: CompanyInvitation): Promise<void> {
    if (!this.persistenceEnabled) return;
    try {
      await this.prisma.employerInvitation.upsert({
        where: { id: inv.id },
        create: {
          id: inv.id,
          employerId: inv.employerId,
          email: inv.email,
          role: inv.role,
          token: inv.token,
          invitedByUserId: inv.invitedByUserId,
          status: inv.status,
          expiresAt: new Date(inv.expiresAt),
          acceptedAt: inv.acceptedAt ? new Date(inv.acceptedAt) : null,
          revokedAt: inv.revokedAt ? new Date(inv.revokedAt) : null,
          createdAt: new Date(inv.createdAt),
        },
        update: {
          status: inv.status,
          acceptedAt: inv.acceptedAt ? new Date(inv.acceptedAt) : null,
          revokedAt: inv.revokedAt ? new Date(inv.revokedAt) : null,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        '[companies] persistInvitation failed',
        inv.id,
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async persistEvidence(row: VerificationEvidence): Promise<void> {
    if (!this.persistenceEnabled) return;
    try {
      await this.prisma.employerVerificationEvidence.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          employerId: row.employerId,
          kind: row.kind,
          label: row.label,
          reference: row.reference,
          submittedBy: row.submittedBy,
          createdAt: new Date(row.createdAt),
        },
        update: {
          label: row.label,
          reference: row.reference,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        '[companies] persistEvidence failed',
        row.id,
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async persistAudit(row: VerificationAudit): Promise<void> {
    if (!this.persistenceEnabled) return;
    try {
      await this.prisma.employerVerificationAudit.create({
        data: {
          id: row.id,
          employerId: row.employerId,
          actorUserId: row.actorUserId,
          action: row.action,
          detail: row.detail,
          createdAt: new Date(row.createdAt),
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        '[companies] persistAudit failed',
        row.id,
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async persistNote(row: CompanyInternalNote): Promise<void> {
    if (!this.persistenceEnabled) return;
    try {
      await this.prisma.companyInternalNote.create({
        data: {
          id: row.id,
          employerId: row.employerId,
          applicationId: row.applicationId,
          body: row.body,
          authorUserId: row.authorUserId,
          createdAt: new Date(row.createdAt),
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        '[companies] persistNote failed',
        row.id,
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async persistInterview(row: CompanyInterview): Promise<void> {
    if (!this.persistenceEnabled) return;
    try {
      await this.prisma.companyInterview.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          employerId: row.employerId,
          applicationId: row.applicationId,
          scheduledAt: row.scheduledAt,
          mode: row.mode,
          locationOrLink: row.locationOrLink,
          notes: row.notes,
          status: row.status,
          createdByUserId: row.createdByUserId,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
        },
        update: {
          scheduledAt: row.scheduledAt,
          mode: row.mode,
          locationOrLink: row.locationOrLink,
          notes: row.notes,
          status: row.status,
          updatedAt: new Date(row.updatedAt),
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        '[companies] persistInterview failed',
        row.id,
        error instanceof Error ? error.message : error,
      );
    }
  }
}

/** Helpers exported for AuthStore ↔ company profile mapping. */
export function emptyCompanyExtras(): Pick<
  CompanyProfile,
  | 'hiringLocations'
  | 'trustTier'
  | 'riskFlags'
  | 'workspaceSettings'
  | 'updatedAt'
> {
  return {
    hiringLocations: [],
    trustTier: 'standard' as CompanyTrustTier,
    riskFlags: [],
    workspaceSettings: {} as CompanyWorkspaceSettings,
    updatedAt: nowIso(),
  };
}

export function normalizeVerificationStatus(
  raw: string | null | undefined,
): CompanyVerificationStatus {
  const v = (raw || 'unverified').toLowerCase();
  const allowed: CompanyVerificationStatus[] = [
    'unverified',
    'pending',
    'verified',
    'rejected',
    'suspended',
    'reverify_required',
  ];
  return (allowed.includes(v as CompanyVerificationStatus)
    ? v
    : 'unverified') as CompanyVerificationStatus;
}

export { parseJsonArray, parseJsonObject };
