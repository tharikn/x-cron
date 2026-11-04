import {
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { AdsService } from '../ads/ads.service';
import { AuthUser } from '../auth/auth.types';
import { toPublicJob } from '../jobs/jobs.mapper';
import { JobRecord } from '../jobs/job.types';
import { JobsStore } from '../jobs/jobs.store';
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
import { SavedSearchQuery } from './seeker.types';

@Injectable()
export class SeekerService {
  constructor(
    private readonly store: SeekerStore,
    private readonly jobs: JobsStore,
    private readonly preferences: PreferencesService,
    private readonly site: SiteService,
    @Optional() private readonly ads?: AdsService,
  ) {}

  async listSaved(user: AuthUser) {
    const boosts = this.ads?.activeBoosts() ?? new Map();
    const savedIds = this.store.listSaved(user.id);
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
    this.store.save(user.id, jobId);
    return { ok: true, jobId, saved: true };
  }

  unsave(user: AuthUser, jobId: string) {
    this.store.unsave(user.id, jobId);
    return { ok: true, jobId, saved: false };
  }

  getProfile(user: AuthUser) {
    return this.store.getProfile(user.id);
  }

  upsertProfile(user: AuthUser, dto: UpsertSeekerProfileDto) {
    return this.store.upsertProfile(user.id, {
      displayName: dto.displayName,
      experienceBand: dto.experienceBand,
      skills: dto.skills?.map((s) => s.trim()).filter(Boolean).slice(0, 40),
      preferredCities: dto.preferredCities
        ?.map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 20),
      openToWork: dto.openToWork,
    });
  }

  async listApplications(user: AuthUser) {
    const boosts = this.ads?.activeBoosts() ?? new Map();
    const rows = this.store.listApplications(user.id);
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
    this.store.hideJob(user.id, jobId);
    if (dto.hideEmployer && job.employerId) {
      this.store.hideEmployer(user.id, job.employerId);
    }
    return {
      ok: true,
      jobId,
      hidden: true,
      employerHidden: !!(dto.hideEmployer && job.employerId),
    };
  }

  unhideJob(user: AuthUser, jobId: string) {
    this.store.unhideJob(user.id, jobId);
    return { ok: true, jobId, hidden: false };
  }

  listHidden(user: AuthUser) {
    return {
      jobIds: this.store.listHiddenJobs(user.id),
      employerIds: this.store.listHiddenEmployers(user.id),
    };
  }

  listSavedSearches(user: AuthUser) {
    return { items: this.store.listSavedSearches(user.id) };
  }

  createSavedSearch(user: AuthUser, dto: CreateSavedSearchDto) {
    return this.store.createSavedSearch(user.id, {
      name: dto.name,
      query: dto.query,
      alertEnabled: dto.alertEnabled,
    });
  }

  updateSavedSearch(
    user: AuthUser,
    id: string,
    dto: UpdateSavedSearchDto,
  ) {
    const updated = this.store.updateSavedSearch(user.id, id, dto);
    if (!updated) throw new NotFoundException('Saved search not found');
    return updated;
  }

  deleteSavedSearch(user: AuthUser, id: string) {
    const ok = this.store.deleteSavedSearch(user.id, id);
    if (!ok) throw new NotFoundException('Saved search not found');
    return { ok: true };
  }

  async feed(user: AuthUser) {
    const prefs = this.preferences.getForUser(user);
    const profile = this.store.getProfile(user.id);
    const boosts = this.ads?.activeBoosts() ?? new Map();
    const hiddenJobs = new Set(this.store.listHiddenJobs(user.id));
    const hiddenEmployers = new Set(this.store.listHiddenEmployers(user.id));
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

    const skillSet = new Set(
      profile.skills.map((s) => s.trim().toLowerCase()).filter(Boolean),
    );
    items = items
      .map((job) => {
        let score =
          new Date(job.publishedAt).getTime() / 1_000_000 +
          (job.priority ?? 0) * 10;
        if (skillSet.size) {
          const jobSkills = (job.skills ?? []).map((s) => s.toLowerCase());
          const hay = `${job.title} ${job.category} ${job.description.about}`.toLowerCase();
          for (const skill of skillSet) {
            if (jobSkills.some((s) => s.includes(skill)) || hay.includes(skill)) {
              score += 25;
            }
          }
        }
        return { job, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((row) => row.job);

    const saved = new Set(this.store.listSaved(user.id));
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
      items: items.slice(0, 30).map((job) => ({
        ...toPublicJob(
          job,
          boosts.get(job.id) ?? null,
          this.site.getUnlockPricePaise(),
        ),
        saved: saved.has(job.id),
      })),
    };
  }

  /** Used by notifications fan-out for saved-search alerts. */
  jobMatchesSavedQuery(job: JobRecord, query: SavedSearchQuery): boolean {
    const keyword = query.keyword?.trim().toLowerCase() ?? '';
    if (keyword) {
      const hay = [
        job.title,
        job.employerName,
        job.category,
        job.description.about,
        ...(job.skills ?? []),
      ]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(keyword)) return false;
    }
    if (query.location?.trim()) {
      const loc = query.location.trim().toLowerCase();
      const hay = [
        job.location.city,
        job.location.district,
        job.location.state,
        job.location.locality ?? '',
      ]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(loc)) return false;
    }
    if (query.jobType && job.jobType !== query.jobType) return false;
    if (query.category && job.category !== query.category) return false;
    if (query.language && job.contentLanguage !== query.language) return false;
    if (
      query.salaryMin != null &&
      (job.salary?.max ?? job.salary?.min ?? 0) < query.salaryMin
    ) {
      return false;
    }
    if (query.remote && !job.location.remote) return false;
    if (query.walkInOnly && !job.walkInAt) return false;
    return true;
  }

  listAlertSavedSearches() {
    return this.store.listAlertSavedSearches();
  }

  hiddenJobIds(userId: string): string[] {
    return this.store.listHiddenJobs(userId);
  }

  clearUser(userId: string) {
    this.store.clearUser(userId);
  }
}
