import type { JobRecord } from './job.types';
import {
  attachMatchReasons,
  filterJobs,
  matchContextFromQuery,
  paginateHits,
  sortJobHits,
} from './jobs-search.util';

const DAY = 86_400_000;

function job(id: string, overrides: Partial<JobRecord> = {}): JobRecord {
  const publishedAt = new Date(Date.now() - DAY / 2).toISOString();
  return {
    id,
    slug: `slug-${id}`,
    title: 'Store Associate',
    employerName: 'Kovai Retail',
    verifiedEmployer: false,
    location: {
      country: 'IN',
      state: 'Tamil Nadu',
      district: 'Coimbatore',
      city: 'Coimbatore',
    },
    jobType: 'full-time',
    contentLanguage: 'en',
    description: { about: 'Billing and customer support.' },
    skills: ['Billing'],
    category: 'Retail',
    publishedAt,
    effectiveFrom: publishedAt,
    expiresAt: new Date(Date.now() + 30 * DAY).toISOString(),
    priority: 0,
    status: 'published',
    contact: {
      hasPhone: false,
      hasEmail: false,
      hasWhatsapp: false,
      hasWebsite: false,
      unlockPricePaise: 0,
    },
    ...overrides,
  };
}

describe('jobs-search.util', () => {
  describe('filterJobs', () => {
    const jobs = [
      job('a', { title: 'Angular Developer', skills: ['Angular'], category: 'IT' }),
      job('b', {
        location: { country: 'IN', state: 'Tamil Nadu', district: 'Chennai', city: 'Chennai', remote: true },
        jobType: 'part-time',
      }),
      job('c', {
        verifiedEmployer: true,
        contact: { hasPhone: true, hasEmail: false, hasWhatsapp: false, hasWebsite: false, unlockPricePaise: 0 },
        salary: { min: 15000, max: 25000, currency: 'INR', period: 'monthly' },
      }),
      job('d', {
        publishedAt: new Date(Date.now() - 10 * DAY).toISOString(),
        walkInAt: new Date(Date.now() + DAY).toISOString(),
        experienceLabel: 'Fresher',
      }),
    ];

    it('filters by keyword across title/skills/employer', () => {
      expect(filterJobs(jobs, { keyword: 'angular' }).map((j) => j.id)).toEqual(['a']);
    });

    it('filters by location text, job type and remote', () => {
      expect(filterJobs(jobs, { locationText: 'chennai' }).map((j) => j.id)).toEqual(['b']);
      expect(filterJobs(jobs, { jobType: 'part-time' }).map((j) => j.id)).toEqual(['b']);
      expect(filterJobs(jobs, { remote: true }).map((j) => j.id)).toEqual(['b']);
    });

    it('applies verified / easyApply / salaryMin / walk-in / fresher flags', () => {
      expect(filterJobs(jobs, { verifiedEmployer: true }).map((j) => j.id)).toEqual(['c']);
      expect(filterJobs(jobs, { easyApply: true }).map((j) => j.id)).toEqual(['c']);
      expect(filterJobs(jobs, { salaryMin: 20000 }).map((j) => j.id)).toEqual(['c']);
      expect(filterJobs(jobs, { walkInOnly: true }).map((j) => j.id)).toEqual(['d']);
      expect(filterJobs(jobs, { fresher: true }).map((j) => j.id)).toEqual(['d']);
    });

    it('applies postedWithin windows', () => {
      const recent = filterJobs(jobs, { postedWithin: '7d' }).map((j) => j.id);
      expect(recent).not.toContain('d');
      expect(filterJobs(jobs, { postedWithin: '30d' })).toHaveLength(4);
    });

    it('supports comma skills filter and hidden job exclusion', () => {
      expect(filterJobs(jobs, { skills: 'kotlin, angular' }).map((j) => j.id)).toEqual(['a']);
      expect(filterJobs(jobs, { excludeJobIds: ['a', 'b'] }).map((j) => j.id)).toEqual(['c', 'd']);
    });

    it('drops jobs outside the radius and annotates distance', () => {
      const located = [
        job('near', { location: { country: 'IN', state: 'TN', district: 'X', city: 'X', lat: 13.08, lng: 80.27 } }),
        job('far', { location: { country: 'IN', state: 'DL', district: 'Y', city: 'Y', lat: 28.61, lng: 77.2 } }),
      ];
      const hits = filterJobs(located, { nearLat: 13.0827, nearLng: 80.2707, radiusKm: 25 });
      expect(hits.map((h) => h.id)).toEqual(['near']);
      expect(hits[0].distanceKm).toBeLessThan(5);
    });
  });

  describe('sortJobHits', () => {
    it('sorts newest by default with priority first', () => {
      const older = job('older', { publishedAt: new Date(Date.now() - 3 * DAY).toISOString() });
      const newer = job('newer');
      const boosted = job('boosted', { priority: 5, publishedAt: new Date(Date.now() - 9 * DAY).toISOString() });
      expect(sortJobHits([older, newer, boosted], 'newest').map((j) => j.id)).toEqual([
        'boosted',
        'newer',
        'older',
      ]);
    });

    it('falls back from relevance to newest when there is no keyword or skills', () => {
      const out = sortJobHits([job('x')], 'relevance');
      expect(out[0].matchScore).toBeUndefined();
    });

    it('scores relevance hits and attaches match reasons', () => {
      const hits = sortJobHits(
        [job('plain'), job('fit', { title: 'Angular Developer', skills: ['Angular'] })],
        'relevance',
        { keyword: 'angular', skills: ['angular'] },
      );
      expect(hits[0].id).toBe('fit');
      expect(hits[0].matchScore).toBeGreaterThan(hits[1].matchScore ?? 0);
      expect(hits[0].matchReasons?.length).toBeGreaterThan(0);
    });

    it('sorts by salary both directions', () => {
      const low = job('low', { salary: { min: 10000, currency: 'INR', period: 'monthly' } });
      const high = job('high', { salary: { max: 50000, currency: 'INR', period: 'monthly' } });
      expect(sortJobHits([low, high], 'salary-desc').map((j) => j.id)).toEqual(['high', 'low']);
      expect(sortJobHits([high, low], 'salary-asc').map((j) => j.id)).toEqual(['low', 'high']);
    });
  });

  describe('paginateHits', () => {
    const list = ['1', '2', '3', '4', '5'].map((id) => job(id));

    it('pages with a cursor and reports the full total', () => {
      const first = paginateHits(list, undefined, 2);
      expect(first.items.map((j) => j.id)).toEqual(['1', '2']);
      expect(first.nextCursor).toBe('2');
      expect(first.total).toBe(5);

      const second = paginateHits(list, first.nextCursor, 2);
      expect(second.items.map((j) => j.id)).toEqual(['3', '4']);
      const last = paginateHits(list, second.nextCursor, 2);
      expect(last.items.map((j) => j.id)).toEqual(['5']);
      expect(last.nextCursor).toBeUndefined();
    });

    it('clamps limit to 1..50', () => {
      expect(paginateHits(list, undefined, 0).items).toHaveLength(1);
      expect(paginateHits(list, undefined, 500).items).toHaveLength(5);
    });
  });

  describe('matchContextFromQuery / attachMatchReasons', () => {
    it('merges seeker skills with filter skills and remote flag', () => {
      const ctx = matchContextFromQuery({
        keyword: 'dev',
        seekerSkills: ['angular'],
        skills: 'rxjs,typescript',
        remote: true,
      });
      expect(ctx.skills).toEqual(['angular', 'rxjs', 'typescript']);
      expect(ctx.remotePreferred).toBe(true);
    });

    it('keeps existing reasons and adds new ones only when truthful', () => {
      const withReasons = { ...job('r'), matchReasons: ['Already set.'] };
      const verified = job('v', { verifiedEmployer: true });
      const out = attachMatchReasons([withReasons, verified, job('none')], {});
      expect(out[0].matchReasons).toEqual(['Already set.']);
      expect(out[1].matchReasons).toEqual(['Verified employer.']);
      expect(out[2].matchReasons).toBeUndefined();
    });
  });
});
