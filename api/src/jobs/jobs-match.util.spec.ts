import type { JobRecord } from './job.types';
import {
  buildMatchReasons,
  hasEasyApplyContact,
  isFresherFriendly,
  locationFits,
  scoreJob,
  skillOverlap,
} from './jobs-match.util';

function job(overrides: Partial<JobRecord> = {}): JobRecord {
  const now = new Date().toISOString();
  return {
    id: 'job_1',
    slug: 'angular-developer-chennai',
    title: 'Angular Developer',
    employerName: 'Acme Labs',
    verifiedEmployer: false,
    location: {
      country: 'IN',
      state: 'Tamil Nadu',
      district: 'Chennai',
      city: 'Chennai',
    },
    jobType: 'full-time',
    contentLanguage: 'en',
    description: { about: 'Build dashboards with RxJS and TypeScript.' },
    skills: ['Angular', 'TypeScript'],
    category: 'IT',
    publishedAt: now,
    effectiveFrom: now,
    expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
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

describe('jobs-match.util', () => {
  describe('skillOverlap', () => {
    it('matches job skills and description text case-insensitively', () => {
      const result = skillOverlap(job(), ['angular', 'RXJS', 'Kotlin']);
      expect(result).toEqual({ matched: ['angular', 'rxjs'], total: 3 });
    });

    it('returns zero total when no skills are wanted', () => {
      expect(skillOverlap(job(), [' ', ''])).toEqual({ matched: [], total: 0 });
    });
  });

  describe('locationFits', () => {
    it('matches any preferred location against city/district/state', () => {
      expect(locationFits(job(), ['tamil nadu'])).toBe(true);
      expect(locationFits(job(), ['Mumbai'])).toBe(false);
    });

    it('is false with no preferences', () => {
      expect(locationFits(job(), undefined)).toBe(false);
    });
  });

  describe('scoreJob', () => {
    it('ranks exact title matches above partial title matches', () => {
      const exact = scoreJob(job(), { keyword: 'angular developer' });
      const partial = scoreJob(job(), { keyword: 'angular' });
      expect(exact).toBeGreaterThan(partial);
    });

    it('caps freshness + priority so skill fit dominates', () => {
      const boosted = job({ priority: 100, verifiedEmployer: true });
      const plain = job({ skills: ['Angular', 'TypeScript', 'RxJS'] });
      const ctx = { skills: ['angular', 'typescript', 'rxjs'] };
      expect(scoreJob(plain, ctx)).toBeGreaterThan(scoreJob(boosted, {}));
    });

    it('adds remote and location preference bonuses', () => {
      const remote = job({
        location: { ...job().location, remote: true },
      });
      const base = scoreJob(remote, {});
      const withPrefs = scoreJob(remote, {
        remotePreferred: true,
        preferredLocations: ['Chennai'],
      });
      expect(withPrefs - base).toBeCloseTo(22, 5);
    });
  });

  describe('buildMatchReasons', () => {
    it('returns truthful reasons and never a percentage', () => {
      const reasons = buildMatchReasons(job({ verifiedEmployer: true }), {
        skills: ['angular'],
        keyword: 'angular',
      });
      expect(reasons).toEqual([
        'Matches 1 of your 1 selected skill.',
        'Title matches your search.',
        'Verified employer.',
      ]);
      expect(reasons.join(' ')).not.toMatch(/%/);
    });

    it('caps reasons at three', () => {
      const remote = job({
        verifiedEmployer: true,
        location: { ...job().location, remote: true },
      });
      const reasons = buildMatchReasons(remote, {
        skills: ['angular', 'typescript'],
        remotePreferred: true,
        preferredLocations: ['chennai'],
        keyword: 'angular',
      });
      expect(reasons).toHaveLength(3);
      expect(reasons[0]).toBe('Matches 2 of your 2 selected skills.');
    });
  });

  describe('isFresherFriendly', () => {
    it.each([
      ['Fresher', true],
      ['Entry-level', true],
      ['0-1 years', true],
      ['No experience needed', true],
      ['Internship', true],
      ['Senior engineer', false],
      ['3-5 years', false],
    ])('label %s → %s', (label, expected) => {
      expect(isFresherFriendly(job({ experienceLabel: label }))).toBe(expected);
    });

    it('falls back to internship / apprenticeship job types', () => {
      expect(isFresherFriendly(job({ jobType: 'internship' }))).toBe(true);
      expect(isFresherFriendly(job({ jobType: 'full-time' }))).toBe(false);
    });
  });

  describe('hasEasyApplyContact', () => {
    it('requires at least one public contact path', () => {
      expect(hasEasyApplyContact(job())).toBe(false);
      expect(
        hasEasyApplyContact(
          job({ contact: { ...job().contact, hasWebsite: true } }),
        ),
      ).toBe(true);
    });
  });
});
