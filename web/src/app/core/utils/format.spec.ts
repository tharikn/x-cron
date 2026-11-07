import type { Job } from '../models/job.model';
import {
  formatJobType,
  formatLocation,
  formatSalary,
  formatUnlockPrice,
  jobPath,
} from './format';

function job(partial: Record<string, unknown>): Job {
  return partial as unknown as Job;
}

describe('formatLocation', () => {
  it('joins locality, city and district, skipping blanks', () => {
    expect(
      formatLocation(
        job({ location: { locality: 'T Nagar', city: 'Chennai', district: '', remote: false } }),
      ),
    ).toBe('T Nagar, Chennai');
  });

  it('marks remote roles', () => {
    expect(formatLocation(job({ location: { city: 'Pune', remote: true } }))).toBe(
      'Pune · Remote',
    );
  });
});

describe('formatSalary', () => {
  it('handles missing and negotiable-only salary', () => {
    expect(formatSalary(undefined)).toBe('Salary not provided');
    expect(formatSalary({ negotiable: true } as never)).toBe('Negotiable');
    expect(formatSalary({} as never)).toBe('Salary not provided');
  });

  it('formats an INR range with Indian grouping and period', () => {
    expect(formatSalary({ min: 12000, max: 150000, period: 'monthly' } as never)).toBe(
      '₹12,000–₹1,50,000 / month',
    );
  });

  it('collapses equal min/max and labels daily / hourly / negotiable', () => {
    expect(formatSalary({ min: 800, max: 800, period: 'daily' } as never)).toBe('₹800 / day');
    expect(formatSalary({ max: 250, period: 'hourly', negotiable: true } as never)).toBe(
      '₹250 / hour · negotiable',
    );
  });
});

describe('formatJobType / jobPath / formatUnlockPrice', () => {
  it('title-cases hyphenated job types', () => {
    expect(formatJobType('full-time')).toBe('Full Time');
    expect(formatJobType('walk-in')).toBe('Walk In');
  });

  it('builds the SEO slug path', () => {
    expect(jobPath(job({ slug: 'delivery-executive-chennai-abc' }))).toBe(
      '/jobs/delivery-executive-chennai-abc',
    );
  });

  it('converts paise to whole rupees', () => {
    expect(formatUnlockPrice(100)).toBe('₹1');
    expect(formatUnlockPrice(4900)).toBe('₹49');
  });
});
