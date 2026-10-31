import { Injectable, computed, signal } from '@angular/core';
import { MOCK_JOBS } from '../data/mock-jobs';
import type { Job, JobSearchQuery, JobType } from '../models/job.model';

const SEARCH_COUNT_KEY = 'xcron.searchCount';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private readonly jobs = signal<Job[]>([...MOCK_JOBS]);
  private readonly drafts = signal<Job[]>([]);
  readonly searchCount = signal(this.readSearchCount());

  readonly publishedJobs = computed(() =>
    this.jobs().filter((job) => job.status === 'published'),
  );

  search(query: JobSearchQuery): Job[] {
    const keyword = query.keyword?.trim().toLowerCase() ?? '';
    const locationText = query.locationText?.trim().toLowerCase() ?? '';

    let results = this.publishedJobs().filter((job) => {
      const haystack = [
        job.title,
        job.employerName,
        job.category,
        job.description.about,
        job.skills?.join(' ') ?? '',
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

      const matchesKeyword = !keyword || haystack.includes(keyword);
      const matchesLocation = !locationText || locationHaystack.includes(locationText);
      const matchesType = !query.jobType || job.jobType === query.jobType;
      const matchesCategory = !query.category || job.category === query.category;
      const matchesLanguage = !query.language || job.contentLanguage === query.language;
      const matchesSalary =
        query.salaryMin == null ||
        (job.salary?.max ?? job.salary?.min ?? 0) >= query.salaryMin;

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesType &&
        matchesCategory &&
        matchesLanguage &&
        matchesSalary
      );
    });

    results = this.sortJobs(results, query.sort, !!keyword);

    if (keyword || locationText || query.jobType || query.category || query.language) {
      this.bumpSearchCount();
    }

    return results;
  }

  getById(id: string): Job | undefined {
    return this.jobs().find((job) => job.id === id) ?? this.drafts().find((job) => job.id === id);
  }

  getBySlug(slug: string): Job | undefined {
    return this.publishedJobs().find((job) => job.slug === slug);
  }

  related(job: Job, limit = 3): Job[] {
    return this.publishedJobs()
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
    return [...new Set(this.publishedJobs().map((job) => job.category))].sort();
  }

  createDraftFromQuickPost(input: {
    title: string;
    employerName: string;
    locationCity: string;
    jobType: JobType;
    salaryText?: string;
    description: string;
    contentLanguage: string;
    contactPhone?: string;
  }): Job {
    const id = `draft_${Date.now()}`;
    const city = input.locationCity.trim() || 'Palani';
    const salary = this.parseSalary(input.salaryText);
    const draft: Job = {
      id,
      slug: `draft/${city.toLowerCase().replace(/\s+/g, '-')}/${id}`,
      title: input.title.trim() || 'Untitled role',
      employerName: input.employerName.trim() || 'Employer',
      verifiedEmployer: false,
      location: {
        country: 'India',
        state: 'Tamil Nadu',
        district: city,
        city,
      },
      jobType: input.jobType,
      salary,
      contentLanguage: input.contentLanguage || 'en',
      description: {
        about: input.description.trim() || 'Not provided',
      },
      category: 'General',
      publishedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      contact: {
        hasPhone: !!input.contactPhone?.trim(),
        hasEmail: false,
        hasWhatsapp: !!input.contactPhone?.trim(),
        unlockPricePaise: 500,
      },
    };

    this.drafts.update((items) => [draft, ...items]);
    return draft;
  }

  createDraftFromPaste(rawText: string, contentLanguage: string): Job {
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

    return this.createDraftFromQuickPost({
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

  publishDraft(id: string): Job | undefined {
    const draft = this.drafts().find((job) => job.id === id);
    if (!draft) {
      return undefined;
    }

    const published: Job = {
      ...draft,
      id: `job_${Date.now()}`,
      status: 'needs-review',
      slug: `tamil-nadu/${draft.location.city.toLowerCase()}/${this.slugify(draft.title)}-${Date.now()}`,
      publishedAt: new Date().toISOString(),
    };

    this.drafts.update((items) => items.filter((job) => job.id !== id));
    this.jobs.update((items) => [{ ...published, status: 'published' }, ...items]);
    return { ...published, status: 'published' };
  }

  private sortJobs(jobs: Job[], sort: JobSearchQuery['sort'], hasKeyword: boolean): Job[] {
    const list = [...jobs];
    const effective = sort === 'relevance' && !hasKeyword ? 'newest' : sort;

    switch (effective) {
      case 'oldest':
        return list.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt) || a.id.localeCompare(b.id));
      case 'salary-desc':
        return list.sort((a, b) => this.salaryValue(b) - this.salaryValue(a) || a.id.localeCompare(b.id));
      case 'salary-asc':
        return list.sort((a, b) => this.salaryValue(a) - this.salaryValue(b) || a.id.localeCompare(b.id));
      case 'relevance':
        return list;
      case 'newest':
      default:
        return list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id));
    }
  }

  private salaryValue(job: Job): number {
    return job.salary?.max ?? job.salary?.min ?? -1;
  }

  private bumpSearchCount(): void {
    const next = this.searchCount() + 1;
    this.searchCount.set(next);
    localStorage.setItem(SEARCH_COUNT_KEY, String(next));
  }

  private readSearchCount(): number {
    const raw = localStorage.getItem(SEARCH_COUNT_KEY);
    return raw ? Number(raw) || 0 : 0;
  }

  private parseSalary(text?: string): Job['salary'] | undefined {
    if (!text?.trim()) {
      return undefined;
    }
    const numbers = [...text.matchAll(/\d[\d,]*/g)].map((match) => Number(match[0].replace(/,/g, '')));
    if (!numbers.length) {
      return { currency: 'INR', period: 'monthly', negotiable: /negotiable/i.test(text) };
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
    const match = text.match(/₹?\s?\d[\d,]*(?:\s?[-–to]+\s?₹?\s?\d[\d,]*)?(?:\s?(?:per\s)?(?:month|day|daily))?/i);
    return match?.[0];
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40);
  }
}
