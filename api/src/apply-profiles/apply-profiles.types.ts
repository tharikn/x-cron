export type ExperienceBand = 'fresher' | '0-1' | '1-3' | '3-5' | '5+';

export interface ApplyProfileProject {
  title: string;
  description?: string;
  url?: string;
  tech?: string[];
}

export interface ApplyProfileLink {
  label: string;
  url: string;
}

/** Named apply version (e.g. Frontend / Backend) — no CV/resume. */
export interface ApplyProfile {
  id: string;
  userId: string;
  name: string;
  headline?: string;
  summary?: string;
  experienceBand?: ExperienceBand;
  skills: string[];
  projects: ApplyProfileProject[];
  portfolioLinks: ApplyProfileLink[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Frozen copy stored on JobApplication at apply time. */
export interface ApplyProfileSnapshot {
  id: string;
  name: string;
  headline?: string;
  summary?: string;
  experienceBand?: ExperienceBand;
  skills: string[];
  projects: ApplyProfileProject[];
  portfolioLinks: ApplyProfileLink[];
}

export const APPLY_PROFILE_LIMITS = {
  maxVersions: 8,
  /** Seekers pick a focused skill set per version (badge UI). */
  minSkills: 2,
  maxSkills: 7,
  maxProjects: 12,
  maxLinks: 10,
  maxTechPerProject: 20,
} as const;

export function toSnapshot(profile: ApplyProfile): ApplyProfileSnapshot {
  return {
    id: profile.id,
    name: profile.name,
    headline: profile.headline,
    summary: profile.summary,
    experienceBand: profile.experienceBand,
    skills: [...profile.skills],
    projects: profile.projects.map((p) => ({
      title: p.title,
      description: p.description,
      url: p.url,
      tech: p.tech ? [...p.tech] : undefined,
    })),
    portfolioLinks: profile.portfolioLinks.map((l) => ({
      label: l.label,
      url: l.url,
    })),
  };
}

/** Submit-ready when skills, headline, summary, or a titled project is present. */
export function isReadyForApply(
  profile: Pick<ApplyProfile, 'skills' | 'headline' | 'summary' | 'projects'>,
): boolean {
  const hasSkills = profile.skills.length > 0;
  const hasHeadline = Boolean(profile.headline?.trim());
  const hasSummary = Boolean(profile.summary?.trim());
  const hasProjects = profile.projects.some((p) => p.title?.trim());
  return hasSkills || hasHeadline || hasSummary || hasProjects;
}
