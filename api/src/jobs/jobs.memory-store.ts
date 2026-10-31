import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CreateJobInput,
  JobRecord,
  JobSearchQuery,
  JobType,
} from './job.types';
import { SEED_JOBS } from './seed-jobs';

@Injectable()
export class JobsMemoryStore implements OnModuleInit {
  private jobs: JobRecord[] = [];

  onModuleInit() {
    this.jobs = SEED_JOBS.map((job) => structuredClone(job));
  }

  listPublished(): JobRecord[] {
    return this.jobs.filter((job) => job.status === 'published');
  }

  findById(id: string): JobRecord | undefined {
    return this.jobs.find((job) => job.id === id);
  }

  findBySlug(slug: string): JobRecord | undefined {
    return this.jobs.find((job) => job.slug === slug);
  }

  search(query: JobSearchQuery): { items: JobRecord[]; nextCursor?: string } {
    const keyword = query.keyword?.trim().toLowerCase() ?? '';
    const locationText = query.locationText?.trim().toLowerCase() ?? '';
    const limit = Math.min(Math.max(query.limit ?? 20, 1), 50);

    let results = this.listPublished().filter((job) => {
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

  related(job: JobRecord, limit = 3): JobRecord[] {
    return this.listPublished()
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

  categories(): string[] {
    return [...new Set(this.listPublished().map((job) => job.category))].sort();
  }

  createAndPublish(input: CreateJobInput): JobRecord {
    const id = `job_${randomUUID().slice(0, 8)}`;
    const city = input.locationCity.trim() || 'Palani';
    const state = input.locationState?.trim() || 'Tamil Nadu';
    const district = input.locationDistrict?.trim() || city;
    const title = input.title.trim() || 'Untitled role';
    const salary = this.parseSalary(input.salaryText);
    const phone = input.contactPhone?.trim();
    const email = input.contactEmail?.trim();

    const job: JobRecord = {
      id,
      slug: `tamil-nadu/${this.slugify(city)}/${this.slugify(title)}-${id}`,
      title,
      employerName: input.employerName.trim() || 'Employer',
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
      publishedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'published',
      contact: {
        hasPhone: !!phone,
        hasEmail: !!email,
        hasWhatsapp: !!phone,
        unlockPricePaise: Number(process.env.UNLOCK_PRICE_PAISE ?? 500),
      },
      privateContact: {
        phone,
        email,
        whatsapp: phone,
      },
    };

    this.jobs.unshift(job);
    return job;
  }

  createFromPaste(rawText: string, contentLanguage: string): JobRecord {
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
      employerName: 'From pasted message',
      locationCity: this.detectCity(joined) ?? 'Palani',
      jobType: 'full-time',
      salaryText: this.detectSalaryText(joined),
      description: rawText.trim(),
      contentLanguage,
      contactPhone: phoneMatch?.[0],
    });
  }

  private sortJobs(
    jobs: JobRecord[],
    sort: NonNullable<JobSearchQuery['sort']>,
    hasKeyword: boolean,
  ): JobRecord[] {
    const list = [...jobs];
    const effective = sort === 'relevance' && !hasKeyword ? 'newest' : sort;
    switch (effective) {
      case 'oldest':
        return list.sort(
          (a, b) =>
            a.publishedAt.localeCompare(b.publishedAt) ||
            a.id.localeCompare(b.id),
        );
      case 'salary-desc':
        return list.sort(
          (a, b) =>
            this.salaryValue(b) - this.salaryValue(a) ||
            a.id.localeCompare(b.id),
        );
      case 'salary-asc':
        return list.sort(
          (a, b) =>
            this.salaryValue(a) - this.salaryValue(b) ||
            a.id.localeCompare(b.id),
        );
      case 'relevance':
        return list;
      case 'newest':
      default:
        return list.sort(
          (a, b) =>
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
