import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUser } from '../auth/auth.types';
import { ApplyProfilesStore } from './apply-profiles.store';
import {
  APPLY_PROFILE_LIMITS,
  ApplyProfile,
  ApplyProfileLink,
  ApplyProfileProject,
  isReadyForApply,
} from './apply-profiles.types';
import {
  CreateApplyProfileDto,
  UpdateApplyProfileDto,
} from './dto/apply-profiles.dto';

@Injectable()
export class ApplyProfilesService {
  constructor(private readonly store: ApplyProfilesStore) {}

  list(user: AuthUser) {
    return this.store.listForUser(user.id).then((items) => ({ items }));
  }

  async get(user: AuthUser, id: string) {
    return this.requireOwned(user, id);
  }

  async create(user: AuthUser, dto: CreateApplyProfileDto) {
    const count = await this.store.countForUser(user.id);
    if (count >= APPLY_PROFILE_LIMITS.maxVersions) {
      throw new BadRequestException(
        `You can keep up to ${APPLY_PROFILE_LIMITS.maxVersions} apply profile versions`,
      );
    }
    const name = dto.name.trim();
    if (!name) throw new BadRequestException('Name is required');

    const isDefault = dto.isDefault === true || count === 0;
    const created = await this.store.create(user.id, {
      name,
      headline: dto.headline?.trim() || undefined,
      summary: dto.summary?.trim() || undefined,
      experienceBand: dto.experienceBand,
      skills: this.requireSkillCount(this.normalizeSkills(dto.skills), true),
      projects: this.normalizeProjects(dto.projects),
      portfolioLinks: this.normalizeLinks(dto.portfolioLinks),
      isDefault,
    });
    if (isDefault) {
      await this.store.clearDefaultExcept(user.id, created.id);
    }
    return created;
  }

  async update(user: AuthUser, id: string, dto: UpdateApplyProfileDto) {
    const existing = await this.requireOwned(user, id);
    const patch: Parameters<ApplyProfilesStore['update']>[1] = {};
    if (dto.name !== undefined) {
      const name = dto.name.trim();
      if (!name) throw new BadRequestException('Name is required');
      patch.name = name;
    }
    if (dto.headline !== undefined) {
      patch.headline = dto.headline.trim() || undefined;
    }
    if (dto.summary !== undefined) {
      patch.summary = dto.summary.trim() || undefined;
    }
    if (dto.experienceBand !== undefined) {
      patch.experienceBand = dto.experienceBand;
    }
    if (dto.skills !== undefined) {
      patch.skills = this.requireSkillCount(this.normalizeSkills(dto.skills));
    }
    if (dto.projects !== undefined) {
      patch.projects = this.normalizeProjects(dto.projects);
    }
    if (dto.portfolioLinks !== undefined) {
      patch.portfolioLinks = this.normalizeLinks(dto.portfolioLinks);
    }
    if (dto.isDefault !== undefined) {
      patch.isDefault = dto.isDefault;
    }

    const updated = await this.store.update(id, patch);
    if (!updated) throw new NotFoundException('Apply profile not found');

    if (updated.isDefault) {
      await this.store.clearDefaultExcept(user.id, updated.id);
    } else if (existing.isDefault && dto.isDefault === false) {
      // Keep at least one default when possible.
      const list = await this.store.listForUser(user.id);
      const other = list.find((p) => p.id !== id);
      if (other) {
        await this.store.update(other.id, { isDefault: true });
        await this.store.clearDefaultExcept(user.id, other.id);
      }
    }
    return (await this.store.findById(id))!;
  }

  async remove(user: AuthUser, id: string) {
    const existing = await this.requireOwned(user, id);
    await this.store.delete(id);
    if (existing.isDefault) {
      const list = await this.store.listForUser(user.id);
      if (list[0]) {
        await this.store.update(list[0].id, { isDefault: true });
        await this.store.clearDefaultExcept(user.id, list[0].id);
      }
    }
    return { ok: true };
  }

  /** Used by applications.apply — ownership checked. */
  async requireOwnedProfile(
    userId: string,
    profileId: string,
  ): Promise<ApplyProfile> {
    const profile = await this.store.findById(profileId);
    if (!profile || profile.userId !== userId) {
      throw new NotFoundException('Apply profile not found');
    }
    return profile;
  }

  /**
   * Anti-spam: empty named shells cannot be submitted.
   * Needs at least one of: skills, headline, summary, or a project.
   */
  assertReadyForApply(profile: ApplyProfile): void {
    if (!isReadyForApply(profile)) {
      throw new BadRequestException(
        'Complete your apply profile: add skills, a headline, summary, or a project before applying',
      );
    }
  }

  clearForUser(userId: string) {
    return this.store.clearForUser(userId);
  }

  private async requireOwned(user: AuthUser, id: string) {
    const profile = await this.store.findById(id);
    if (!profile) throw new NotFoundException('Apply profile not found');
    if (profile.userId !== user.id) {
      throw new ForbiddenException('Not your apply profile');
    }
    return profile;
  }

  private requireSkillCount(skills: string[], required = false): string[] {
    const { minSkills, maxSkills } = APPLY_PROFILE_LIMITS;
    if (!skills.length) {
      if (required) {
        throw new BadRequestException(
          `Add between ${minSkills} and ${maxSkills} skills`,
        );
      }
      return skills;
    }
    if (skills.length < minSkills || skills.length > maxSkills) {
      throw new BadRequestException(
        `Add between ${minSkills} and ${maxSkills} skills`,
      );
    }
    return skills;
  }

  private normalizeSkills(skills?: string[]): string[] {
    if (!skills?.length) return [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of skills) {
      const s = raw.trim();
      if (!s) continue;
      const key = s.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(s.slice(0, 60));
      if (out.length >= APPLY_PROFILE_LIMITS.maxSkills) break;
    }
    return out;
  }

  private normalizeProjects(
    projects?: Array<{
      title: string;
      description?: string;
      url?: string;
      tech?: string[];
    }>,
  ): ApplyProfileProject[] {
    if (!projects?.length) return [];
    return projects.slice(0, APPLY_PROFILE_LIMITS.maxProjects).map((p) => ({
      title: p.title.trim().slice(0, 120),
      description: p.description?.trim().slice(0, 2000) || undefined,
      url: p.url?.trim().slice(0, 500) || undefined,
      tech: (p.tech ?? [])
        .map((t) => t.trim().slice(0, 40))
        .filter(Boolean)
        .slice(0, APPLY_PROFILE_LIMITS.maxTechPerProject),
    }));
  }

  private normalizeLinks(
    links?: Array<{ label: string; url: string }>,
  ): ApplyProfileLink[] {
    if (!links?.length) return [];
    return links.slice(0, APPLY_PROFILE_LIMITS.maxLinks).map((l) => ({
      label: l.label.trim().slice(0, 80),
      url: l.url.trim().slice(0, 500),
    }));
  }
}
