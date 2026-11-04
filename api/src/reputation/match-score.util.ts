import type { ApplyProfileSnapshot, ExperienceBand } from '../apply-profiles/apply-profiles.types';
import type { JobRecord } from '../jobs/job.types';

/** Normalize skill/token for overlap (lowercase, strip punctuation). */
export function normalizeToken(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenSet(values: string[] | undefined): string[] {
  if (!values?.length) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of values) {
    const t = normalizeToken(raw);
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

function tokensOverlap(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length >= 3 && b.includes(a)) return true;
  if (b.length >= 3 && a.includes(b)) return true;
  return false;
}

/** Map experience band to rough years midpoint. */
const BAND_YEARS: Record<ExperienceBand, number> = {
  fresher: 0,
  '0-1': 0.5,
  '1-3': 2,
  '3-5': 4,
  '5+': 6,
};

function parseJobYears(label: string | undefined): number | null {
  if (!label?.trim()) return null;
  const t = label.toLowerCase();
  if (/fresher|entry|no\s*exp|0\s*year/.test(t)) return 0;
  const range = t.match(/(\d+)\s*[-–to]+\s*(\d+)/);
  if (range) return (Number(range[1]) + Number(range[2])) / 2;
  const plus = t.match(/(\d+)\s*\+/);
  if (plus) return Number(plus[1]) + 1;
  const single = t.match(/(\d+)\s*(?:year|yr)/);
  if (single) return Number(single[1]);
  return null;
}

/**
 * Fit % between apply-profile snapshot and job (skills + experience).
 * Returns 0–100. Neutral 50 when job has no skills and no experience signal.
 */
export function computeMatchPercent(
  snapshot: ApplyProfileSnapshot | undefined,
  job: Pick<JobRecord, 'skills' | 'experienceLabel' | 'title'> & {
    description?: { requirements?: string[] };
  },
): number {
  const profileSkills = tokenSet(snapshot?.skills);
  const jobSkills = tokenSet([
    ...(job.skills ?? []),
    ...(job.description?.requirements ?? []),
  ]);

  let skillsScore = 50;
  if (jobSkills.length > 0) {
    if (profileSkills.length === 0) {
      skillsScore = 15;
    } else {
      let hits = 0;
      for (const js of jobSkills) {
        if (profileSkills.some((ps) => tokensOverlap(ps, js))) hits += 1;
      }
      skillsScore = Math.round((hits / jobSkills.length) * 100);
    }
  } else if (profileSkills.length > 0 && job.title) {
    const title = normalizeToken(job.title);
    const titleHits = profileSkills.filter((ps) => title.includes(ps)).length;
    skillsScore = Math.min(80, 40 + titleHits * 15);
  }

  let expScore = 50;
  const jobYears = parseJobYears(job.experienceLabel);
  const band = snapshot?.experienceBand;
  if (jobYears != null && band) {
    const seekerYears = BAND_YEARS[band];
    const gap = Math.abs(seekerYears - jobYears);
    if (gap <= 0.5) expScore = 100;
    else if (gap <= 1.5) expScore = 80;
    else if (gap <= 3) expScore = 55;
    else if (gap <= 5) expScore = 30;
    else expScore = 10;
  } else if (jobYears != null && !band) {
    expScore = 35;
  }

  const hasSkillSignal = jobSkills.length > 0 || !!job.title;
  const hasExpSignal = jobYears != null;
  if (!hasSkillSignal && !hasExpSignal) return 50;
  if (!hasExpSignal) return Math.max(0, Math.min(100, skillsScore));
  if (!hasSkillSignal) return Math.max(0, Math.min(100, expScore));
  return Math.max(
    0,
    Math.min(100, Math.round(skillsScore * 0.7 + expScore * 0.3)),
  );
}

export const MATCH_GOOD_THRESHOLD = 50;
