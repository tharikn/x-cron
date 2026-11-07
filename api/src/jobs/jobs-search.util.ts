import { haversineKm, resolveCoords } from './geo';
import {
  buildMatchReasons,
  hasEasyApplyContact,
  isFresherFriendly,
  scoreJob,
  type JobMatchContext,
} from './jobs-match.util';
import { JobRecord, JobSearchQuery } from './job.types';

export type JobSearchHit = JobRecord & {
  distanceKm?: number;
  matchScore?: number;
  matchReasons?: string[];
};

function postedWithinMs(window: JobSearchQuery['postedWithin']): number | null {
  if (window === '1d') return 24 * 60 * 60 * 1000;
  if (window === '7d') return 7 * 24 * 60 * 60 * 1000;
  if (window === '30d') return 30 * 24 * 60 * 60 * 1000;
  return null;
}

function parseSkillsFilter(raw: string | string[] | undefined): string[] {
  if (!raw) return [];
  const parts = Array.isArray(raw) ? raw : raw.split(',');
  return parts.map((s) => s.trim().toLowerCase()).filter(Boolean);
}

function jobSkillOverlap(job: JobRecord, wanted: string[]): boolean {
  if (!wanted.length) return true;
  const jobSkills = (job.skills ?? []).map((s) => s.toLowerCase());
  const hay = `${job.title} ${job.category} ${job.description.about}`.toLowerCase();
  return wanted.some(
    (skill) =>
      jobSkills.some((s) => s.includes(skill) || skill.includes(s)) ||
      hay.includes(skill),
  );
}

export function filterJobs(
  published: JobRecord[],
  query: JobSearchQuery,
): JobSearchHit[] {
  const keyword = query.keyword?.trim().toLowerCase() ?? '';
  const locationText = query.locationText?.trim().toLowerCase() ?? '';
  const exclude = new Set(query.excludeJobIds ?? []);
  const withinMs = postedWithinMs(query.postedWithin ?? null);
  const now = Date.now();
  const origin =
    query.nearLat != null && query.nearLng != null
      ? { lat: query.nearLat, lng: query.nearLng }
      : null;
  const radiusKm = query.radiusKm ?? null;
  const skillsFilter = parseSkillsFilter(query.skills);

  const hits: JobSearchHit[] = [];
  for (const job of published) {
    if (exclude.has(job.id)) continue;

    const haystack = [
      job.title,
      job.employerName,
      job.category,
      job.description.about,
      ...(job.skills ?? []),
    ]
      .join(' ')
      .toLowerCase();
    const locationHaystack = [
      job.location.city,
      job.location.district,
      job.location.state,
      job.location.locality ?? '',
    ]
      .join(' ')
      .toLowerCase();

    if (keyword && !haystack.includes(keyword)) continue;
    if (locationText && !locationHaystack.includes(locationText)) continue;
    if (query.jobType && job.jobType !== query.jobType) continue;
    if (query.category && job.category !== query.category) continue;
    if (query.language && job.contentLanguage !== query.language) continue;
    if (
      query.salaryMin != null &&
      (job.salary?.max ?? job.salary?.min ?? 0) < query.salaryMin
    ) {
      continue;
    }
    if (query.remote && !job.location.remote) continue;
    if (query.walkInOnly && !job.walkInAt) continue;
    if (query.verifiedEmployer && !job.verifiedEmployer) continue;
    if (query.fresher && !isFresherFriendly(job)) continue;
    if (query.easyApply && !hasEasyApplyContact(job)) continue;
    if (!jobSkillOverlap(job, skillsFilter)) continue;
    if (withinMs != null) {
      const publishedAt = new Date(job.publishedAt).getTime();
      if (!Number.isFinite(publishedAt) || now - publishedAt > withinMs) continue;
    }

    let distanceKm: number | undefined;
    if (origin) {
      const coords = resolveCoords({
        lat: job.location.lat,
        lng: job.location.lng,
        city: job.location.city,
      });
      if (!coords) continue;
      distanceKm = haversineKm(origin, coords);
      if (radiusKm != null && distanceKm > radiusKm) continue;
    }

    hits.push(distanceKm != null ? { ...job, distanceKm } : job);
  }
  return hits;
}

function salaryValue(job: JobRecord): number {
  return job.salary?.max ?? job.salary?.min ?? -1;
}

export function sortJobHits(
  jobs: JobSearchHit[],
  sort: NonNullable<JobSearchQuery['sort']>,
  matchCtx: JobMatchContext = {},
): JobSearchHit[] {
  const list = [...jobs];
  const keyword = matchCtx.keyword?.trim().toLowerCase() ?? '';
  const byPriority = (a: JobRecord, b: JobRecord) =>
    (b.priority ?? 0) - (a.priority ?? 0);
  const effective =
    sort === 'relevance' && !keyword && !(matchCtx.skills?.length)
      ? 'newest'
      : sort === 'distance'
        ? 'distance'
        : sort;

  const withScores =
    effective === 'relevance'
      ? list.map((job) => {
          const matchScore = scoreJob(job, matchCtx);
          const matchReasons = buildMatchReasons(job, matchCtx);
          return { ...job, matchScore, matchReasons };
        })
      : list;

  switch (effective) {
    case 'oldest':
      return withScores.sort(
        (a, b) =>
          byPriority(a, b) ||
          a.publishedAt.localeCompare(b.publishedAt) ||
          a.id.localeCompare(b.id),
      );
    case 'salary-desc':
      return withScores.sort(
        (a, b) =>
          byPriority(a, b) ||
          salaryValue(b) - salaryValue(a) ||
          a.id.localeCompare(b.id),
      );
    case 'salary-asc':
      return withScores.sort(
        (a, b) =>
          byPriority(a, b) ||
          salaryValue(a) - salaryValue(b) ||
          a.id.localeCompare(b.id),
      );
    case 'relevance':
      return withScores.sort(
        (a, b) =>
          (b.matchScore ?? 0) - (a.matchScore ?? 0) ||
          byPriority(a, b) ||
          b.publishedAt.localeCompare(a.publishedAt) ||
          a.id.localeCompare(b.id),
      );
    case 'distance':
      return withScores.sort(
        (a, b) =>
          (a.distanceKm ?? Number.POSITIVE_INFINITY) -
            (b.distanceKm ?? Number.POSITIVE_INFINITY) ||
          byPriority(a, b) ||
          a.id.localeCompare(b.id),
      );
    case 'newest':
    default:
      return withScores.sort(
        (a, b) =>
          byPriority(a, b) ||
          b.publishedAt.localeCompare(a.publishedAt) ||
          a.id.localeCompare(b.id),
      );
  }
}

export function paginateHits(
  results: JobSearchHit[],
  cursor: string | undefined,
  limitRaw: number | undefined,
): { items: JobSearchHit[]; nextCursor?: string; total: number } {
  const limit = Math.min(Math.max(limitRaw ?? 20, 1), 50);
  let page = results;
  const total = page.length;
  if (cursor) {
    const index = page.findIndex((job) => job.id === cursor);
    if (index >= 0) page = page.slice(index + 1);
  }
  const items = page.slice(0, limit);
  const nextCursor =
    page.length > limit ? items[items.length - 1]?.id : undefined;
  return { items, nextCursor, total };
}

export function attachMatchReasons(
  jobs: JobSearchHit[],
  matchCtx: JobMatchContext,
): JobSearchHit[] {
  return jobs.map((job) => {
    if (job.matchReasons?.length) return job;
    const reasons = buildMatchReasons(job, matchCtx);
    return reasons.length ? { ...job, matchReasons: reasons } : job;
  });
}

export function matchContextFromQuery(query: JobSearchQuery): JobMatchContext {
  const skillsFromFilter = parseSkillsFilter(query.skills);
  return {
    keyword: query.keyword,
    skills: [...(query.seekerSkills ?? []), ...skillsFromFilter],
    preferredLocations: query.preferredLocations,
    remotePreferred: !!(query.remotePreferred ?? query.remote),
  };
}
