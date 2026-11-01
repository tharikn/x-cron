import {
  Job as PrismaJob,
  JobContactSecret,
  JobStatus as PrismaJobStatus,
  JobType as PrismaJobType,
  PayPeriod as PrismaPayPeriod,
  Employer,
} from '@prisma/client';
import { JobRecord, JobStatus, JobType } from './job.types';

type JobRow = PrismaJob & {
  employer?: Employer | null;
  contactSecret?: JobContactSecret | null;
};

export function toPrismaJobStatus(status: JobStatus): PrismaJobStatus {
  switch (status) {
    case 'published':
      return 'PUBLISHED';
    case 'draft':
      return 'DRAFT';
    case 'expired':
      return 'EXPIRED';
    case 'needs-review':
      return 'NEEDS_REVIEW';
    case 'rejected':
      return 'REJECTED';
    case 'removed':
      return 'REMOVED';
    default:
      return 'DRAFT';
  }
}

export function fromPrismaJobStatus(status: PrismaJobStatus): JobStatus {
  switch (status) {
    case 'PUBLISHED':
      return 'published';
    case 'DRAFT':
      return 'draft';
    case 'EXPIRED':
      return 'expired';
    case 'NEEDS_REVIEW':
      return 'needs-review';
    case 'REJECTED':
      return 'rejected';
    case 'REMOVED':
      return 'removed';
    default:
      return 'draft';
  }
}

export function toPrismaJobType(jobType: JobType): PrismaJobType {
  switch (jobType) {
    case 'full-time':
      return 'FULL_TIME';
    case 'part-time':
      return 'PART_TIME';
    case 'contract':
      return 'CONTRACT';
    case 'temporary':
      return 'TEMPORARY';
    case 'internship':
      return 'INTERNSHIP';
    case 'apprenticeship':
      return 'APPRENTICESHIP';
    case 'daily-wage':
      return 'DAILY_WAGE';
    default:
      return 'FULL_TIME';
  }
}

export function fromPrismaJobType(jobType: PrismaJobType): JobType {
  switch (jobType) {
    case 'FULL_TIME':
      return 'full-time';
    case 'PART_TIME':
      return 'part-time';
    case 'CONTRACT':
      return 'contract';
    case 'TEMPORARY':
      return 'temporary';
    case 'INTERNSHIP':
      return 'internship';
    case 'APPRENTICESHIP':
      return 'apprenticeship';
    case 'DAILY_WAGE':
      return 'daily-wage';
    default:
      return 'full-time';
  }
}

export function toPrismaPayPeriod(
  period?: 'monthly' | 'daily' | 'hourly',
): PrismaPayPeriod | null {
  if (!period) return null;
  switch (period) {
    case 'monthly':
      return 'MONTHLY';
    case 'daily':
      return 'DAILY';
    case 'hourly':
      return 'HOURLY';
    default:
      return 'MONTHLY';
  }
}

export function fromPrismaPayPeriod(
  period: PrismaPayPeriod | null,
): 'monthly' | 'daily' | 'hourly' | undefined {
  if (!period) return undefined;
  switch (period) {
    case 'MONTHLY':
      return 'monthly';
    case 'DAILY':
      return 'daily';
    case 'HOURLY':
      return 'hourly';
    default:
      return 'monthly';
  }
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function parseLinks(raw?: string | null): { whatsapp?: string; website?: string } {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as { whatsapp?: string; website?: string };
    return {
      whatsapp: parsed.whatsapp || undefined,
      website: parsed.website || undefined,
    };
  } catch {
    return {};
  }
}

export function jobRecordFromPrisma(row: JobRow): JobRecord {
  const phone = row.contactSecret?.encryptedPhone || undefined;
  const email = row.contactSecret?.encryptedEmail || undefined;
  const links = parseLinks(row.contactSecret?.encryptedLinks);
  const publishedAt = (row.publishedAt ?? row.createdAt).toISOString();
  const effectiveFrom = (row.effectiveFrom ?? row.publishedAt ?? row.createdAt).toISOString();
  const salaryPeriod = fromPrismaPayPeriod(row.salaryPeriod);
  const salary =
    row.salaryMinPaise != null || row.salaryMaxPaise != null || salaryPeriod
      ? {
          min:
            row.salaryMinPaise != null
              ? Math.round(row.salaryMinPaise / 100)
              : undefined,
          max:
            row.salaryMaxPaise != null
              ? Math.round(row.salaryMaxPaise / 100)
              : undefined,
          currency: 'INR' as const,
          period: salaryPeriod ?? 'monthly',
          negotiable: row.salaryNegotiable || undefined,
        }
      : undefined;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    employerName: row.employer?.name || 'Employer',
    employerId: row.employerId,
    ownerUserId: row.ownerUserId || row.employer?.ownerUserId,
    verifiedEmployer: row.employer?.verificationStatus === 'verified',
    location: {
      country: row.country,
      state: row.state,
      district: row.district,
      city: row.city,
      locality: row.locality || undefined,
      remote: row.remote || undefined,
    },
    jobType: fromPrismaJobType(row.jobType),
    salary,
    contentLanguage: row.contentLanguage,
    description: {
      about: row.about,
      responsibilities: asStringArray(row.responsibilitiesJson),
      requirements: asStringArray(row.requirementsJson),
      benefits: asStringArray(row.benefitsJson),
    },
    experienceLabel: row.experienceLabel || undefined,
    vacancies: row.vacancies ?? undefined,
    workSchedule: row.workSchedule || undefined,
    skills: asStringArray(row.skillsJson),
    category: row.category,
    publishedAt,
    effectiveFrom,
    expiresAt: (row.expiresAt ?? new Date(Date.now() + 30 * 86400000)).toISOString(),
    priority: row.priority ?? 0,
    status: fromPrismaJobStatus(row.status),
    reportCount: row.reportCount ?? 0,
    moderationNote: row.moderationNote || undefined,
    contact: {
      hasPhone: !!phone,
      hasEmail: !!email,
      hasWhatsapp: !!links.whatsapp || !!phone,
      hasWebsite: !!links.website,
      unlockPricePaise: Number(process.env.UNLOCK_PRICE_PAISE ?? 500),
    },
    privateContact: {
      phone,
      email,
      whatsapp: links.whatsapp || phone,
      website: links.website,
    },
  };
}

export function salaryToPaise(salary?: JobRecord['salary']): {
  salaryMinPaise: number | null;
  salaryMaxPaise: number | null;
  salaryPeriod: PrismaPayPeriod | null;
  salaryNegotiable: boolean;
} {
  if (!salary) {
    return {
      salaryMinPaise: null,
      salaryMaxPaise: null,
      salaryPeriod: null,
      salaryNegotiable: false,
    };
  }
  return {
    salaryMinPaise:
      salary.min != null ? Math.round(salary.min * 100) : null,
    salaryMaxPaise:
      salary.max != null ? Math.round(salary.max * 100) : null,
    salaryPeriod: toPrismaPayPeriod(salary.period),
    salaryNegotiable: !!salary.negotiable,
  };
}

export function contactLinksJson(privateContact?: JobRecord['privateContact']): string | null {
  if (!privateContact?.whatsapp && !privateContact?.website) return null;
  return JSON.stringify({
    whatsapp: privateContact.whatsapp || undefined,
    website: privateContact.website || undefined,
  });
}
