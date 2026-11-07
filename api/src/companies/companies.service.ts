import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
  forwardRef,
} from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types';
import { AuthStore } from '../auth/auth.store';
import { ApplicationsStore } from '../applications/applications.store';
import { JobsStore } from '../jobs/jobs.store';
import { ModerationService } from '../moderation/moderation.service';
import { CompaniesStore } from './companies.store';
import type {
  CompanyMemberDto,
  CompanyMemberRole,
  CompanyProfile,
  PublicCompanyDto,
  RecruiterDashboard,
} from './companies.types';
import { roleCan } from './companies.types';
import type {
  AdminVerificationDecisionDto,
  CreateCompanyDto,
  CreateInternalNoteDto,
  CreateInterviewDto,
  CreateInvitationDto,
  PatchCompanyDto,
  PatchInterviewDto,
  PatchMemberDto,
  SubmitVerificationDto,
  TransferOwnershipDto,
} from './dto/companies.dto';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly authStore: AuthStore,
    private readonly store: CompaniesStore,
    private readonly jobsStore: JobsStore,
    private readonly applicationsStore: ApplicationsStore,
    @Optional()
    @Inject(forwardRef(() => ModerationService))
    private readonly moderation?: ModerationService,
  ) {}

  /* ── Access helpers (used by jobs/applications too) ─────── */

  /**
   * Resolve active company access for a user.
   * Platform admin → admin_bypass. Otherwise active membership required.
   */
  resolveAccess(
    user: AuthUser,
    companyId: string,
  ): { company: CompanyProfile; role: CompanyMemberRole | 'admin_bypass' } {
    const company = this.requireCompany(companyId);
    if (user.roles.includes('admin')) {
      this.store.ensureOwnerMember(company.id, company.ownerUserId);
      return { company, role: 'admin_bypass' };
    }
    // Owner always has access even before membership row exists.
    if (company.ownerUserId === user.id) {
      this.store.ensureOwnerMember(company.id, user.id);
      return { company, role: 'owner' };
    }
    const member = this.store.findActiveMember(companyId, user.id);
    if (!member) {
      throw new ForbiddenException('Not a member of this company');
    }
    return { company, role: member.role };
  }

  /** True when user may act on jobs/apps owned by this company. */
  canAccessCompany(user: AuthUser, companyId: string): boolean {
    try {
      this.resolveAccess(user, companyId);
      return true;
    } catch {
      return false;
    }
  }

  requireAction(
    user: AuthUser,
    companyId: string,
    action: Parameters<typeof roleCan>[1],
  ) {
    const access = this.resolveAccess(user, companyId);
    if (!roleCan(access.role, action)) {
      throw new ForbiddenException(`Role ${access.role} cannot ${action}`);
    }
    return access;
  }

  /** Employer ids the user can operate on (active memberships + owned). */
  accessibleCompanyIds(user: AuthUser): string[] {
    if (user.roles.includes('admin')) {
      return this.authStore.listEmployers().map((e) => e.id);
    }
    const ids = new Set(this.store.listActiveEmployerIdsForUser(user.id));
    const owned = this.authStore.getEmployerByOwner(user.id);
    if (owned) ids.add(owned.id);
    return [...ids];
  }

  /** Primary company for recruiter desk (owned first, else first membership). */
  primaryCompanyFor(user: AuthUser): CompanyProfile | undefined {
    const owned = this.authStore.getEmployerByOwner(user.id);
    if (owned) {
      this.store.ensureOwnerMember(owned.id, user.id);
      return this.toCompany(owned);
    }
    const memberships = this.store.listActiveMembershipsForUser(user.id);
    if (!memberships.length) return undefined;
    const emp = this.authStore.getEmployer(memberships[0].employerId);
    return emp ? this.toCompany(emp) : undefined;
  }

  /* ── CRUD ────────────────────────────────────────────────── */

  create(user: AuthUser, dto: CreateCompanyDto) {
    const existing = this.authStore.getEmployerByOwner(user.id);
    if (existing) {
      const updated = this.authStore.updateEmployer(existing.id, {
        name: dto.name,
        legalName: dto.legalName,
        about: dto.about,
        website: dto.website,
        industry: dto.industry,
        sizeBand: dto.sizeBand,
        headquarters: dto.headquarters,
        hiringLocations: dto.hiringLocations,
      });
      this.store.ensureOwnerMember(updated.id, user.id);
      return this.companyResponse(user, updated.id);
    }
    const created = this.authStore.createEmployer(user.id, dto.name, {
      legalName: dto.legalName,
      about: dto.about,
      website: dto.website,
      industry: dto.industry,
      sizeBand: dto.sizeBand,
      headquarters: dto.headquarters,
      hiringLocations: dto.hiringLocations,
    });
    this.store.ensureOwnerMember(created.id, user.id);
    return this.companyResponse(user, created.id);
  }

  get(user: AuthUser, companyId: string) {
    this.requireAction(user, companyId, 'read');
    return this.companyResponse(user, companyId);
  }

  patch(user: AuthUser, companyId: string, dto: PatchCompanyDto) {
    this.requireAction(user, companyId, 'manage_company');
    this.authStore.updateEmployer(companyId, {
      name: dto.name,
      legalName: dto.legalName,
      about: dto.about,
      logoUrl: dto.logoUrl,
      website: dto.website,
      industry: dto.industry,
      sizeBand: dto.sizeBand,
      headquarters: dto.headquarters,
      hiringLocations: dto.hiringLocations,
      workspaceSettings: dto.workspaceSettings,
    });
    return this.companyResponse(user, companyId);
  }

  /* ── Verification ────────────────────────────────────────── */

  submitVerification(
    user: AuthUser,
    companyId: string,
    dto: SubmitVerificationDto,
  ) {
    this.requireAction(user, companyId, 'submit_verification');
    const company = this.requireCompany(companyId);
    this.store.addEvidence({
      employerId: companyId,
      kind: dto.kind,
      label: dto.label,
      reference: dto.reference,
      submittedBy: user.id,
    });
    if (dto.claimedEmailDomain) {
      this.authStore.updateEmployer(companyId, {
        verifiedEmailDomain: dto.claimedEmailDomain.trim().toLowerCase(),
      });
    }
    const nextStatus =
      company.verificationStatus === 'verified'
        ? 'reverify_required'
        : 'pending';
    this.authStore.updateEmployer(companyId, {
      verificationStatus: nextStatus,
    });
    this.store.addAudit({
      employerId: companyId,
      actorUserId: user.id,
      action: 'evidence_submitted',
      detail: `${dto.kind}: ${dto.label}`,
    });
    void this.moderation?.ensureEmployerVerificationCase(companyId);
    return this.companyResponse(user, companyId, { includePrivate: true });
  }

  adminDecideVerification(
    admin: AuthUser,
    companyId: string,
    dto: AdminVerificationDecisionDto,
  ) {
    if (!admin.roles.includes('admin') && !admin.roles.includes('moderator')) {
      throw new ForbiddenException('Moderator or admin required');
    }
    this.requireCompany(companyId);
    this.authStore.updateEmployer(companyId, {
      verificationStatus: dto.status,
      verificationNotes: dto.reviewerNotes,
      trustTier: dto.trustTier,
      riskFlags: dto.riskFlags,
    });
    this.store.addAudit({
      employerId: companyId,
      actorUserId: admin.id,
      action: `decision:${dto.status}`,
      detail: dto.reviewerNotes || '',
    });
    return this.companyResponse(admin, companyId, { includePrivate: true });
  }

  listEvidence(user: AuthUser, companyId: string) {
    this.requireAction(user, companyId, 'manage_company');
    // Evidence is private — only owner/admin (+ platform admin).
    if (
      !user.roles.includes('admin') &&
      !roleCan(this.resolveAccess(user, companyId).role, 'manage_company')
    ) {
      throw new ForbiddenException('Evidence is private');
    }
    this.store.addAudit({
      employerId: companyId,
      actorUserId: user.id,
      action: 'evidence_viewed',
      detail: '',
    });
    return { items: this.store.listEvidence(companyId) };
  }

  /* ── Team ────────────────────────────────────────────────── */

  invite(user: AuthUser, companyId: string, dto: CreateInvitationDto) {
    this.requireAction(user, companyId, 'manage_team');
    const email = dto.email.trim().toLowerCase();
    const inv = this.store.createInvitation({
      employerId: companyId,
      email,
      role: dto.role,
      invitedByUserId: user.id,
    });
    this.store.addAudit({
      employerId: companyId,
      actorUserId: user.id,
      action: 'invite_created',
      detail: `${email} as ${dto.role}`,
    });
    return {
      id: inv.id,
      email: inv.email,
      role: inv.role,
      status: inv.status,
      expiresAt: inv.expiresAt,
      /** Dev/MVP: token returned so clients can share accept link. */
      acceptToken: inv.token,
      acceptPath: `/company-invitations/${inv.token}/accept`,
    };
  }

  acceptInvitation(user: AuthUser, token: string) {
    const inv = this.store.getInvitationByToken(token);
    if (!inv) throw new NotFoundException('Invitation not found');
    if (inv.status !== 'pending') {
      throw new BadRequestException(`Invitation is ${inv.status}`);
    }
    if (Date.parse(inv.expiresAt) < Date.now()) {
      this.store.patchInvitation(inv.id, { status: 'expired' });
      throw new BadRequestException('Invitation expired');
    }
    const userEmail = (user.email || '').trim().toLowerCase();
    if (userEmail && userEmail !== inv.email) {
      throw new ForbiddenException(
        'Sign in with the invited email to accept this invite',
      );
    }
    this.requireCompany(inv.employerId);
    this.store.upsertMember({
      employerId: inv.employerId,
      userId: user.id,
      role: inv.role,
      status: 'active',
      invitedByUserId: inv.invitedByUserId,
    });
    // Grant employer role so client chrome unlocks.
    const u = this.authStore.getUser(user.id);
    if (u && !u.roles.includes('employer')) {
      u.roles = [...u.roles, 'employer'];
      this.authStore.saveUser(u);
    }
    this.store.patchInvitation(inv.id, {
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    });
    this.store.addAudit({
      employerId: inv.employerId,
      actorUserId: user.id,
      action: 'invite_accepted',
      detail: inv.email,
    });
    return this.companyResponse(user, inv.employerId);
  }

  listMembers(user: AuthUser, companyId: string) {
    this.requireAction(user, companyId, 'read');
    const items: CompanyMemberDto[] = this.store
      .listMembers(companyId)
      .map((m) => {
        const u = this.authStore.getUser(m.userId);
        return {
          ...m,
          displayName: u?.displayName,
          username: u?.username,
          email: u?.email,
        };
      });
    const invitations = this.store
      .listInvitations(companyId)
      .filter((i) => i.status === 'pending')
      .map((i) => ({
        id: i.id,
        email: i.email,
        role: i.role,
        status: i.status,
        expiresAt: i.expiresAt,
        createdAt: i.createdAt,
      }));
    return { items, invitations };
  }

  patchMember(
    user: AuthUser,
    companyId: string,
    memberId: string,
    dto: PatchMemberDto,
  ) {
    this.requireAction(user, companyId, 'manage_team');
    const member = this.store.getMember(memberId);
    if (!member || member.employerId !== companyId) {
      throw new NotFoundException('Member not found');
    }
    const company = this.requireCompany(companyId);
    if (member.role === 'owner' || member.userId === company.ownerUserId) {
      if (dto.status === 'revoked' || (dto.role && dto.role !== 'owner')) {
        throw new BadRequestException(
          'Transfer ownership before changing the owner membership',
        );
      }
    }
    if (dto.role === 'owner') {
      throw new BadRequestException('Use ownership transfer to assign owner');
    }
    const updated = this.store.patchMember(memberId, {
      role: dto.role as CompanyMemberRole | undefined,
      status: dto.status,
      savedFilters: dto.savedFilters,
    });
    if (!updated) throw new NotFoundException('Member not found');
    this.store.addAudit({
      employerId: companyId,
      actorUserId: user.id,
      action: dto.status === 'revoked' ? 'member_revoked' : 'member_updated',
      detail: `${member.userId} → ${updated.role}/${updated.status}`,
    });
    // Immediate revoke — no cached permission; next resolveAccess fails.
    return { member: updated };
  }

  transferOwnership(
    user: AuthUser,
    companyId: string,
    dto: TransferOwnershipDto,
  ) {
    this.requireAction(user, companyId, 'transfer_ownership');
    const company = this.requireCompany(companyId);
    if (dto.confirmCompanyName.trim() !== company.name.trim()) {
      throw new BadRequestException(
        'Confirmation name does not match company name',
      );
    }
    const target = this.store.getMember(dto.targetMemberId);
    if (
      !target ||
      target.employerId !== companyId ||
      target.status !== 'active'
    ) {
      throw new NotFoundException('Target member not found or inactive');
    }
    if (target.userId === company.ownerUserId) {
      throw new BadRequestException('Already the owner');
    }
    // Demote previous owner → admin; promote target → owner.
    const prevOwnerMem = this.store.findActiveMember(
      companyId,
      company.ownerUserId,
    );
    if (prevOwnerMem) {
      this.store.patchMember(prevOwnerMem.id, { role: 'admin' });
    }
    this.store.patchMember(target.id, { role: 'owner' });
    this.authStore.updateEmployer(companyId, {
      ownerUserId: target.userId,
    });
    const targetUser = this.authStore.getUser(target.userId);
    if (targetUser && !targetUser.roles.includes('employer')) {
      targetUser.roles = [...targetUser.roles, 'employer'];
      this.authStore.saveUser(targetUser);
    }
    this.store.addAudit({
      employerId: companyId,
      actorUserId: user.id,
      action: 'ownership_transferred',
      detail: `${company.ownerUserId} → ${target.userId}`,
    });
    return this.companyResponse(user, companyId, { includePrivate: true });
  }

  /* ── Internal notes + interviews ─────────────────────────── */

  addInternalNote(
    user: AuthUser,
    companyId: string,
    dto: CreateInternalNoteDto,
  ) {
    this.requireAction(user, companyId, 'internal_notes');
    const note = this.store.addNote({
      employerId: companyId,
      applicationId: dto.applicationId,
      body: dto.body,
      authorUserId: user.id,
    });
    return { note };
  }

  listInternalNotes(
    user: AuthUser,
    companyId: string,
    applicationId?: string,
  ) {
    this.requireAction(user, companyId, 'internal_notes');
    return { items: this.store.listNotes(companyId, applicationId) };
  }

  scheduleInterview(
    user: AuthUser,
    companyId: string,
    dto: CreateInterviewDto,
  ) {
    this.requireAction(user, companyId, 'schedule_interview');
    const interview = this.store.addInterview({
      employerId: companyId,
      applicationId: dto.applicationId,
      scheduledAt: dto.scheduledAt,
      mode: dto.mode ?? 'video',
      locationOrLink: dto.locationOrLink ?? '',
      notes: dto.notes ?? '',
      status: 'scheduled',
      createdByUserId: user.id,
    });
    return { interview };
  }

  listInterviews(user: AuthUser, companyId: string, applicationId?: string) {
    this.requireAction(user, companyId, 'read');
    return { items: this.store.listInterviews(companyId, applicationId) };
  }

  patchInterview(
    user: AuthUser,
    companyId: string,
    interviewId: string,
    dto: PatchInterviewDto,
  ) {
    this.requireAction(user, companyId, 'schedule_interview');
    const existing = this.store.getInterview(interviewId);
    if (!existing || existing.employerId !== companyId) {
      throw new NotFoundException('Interview not found');
    }
    const interview = this.store.patchInterview(interviewId, dto);
    return { interview };
  }

  /* ── Dashboard ───────────────────────────────────────────── */

  async dashboard(user: AuthUser): Promise<RecruiterDashboard> {
    const company = this.primaryCompanyFor(user);
    if (!company) {
      throw new ForbiddenException('Create a company workspace first');
    }
    const access = this.resolveAccess(user, company.id);
    const jobs = await this.jobsStore.listByEmployer(company.id);

    const byStatus: Record<string, number> = {};
    for (const j of jobs) {
      byStatus[j.status] = (byStatus[j.status] || 0) + 1;
    }

    const apps = await this.applicationsStore.listForEmployer(company.id);

    const appByStatus: Record<string, number> = {};
    let unreviewed = 0;
    const firstViewHours: number[] = [];
    let viewedWithin48 = 0;
    let withView = 0;

    for (const a of apps) {
      appByStatus[a.status] = (appByStatus[a.status] || 0) + 1;
      if (!a.viewedAt && a.status === 'applied') unreviewed += 1;
      if (a.viewedAt) {
        withView += 1;
        const hours =
          (Date.parse(a.viewedAt) - Date.parse(a.createdAt)) / 3_600_000;
        if (Number.isFinite(hours) && hours >= 0) {
          firstViewHours.push(hours);
          if (hours <= 48) viewedWithin48 += 1;
        }
      }
    }

    const medianFirstViewHours =
      firstViewHours.length >= 3 ? median(firstViewHours) : null;
    const viewedWithin48hPct =
      withView >= 3
        ? Math.round((viewedWithin48 / withView) * 1000) / 10
        : null;

    let indicator: RecruiterDashboard['responseQuality']['indicator'] = null;
    if (viewedWithin48hPct != null) {
      if (viewedWithin48hPct >= 70 && unreviewed <= 3) {
        indicator = 'actively_reviewing';
      } else if (viewedWithin48hPct >= 40) {
        indicator = 'usually_responds';
      } else {
        indicator = 'building';
      }
    }

    const upcoming = this.store.listUpcomingInterviews(company.id, 8);
    const membersActive = this.store
      .listMembers(company.id)
      .filter((m) => m.status === 'active').length;

    return {
      company: {
        ...this.toPublic(company),
        verificationStatus: company.verificationStatus,
        memberRole: access.role,
      },
      jobs: { total: jobs.length, byStatus },
      applicants: {
        total: apps.length,
        unreviewed,
        byStatus: appByStatus,
      },
      responseQuality: {
        medianFirstViewHours,
        viewedWithin48hPct,
        indicator,
        unreviewedReminderCount: unreviewed,
      },
      upcomingInterviews: upcoming,
      membersActive,
    };
  }

  /* ── Mapping ─────────────────────────────────────────────── */

  toPublic(company: CompanyProfile): PublicCompanyDto {
    return {
      id: company.id,
      name: company.name,
      slug: company.slug,
      about: company.about,
      logoUrl: company.logoUrl,
      website: company.website,
      industry: company.industry,
      sizeBand: company.sizeBand,
      headquarters: company.headquarters,
      hiringLocations: company.hiringLocations ?? [],
      verified: company.verificationStatus === 'verified',
      verificationStatus: company.verificationStatus,
    };
  }

  private companyResponse(
    user: AuthUser,
    companyId: string,
    opts?: { includePrivate?: boolean },
  ) {
    const access = this.resolveAccess(user, companyId);
    const company = access.company;
    const base = {
      ...this.toPublic(company),
      legalName: company.legalName,
      verifiedEmailDomain: company.verifiedEmailDomain,
      workspaceSettings: company.workspaceSettings,
      ownerUserId: company.ownerUserId,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      memberRole: access.role,
    };
    if (opts?.includePrivate && roleCan(access.role, 'manage_company')) {
      return {
        ...base,
        verificationNotes: company.verificationNotes,
        trustTier: company.trustTier,
        riskFlags: company.riskFlags,
        evidenceCount: this.store.listEvidence(companyId).length,
        audits: this.store.listAudits(companyId).slice(0, 20),
      };
    }
    return base;
  }

  private requireCompany(companyId: string): CompanyProfile {
    const emp = this.authStore.getEmployer(companyId);
    if (!emp) throw new NotFoundException('Company not found');
    return this.toCompany(emp);
  }

  private toCompany(emp: ReturnType<AuthStore['getEmployer']>): CompanyProfile {
    if (!emp) throw new NotFoundException('Company not found');
    return {
      id: emp.id,
      name: emp.name,
      legalName: emp.legalName,
      slug: emp.slug,
      about: emp.about,
      logoUrl: emp.logoUrl,
      website: emp.website,
      verifiedEmailDomain: emp.verifiedEmailDomain,
      industry: emp.industry,
      sizeBand: emp.sizeBand,
      headquarters: emp.headquarters,
      hiringLocations: emp.hiringLocations ?? [],
      verificationStatus: emp.verificationStatus as CompanyProfile['verificationStatus'],
      verificationNotes: emp.verificationNotes,
      trustTier: (emp.trustTier as CompanyProfile['trustTier']) || 'standard',
      riskFlags: emp.riskFlags ?? [],
      workspaceSettings: emp.workspaceSettings ?? {},
      ownerUserId: emp.ownerUserId,
      createdAt: emp.createdAt,
      updatedAt: emp.updatedAt || emp.createdAt,
    };
  }
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const v =
    sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  return Math.round(v * 10) / 10;
}
