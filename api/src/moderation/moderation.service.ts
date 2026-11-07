import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
  forwardRef,
} from '@nestjs/common';
import { AuthStore } from '../auth/auth.store';
import type { AuthUser } from '../auth/auth.types';
import { CompaniesService } from '../companies/companies.service';
import { JobsService } from '../jobs/jobs.service';
import { JobsStore } from '../jobs/jobs.store';
import type {
  CreateAppealDto,
  CreateReportDto,
  DecideCaseDto,
  ReactivateUserDto,
  SuspendUserDto,
  UpdateModerationConfigDto,
} from './dto/moderation.dto';
import { ModerationStore } from './moderation.store';
import {
  type ModerationCase,
  type ModerationConfig,
  type ModerationQueue,
} from './moderation.types';
import { evaluateRiskSignals, priorityFromScore } from './risk-signals';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  constructor(
    private readonly store: ModerationStore,
    private readonly authStore: AuthStore,
    @Optional()
    @Inject(forwardRef(() => JobsService))
    private readonly jobs?: JobsService,
    @Optional()
    @Inject(forwardRef(() => JobsStore))
    private readonly jobsStore?: JobsStore,
    @Optional()
    @Inject(forwardRef(() => CompaniesService))
    private readonly companies?: CompaniesService,
  ) {}

  private isStaff(user: AuthUser): boolean {
    return user.roles.includes('admin') || user.roles.includes('moderator');
  }

  private assertStaff(user: AuthUser) {
    if (!this.isStaff(user)) {
      throw new ForbiddenException('Moderator or admin required');
    }
  }

  private assertAdmin(user: AuthUser) {
    if (!user.roles.includes('admin')) {
      throw new ForbiddenException('Admin only');
    }
  }

  async getConfig(): Promise<ModerationConfig> {
    return this.store.getConfig();
  }

  async updateConfig(
    actor: AuthUser,
    dto: UpdateModerationConfigDto,
  ): Promise<ModerationConfig> {
    this.assertAdmin(actor);
    const current = await this.store.getConfig();
    const next: ModerationConfig = {
      ...current,
      ...(dto.reportAutoQueueThreshold !== undefined
        ? { reportAutoQueueThreshold: dto.reportAutoQueueThreshold }
        : {}),
      ...(dto.prohibitedPhrases !== undefined
        ? { prohibitedPhrases: dto.prohibitedPhrases }
        : {}),
      ...(dto.brandImpersonationKeywords !== undefined
        ? { brandImpersonationKeywords: dto.brandImpersonationKeywords }
        : {}),
      ...(dto.defaultSlaHours
        ? {
            defaultSlaHours: {
              ...current.defaultSlaHours,
              ...dto.defaultSlaHours,
            },
          }
        : {}),
    };
    const saved = await this.store.saveConfig(next);
    await this.audit(actor.id, 'config.update', 'moderation_config', 'default', {
      reason: 'Updated moderation config',
      after: saved as unknown as Record<string, unknown>,
    });
    return saved;
  }

  async dashboard(actor: AuthUser) {
    this.assertStaff(actor);
    const counts = await this.store.queueCounts();
    const open = await this.store.listCases({ status: 'open' });
    const inReview = await this.store.listCases({ status: 'in_review' });
    const now = Date.now();
    const overdue = [...open, ...inReview].filter(
      (c) => c.slaAt && new Date(c.slaAt).getTime() < now,
    ).length;
    return { queues: counts, overdue, openTotal: open.length + inReview.length };
  }

  async listCases(
    actor: AuthUser,
    filter: {
      queue?: ModerationQueue;
      status?: string;
      assigneeUserId?: string;
    },
  ) {
    this.assertStaff(actor);
    const items = await this.store.listCases(filter);
    return { items };
  }

  async getCase(actor: AuthUser, id: string, correlationId?: string) {
    this.assertStaff(actor);
    const row = await this.store.getCase(id);
    if (!row) throw new NotFoundException('Case not found');
    const reports = await this.store.listReportsForCase(id);
    const audit = await this.store.listAudit({
      resourceType: 'moderation_case',
      resourceId: id,
      limit: 50,
    });
    await this.audit(actor.id, 'evidence_viewed', 'moderation_case', id, {
      correlationId,
      reason: 'Case detail opened',
    });
    return { case: row, reports, audit };
  }

  async assignCase(
    actor: AuthUser,
    id: string,
    assigneeUserId?: string | null,
  ) {
    this.assertStaff(actor);
    const before = await this.store.getCase(id);
    if (!before) throw new NotFoundException('Case not found');
    const updated = await this.store.updateCase(id, {
      assigneeUserId: assigneeUserId || undefined,
      status: before.status === 'open' ? 'in_review' : before.status,
    });
    await this.audit(actor.id, 'case.assign', 'moderation_case', id, {
      reason: assigneeUserId ? 'Assigned' : 'Unassigned',
      before: { assigneeUserId: before.assigneeUserId },
      after: { assigneeUserId: updated?.assigneeUserId },
    });
    return updated;
  }

  async createReport(reporter: AuthUser | undefined, dto: CreateReportDto) {
    const details = (dto.details || dto.reason || '').trim();
    if (details.length < 5) {
      throw new BadRequestException('details or reason required (min 5 chars)');
    }
    const config = await this.store.getConfig();
    let open =
      (await this.store.findOpenCase(
        'reported_target',
        dto.targetType,
        dto.targetId,
      )) || undefined;

    const risk = await this.computeRiskForTarget(dto.targetType, dto.targetId, config);
    const slaHours = config.defaultSlaHours.reported_target;
    const slaAt = new Date(Date.now() + slaHours * 3600_000).toISOString();

    if (!open) {
      open = await this.store.createCase({
        queue: 'reported_target',
        status: 'open',
        priority: priorityFromScore(risk.score),
        targetType: dto.targetType,
        targetId: dto.targetId,
        category: dto.category,
        details,
        evidenceJson: { firstReportAt: new Date().toISOString() },
        riskFlags: risk.flags,
        riskScore: risk.score,
        dismissedRiskFlags: [],
        slaAt,
      });
    } else {
      const mergedFlags = [...new Set([...open.riskFlags, ...risk.flags])];
      const score = Math.max(open.riskScore, risk.score);
      open =
        (await this.store.updateCase(open.id, {
          riskFlags: mergedFlags,
          riskScore: score,
          priority: priorityFromScore(score),
          details: details.slice(0, 500),
          category: dto.category,
        })) || open;
    }

    await this.store.addReport({
      caseId: open.id,
      targetType: dto.targetType,
      targetId: dto.targetId,
      category: dto.category,
      details,
      reporterUserId: reporter?.id,
    });

    const reportCount = await this.store.countReportsForTarget(
      dto.targetType,
      dto.targetId,
    );

    if (dto.targetType === 'job' && this.jobsStore) {
      await this.jobsStore.report(dto.targetId, details.slice(0, 500));
      const threshold = config.reportAutoQueueThreshold;
      if (reportCount >= threshold) {
        await this.store.updateCase(open.id, {
          priority: 'high',
          evidenceJson: {
            ...open.evidenceJson,
            autoQueuedAt: new Date().toISOString(),
            reportCount,
          },
        });
        await this.ensureJobReviewCase(dto.targetId, {
          fromReport: true,
          reportCount,
        });
      }
    }

    await this.audit(reporter?.id, 'report.create', 'moderation_case', open.id, {
      reason: details.slice(0, 200),
      reasonCode: dto.category,
      after: { targetType: dto.targetType, targetId: dto.targetId },
    });

    return {
      caseId: open.id,
      status: open.status,
      acknowledgement:
        'Thanks — your report was received. Our team will review it. We never share your identity with the reported party.',
      reportCount,
    };
  }

  async createAppeal(user: AuthUser, dto: CreateAppealDto) {
    const config = await this.store.getConfig();
    const slaAt = new Date(
      Date.now() + config.defaultSlaHours.appeal * 3600_000,
    ).toISOString();
    const row = await this.store.createCase({
      queue: 'appeal',
      status: 'open',
      priority: 'normal',
      targetType: dto.targetType,
      targetId: dto.targetId,
      category: 'other',
      details: dto.reason,
      evidenceJson: { appellantUserId: user.id },
      riskFlags: [],
      riskScore: 0,
      dismissedRiskFlags: [],
      slaAt,
      relatedCaseId: dto.relatedCaseId,
      feedbackThreadId: dto.feedbackThreadId,
    });
    await this.audit(user.id, 'appeal.create', 'moderation_case', row.id, {
      reason: dto.reason.slice(0, 200),
    });
    return {
      caseId: row.id,
      status: row.status,
      acknowledgement:
        'Appeal received. A moderator will review the prior decision. You can also continue the conversation via Contact Admin feedback.',
    };
  }

  async decideCase(actor: AuthUser, id: string, dto: DecideCaseDto) {
    this.assertStaff(actor);
    const row = await this.store.getCase(id);
    if (!row) throw new NotFoundException('Case not found');

    if (dto.dismissRiskFlags?.length) {
      const dismissed = [
        ...new Set([...row.dismissedRiskFlags, ...dto.dismissRiskFlags]),
      ];
      const remaining = row.riskFlags.filter((f) => !dismissed.includes(f));
      await this.store.updateCase(id, {
        dismissedRiskFlags: dismissed,
        riskFlags: remaining,
        riskScore: Math.max(0, row.riskScore - dto.dismissRiskFlags.length * 10),
      });
      await this.audit(actor.id, 'risk.override', 'moderation_case', id, {
        reason: dto.reason,
        reasonCode: dto.reasonCode || 'risk_override',
        after: { dismissedRiskFlags: dismissed },
      });
      if (dto.decision === 'override_risk') {
        return this.store.getCase(id);
      }
    }

    const decidedAt = new Date().toISOString();
    let decision = dto.decision;

    if (row.targetType === 'job' && this.jobs) {
      if (decision === 'approve') {
        await this.jobs.approve(row.targetId, {
          note: dto.reason,
          actorId: actor.id,
        });
      } else if (decision === 'reject') {
        await this.jobs.reject(row.targetId, {
          note: dto.reason,
          actorId: actor.id,
        });
      } else if (decision === 'remove' || decision === 'reinstate') {
        if (decision === 'remove') {
          await this.jobs.removeForModeration(row.targetId, {
            note: dto.reason,
            actorId: actor.id,
          });
        } else {
          await this.jobs.approve(row.targetId, {
            note: dto.reason,
            actorId: actor.id,
          });
        }
      }
    }

    if (row.targetType === 'user') {
      if (decision === 'suspend_user') {
        await this.suspendUser(actor, row.targetId, {
          reasonCode: dto.reasonCode || 'moderation',
          reason: dto.reason,
        });
      } else if (decision === 'reactivate_user' || decision === 'reinstate') {
        await this.reactivateUser(actor, row.targetId, { reason: dto.reason });
      }
    }

    if (row.targetType === 'employer' && this.companies) {
      if (
        decision === 'verify_company' ||
        decision === 'reject_company' ||
        decision === 'suspend_company'
      ) {
        const status =
          decision === 'verify_company'
            ? 'verified'
            : decision === 'suspend_company'
              ? 'suspended'
              : 'rejected';
        await this.companies.adminDecideVerification(actor, row.targetId, {
          status,
          reviewerNotes: dto.reason,
        });
      }
    }

    if (row.queue === 'appeal') {
      if (decision !== 'uphold' && decision !== 'reinstate' && decision !== 'dismiss') {
        decision = decision === 'approve' ? 'reinstate' : decision;
      }
    }

    const updated = await this.store.updateCase(id, {
      status: decision === 'dismiss' ? 'dismissed' : 'resolved',
      decision,
      reason: dto.reason,
      reasonCode: dto.reasonCode,
      decidedByUserId: actor.id,
      decidedAt,
    });

    await this.audit(actor.id, `case.decide.${decision}`, 'moderation_case', id, {
      reason: dto.reason,
      reasonCode: dto.reasonCode,
      before: { status: row.status },
      after: { status: updated?.status, decision },
    });

    return updated;
  }

  async suspendUser(actor: AuthUser, userId: string, dto: SuspendUserDto) {
    this.assertStaff(actor);
    const user = this.authStore.getUser(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.roles.includes('admin')) {
      throw new ForbiddenException('Cannot suspend platform admin');
    }
    const existing = await this.store.getActiveSuspension(userId);
    if (existing) {
      throw new BadRequestException('User already suspended');
    }
    const startsAt = new Date().toISOString();
    const endsAt = dto.durationHours
      ? new Date(Date.now() + dto.durationHours * 3600_000).toISOString()
      : undefined;
    const suspension = await this.store.createSuspension({
      userId,
      reasonCode: dto.reasonCode,
      reason: dto.reason,
      startsAt,
      endsAt,
      actorId: actor.id,
      active: true,
    });
    this.authStore.setUserStatus(userId, 'disabled');
    await this.ensureSuspiciousAccountCase(userId, dto.reason);
    await this.audit(actor.id, 'user.suspend', 'user', userId, {
      reason: dto.reason,
      reasonCode: dto.reasonCode,
      after: { endsAt, suspensionId: suspension.id },
    });
    return suspension;
  }

  async reactivateUser(actor: AuthUser, userId: string, dto: ReactivateUserDto) {
    this.assertStaff(actor);
    const active = await this.store.getActiveSuspension(userId);
    if (active) {
      await this.store.updateSuspension(active.id, {
        active: false,
        clearedAt: new Date().toISOString(),
        clearedByUserId: actor.id,
        clearReason: dto.reason,
      });
    }
    this.authStore.setUserStatus(userId, 'active');
    await this.audit(actor.id, 'user.reactivate', 'user', userId, {
      reason: dto.reason,
    });
    return { ok: true, userId };
  }

  async expireSuspensions(): Promise<number> {
    const active = await this.store.listActiveSuspensions();
    const now = Date.now();
    let count = 0;
    for (const s of active) {
      if (!s.endsAt) continue;
      if (new Date(s.endsAt).getTime() > now) continue;
      await this.store.updateSuspension(s.id, {
        active: false,
        clearedAt: new Date().toISOString(),
        clearReason: 'Suspension duration elapsed',
      });
      this.authStore.setUserStatus(s.userId, 'active');
      await this.audit(undefined, 'user.auto_reactivate', 'user', s.userId, {
        reason: 'Timed suspension expired',
        reasonCode: 'duration_elapsed',
      });
      count += 1;
    }
    return count;
  }

  /** Called when a job enters needs-review (import / Job Fare / report threshold). */
  async ensureJobReviewCase(
    jobId: string,
    meta?: { fromReport?: boolean; reportCount?: number },
  ): Promise<ModerationCase> {
    const existing = await this.store.findOpenCase(
      'new_job_review',
      'job',
      jobId,
    );
    if (existing) {
      if (meta?.fromReport) {
        return (
          (await this.store.updateCase(existing.id, {
            priority: 'high',
            evidenceJson: {
              ...existing.evidenceJson,
              ...meta,
            },
          })) || existing
        );
      }
      return existing;
    }
    const config = await this.store.getConfig();
    const risk = await this.computeRiskForTarget('job', jobId, config);
    return this.store.createCase({
      queue: 'new_job_review',
      status: 'open',
      priority: priorityFromScore(risk.score),
      targetType: 'job',
      targetId: jobId,
      evidenceJson: { ...meta },
      riskFlags: risk.flags,
      riskScore: risk.score,
      dismissedRiskFlags: [],
      slaAt: new Date(
        Date.now() + config.defaultSlaHours.new_job_review * 3600_000,
      ).toISOString(),
    });
  }

  async ensureDuplicateCase(
    jobId: string,
    note: string,
  ): Promise<ModerationCase> {
    const existing = await this.store.findOpenCase(
      'suspected_duplicate',
      'job',
      jobId,
    );
    if (existing) {
      return (
        (await this.store.updateCase(existing.id, {
          status: 'resolved',
          decision: 'reject',
          reason: note,
          decidedAt: new Date().toISOString(),
        })) || existing
      );
    }
    const config = await this.store.getConfig();
    return this.store.createCase({
      queue: 'suspected_duplicate',
      status: 'resolved',
      priority: 'normal',
      targetType: 'job',
      targetId: jobId,
      details: note,
      evidenceJson: { auto: true },
      riskFlags: ['copied_description_or_duplicate'],
      riskScore: 40,
      dismissedRiskFlags: [],
      decision: 'reject',
      reason: note,
      decidedAt: new Date().toISOString(),
      slaAt: new Date(
        Date.now() + config.defaultSlaHours.suspected_duplicate * 3600_000,
      ).toISOString(),
    });
  }

  async ensureEmployerVerificationCase(employerId: string): Promise<ModerationCase> {
    const existing = await this.store.findOpenCase(
      'employer_verification',
      'employer',
      employerId,
    );
    if (existing) return existing;
    const config = await this.store.getConfig();
    return this.store.createCase({
      queue: 'employer_verification',
      status: 'open',
      priority: 'normal',
      targetType: 'employer',
      targetId: employerId,
      evidenceJson: {},
      riskFlags: [],
      riskScore: 0,
      dismissedRiskFlags: [],
      slaAt: new Date(
        Date.now() + config.defaultSlaHours.employer_verification * 3600_000,
      ).toISOString(),
    });
  }

  async ensureSuspiciousAccountCase(
    userId: string,
    reason: string,
  ): Promise<ModerationCase> {
    const existing = await this.store.findOpenCase(
      'suspicious_account',
      'user',
      userId,
    );
    if (existing) return existing;
    const config = await this.store.getConfig();
    return this.store.createCase({
      queue: 'suspicious_account',
      status: 'open',
      priority: 'high',
      targetType: 'user',
      targetId: userId,
      details: reason,
      evidenceJson: {},
      riskFlags: ['account_velocity_or_abuse'],
      riskScore: 50,
      dismissedRiskFlags: [],
      slaAt: new Date(
        Date.now() + config.defaultSlaHours.suspicious_account * 3600_000,
      ).toISOString(),
    });
  }

  async onJobModerated(
    actorId: string | undefined,
    jobId: string,
    decision: 'approve' | 'reject' | 'remove',
    reason?: string,
  ) {
    const open = await this.store.listCases({
      targetType: 'job',
      targetId: jobId,
    });
    for (const c of open) {
      if (c.status !== 'open' && c.status !== 'in_review') continue;
      if (c.queue !== 'new_job_review' && c.queue !== 'reported_target') continue;
      await this.store.updateCase(c.id, {
        status: 'resolved',
        decision,
        reason: reason || decision,
        decidedByUserId: actorId,
        decidedAt: new Date().toISOString(),
      });
    }
    await this.audit(actorId, `job.${decision}`, 'job', jobId, {
      reason: reason || decision,
    });
  }

  async search(actor: AuthUser, q: string) {
    this.assertStaff(actor);
    const needle = q.trim().toLowerCase();
    const users = this.authStore.findUsersByQuery(needle, 10).map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      displayName: u.displayName,
      roles: u.roles,
      status: u.status,
    }));
    const employers = this.authStore
      .listEmployers()
      .filter((e) => `${e.id} ${e.name}`.toLowerCase().includes(needle))
      .slice(0, 10)
      .map((e) => ({
        id: e.id,
        name: e.name,
        verificationStatus: e.verificationStatus,
        ownerUserId: e.ownerUserId,
      }));
    let jobs: Array<Record<string, unknown>> = [];
    if (this.jobsStore) {
      const all = await this.jobsStore.listAll();
      jobs = all
        .filter((j) => {
          const hay =
            `${j.id} ${j.title} ${j.employerName} ${j.location.city}`.toLowerCase();
          return hay.includes(needle);
        })
        .slice(0, 10)
        .map((j) => ({
          id: j.id,
          title: j.title,
          employerName: j.employerName,
          city: j.location.city,
          status: j.status,
          reportCount: j.reportCount ?? 0,
        }));
    }
    return { users, employers, jobs, applications: [] };
  }

  async listAudit(actor: AuthUser, resourceType?: string, resourceId?: string) {
    this.assertStaff(actor);
    return {
      items: await this.store.listAudit({ resourceType, resourceId, limit: 100 }),
    };
  }

  private async computeRiskForTarget(
    targetType: string,
    targetId: string,
    config: ModerationConfig,
  ) {
    if (targetType === 'job' && this.jobsStore) {
      const job = await this.jobsStore.findById(targetId);
      if (!job) return { flags: [] as string[], score: 0 };
      const owner = job.ownerUserId
        ? this.authStore.getUser(job.ownerUserId)
        : undefined;
      const siblings = (await this.jobsStore.listAll()).filter(
        (j) =>
          j.id !== job.id &&
          j.title.trim().toLowerCase() === job.title.trim().toLowerCase() &&
          j.location.city.trim().toLowerCase() ===
            job.location.city.trim().toLowerCase(),
      );
      const recent = owner
        ? (await this.jobsStore.listAll()).filter(
            (j) =>
              j.ownerUserId === owner.id &&
              Date.now() - new Date(j.publishedAt || j.effectiveFrom).getTime() <
                24 * 3600_000,
          ).length
        : 0;
      const salaryText = job.salary
        ? `${job.salary.min ?? ''}-${job.salary.max ?? ''} ${job.salary.period}`
        : '';
      return evaluateRiskSignals(
        {
          title: job.title,
          description: job.description.about,
          salaryText,
          city: job.location.city,
          contactWebsite: job.privateContact?.website,
          ownerEmail: owner?.email,
          recentPostCount: recent,
          siblingDuplicateCount: siblings.length,
        },
        config,
      );
    }
    if (targetType === 'user') {
      const user = this.authStore.getUser(targetId);
      return evaluateRiskSignals(
        { ownerEmail: user?.email, recentPostCount: 0 },
        config,
      );
    }
    return { flags: [] as string[], score: 0 };
  }

  private async audit(
    actorId: string | undefined,
    action: string,
    resourceType: string,
    resourceId: string,
    opts?: {
      reason?: string;
      reasonCode?: string;
      correlationId?: string;
      before?: Record<string, unknown>;
      after?: Record<string, unknown>;
    },
  ) {
    try {
      await this.store.appendAudit({
        actorId,
        action,
        resourceType,
        resourceId,
        reason: opts?.reason,
        reasonCode: opts?.reasonCode,
        correlationId: opts?.correlationId,
        beforeJson: opts?.before,
        afterJson: opts?.after,
      });
    } catch (err) {
      this.logger.warn(
        `Trust audit failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
