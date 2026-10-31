import {
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { AuthUser } from '../auth/auth.types';
import { JobsMemoryStore } from '../jobs/jobs.memory-store';
import { toPublicJob } from '../jobs/jobs.mapper';
import { AdsService } from '../ads/ads.service';
import { PreferencesService } from '../preferences/preferences.service';
import { SiteService } from '../site/site.service';
import { SeekerStore } from './seeker.store';

@Injectable()
export class SeekerService {
  constructor(
    private readonly store: SeekerStore,
    private readonly jobs: JobsMemoryStore,
    private readonly preferences: PreferencesService,
    private readonly site: SiteService,
    @Optional() private readonly ads?: AdsService,
  ) {}

  listSaved(user: AuthUser) {
    const boosts = this.ads?.activeBoosts() ?? new Map();
    const items = this.store
      .listSaved(user.id)
      .map((id) => this.jobs.findById(id))
      .filter((job): job is NonNullable<typeof job> => !!job && job.status === 'published')
      .map((job) => ({
        ...toPublicJob(
          job,
          boosts.get(job.id) ?? null,
          this.site.getUnlockPricePaise(),
        ),
        saved: true,
      }));
    return { items };
  }

  save(user: AuthUser, jobId: string) {
    const job = this.jobs.findById(jobId);
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

  feed(user: AuthUser) {
    const prefs = this.preferences.getForUser(user);
    const boosts = this.ads?.activeBoosts() ?? new Map();
    let items = this.jobs.listPublished();

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
