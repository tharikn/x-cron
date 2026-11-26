import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { generateImageVersions } from './image-versions';
import {
  ImageVersion,
  ImageVersionName,
  PublicAssetResponse,
  StorageProvider,
  UploadAssetStore,
  UploadPurpose,
  UploadedAsset,
} from './storage.types';
import { validateUpload } from './upload-validation';

const IMAGE_PURPOSES: ReadonlySet<UploadPurpose> = new Set([
  'portfolio',
  'company-logo',
  'profile-photo',
]);

function safeSegment(value: string): string {
  return (value || 'anonymous').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
}

@Injectable()
export class UploadService {
  constructor(
    private readonly provider: StorageProvider,
    private readonly store: UploadAssetStore,
  ) {}

  /** One entry point for all feature modules; validation is purpose-driven. */
  async upload(
    file: Express.Multer.File | undefined,
    ownerUserId: string,
    purpose: UploadPurpose,
  ): Promise<UploadedAsset> {
    const validated = validateUpload(file, purpose);
    const id = `asset_${randomUUID().replace(/-/g, '').slice(0, 20)}`;
    const owner = safeSegment(ownerUserId);
    const folder = purpose === 'portfolio' ? 'portfolio' : 'jobs';
    const cacheControl = 'public, max-age=31536000, immutable';

    if (validated.kind === 'image') {
      const versions = await generateImageVersions(file!.buffer, validated.extension);
      const stored: ImageVersion[] = [];

      for (const version of versions) {
        const ext = version.name === 'original' ? validated.extension : version.format;
        const key = `${folder}/${owner}/${id}/${version.name}.${ext}`;
        await this.provider.put({
          key,
          body: version.body,
          contentType: version.contentType,
          cacheControl,
        });
        stored.push({
          name: version.name,
          key,
          url: this.publicUrl(id, version.name),
          contentType: version.contentType,
          width: version.width,
          height: version.height,
          bytes: version.body.length,
          format: version.format,
        });
      }

      const original = stored.find((v) => v.name === 'original')!;
      return this.store.save({
        id,
        ownerUserId,
        purpose,
        originalName: (file!.originalname || `image.${validated.extension}`).slice(0, 255),
        mimeType: validated.mimeType,
        sizeBytes: file!.buffer.length,
        url: original.url,
        versions: stored,
        createdAt: new Date().toISOString(),
        storageProvider: this.provider.name,
      });
    }

    const key = `${folder}/${owner}/${id}/resume.${validated.extension}`;
    await this.provider.put({
      key,
      body: file!.buffer,
      contentType: validated.mimeType,
      cacheControl: 'private, no-store',
    });

    return this.store.save({
      id,
      ownerUserId,
      purpose,
      originalName: (file!.originalname || `resume.${validated.extension}`).slice(0, 255),
      mimeType: validated.mimeType,
      sizeBytes: file!.buffer.length,
      url: `${this.baseUrl()}/v1/storage/assets/${id}/download`,
      versions: [],
      createdAt: new Date().toISOString(),
      storageProvider: this.provider.name,
    });
  }

  async getOwned(assetId: string, userId: string): Promise<UploadedAsset> {
    const asset = await this.store.get(assetId);
    if (!asset || asset.ownerUserId !== userId) {
      throw new NotFoundException('Asset not found');
    }
    return asset;
  }

  /** Unauthenticated read for public image purposes only; resumes are never public. */
  async getPublic(
    assetId: string,
    versionName: string,
  ): Promise<PublicAssetResponse | null> {
    const asset = await this.store.get(assetId);
    if (!asset || !IMAGE_PURPOSES.has(asset.purpose)) return null;
    if (!isImageVersionName(versionName)) return null;

    const version = asset.versions.find((v) => v.name === versionName);
    if (!version) return null;

    const object = await this.provider.get(version.key);
    if (!object) return null;

    const isSvg = version.contentType === 'image/svg+xml';
    const filename = `${asset.id}-${version.name}${fileExtension(version.contentType)}`;
    return {
      body: object.body,
      contentType: version.contentType,
      headers: {
        'Content-Type': version.contentType,
        'Content-Length': String(object.body.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': `inline; filename="${filename}"`,
        // Even if a browser opens an SVG directly, it cannot run its scripts.
        'Content-Security-Policy': isSvg
          ? 'sandbox; default-src \'none\''
          : 'default-src \'none\'',
      },
    };
  }

  async downloadOwned(
    assetId: string,
    userId: string,
  ): Promise<{ asset: UploadedAsset; response: PublicAssetResponse }> {
    const asset = await this.getOwned(assetId, userId);
    const key = asset.versions[0]?.key ?? this.resumeKey(asset);
    const object = await this.provider.get(key);
    if (!object) throw new NotFoundException('Asset not found');

    const filename = asset.originalName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
    return {
      asset,
      response: {
        body: object.body,
        contentType: asset.mimeType,
        headers: {
          'Content-Type': asset.mimeType,
          'Content-Length': String(object.body.length),
          'Cache-Control': 'private, no-store',
          'X-Content-Type-Options': 'nosniff',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Security-Policy': 'sandbox; default-src \'none\'',
        },
      },
    };
  }

  async deleteOwned(assetId: string, userId: string): Promise<boolean> {
    const asset = await this.getOwned(assetId, userId);
    for (const version of asset.versions) {
      await this.provider.delete(version.key);
    }
    if (asset.versions.length === 0) {
      await this.provider.delete(this.resumeKey(asset));
    }
    return this.store.delete(assetId);
  }

  private keyPrefix(asset: UploadedAsset): string {
    return `${asset.purpose === 'portfolio' ? 'portfolio' : 'jobs'}/${safeSegment(asset.ownerUserId)}/${asset.id}`;
  }

  private resumeKey(asset: UploadedAsset): string {
    const ext = asset.mimeType.includes('pdf')
      ? 'pdf'
      : asset.mimeType.includes('msword')
        ? 'doc'
        : 'docx';
    return `${this.keyPrefix(asset)}/resume.${ext}`;
  }

  private publicUrl(assetId: string, version: ImageVersionName): string {
    return `${this.baseUrl()}/v1/storage/public/${assetId}/${version}`;
  }

  private baseUrl(): string {
    const configured = process.env.APP_URL?.trim();
    if (configured) return configured.replace(/\/+$/, '');
    return `http://localhost:${process.env.PORT?.trim() || '3010'}`;
  }
}

function isImageVersionName(value: string): value is ImageVersionName {
  return value === 'original' || value === 'thumb' || value === 'medium' || value === 'large';
}

function fileExtension(contentType: string): string {
  if (contentType === 'image/svg+xml') return '.svg';
  if (contentType === 'image/png') return '.png';
  if (contentType === 'image/jpeg') return '.jpg';
  return '.bin';
}
