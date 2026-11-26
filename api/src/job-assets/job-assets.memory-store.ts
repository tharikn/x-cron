import { Injectable } from '@nestjs/common';
import { JobAsset, JobAssetStore } from './job-assets.types';

/** MVP registry; a Prisma table can implement the same port later. */
@Injectable()
export class JobAssetMemoryStore extends JobAssetStore {
  private readonly assets = new Map<string, JobAsset>();

  async save(asset: JobAsset): Promise<JobAsset> {
    this.assets.set(asset.id, asset);
    return asset;
  }

  async get(assetId: string): Promise<JobAsset | null> {
    return this.assets.get(assetId) ?? null;
  }

  async list(ownerUserId: string): Promise<JobAsset[]> {
    return [...this.assets.values()]
      .filter((asset) => asset.ownerUserId === ownerUserId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async delete(assetId: string): Promise<boolean> {
    return this.assets.delete(assetId);
  }
}
