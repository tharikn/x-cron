import { Injectable } from '@nestjs/common';

@Injectable()
export class SeekerStore {
  /** userId -> set of jobIds */
  private readonly saved = new Map<string, Set<string>>();

  listSaved(userId: string): string[] {
    return [...(this.saved.get(userId) ?? new Set())];
  }

  isSaved(userId: string, jobId: string): boolean {
    return this.saved.get(userId)?.has(jobId) ?? false;
  }

  save(userId: string, jobId: string): void {
    if (!this.saved.has(userId)) this.saved.set(userId, new Set());
    this.saved.get(userId)!.add(jobId);
  }

  unsave(userId: string, jobId: string): void {
    this.saved.get(userId)?.delete(jobId);
  }

  clearUser(userId: string): void {
    this.saved.delete(userId);
  }
}
