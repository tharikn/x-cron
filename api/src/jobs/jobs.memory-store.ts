import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CreateJobInput,
  JobRecord,
  JobSearchQuery,
  JobType,
} from './job.types';
import { JobsStore } from './jobs.store';
import { SEED_JOBS } from './seed-jobs';

@Injectable()
export class JobsMemoryStore extends JobsStore implements OnModuleInit {
  private jobs: JobRecord[] = [];

  constructor() {
    super();
  }

  onModuleInit() {
    this.jobs = SEED_JOBS.map((job) => structuredClone(job));
  }

  async listPublished(): Promise<JobRecord[]> {
    const now = Date.now();
    return this.jobs.filter((job) => {
      if (job.status !== 'published') return false;
      const from = Date.parse(job.effectiveFrom || job.publishedAt);
      const until = Date.parse(job.expiresAt);
      if (Number.isFinite(from) && now < from) return false;
      if (Number.isFinite(until) && now > until) return false;
      return true;
    });
  }

  async findById(id: string): Promise<JobRecord | undefined> {
    return this.jobs.find((job) => job.id === id);
  }

  async findBySlug(slug: string): Promise<JobRecord | undefined> {
    return this.jobs.find((job) => job.slug === slug);
  }

  async search(
    query: JobSearchQuery,
  ): Promise<{ items: JobRecord[]; nextCursor?: string }> {
    const keyword = query.keyword?.trim().toLowerCase() ?? '';
    const locationText = query.locationText?.trim().toLowerCase() ?? '';
    const limit = Math.min(Math.max(query.limit ?? 20, 1), 50);

    let results = (await this.listPublished()).filter((job) => {
      const haystack = [
        job.title,
        job.employerName,
        job.category,
        job.description.about,
        ...(job.skills ?? []),
      ]
        .join(' ')
        .toLowerCase();
      const locationHaystack = [
        job.location.city,
        job.location.district,
        job.location.state,
        job.location.locality ?? '',
      ]
        .join(' ')
        .toLowerCase();

      return (
        (!keyword || haystack.includes(keyword)) &&
        (!locationText || locationHaystack.includes(locationText)) &&
        (!query.jobType || job.jobType === query.jobType) &&
        (!query.category || job.category === query.category) &&
        (!query.language || job.contentLanguage === query.language) &&
        (query.salaryMin == null ||
          (job.salary?.max ?? job.salary?.min ?? 0) >= query.salaryMin)
      );
    });

    results = this.sortJobs(results, query.sort ?? 'newest', !!keyword);

    if (query.cursor) {
      const index = results.findIndex((job) => job.id === query.cursor);
      if (index >= 0) {
        results = results.slice(index + 1);
      }
    }

    const page = results.slice(0, limit);
    const nextCursor =
      results.length > limit ? page[page.length - 1]?.id : undefined;
    return { items: page, nextCursor };
  }

  async related(job: JobRecord, limit = 3): Promise<JobRecord[]> {
    return (await this.listPublished())
      .filter((candidate) => candidate.id !== job.id)
      .map((candidate) => ({
        candidate,
        score:
          (candidate.location.city === job.location.city ? 3 : 0) +
          (candidate.category === job.category ? 2 : 0) +
          (candidate.jobType === job.jobType ? 1 : 0),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.candidate);
  }

  async categories(): Promise<string[]> {
    return [...new Set((await this.listPublished()).map((job) => job.category))].sort();
  }

  /** Title + city fingerprint for active (non-rejected/removed) jobs. */
  dedupeKey(title: string, city: string): string {
    return `${title.trim().toLowerCase()}|${city.trim().toLowerCase()}`;
  }

  async findActiveDuplicate(
    title: string,
    city: string,
  ): Promise<JobRecord | undefined> {
    const key = this.dedupeKey(title || 'Untitled role', city || 'Palani');
    return this.jobs.find((job) => {
      if (job.status === 'rejected' || job.status === 'removed') return false;
      return this.dedupeKey(job.title, job.location.city) === key;
    });
  }

  async createAndPublish(input: CreateJobInput): Promise<JobRecord> {
    const id = `job_${randomUUID().slice(0, 8)}`;
    const city = input.locationCity.trim() || 'Palani';
    const state = input.locationState?.trim() || 'Tamil Nadu';
    const district = input.locationDistrict?.trim() || city;
    const title = input.title.trim() || 'Untitled role';
    if (await this.findActiveDuplicate(title, city)) {
      throw new Error('DUPLICATE_JOB');
    }
    const salary = this.parseSalary(input.salaryText);
    const phone = input.contactPhone?.trim();
    const email = input.contactEmail?.trim();
    const website = input.contactWebsite?.trim();

    const status = input.status ?? 'needs-review';
    const nowIso = new Date().toISOString();
    const job: JobRecord = {
      id,
      slug: `tamil-nadu/${this.slugify(city)}/${this.slugify(title)}-${id}`,
      title,
      employerName: input.employerName.trim() || 'Employer',
      employerId: input.employerId,
      ownerUserId: input.ownerUserId,
      verifiedEmployer: false,
      location: {
        country: 'India',
        state,
        district,
        city,
      },
      jobType: input.jobType,
      salary,
      contentLanguage: input.contentLanguage || 'en',
      description: {
        about: input.description.trim() || 'Not provided',
      },
      experienceLabel: input.experienceLabel,
      vacancies: input.vacancies,
      workSchedule: input.workSchedule,
      skills: input.skills,
      category: input.category?.trim() || 'General',
      publishedAt: nowIso,
      effectiveFrom: input.effectiveFrom || nowIso,
      expiresAt:
        input.expiresAt ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      priority: input.priority ?? 0,
      status,
      reportCount: 0,
      contact: {
        hasPhone: !!phone,
        hasEmail: !!email,
        hasWhatsapp: !!phone,
        hasWebsite: !!website,
        unlockPricePaise: Number(process.env.UNLOCK_PRICE_PAISE ?? 500),
      },
      privateContact: {
        phone,
        email,
        whatsapp: phone,
        website,
      },
    };

    this.jobs.unshift(job);
    return job;
  }

  async createFromPaste(
    rawText: string,
    contentLanguage: string,
    meta?: { employerId?: string; ownerUserId?: string; employerName?: string },
  ): Promise<JobRecord> {
    const lines = rawText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const joined = lines.join(' ');
    const phoneMatch = joined.match(/(?:\+91[-\s]?)?[6-9]\d{9}/);
    const title =
      lines.find((line) => /hiring|wanted|job|வேலை|வேண்டும்/i.test(line)) ??
      lines[0] ??
      'Pasted job';

    return this.createAndPublish({
      title: title.slice(0, 80),
      employerName: meta?.employerName || 'From pasted message',
      locationCity: this.detectCity(joined) ?? 'Palani',
      jobType: 'full-time',
      salaryText: this.detectSalaryText(joined),
      description: rawText.trim(),
      contentLanguage,
      contactPhone: phoneMatch?.[0],
      employerId: meta?.employerId,
      ownerUserId: meta?.ownerUserId,
      status: 'needs-review',
    });
  }

  async listByStatus(status?: string): Promise<JobRecord[]> {
    if (!status) return [...this.jobs];
    return this.jobs.filter((job) => job.status === status);
  }

  async listByOwner(userId: string): Promise<JobRecord[]> {
    return this.jobs.filter((job) => job.ownerUserId === userId);
  }

  async listAll(): Promise<JobRecord[]> {
    return [...this.jobs];
  }

  async listByOwnerPaged(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{ items: JobRecord[]; total: number; page: number; limit: number }> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const sorted = (await this.listByOwner(userId)).sort(
      (a, b) =>
        b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id),
    );
    const start = (safePage - 1) * safeLimit;
    return {
      items: sorted.slice(start, start + safeLimit),
      total: sorted.length,
      page: safePage,
      limit: safeLimit,
    };
  }

  async setStatus(
    id: string,
    status: JobRecord['status'],
    note?: string,
  ): Promise<JobRecord | undefined> {
    const job = await this.findById(id);
    if (!job) return undefined;
    job.status = status;
    if (note) job.moderationNote = note;
    if (status === 'published' && !job.publishedAt) {
      job.publishedAt = new Date().toISOString();
    }
    return job;
  }

  async updateOwned(
    id: string,
    ownerUserId: string,
    patch: Partial<CreateJobInput> & {
      status?: JobRecord['status'];
    },
  ): Promise<JobRecord | undefined> {
    const job = await this.findById(id);
    if (!job || job.ownerUserId !== ownerUserId) return undefined;

    if (patch.title?.trim()) job.title = patch.title.trim();
    if (patch.employerName?.trim()) job.employerName = patch.employerName.trim();
    if (patch.locationCity?.trim()) {
      job.location.city = patch.locationCity.trim();
      job.location.district =
        patch.locationDistrict?.trim() || job.location.district;
      job.location.state = patch.locationState?.trim() || job.location.state;
    } else {
      if (patch.locationDistrict?.trim()) {
        job.location.district = patch.locationDistrict.trim();
      }
      if (patch.locationState?.trim()) {
        job.location.state = patch.locationState.trim();
      }
    }
    if (patch.jobType) job.jobType = patch.jobType;
    if (patch.salaryText !== undefined) {
      job.salary = this.parseSalary(patch.salaryText);
    }
    if (patch.description?.trim()) {
      job.description = {
        ...job.description,
        about: patch.description.trim(),
      };
    }
    if (patch.contentLanguage) job.contentLanguage = patch.contentLanguage;
    if (patch.category?.trim()) job.category = patch.category.trim();
    if (patch.experienceLabel !== undefined) {
      job.experienceLabel = patch.experienceLabel;
    }
    if (patch.vacancies !== undefined) job.vacancies = patch.vacancies;
    if (patch.workSchedule !== undefined) job.workSchedule = patch.workSchedule;
    if (patch.skills !== undefined) job.skills = patch.skills;
    if (patch.effectiveFrom) job.effectiveFrom = patch.effectiveFrom;
    if (patch.expiresAt) job.expiresAt = patch.expiresAt;
    if (patch.priority !== undefined) job.priority = patch.priority;
    if (patch.status) {
      job.status = patch.status;
      if (patch.status === 'published' && !job.publishedAt) {
        job.publishedAt = new Date().toISOString();
      }
    }

    const phone = patch.contactPhone?.trim();
    const email = patch.contactEmail?.trim();
    const website = patch.contactWebsite?.trim();
    if (phone !== undefined || email !== undefined || website !== undefined) {
      const nextPhone =
        phone !== undefined ? phone || undefined : job.privateContact?.phone;
      const nextEmail =
        email !== undefined ? email || undefined : job.privateContact?.email;
      const nextWebsite =
        website !== undefined
          ? website || undefined
          : job.privateContact?.website;
      job.privateContact = {
        phone: nextPhone,
        email: nextEmail,
        whatsapp: nextPhone,
        website: nextWebsite,
      };
      job.contact = {
        ...job.contact,
        hasPhone: !!nextPhone,
        hasEmail: !!nextEmail,
        hasWhatsapp: !!nextPhone,
        hasWebsite: !!nextWebsite,
      };
    }

    return job;
  }

  async softRemoveOwned(
    id: string,
    ownerUserId: string,
  ): Promise<JobRecord | undefined> {
    return this.updateOwned(id, ownerUserId, { status: 'removed' });
  }

  async report(id: string, reason: string): Promise<JobRecord | undefined> {
    const job = await this.findById(id);
    if (!job) return undefined;
    job.reportCount = (job.reportCount ?? 0) + 1;
    job.moderationNote = reason.slice(0, 500);
    if (job.reportCount >= 3 && job.status === 'published') {
      job.status = 'needs-review';
    }
    return job;
  }

  private sortJobs(
    jobs: JobRecord[],
    sort: NonNullable<JobSearchQuery['sort']>,
    hasKeyword: boolean,
  ): JobRecord[] {
    const list = [...jobs];
    const byPriority = (a: JobRecord, b: JobRecord) =>
      (b.priority ?? 0) - (a.priority ?? 0);
    const effective = sort === 'relevance' && !hasKeyword ? 'newest' : sort;
    switch (effective) {
      case 'oldest':
        return list.sort(
          (a, b) =>
            byPriority(a, b) ||
            a.publishedAt.localeCompare(b.publishedAt) ||
            a.id.localeCompare(b.id),
        );
      case 'salary-desc':
        return list.sort(
          (a, b) =>
            byPriority(a, b) ||
            this.salaryValue(b) - this.salaryValue(a) ||
            a.id.localeCompare(b.id),
        );
      case 'salary-asc':
        return list.sort(
          (a, b) =>
            byPriority(a, b) ||
            this.salaryValue(a) - this.salaryValue(b) ||
            a.id.localeCompare(b.id),
        );
      case 'relevance':
        return list.sort(
          (a, b) => byPriority(a, b) || a.id.localeCompare(b.id),
        );
      case 'newest':
      default:
        return list.sort(
          (a, b) =>
            byPriority(a, b) ||
            b.publishedAt.localeCompare(a.publishedAt) ||
            a.id.localeCompare(b.id),
        );
    }
  }

  private salaryValue(job: JobRecord): number {
    return job.salary?.max ?? job.salary?.min ?? -1;
  }

  private parseSalary(text?: string): JobRecord['salary'] | undefined {
    if (!text?.trim()) return undefined;
    const numbers = [...text.matchAll(/\d[\d,]*/g)].map((m) =>
      Number(m[0].replace(/,/g, '')),
    );
    if (!numbers.length) {
      return {
        currency: 'INR',
        period: 'monthly',
        negotiable: /negotiable/i.test(text),
      };
    }
    return {
      min: numbers[0],
      max: numbers[1] ?? numbers[0],
      currency: 'INR',
      period: /day|daily/i.test(text) ? 'daily' : 'monthly',
      negotiable: /negotiable/i.test(text),
    };
  }

  private detectCity(text: string): string | undefined {
    const cities = ['Palani', 'Madurai', 'Coimbatore', 'Dindigul', 'Chennai'];
    return cities.find((city) => new RegExp(city, 'i').test(text));
  }

  private detectSalaryText(text: string): string | undefined {
    return text.match(
      /₹?\s?\d[\d,]*(?:\s?[-–to]+\s?₹?\s?\d[\d,]*)?(?:\s?(?:per\s)?(?:month|day|daily))?/i,
    )?.[0];
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40);
  }
}
