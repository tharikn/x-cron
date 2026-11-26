import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  PutObjectInput,
  StorageProvider,
  StorageProviderName,
  StoredObject,
} from '../storage.types';

export interface R2StorageConfig {
  bucket: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
}

/**
 * Cloudflare R2 is S3-compatible, so the AWS SDK v3 client is the entire
 * integration. Pointing the same provider at AWS S3 later needs only a
 * different endpoint/region/credential set — no code change at call sites.
 */
export class R2StorageProvider implements StorageProvider {
  readonly name: StorageProviderName = 'r2';
  private readonly client: S3Client;

  constructor(private readonly config: R2StorageConfig) {
    this.client = new S3Client({
      region: config.region?.trim() || 'auto',
      endpoint: config.endpoint,
      forcePathStyle: false,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async put(input: PutObjectInput): Promise<{ key: string }> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: input.key,
        Body: input.body,
        ContentType: input.contentType,
        ...(input.cacheControl ? { CacheControl: input.cacheControl } : {}),
      }),
    );
    return { key: input.key };
  }

  async get(key: string): Promise<StoredObject | null> {
    try {
      const result = await this.client.send(
        new GetObjectCommand({ Bucket: this.config.bucket, Key: key }),
      );
      if (!result.Body) return null;
      const body = Buffer.from(await result.Body.transformToByteArray());
      return {
        key,
        body,
        contentType: result.ContentType ?? 'application/octet-stream',
        ...(result.CacheControl ? { cacheControl: result.CacheControl } : {}),
      };
    } catch (error) {
      if (isMissingObject(error)) return null;
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: this.config.bucket, Key: key }),
      );
    } catch (error) {
      if (!isMissingObject(error)) throw error;
    }
  }
}

function isMissingObject(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { name?: string; $metadata?: { httpStatusCode?: number } };
  return (
    candidate.name === 'NoSuchKey' ||
    candidate.name === 'NotFound' ||
    candidate.$metadata?.httpStatusCode === 404
  );
}
