import { Injectable, Logger } from '@nestjs/common';
import { LocalFileStorage } from './local.storage';
import { FileStorageAdapter } from './file-storage';

/**
 * S3-compatible adapter placeholder. Until AWS SDK is wired, falls back to
 * local disk under `uploads/s3-mirror/` so FILE_STORAGE=s3 does not crash boot.
 * Set FILE_S3_BUCKET (+ optional FILE_S3_ENDPOINT / REGION) when wiring a real SDK.
 */
@Injectable()
export class S3FileStorage extends FileStorageAdapter {
  readonly name = 's3' as const;
  private readonly logger = new Logger(S3FileStorage.name);
  private readonly fallback = new LocalFileStorage();

  constructor() {
    super();
    this.logger.warn(
      `FILE_STORAGE=s3 bucket=${process.env.FILE_S3_BUCKET ?? '(unset)'} — using local mirror until SDK wired`,
    );
  }

  put(input: { key: string; buffer: Buffer; mimeType: string }) {
    return this.fallback.put({
      ...input,
      key: `s3-mirror/${input.key}`,
    });
  }

  get(storageKey: string) {
    return this.fallback.get(
      storageKey.startsWith('s3-mirror/')
        ? storageKey
        : `s3-mirror/${storageKey}`,
    );
  }

  delete(storageKey: string) {
    return this.fallback.delete(
      storageKey.startsWith('s3-mirror/')
        ? storageKey
        : `s3-mirror/${storageKey}`,
    );
  }
}
