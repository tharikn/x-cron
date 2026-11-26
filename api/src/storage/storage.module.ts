import { Module } from '@nestjs/common';
import { LocalStorageProvider } from './providers/local.storage';
import { MemoryStorageProvider } from './providers/memory.storage';
import { R2StorageProvider } from './providers/r2.storage';
import { SupabaseStorageProvider } from './providers/supabase.storage';
import { StorageController } from './storage.controller';
import { StorageProvider } from './storage.types';
import { UploadMemoryStore } from './upload.memory-store';
import { UploadAssetStore } from './storage.types';
import { UploadService } from './upload.service';

/**
 * Provider selection is the only place that knows about a concrete vendor.
 * Adding another S3-compatible store means another branch here and no changes
 * to UploadService, controllers, or clients.
 */
export function createStorageProvider(): StorageProvider {
  const mode = (process.env.UPLOAD_STORAGE ?? 'local').trim().toLowerCase();

  if (mode === 'r2') {
    const bucket = process.env.R2_BUCKET?.trim() ?? '';
    const endpoint = process.env.R2_ENDPOINT?.trim() ?? '';
    const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim() ?? '';
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim() ?? '';
    if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) {
      throw new Error(
        'UPLOAD_STORAGE=r2 requires R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY',
      );
    }
    return new R2StorageProvider({
      bucket,
      endpoint,
      accessKeyId,
      secretAccessKey,
      region: process.env.R2_REGION,
    });
  }

  if (mode === 'supabase') {
    const bucket = process.env.SUPABASE_BUCKET?.trim() ?? '';
    const endpoint = process.env.SUPABASE_ENDPOINT?.trim() ?? '';
    const accessKeyId = process.env.SUPABASE_ACCESS_KEY_ID?.trim() ?? '';
    const secretAccessKey = process.env.SUPABASE_SECRET_ACCESS_KEY?.trim() ?? '';
    const region = process.env.SUPABASE_REGION?.trim() ?? '';
    if (!bucket || !endpoint || !accessKeyId || !secretAccessKey || !region) {
      throw new Error(
        'UPLOAD_STORAGE=supabase requires SUPABASE_BUCKET, SUPABASE_ENDPOINT, ' +
          'SUPABASE_ACCESS_KEY_ID, SUPABASE_SECRET_ACCESS_KEY and SUPABASE_REGION',
      );
    }
    return new SupabaseStorageProvider({
      bucket,
      endpoint,
      accessKeyId,
      secretAccessKey,
      region,
    });
  }

  if (mode === 'memory') return new MemoryStorageProvider();
  return new LocalStorageProvider(process.env.UPLOAD_LOCAL_DIR);
}

@Module({
  controllers: [StorageController],
  providers: [
    { provide: StorageProvider, useFactory: createStorageProvider },
    { provide: UploadAssetStore, useClass: UploadMemoryStore },
    UploadService,
  ],
  exports: [UploadService],
})
export class StorageModule {}
