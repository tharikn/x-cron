import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { SeekerStore } from './seeker.store';
import {
  CareerStage,
  DEFAULT_SEEKER_PROFILE,
  EducationStatus,
  NoticePeriod,
  SavedSearch,
  SavedSearchQuery,
  SeekerApplication,
  SeekerProfile,
} from './seeker.types';

function asStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === 'string')
    .map((v) => v.trim())
    .filter(Boolean);
}

function asSavedSearchQuery(
  value: Prisma.JsonValue | null | undefined,
): SavedSearchQuery {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const row = value as Record<string, unknown>;
  const out: SavedSearchQuery = {};
  if (typeof row.keyword === 'string') out.keyword = row.keyword;
  if (typeof row.location === 'string') out.location = row.location;
  if (typeof row.jobType === 'string') out.jobType = row.jobType;
  if (typeof row.category === 'string') out.category = row.category;
  if (typeof row.language === 'string') out.language = row.language;
  if (typeof row.salaryMin === 'number' || row.salaryMin === null) {
    out.salaryMin = row.salaryMin as number | null;
  }
  if (typeof row.remote === 'boolean' || row.remote === null) {
    out.remote = row.remote as boolean | null;
  }
  if (typeof row.radiusKm === 'number' || row.radiusKm === null) {
    out.radiusKm = row.radiusKm as number | null;
  }
  if (typeof row.nearLat === 'number' || row.nearLat === null) {
    out.nearLat = row.nearLat as number | null;
  }
  if (typeof row.nearLng === 'number' || row.nearLng === null) {
    out.nearLng = row.nearLng as number | null;
  }
  if (typeof row.walkInOnly === 'boolean' || row.walkInOnly === null) {
    out.walkInOnly = row.walkInOnly as boolean | null;
  }
  if (
    row.postedWithin === '1d' ||
    row.postedWithin === '7d' ||
    row.postedWithin === '30d' ||
    row.postedWithin === null
  ) {
    out.postedWithin = row.postedWithin;
  }
  if (typeof row.skills === 'string') out.skills = row.skills;
  if (typeof row.verifiedEmployer === 'boolean' || row.verifiedEmployer === null) {
    out.verifiedEmployer = row.verifiedEmployer as boolean | null;
  }
  if (typeof row.fresher === 'boolean' || row.fresher === null) {
    out.fresher = row.fresher as boolean | null;
  }
  if (typeof row.easyApply === 'boolean' || row.easyApply === null) {
    out.easyApply = row.easyApply as boolean | null;
  }
  if (typeof row.sort === 'string') out.sort = row.sort;
  return out;
}

function mapProfile(row: {
  displayName: string | null;
  mobile: string | null;
  email: string | null;
  showContact: boolean;
  address: string | null;
  pincode: string | null;
  careerStage: string | null;
  educationStatus: string | null;
  openToInternship: boolean | null;
  courseDetails: string | null;
  branchStudied: string | null;
  academicScore: string | null;
  experienceYears: number | null;
  experienceMonths: number | null;
  companyName: string | null;
  companyArea: string | null;
  currentSalary: string | null;
  expectedSalary: string | null;
  noticePeriod: string | null;
  experienceBand: string | null;
  skillsJson: Prisma.JsonValue;
  preferredCitiesJson: Prisma.JsonValue;
  openToWork: boolean;
  updatedAt: Date;
}): SeekerProfile {
  return {
    displayName: row.displayName ?? undefined,
    mobile: row.mobile ?? undefined,
    email: row.email ?? undefined,
    showContact: row.showContact,
    address: row.address ?? undefined,
    pincode: row.pincode ?? undefined,
    careerStage: (row.careerStage as CareerStage) || undefined,
    educationStatus: (row.educationStatus as EducationStatus) || undefined,
    openToInternship: row.openToInternship ?? undefined,
    courseDetails: row.courseDetails ?? undefined,
    branchStudied: row.branchStudied ?? undefined,
    academicScore: row.academicScore ?? undefined,
    experienceYears: row.experienceYears ?? undefined,
    experienceMonths: row.experienceMonths ?? undefined,
    companyName: row.companyName ?? undefined,
    companyArea: row.companyArea ?? undefined,
    currentSalary: row.currentSalary ?? undefined,
    expectedSalary: row.expectedSalary ?? undefined,
    noticePeriod: (row.noticePeriod as NoticePeriod) || undefined,
    experienceBand:
      (row.experienceBand as SeekerProfile['experienceBand']) || undefined,
    skills: asStringArray(row.skillsJson),
    preferredCities: asStringArray(row.preferredCitiesJson),
    openToWork: row.openToWork,
    updatedAt: row.updatedAt.toISOString(),
  };
}

function mapSavedSearch(row: {
  id: string;
  name: string;
  queryJson: Prisma.JsonValue;
  alertEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}): SavedSearch {
  return {
    id: row.id,
    name: row.name,
    query: asSavedSearchQuery(row.queryJson),
    alertEnabled: row.alertEnabled,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

@Injectable()
export class SeekerPrismaStore extends SeekerStore {
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

  async listSaved(userId: string): Promise<string[]> {
    const rows = await this.prisma.savedJob.findMany({
      where: { userId },
      select: { jobId: true },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => r.jobId);
  }

  async isSaved(userId: string, jobId: string): Promise<boolean> {
    const row = await this.prisma.savedJob.findUnique({
      where: { userId_jobId: { userId, jobId } },
      select: { id: true },
    });
    return !!row;
  }

  async save(userId: string, jobId: string): Promise<void> {
    await this.ensureUser(userId);
    await this.prisma.savedJob.upsert({
      where: { userId_jobId: { userId, jobId } },
      create: { id: randomUUID(), userId, jobId },
      update: {},
    });
  }

  async unsave(userId: string, jobId: string): Promise<void> {
    await this.prisma.savedJob.deleteMany({ where: { userId, jobId } });
  }

  async listHiddenJobs(userId: string): Promise<string[]> {
    const rows = await this.prisma.hiddenJob.findMany({
      where: { userId },
      select: { jobId: true },
    });
    return rows.map((r) => r.jobId);
  }

  async listHiddenEmployers(userId: string): Promise<string[]> {
    const rows = await this.prisma.hiddenJob.findMany({
      where: { userId, employerId: { not: null } },
      select: { employerId: true },
      distinct: ['employerId'],
    });
    return rows
      .map((r) => r.employerId)
      .filter((id): id is string => typeof id === 'string' && !!id);
  }

  async hideJob(userId: string, jobId: string): Promise<void> {
    await this.ensureUser(userId);
    await this.prisma.hiddenJob.upsert({
      where: { userId_jobId: { userId, jobId } },
      create: { id: randomUUID(), userId, jobId },
      update: {},
    });
  }

  async unhideJob(userId: string, jobId: string): Promise<void> {
    await this.prisma.hiddenJob.deleteMany({ where: { userId, jobId } });
  }

  async hideEmployer(userId: string, employerId: string): Promise<void> {
    await this.prisma.hiddenJob.updateMany({
      where: { userId, job: { employerId } },
      data: { employerId },
    });
  }

  async getProfile(userId: string): Promise<SeekerProfile> {
    const row = await this.prisma.seekerProfile.findUnique({
      where: { userId },
    });
    if (!row) {
      return {
        ...DEFAULT_SEEKER_PROFILE,
        updatedAt: new Date().toISOString(),
      };
    }
    return mapProfile(row);
  }

  async upsertProfile(
    userId: string,
    patch: Partial<Omit<SeekerProfile, 'updatedAt'>>,
  ): Promise<SeekerProfile> {
    await this.ensureUser(userId);
    const current = await this.getProfile(userId);
    const next: SeekerProfile = {
      displayName: patch.displayName ?? current.displayName,
      mobile: patch.mobile ?? current.mobile,
      email: patch.email ?? current.email,
      showContact: patch.showContact ?? current.showContact,
      address: patch.address ?? current.address,
      pincode: patch.pincode ?? current.pincode,
      careerStage: patch.careerStage ?? current.careerStage,
      educationStatus: patch.educationStatus ?? current.educationStatus,
      openToInternship: patch.openToInternship ?? current.openToInternship,
      courseDetails: patch.courseDetails ?? current.courseDetails,
      branchStudied: patch.branchStudied ?? current.branchStudied,
      academicScore: patch.academicScore ?? current.academicScore,
      experienceYears: patch.experienceYears ?? current.experienceYears,
      experienceMonths: patch.experienceMonths ?? current.experienceMonths,
      companyName: patch.companyName ?? current.companyName,
      companyArea: patch.companyArea ?? current.companyArea,
      currentSalary: patch.currentSalary ?? current.currentSalary,
      expectedSalary: patch.expectedSalary ?? current.expectedSalary,
      noticePeriod: patch.noticePeriod ?? current.noticePeriod,
      experienceBand: patch.experienceBand ?? current.experienceBand,
      skills: patch.skills ?? current.skills,
      preferredCities: patch.preferredCities ?? current.preferredCities,
      openToWork: patch.openToWork ?? current.openToWork,
      updatedAt: new Date().toISOString(),
    };

    const data = {
      displayName: next.displayName ?? null,
      mobile: next.mobile ?? null,
      email: next.email ?? null,
      showContact: next.showContact,
      address: next.address ?? null,
      pincode: next.pincode ?? null,
      careerStage: next.careerStage ?? null,
      educationStatus: next.educationStatus ?? null,
      openToInternship: next.openToInternship ?? null,
      courseDetails: next.courseDetails ?? null,
      branchStudied: next.branchStudied ?? null,
      academicScore: next.academicScore ?? null,
      experienceYears: next.experienceYears ?? null,
      experienceMonths: next.experienceMonths ?? null,
      companyName: next.companyName ?? null,
      companyArea: next.companyArea ?? null,
      currentSalary: next.currentSalary ?? null,
      expectedSalary: next.expectedSalary ?? null,
      noticePeriod: next.noticePeriod ?? null,
      experienceBand: next.experienceBand ?? null,
      skillsJson: next.skills as Prisma.InputJsonValue,
      preferredCitiesJson: next.preferredCities as Prisma.InputJsonValue,
      openToWork: next.openToWork,
    };

    const row = await this.prisma.seekerProfile.upsert({
      where: { userId },
      create: { id: randomUUID(), userId, ...data },
      update: data,
    });
    return mapProfile(row);
  }

  async listApplications(userId: string): Promise<SeekerApplication[]> {
    const rows = await this.prisma.seekerApplication.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map((row) => ({
      jobId: row.jobId,
      status: (row.status as SeekerApplication['status']) || 'contacted',
      channel: (row.channel as SeekerApplication['channel']) || undefined,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  }

  async listApplicationsForJobIds(
    jobIds: string[],
  ): Promise<SeekerApplication[]> {
    if (jobIds.length === 0) return [];
    const rows = await this.prisma.seekerApplication.findMany({
      where: { jobId: { in: jobIds } },
    });
    return rows.map((row) => ({
      jobId: row.jobId,
      status: (row.status as SeekerApplication['status']) || 'contacted',
      channel: (row.channel as SeekerApplication['channel']) || undefined,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  }

  async markApplication(
    userId: string,
    jobId: string,
    input: {
      status?: SeekerApplication['status'];
      channel?: SeekerApplication['channel'];
    },
  ): Promise<SeekerApplication> {
    await this.ensureUser(userId);
    const existing = await this.prisma.seekerApplication.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });
    const status = input.status ?? existing?.status ?? 'contacted';
    const channel = input.channel ?? existing?.channel ?? null;
    const row = await this.prisma.seekerApplication.upsert({
      where: { userId_jobId: { userId, jobId } },
      create: {
        id: randomUUID(),
        userId,
        jobId,
        status,
        channel,
      },
      update: {
        status,
        channel,
      },
    });
    return {
      jobId: row.jobId,
      status: (row.status as SeekerApplication['status']) || 'contacted',
      channel: (row.channel as SeekerApplication['channel']) || undefined,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async listSavedSearches(userId: string): Promise<SavedSearch[]> {
    const rows = await this.prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(mapSavedSearch);
  }

  async createSavedSearch(
    userId: string,
    input: { name: string; query: SavedSearchQuery; alertEnabled?: boolean },
  ): Promise<SavedSearch> {
    await this.ensureUser(userId);
    const row = await this.prisma.savedSearch.create({
      data: {
        id: `ss_${randomUUID().slice(0, 8)}`,
        userId,
        name: input.name.trim() || 'Saved search',
        queryJson: input.query as Prisma.InputJsonValue,
        alertEnabled: !!input.alertEnabled,
      },
    });
    return mapSavedSearch(row);
  }

  async updateSavedSearch(
    userId: string,
    id: string,
    patch: Partial<{
      name: string;
      query: SavedSearchQuery;
      alertEnabled: boolean;
    }>,
  ): Promise<SavedSearch | undefined> {
    const existing = await this.prisma.savedSearch.findFirst({
      where: { id, userId },
    });
    if (!existing) return undefined;
    const row = await this.prisma.savedSearch.update({
      where: { id },
      data: {
        name: patch.name?.trim() || existing.name,
        queryJson:
          patch.query != null
            ? (patch.query as Prisma.InputJsonValue)
            : undefined,
        alertEnabled:
          patch.alertEnabled != null
            ? patch.alertEnabled
            : existing.alertEnabled,
      },
    });
    return mapSavedSearch(row);
  }

  async deleteSavedSearch(userId: string, id: string): Promise<boolean> {
    const result = await this.prisma.savedSearch.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  }

  async listAlertSavedSearches(): Promise<
    Array<{ userId: string; search: SavedSearch }>
  > {
    const rows = await this.prisma.savedSearch.findMany({
      where: { alertEnabled: true },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map((row) => ({
      userId: row.userId,
      search: mapSavedSearch(row),
    }));
  }

  async clearUser(userId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.savedJob.deleteMany({ where: { userId } }),
      this.prisma.hiddenJob.deleteMany({ where: { userId } }),
      this.prisma.seekerProfile.deleteMany({ where: { userId } }),
      this.prisma.seekerApplication.deleteMany({ where: { userId } }),
      this.prisma.savedSearch.deleteMany({ where: { userId } }),
    ]);
  }
}
