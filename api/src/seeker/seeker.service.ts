import {
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { AdsService } from '../ads/ads.service';
import { ApplyProfilesService } from '../apply-profiles/apply-profiles.service';
import { isReadyForApply } from '../apply-profiles/apply-profiles.types';
import { AuthUser } from '../auth/auth.types';
import {
  buildMatchReasons,
  scoreJob,
  type JobMatchContext,
} from '../jobs/jobs-match.util';
import { toPublicJob } from '../jobs/jobs.mapper';
import { JobRecord } from '../jobs/job.types';
import { JobsStore } from '../jobs/jobs.store';
import { filterJobs } from '../jobs/jobs-search.util';
import { PreferencesService } from '../preferences/preferences.service';
import { SiteService } from '../site/site.service';
import {
  CreateSavedSearchDto,
  HideJobDto,
  MarkApplicationDto,
  UpdateSavedSearchDto,
  UpsertSeekerProfileDto,
} from './dto/seeker.dto';
import { SeekerStore } from './seeker.store';
import {
  buildProfileCompletion,
  SavedSearchQuery,
  SeekerProfile,
  SeekerProfileResponse,
} from './seeker.types';

@Injectable()
export class SeekerService {
  constructor(
    private readonly store: SeekerStore,
    private readonly jobs: JobsStore,
    private readonly preferences: PreferencesService,
    private readonly site: SiteService,
    private readonly applyProfiles: ApplyProfilesService,
    @Optional() private readonly ads?: AdsService,
  ) {}

  async listSaved(user: AuthUser) {
    const boosts = this.ads?.activeBoosts() ?? new Map();
    const savedIds = await this.store.listSaved(user.id);
    const jobs: JobRecord[] = [];
    for (const id of savedIds) {
      const job = await this.jobs.findById(id);
      if (job && job.status === 'published') jobs.push(job);
    }
    const items = jobs.map((job) => ({
      ...toPublicJob(
        job,
        boosts.get(job.id) ?? null,
        this.site.getUnlockPricePaise(),
      ),
      saved: true,
    }));
    return { items };
  }

  async save(user: AuthUser, jobId: string) {
    const job = await this.jobs.findById(jobId);
    if (!job || job.status !== 'published') {
      throw new NotFoundException('Job not found');
    }
    await this.store.save(user.id, jobId);
    return { ok: true, jobId, saved: true };
  }

  async unsave(user: AuthUser, jobId: string) {
    await this.store.unsave(user.id, jobId);
    return { ok: true, jobId, saved: false };
  }

  async getProfile(user: AuthUser): Promise<SeekerProfileResponse> {
    const profile = await this.store.getProfile(user.id);
    return this.withCompletion(user.id, profile);
  }

  async upsertProfile(
    user: AuthUser,
    dto: UpsertSeekerProfileDto,
  ): Promise<SeekerProfileResponse> {
    const experienceBand =
      dto.experienceBand ??
      this.deriveExperienceBand(dto.careerStage, dto.experienceYears);
    const profile = await this.store.upsertProfile(user.id, {
      displayName: dto.displayName?.trim() || undefined,
      mobile: dto.mobile?.trim() || undefined,
      email: dto.email?.trim() || undefined,
      showContact: dto.showContact,
      address: dto.address?.trim() || undefined,
      pincode: dto.pincode?.trim() || undefined,
      careerStage: dto.careerStage,
      educationStatus: dto.educationStatus,
      openToInternship: dto.openToInternship,
      courseDetails: dto.courseDetails?.trim() || undefined,
      branchStudied: dto.branchStudied?.trim() || undefined,
      academicScore: dto.academicScore?.trim() || undefined,
      experienceYears: dto.experienceYears,
      experienceMonths: dto.experienceMonths,
      companyName: dto.companyName?.trim() || undefined,
      companyArea: dto.companyArea?.trim() || undefined,
      currentSalary: dto.currentSalary?.trim() || undefined,
      expectedSalary: dto.expectedSalary?.trim() || undefined,
      noticePeriod: dto.noticePeriod,
      experienceBand,
      skills: dto.skills?.map((s) => s.trim()).filter(Boolean).slice(0, 40),
      preferredCities: dto.preferredCities
        ?.map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 20),
      openToWork: dto.openToWork,
    });
    return this.withCompletion(user.id, profile);
  }

  private async withCompletion(
    userId: string,
    profile: SeekerProfile,
  ): Promise<SeekerProfileResponse> {
    let applyReady = false;
    try {
      const { items } = await this.applyProfiles.list({ id: userId } as AuthUser);
      const preferred =
        items.find((item) => item.isDefault) ?? items[0] ?? null;
      applyReady = preferred ? isReadyForApply(preferred) : false;
    } catch {
      applyReady = false;
    }
    return {
      ...profile,
      completion: buildProfileCompletion(profile, applyReady),
    };
  }

  private deriveExperienceBand(
    careerStage?: 'fresher' | 'experienced',
    years?: number,
  ): 'fresher' | '0-1' | '1-3' | '3-5' | '5+' | undefined {
    if (careerStage === 'fresher') return 'fresher';
    if (careerStage !== 'experienced' || years == null) return undefined;
    if (years < 1) return '0-1';
    if (years < 3) return '1-3';
    if (years < 5) return '3-5';
    return '5+';
  }

  async listApplications(user: AuthUser) {
    const boosts = this.ads?.activeBoosts() ?? new Map();
    const rows = await this.store.listApplications(user.id);
    const items = [];
    for (const row of rows) {
      const job = await this.jobs.findById(row.jobId);
      if (!job || job.status === 'removed') continue;
      items.push({
        ...row,
        job: toPublicJob(
          job,
          boosts.get(job.id) ?? null,
          this.site.getUnlockPricePaise(),
        ),
      });
    }
    return { items };
  }

  async markApplication(
    user: AuthUser,
    jobId: string,
    dto: MarkApplicationDto,
  ) {
    const job = await this.jobs.findById(jobId);
    if (!job || job.status !== 'published') {
      throw new NotFoundException('Job not found');
    }
    return this.store.markApplication(user.id, jobId, dto);
  }

  async hideJob(user: AuthUser, jobId: string, dto: HideJobDto) {
    const job = await this.jobs.findById(jobId);
    if (!job) throw new NotFoundException('Job not found');
    await this.store.hideJob(user.id, jobId);
    if (dto.hideEmployer && job.employerId) {
      await this.store.hideEmployer(user.id, job.employerId);
    }
    return {
      ok: true,
      jobId,
      hidden: true,
      employerHidden: !!(dto.hideEmployer && job.employerId),
    };
  }

  async unhideJob(user: AuthUser, jobId: string) {
    await this.store.unhideJob(user.id, jobId);
    return { ok: true, jobId, hidden: false };
  }

  async listHidden(user: AuthUser) {
    return {
      jobIds: await this.store.listHiddenJobs(user.id),
      employerIds: await this.store.listHiddenEmployers(user.id),
    };
  }

  async listSavedSearches(user: AuthUser) {
    return { items: await this.store.listSavedSearches(user.id) };
  }

  async createSavedSearch(user: AuthUser, dto: CreateSavedSearchDto) {
    return this.store.createSavedSearch(user.id, {
      name: dto.name,
      query: dto.query,
      alertEnabled: dto.alertEnabled,
    });
  }

  async updateSavedSearch(
    user: AuthUser,
    id: string,
    dto: UpdateSavedSearchDto,
  ) {
    const updated = await this.store.updateSavedSearch(user.id, id, dto);
    if (!updated) throw new NotFoundException('Saved search not found');
    return updated;
  }

  async deleteSavedSearch(user: AuthUser, id: string) {
    const ok = await this.store.deleteSavedSearch(user.id, id);
    if (!ok) throw new NotFoundException('Saved search not found');
    return { ok: true };
  }

  /** Skills / locations / prefs used by public search ranking + hide exclude. */
  async discoveryHints(user: AuthUser): Promise<{
    hiddenJobIds: string[];
    skills: string[];
    preferredLocations: string[];
    remotePreferred: boolean;
  }> {
    const prefs = this.preferences.getForUser(user);
    const profile = await this.store.getProfile(user.id);
    return {
      hiddenJobIds: await this.store.listHiddenJobs(user.id),
      skills: profile.skills ?? [],
      preferredLocations: [
        ...prefs.locations,
        ...(profile.preferredCities ?? []),
      ],
      remotePreferred: !!prefs.remotePreferred,
    };
  }

  async feed(user: AuthUser) {
    const prefs = this.preferences.getForUser(user);
    const profile = await this.store.getProfile(user.id);
    const boosts = this.ads?.activeBoosts() ?? new Map();
    const hiddenJobs = new Set(await this.store.listHiddenJobs(user.id));
    const hiddenEmployers = new Set(
      await this.store.listHiddenEmployers(user.id),
    );
    let items = await this.jobs.listPublished();

    items = items.filter((job) => {
      if (hiddenJobs.has(job.id)) return false;
      if (job.employerId && hiddenEmployers.has(job.employerId)) return false;
      return true;
    });

    if (prefs.locations.length || profile.preferredCities.length) {
      const locs = [
        ...prefs.locations,
        ...profile.preferredCities,
      ].map((l) => l.trim().toLowerCase());
      items = items.filter((job) => {
        const hay = [
          job.location.city,
          job.location.district,
          job.location.state,
          job.location.locality,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return locs.some((loc) => hay.includes(loc));
      });
    }
    if (prefs.jobTypes.length) {
      items = items.filter((job) => prefs.jobTypes.includes(job.jobType));
    }
    if (prefs.categories.length) {
      items = items.filter((job) => prefs.categories.includes(job.category));
    }
    if (prefs.languages.length) {
      items = items.filter((job) =>
        prefs.languages.includes(job.contentLanguage),
      );
    }
    if (prefs.salaryMin != null) {
      items = items.filter((job) => {
        const max = job.salary?.max ?? job.salary?.min ?? 0;
        return max >= prefs.salaryMin!;
      });
    }
    if (prefs.remotePreferred) {
      items = items.filter((job) => job.location.remote);
    }

    const matchCtx: JobMatchContext = {
      skills: profile.skills,
      preferredLocations: [
        ...prefs.locations,
        ...profile.preferredCities,
      ],
      remotePreferred: prefs.remotePreferred,
    };

    const ranked = items
      .map((job) => ({
        job,
        score: scoreJob(job, matchCtx),
        matchReasons: buildMatchReasons(job, matchCtx),
      }))
      .sort(
        (a, b) =>
          b.score - a.score ||
          b.job.publishedAt.localeCompare(a.job.publishedAt) ||
          a.job.id.localeCompare(b.job.id),
      );

    const saved = new Set(await this.store.listSaved(user.id));
    return {
      preferencesSummary: {
        locations: prefs.locations,
        jobTypes: prefs.jobTypes,
        categories: prefs.categories,
        languages: prefs.languages,
        salaryMin: prefs.salaryMin,
        remotePreferred: prefs.remotePreferred,
      },
      profileSummary: {
        experienceBand: profile.experienceBand,
        skills: profile.skills,
        preferredCities: profile.preferredCities,
        openToWork: profile.openToWork,
      },
      items: ranked.slice(0, 30).map(({ job, matchReasons }) => ({
        ...toPublicJob(
          job,
          boosts.get(job.id) ?? null,
          this.site.getUnlockPricePaise(),
        ),
        saved: saved.has(job.id),
        ...(matchReasons.length ? { matchReasons } : {}),
      })),
    };
  }

  /** Used by notifications fan-out for saved-search alerts. */
  jobMatchesSavedQuery(job: JobRecord, query: SavedSearchQuery): boolean {
    const hits = filterJobs([job], {
      keyword: query.keyword,
      locationText: query.location,
      jobType: (query.jobType as JobRecord['jobType'] | '') || '',
      category: query.category,
      language: query.language,
      salaryMin: query.salaryMin ?? null,
      remote: query.remote ?? null,
      walkInOnly: query.walkInOnly ?? null,
      postedWithin: query.postedWithin ?? null,
      nearLat: query.nearLat ?? null,
      nearLng: query.nearLng ?? null,
      radiusKm: query.radiusKm ?? null,
      skills: query.skills,
      verifiedEmployer: query.verifiedEmployer ?? null,
      fresher: query.fresher ?? null,
      easyApply: query.easyApply ?? null,
    });
    return hits.length > 0;
  }

  async listAlertSavedSearches() {
    return this.store.listAlertSavedSearches();
  }

  async hiddenJobIds(userId: string): Promise<string[]> {
    return this.store.listHiddenJobs(userId);
  }

  async clearUser(userId: string) {
    await this.store.clearUser(userId);
  }
}
