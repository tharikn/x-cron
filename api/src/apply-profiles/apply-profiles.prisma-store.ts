import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import {
  ApplyProfilesStore,
  ApplyProfileWriteInput,
} from './apply-profiles.store';
import {
  ApplyProfile,
  ApplyProfileLink,
  ApplyProfileProject,
  ExperienceBand,
} from './apply-profiles.types';

function asStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === 'string')
    .map((v) => v.trim())
    .filter(Boolean);
}

function asProjects(
  value: Prisma.JsonValue | null | undefined,
): ApplyProfileProject[] {
  if (!Array.isArray(value)) return [];
  const out: ApplyProfileProject[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    if (!title) continue;
    out.push({
      title,
      description:
        typeof item.description === 'string' ? item.description : undefined,
      url: typeof item.url === 'string' ? item.url : undefined,
      tech: Array.isArray(item.tech)
        ? item.tech.filter((t): t is string => typeof t === 'string')
        : undefined,
    });
  }
  return out;
}

function asLinks(
  value: Prisma.JsonValue | null | undefined,
): ApplyProfileLink[] {
  if (!Array.isArray(value)) return [];
  const out: ApplyProfileLink[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
    const label = typeof item.label === 'string' ? item.label.trim() : '';
    const url = typeof item.url === 'string' ? item.url.trim() : '';
    if (!label || !url) continue;
    out.push({ label, url });
  }
  return out;
}

function mapRow(row: {
  id: string;
  userId: string;
  name: string;
  headline: string | null;
  summary: string | null;
  experienceBand: string | null;
  skillsJson: Prisma.JsonValue;
  projectsJson: Prisma.JsonValue;
  portfolioLinksJson: Prisma.JsonValue;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}): ApplyProfile {
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    headline: row.headline ?? undefined,
    summary: row.summary ?? undefined,
    experienceBand: (row.experienceBand as ExperienceBand) || undefined,
    skills: asStringArray(row.skillsJson),
    projects: asProjects(row.projectsJson),
    portfolioLinks: asLinks(row.portfolioLinksJson),
    isDefault: row.isDefault,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

@Injectable()
export class ApplyProfilesPrismaStore extends ApplyProfilesStore {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private async ensureUser(userId: string): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    });
  }

  async listForUser(userId: string): Promise<ApplyProfile[]> {
    const rows = await this.prisma.applyProfile.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
    });
    return rows.map(mapRow);
  }

  async findById(id: string): Promise<ApplyProfile | undefined> {
    const row = await this.prisma.applyProfile.findUnique({ where: { id } });
    return row ? mapRow(row) : undefined;
  }

  async countForUser(userId: string): Promise<number> {
    return this.prisma.applyProfile.count({ where: { userId } });
  }

  async create(
    userId: string,
    input: ApplyProfileWriteInput,
  ): Promise<ApplyProfile> {
    await this.ensureUser(userId);
    const row = await this.prisma.applyProfile.create({
      data: {
        id: randomUUID(),
        userId,
        name: input.name,
        headline: input.headline,
        summary: input.summary,
        experienceBand: input.experienceBand,
        skillsJson: input.skills,
        projectsJson: input.projects as unknown as Prisma.InputJsonValue,
        portfolioLinksJson:
          input.portfolioLinks as unknown as Prisma.InputJsonValue,
        isDefault: input.isDefault,
      },
    });
    return mapRow(row);
  }

  async update(
    id: string,
    patch: Partial<ApplyProfileWriteInput>,
  ): Promise<ApplyProfile | undefined> {
    try {
      const row = await this.prisma.applyProfile.update({
        where: { id },
        data: {
          name: patch.name,
          headline: patch.headline,
          summary: patch.summary,
          experienceBand: patch.experienceBand,
          skillsJson: patch.skills,
          projectsJson: patch.projects as unknown as Prisma.InputJsonValue | undefined,
          portfolioLinksJson:
            patch.portfolioLinks as unknown as Prisma.InputJsonValue | undefined,
          isDefault: patch.isDefault,
        },
      });
      return mapRow(row);
    } catch {
      return undefined;
    }
  }

  async clearDefaultExcept(userId: string, keepId: string): Promise<void> {
    await this.prisma.applyProfile.updateMany({
      where: { userId, id: { not: keepId }, isDefault: true },
      data: { isDefault: false },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.applyProfile.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async clearForUser(userId: string): Promise<void> {
    await this.prisma.applyProfile.deleteMany({ where: { userId } });
  }
}
