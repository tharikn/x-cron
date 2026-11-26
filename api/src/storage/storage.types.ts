/**
 * Storage ports for uploaded assets.
 *
 * The rest of the app depends only on `StorageProvider` and `UploadService`;
 * swapping Cloudflare R2, Supabase S3 or AWS S3 means adding one provider class
 * and selecting it in `StorageModule` — no controller or feature service changes.
 */

export type StorageProviderName = 'r2' | 'supabase' | 'local' | 'memory';

export interface PutObjectInput {
  /** Provider-relative object key. Never derived from an untrusted filename. */
  key: string;
  body: Buffer;
  contentType: string;
  cacheControl?: string;
}

export interface StoredObject {
  key: string;
  body: Buffer;
  contentType: string;
  cacheControl?: string;
}

export abstract class StorageProvider {
  abstract readonly name: StorageProviderName;

  abstract put(input: PutObjectInput): Promise<{ key: string }>;

  abstract get(key: string): Promise<StoredObject | null>;

  abstract delete(key: string): Promise<void>;
}

export type UploadPurpose =
  | 'portfolio'
  | 'company-logo'
  | 'profile-photo'
  | 'resume';

export const UPLOAD_PURPOSES: readonly UploadPurpose[] = [
  'portfolio',
  'company-logo',
  'profile-photo',
  'resume',
];

export type ImageVersionName = 'original' | 'thumb' | 'medium' | 'large';

export interface ImageVersion {
  name: ImageVersionName;
  url: string;
  contentType: string;
  width: number | null;
  height: number | null;
  bytes: number;
  format: string;
  key: string;
}

export interface UploadedAsset {
  id: string;
  ownerUserId: string;
  purpose: UploadPurpose;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  /** Canonical image URL (the `original` version for images). */
  url: string;
  /** Empty for non-image uploads such as resumes. */
  versions: ImageVersion[];
  createdAt: string;
  storageProvider: StorageProviderName;
}

export interface PublicAssetResponse {
  body: Buffer;
  contentType: string;
  headers: Record<string, string>;
}

/** Metadata store port. In-memory for MVP; a Prisma table can replace it. */
export abstract class UploadAssetStore {
  abstract save(asset: UploadedAsset): Promise<UploadedAsset>;

  abstract get(assetId: string): Promise<UploadedAsset | null>;

  abstract list(ownerUserId: string): Promise<UploadedAsset[]>;

  abstract delete(assetId: string): Promise<boolean>;
}
