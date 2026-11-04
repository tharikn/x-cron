import { haversineKm, resolveCoords } from './geo';
import { JobRecord, JobSearchQuery } from './job.types';

export type JobSearchHit = JobRecord & { distanceKm?: number };

function postedWithinMs(window: JobSearchQuery['postedWithin']): number | null {
  if (window === '1d') return 24 * 60 * 60 * 1000;
  if (window === '7d') return 7 * 24 * 60 * 60 * 1000;
  if (window === '30d') return 30 * 24 * 60 * 60 * 1000;
  return null;
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

function relevanceScore(job: JobRecord, keyword: string): number {
  if (!keyword) return 0;
  const title = job.title.toLowerCase();
  const employer = job.employerName.toLowerCase();
  const category = job.category.toLowerCase();
  const about = job.description.about.toLowerCase();
  const skills = (job.skills ?? []).join(' ').toLowerCase();
  let score = 0;
  if (title === keyword) score += 50;
  else if (title.includes(keyword)) score += 30;
  if (employer.includes(keyword)) score += 12;
  if (category.includes(keyword)) score += 10;
  if (skills.includes(keyword)) score += 8;
  if (about.includes(keyword)) score += 4;
  const ageHours =
    (Date.now() - new Date(job.publishedAt).getTime()) / (1000 * 60 * 60);
  score += Math.max(0, 10 - ageHours / 24);
  if (job.location.remote) score += 1;
  score += (job.priority ?? 0) * 2;
  return score;
}

export function sortJobHits(
  jobs: JobSearchHit[],
  sort: NonNullable<JobSearchQuery['sort']>,
  keywordRaw: string,
): JobSearchHit[] {
  const list = [...jobs];
  const keyword = keywordRaw.trim().toLowerCase();
  const byPriority = (a: JobRecord, b: JobRecord) =>
    (b.priority ?? 0) - (a.priority ?? 0);
  const effective =
    sort === 'relevance' && !keyword
      ? 'newest'
      : sort === 'distance'
        ? 'distance'
        : sort;

  switch (effective) {
    case 'oldest':
      return list.sort(
        (a, b) =>
          byPriority(a, b) ||
          a.publishedAt.localeCompare(b.publishedAt) ||
          a.id.localeCompare(b.id),
      );
    case 'salary-desc':
      return list.sort(
        (a, b) =>
          byPriority(a, b) ||
          salaryValue(b) - salaryValue(a) ||
          a.id.localeCompare(b.id),
      );
    case 'salary-asc':
      return list.sort(
        (a, b) =>
          byPriority(a, b) ||
          salaryValue(a) - salaryValue(b) ||
          a.id.localeCompare(b.id),
      );
    case 'relevance':
      return list.sort(
        (a, b) =>
          relevanceScore(b, keyword) - relevanceScore(a, keyword) ||
          byPriority(a, b) ||
          b.publishedAt.localeCompare(a.publishedAt) ||
          a.id.localeCompare(b.id),
      );
    case 'distance':
      return list.sort(
        (a, b) =>
          (a.distanceKm ?? Number.POSITIVE_INFINITY) -
            (b.distanceKm ?? Number.POSITIVE_INFINITY) ||
          byPriority(a, b) ||
          a.id.localeCompare(b.id),
      );
    case 'newest':
    default:
      return list.sort(
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
