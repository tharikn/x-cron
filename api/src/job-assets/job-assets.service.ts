import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AuthUser } from '../auth/auth.types';
import { UploadService } from '../storage/upload.service';
import { UploadedAsset } from '../storage/storage.types';
import { JobAsset, JobAssetPurpose, JobAssetStore } from './job-assets.types';

@Injectable()
export class JobAssetsService {
  constructor(
    private readonly uploads: UploadService,
    private readonly store: JobAssetStore,
  ) {}

  async uploadImage(
    user: AuthUser,
    file: Express.Multer.File | undefined,
    purpose: 'company-logo' | 'profile-photo',
  ): Promise<JobAsset> {
    this.assertRole(user, purpose === 'company-logo' ? 'employer' : 'seeker');
    return this.register(user, file, purpose);
  }

  /** Private CV asset. Not attached to apply — apply stays profile-version based. */
  async uploadResume(
    user: AuthUser,
    file: Express.Multer.File | undefined,
  ): Promise<JobAsset> {
    this.assertRole(user, 'seeker');
    return this.register(user, file, 'resume');
  }

  async list(user: AuthUser): Promise<JobAsset[]> {
    return this.store.list(user.id);
  }

  async delete(user: AuthUser, assetId: string): Promise<{ ok: boolean }> {
    const asset = await this.owned(user, assetId);
    await this.uploads.deleteOwned(asset.storageAssetId, user.id).catch(() => undefined);
    await this.store.delete(assetId);
    return { ok: true };
  }

  private async register(
    user: AuthUser,
    file: Express.Multer.File | undefined,
    purpose: JobAssetPurpose,
  ): Promise<JobAsset> {
    const uploaded: UploadedAsset = await this.uploads.upload(file, user.id, purpose);
    return this.store.save({
      id: `job_asset_${randomUUID().replace(/-/g, '').slice(0, 20)}`,
      ownerUserId: user.id,
      purpose,
      storageAssetId: uploaded.id,
      url: uploaded.url,
      originalName: uploaded.originalName,
      createdAt: new Date().toISOString(),
    });
  }

  private async owned(user: AuthUser, assetId: string): Promise<JobAsset> {
    const asset = await this.store.get(assetId);
    if (!asset || asset.ownerUserId !== user.id) {
      throw new NotFoundException('Asset not found');
    }
    return asset;
  }

  private assertRole(user: AuthUser, required: 'seeker' | 'employer'): void {
    if (user.roles.includes('admin') || user.roles.includes(required)) return;
    throw new ForbiddenException(`Only ${required} accounts can upload this asset`);
  }
}
