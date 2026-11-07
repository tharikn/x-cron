import type { Job } from '../models/job.model';
import {
  formatJobType,
  formatLocation,
  formatSalary,
  formatUnlockPrice,
  languageLabel,
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

describe('formatJobType / formatUnlockPrice / languageLabel', () => {
  it('uses the shared job-type labels', () => {
    expect(formatJobType(job({ jobType: 'full-time' }))).toBe('Full-time');
    expect(formatJobType(job({ jobType: 'daily-wage' }))).toBe('Daily wage');
  });

  it('converts paise to whole rupees', () => {
    expect(formatUnlockPrice(4900)).toBe('₹49');
  });

  it('labels supported content languages and defaults to English', () => {
    expect(languageLabel('ta')).toBe('Tamil');
    expect(languageLabel('hi')).toBe('Hindi');
    expect(languageLabel('en')).toBe('English');
    expect(languageLabel('xx')).toBe('English');
  });
});
