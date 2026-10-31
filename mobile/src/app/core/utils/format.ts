import type { Job, JobSalary } from '../models/job.model';
import { JOB_TYPE_LABELS } from '../models/job.model';

export function formatLocation(job: Job): string {
  const parts = [job.location.locality, job.location.city, job.location.district].filter(Boolean);
  const base = parts.join(', ');
  return job.location.remote ? `${base} · Remote` : base;
}

export function formatSalary(salary?: JobSalary): string {
  if (!salary) {
    return 'Salary not provided';
  }
  if (salary.min == null && salary.max == null) {
    return salary.negotiable ? 'Negotiable' : 'Salary not provided';
  }
  const min = salary.min != null ? `₹${salary.min.toLocaleString('en-IN')}` : '';
  const max = salary.max != null ? `₹${salary.max.toLocaleString('en-IN')}` : '';
  const range = min && max && min !== max ? `${min}–${max}` : min || max;
  const period =
    salary.period === 'daily' ? ' / day' : salary.period === 'hourly' ? ' / hour' : ' / month';
  return `${range}${period}${salary.negotiable ? ' · negotiable' : ''}`;
}

export function formatJobType(job: Job): string {
  return JOB_TYPE_LABELS[job.jobType];
}

export function formatPostedDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatUnlockPrice(paise: number): string {
  return `₹${(paise / 100).toFixed(0)}`;
}

export function languageLabel(code: string): string {
  switch (code) {
    case 'ta':
      return 'Tamil';
    case 'hi':
      return 'Hindi';
    case 'en':
    default:
      return 'English';
  }
}
