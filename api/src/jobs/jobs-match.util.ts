import { JobRecord } from './job.types';

/** Optional seeker / query context for ranking + truthful match reasons. */
export interface JobMatchContext {
  keyword?: string;
  /** Skills to score overlap against (profile and/or filter). */
  skills?: string[];
  preferredLocations?: string[];
  remotePreferred?: boolean;
}

const FRESHNESS_CAP = 8;
const PRIORITY_CAP = 6;
const VERIFIED_BUMP = 3;
const MAX_REASONS = 3;

function normalizeSkills(skills: string[] | undefined): string[] {
  return (skills ?? [])
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function skillOverlap(
  job: JobRecord,
  wanted: string[],
): { matched: string[]; total: number } {
  const want = normalizeSkills(wanted);
  if (!want.length) return { matched: [], total: 0 };
  const jobSkills = normalizeSkills(job.skills);
  const hay = `${job.title} ${job.category} ${job.description.about}`.toLowerCase();
  const matched: string[] = [];
  for (const skill of want) {
    if (
      jobSkills.some((s) => s.includes(skill) || skill.includes(s)) ||
      hay.includes(skill)
    ) {
      matched.push(skill);
    }
  }
  return { matched, total: want.length };
}

export function locationFits(
  job: JobRecord,
  preferredLocations: string[] | undefined,
): boolean {
  const locs = (preferredLocations ?? [])
    .map((l) => l.trim().toLowerCase())
    .filter(Boolean);
  if (!locs.length) return false;
  const hay = [
    job.location.city,
    job.location.district,
    job.location.state,
    job.location.locality ?? '',
  ]
    .join(' ')
    .toLowerCase();
  return locs.some((loc) => hay.includes(loc));
}

/**
 * Deterministic weighted score for relevance / feed ranking.
 * Freshness and priority are capped so they cannot overwhelm skill/title fit.
 */
export function scoreJob(job: JobRecord, ctx: JobMatchContext = {}): number {
  const keyword = ctx.keyword?.trim().toLowerCase() ?? '';
  let score = 0;

  if (keyword) {
    const title = job.title.toLowerCase();
    const employer = job.employerName.toLowerCase();
    const category = job.category.toLowerCase();
    const about = job.description.about.toLowerCase();
    const skills = (job.skills ?? []).join(' ').toLowerCase();
    if (title === keyword) score += 50;
    else if (title.includes(keyword)) score += 30;
    if (skills.includes(keyword)) score += 18;
    if (employer.includes(keyword)) score += 12;
    if (category.includes(keyword)) score += 10;
    if (about.includes(keyword)) score += 4;
  }

  const { matched, total } = skillOverlap(job, ctx.skills ?? []);
  if (total > 0) {
    score += matched.length * 22;
  }

  if (ctx.remotePreferred && job.location.remote) {
    score += 10;
  }
  if (locationFits(job, ctx.preferredLocations)) {
    score += 12;
  }

  const ageHours =
    (Date.now() - new Date(job.publishedAt).getTime()) / (1000 * 60 * 60);
  score += Math.min(FRESHNESS_CAP, Math.max(0, FRESHNESS_CAP - ageHours / 24));

  if (job.verifiedEmployer) score += VERIFIED_BUMP;
  score += Math.min(PRIORITY_CAP, Math.max(0, (job.priority ?? 0) * 2));

  return score;
}

/** Truthful reason chips — never a match percentage. */
export function buildMatchReasons(
  job: JobRecord,
  ctx: JobMatchContext = {},
): string[] {
  const reasons: string[] = [];
  const { matched, total } = skillOverlap(job, ctx.skills ?? []);
  if (total > 0 && matched.length > 0) {
    reasons.push(
      `Matches ${matched.length} of your ${total} selected skill${total === 1 ? '' : 's'}.`,
    );
  }
  if (ctx.remotePreferred && job.location.remote) {
    reasons.push('Remote work matches your preference.');
  }
  if (locationFits(job, ctx.preferredLocations)) {
    reasons.push('Near your preferred locations.');
  }
  const keyword = ctx.keyword?.trim().toLowerCase() ?? '';
  if (keyword && job.title.toLowerCase().includes(keyword)) {
    reasons.push('Title matches your search.');
  }
  if (job.verifiedEmployer) {
    reasons.push('Verified employer.');
  }
  return reasons.slice(0, MAX_REASONS);
}

export function isFresherFriendly(job: JobRecord): boolean {
  const label = (job.experienceLabel ?? '').toLowerCase();
  if (label) {
    if (
      /\bfresher\b/.test(label) ||
      /\bentry[\s-]?level\b/.test(label) ||
      /\b0\s*[-–]?\s*1\b/.test(label) ||
      /\b0\s*(yr|year)/.test(label) ||
      /\bno experience\b/.test(label) ||
      /\bintern/.test(label)
    ) {
      return true;
    }
    // Explicit senior / years requirement → not fresher
    if (
      /\b(senior|lead|principal|5\+|3\s*[-–]\s*5|experienced)\b/.test(label)
    ) {
      return false;
    }
  }
  return job.jobType === 'internship' || job.jobType === 'apprenticeship';
}

export function hasEasyApplyContact(job: JobRecord): boolean {
  const c = job.contact;
  return !!(c.hasPhone || c.hasEmail || c.hasWhatsapp || c.hasWebsite);
}
