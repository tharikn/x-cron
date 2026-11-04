import { JobRecord } from './job.types';

/** Public DTO — includes employer contact for seekers (no unlock gate). */
export function toPublicJob(
  job: JobRecord,
  boost?: { badge: string; endsAt: string } | null,
  /** Global SiteConfig commerce price; kept for admin commerce UI compatibility. */
  unlockPricePaise?: number,
) {
  const pricePaise = unlockPricePaise ?? job.contact.unlockPricePaise;
  const privateContact = job.privateContact;
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
    employerId: job.employerId ?? null,
    publishedAt: job.publishedAt,
    effectiveFrom: job.effectiveFrom,
    expiresAt: job.expiresAt,
    priority: job.priority,
    status: job.status,
    walkInAt: job.walkInAt ?? null,
    applyBy: job.applyBy ?? null,
    screeningQuestion: job.screeningQuestion ?? null,
    promoted: !!boost,
    promotionBadge: boost?.badge ?? null,
    promotionEndsAt: boost?.endsAt ?? null,
    contact: {
      hasPhone: job.contact.hasPhone,
      hasEmail: job.contact.hasEmail,
      hasWhatsapp: job.contact.hasWhatsapp,
      hasWebsite: job.contact.hasWebsite,
      phone: privateContact?.phone ?? null,
      email: privateContact?.email ?? null,
      whatsapp: privateContact?.whatsapp ?? null,
      website: privateContact?.website ?? null,
      unlockPricePaise: pricePaise,
    },
  };
}

export type PublicJobDto = ReturnType<typeof toPublicJob>;
