export type UploadPurpose =
  | 'portfolio'
  | 'company-logo'
  | 'profile-photo'
  | 'resume';

export type ImageUploadPurpose = Exclude<UploadPurpose, 'resume'>;

export type ImageVersionName = 'original' | 'thumb' | 'medium' | 'large';

export interface UploadedImageVersion {
  name: ImageVersionName;
  url: string;
  contentType: string;
  width: number | null;
  height: number | null;
  bytes: number;
  format: string;
}

export interface UploadedAsset {
  id: string;
  ownerUserId: string;
  purpose: UploadPurpose;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  versions: UploadedImageVersion[];
  createdAt: string;
  storageProvider: string;
}
