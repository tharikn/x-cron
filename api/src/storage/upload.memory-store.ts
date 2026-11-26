import { Injectable } from '@nestjs/common';
import { UploadAssetStore, UploadedAsset } from './storage.types';

/**
 * MVP metadata store. Swap for a Prisma-backed implementation without
 * touching `UploadService` — the port is deliberately tiny.
 */
@Injectable()
export class UploadMemoryStore extends UploadAssetStore {
  private readonly assets = new Map<string, UploadedAsset>();

  async save(asset: UploadedAsset): Promise<UploadedAsset> {
    this.assets.set(asset.id, asset);
    return asset;
  }

  async get(assetId: string): Promise<UploadedAsset | null> {
    return this.assets.get(assetId) ?? null;
  }

  async list(ownerUserId: string): Promise<UploadedAsset[]> {
    return [...this.assets.values()].filter((a) => a.ownerUserId === ownerUserId);
  }

  async delete(assetId: string): Promise<boolean> {
    return this.assets.delete(assetId);
  }
}
