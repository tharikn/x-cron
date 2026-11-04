import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  ApplyProfilesStore,
  ApplyProfileWriteInput,
} from './apply-profiles.store';
import { ApplyProfile } from './apply-profiles.types';

@Injectable()
export class ApplyProfilesMemoryStore extends ApplyProfilesStore {
  private readonly rows = new Map<string, ApplyProfile>();

  async listForUser(userId: string): Promise<ApplyProfile[]> {
    return [...this.rows.values()]
      .filter((r) => r.userId === userId)
      .sort((a, b) => {
        if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      })
      .map((r) => this.clone(r));
  }

  async findById(id: string): Promise<ApplyProfile | undefined> {
    const row = this.rows.get(id);
    return row ? this.clone(row) : undefined;
  }

  async countForUser(userId: string): Promise<number> {
    let n = 0;
    for (const row of this.rows.values()) {
      if (row.userId === userId) n += 1;
    }
    return n;
  }

  async create(
    userId: string,
    input: ApplyProfileWriteInput,
  ): Promise<ApplyProfile> {
    const now = new Date().toISOString();
    const row: ApplyProfile = {
      id: randomUUID(),
      userId,
      name: input.name,
      headline: input.headline,
      summary: input.summary,
      experienceBand: input.experienceBand,
      skills: [...input.skills],
      projects: input.projects.map((p) => ({ ...p, tech: p.tech ? [...p.tech] : undefined })),
      portfolioLinks: input.portfolioLinks.map((l) => ({ ...l })),
      isDefault: input.isDefault,
      createdAt: now,
      updatedAt: now,
    };
    this.rows.set(row.id, row);
    return this.clone(row);
  }

  async update(
    id: string,
    patch: Partial<ApplyProfileWriteInput>,
  ): Promise<ApplyProfile | undefined> {
    const existing = this.rows.get(id);
    if (!existing) return undefined;
    const next: ApplyProfile = {
      ...existing,
      name: patch.name ?? existing.name,
      headline:
        patch.headline !== undefined ? patch.headline : existing.headline,
      summary: patch.summary !== undefined ? patch.summary : existing.summary,
      experienceBand:
        patch.experienceBand !== undefined
          ? patch.experienceBand
          : existing.experienceBand,
      skills: patch.skills ? [...patch.skills] : existing.skills,
      projects: patch.projects
        ? patch.projects.map((p) => ({
            ...p,
            tech: p.tech ? [...p.tech] : undefined,
          }))
        : existing.projects,
      portfolioLinks: patch.portfolioLinks
        ? patch.portfolioLinks.map((l) => ({ ...l }))
        : existing.portfolioLinks,
      isDefault:
        patch.isDefault !== undefined ? patch.isDefault : existing.isDefault,
      updatedAt: new Date().toISOString(),
    };
    this.rows.set(id, next);
    return this.clone(next);
  }

  async clearDefaultExcept(userId: string, keepId: string): Promise<void> {
    for (const row of this.rows.values()) {
      if (row.userId === userId && row.id !== keepId && row.isDefault) {
        row.isDefault = false;
        row.updatedAt = new Date().toISOString();
      }
    }
  }

  async delete(id: string): Promise<boolean> {
    return this.rows.delete(id);
  }

  async clearForUser(userId: string): Promise<void> {
    for (const [id, row] of this.rows) {
      if (row.userId === userId) this.rows.delete(id);
    }
  }

  private clone(row: ApplyProfile): ApplyProfile {
    return {
      ...row,
      skills: [...row.skills],
      projects: row.projects.map((p) => ({
        ...p,
        tech: p.tech ? [...p.tech] : undefined,
      })),
      portfolioLinks: row.portfolioLinks.map((l) => ({ ...l })),
    };
  }
}
