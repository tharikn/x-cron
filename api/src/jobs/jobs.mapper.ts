import { JobRecord } from './job.types';

/** Public DTO — never includes privateContact (PRD AC-13). */
export function toPublicJob(
  job: JobRecord,
  boost?: { badge: string; endsAt: string } | null,
) {
  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    employerName: job.employerName,
    verifiedEmployer: job.verifiedEmployer,
    location: job.location,
    jobType: job.jobType,
    salary: job.salary,
    contentLanguage: job.contentLanguage,
    description: job.description,
    experienceLabel: job.experienceLabel,
    vacancies: job.vacancies,
    workSchedule: job.workSchedule,
    skills: job.skills,
    category: job.category,
    publishedAt: job.publishedAt,
    expiresAt: job.expiresAt,
    status: job.status,
    promoted: !!boost,
    promotionBadge: boost?.badge ?? null,
    promotionEndsAt: boost?.endsAt ?? null,
    contact: {
      hasPhone: job.contact.hasPhone,
      hasEmail: job.contact.hasEmail,
      hasWhatsapp: job.contact.hasWhatsapp,
      unlockPricePaise: job.contact.unlockPricePaise,
      masked: true,
      unlockLabel: `Unlock employer contact – ₹${(job.contact.unlockPricePaise / 100).toFixed(0)}`,
    },
  };
}

export type PublicJobDto = ReturnType<typeof toPublicJob>;
