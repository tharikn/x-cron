import { JobRecord } from './job.types';

/** Public DTO — never includes privateContact (PRD AC-13). */
export function toPublicJob(
  job: JobRecord,
  boost?: { badge: string; endsAt: string } | null,
  /** Global SiteConfig commerce price; falls back to per-job seed. */
  unlockPricePaise?: number,
) {
  const pricePaise = unlockPricePaise ?? job.contact.unlockPricePaise;
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
    effectiveFrom: job.effectiveFrom,
    expiresAt: job.expiresAt,
    priority: job.priority,
    status: job.status,
    promoted: !!boost,
    promotionBadge: boost?.badge ?? null,
    promotionEndsAt: boost?.endsAt ?? null,
    contact: {
      hasPhone: job.contact.hasPhone,
      hasEmail: job.contact.hasEmail,
      hasWhatsapp: job.contact.hasWhatsapp,
      hasWebsite: job.contact.hasWebsite,
      unlockPricePaise: pricePaise,
      masked: true,
      unlockLabel: `Unlock employer contact – ₹${(pricePaise / 100).toFixed(0)}`,
    },
  };
}

export type PublicJobDto = ReturnType<typeof toPublicJob>;
