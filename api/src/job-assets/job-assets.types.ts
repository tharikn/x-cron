import { UploadPurpose } from '../storage/storage.types';

export type JobAssetPurpose = Extract<
  UploadPurpose,
  'company-logo' | 'profile-photo' | 'resume'
>;

export interface JobAsset {
  id: string;
  ownerUserId: string;
  purpose: JobAssetPurpose;
  storageAssetId: string;
  /** Public image URL, or an owner-only download URL for resumes. */
  url: string;
  originalName: string;
  createdAt: string;
}

export abstract class JobAssetStore {
  abstract save(asset: JobAsset): Promise<JobAsset>;
  abstract get(assetId: string): Promise<JobAsset | null>;
  abstract list(ownerUserId: string): Promise<JobAsset[]>;
  abstract delete(assetId: string): Promise<boolean>;
}
