import {
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { AuthUser } from '../auth/auth.types';
import { JobsStore } from '../jobs/jobs.store';
import { toPublicJob } from '../jobs/jobs.mapper';
import { JobRecord } from '../jobs/job.types';
import { AdsService } from '../ads/ads.service';
import { PreferencesService } from '../preferences/preferences.service';
import { SiteService } from '../site/site.service';
import { SeekerStore } from './seeker.store';

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

  async feed(user: AuthUser) {
    const prefs = this.preferences.getForUser(user);
    const boosts = this.ads?.activeBoosts() ?? new Map();
    let items = await this.jobs.listPublished();

    if (prefs.locations.length) {
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
        return prefs.locations.some((loc) =>
          hay.includes(loc.trim().toLowerCase()),
        );
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

    items.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

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

  clearUser(userId: string) {
    this.store.clearUser(userId);
  }
}
