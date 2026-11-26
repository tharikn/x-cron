import { inject, signal, type Signal } from '@angular/core';
import type { ImageUploadPurpose, UploadedAsset } from '../models/upload.model';
import { UploadApiService } from '../services/upload-api.service';
import { imageFileError } from '../utils/image-file-validation';

export interface ImageUploadHook {
  readonly pending: Signal<boolean>;
  readonly error: Signal<string | null>;
  readonly lastAsset: Signal<UploadedAsset | null>;
  upload(file: File, purpose: ImageUploadPurpose): Promise<UploadedAsset | null>;
  clearError(): void;
}

function messageOf(error: unknown): string {
  const candidate = error as { error?: { message?: string }; message?: string };
  return (
    candidate?.error?.message ||
    candidate?.message ||
    'Upload failed. Please try again.'
  );
}

/**
 * Angular "hook" (called from a component field initializer, i.e. inside an
 * injection context). Keeps upload state out of feature pages.
 */
export function useImageUpload(): ImageUploadHook {
  const api = inject(UploadApiService);
  const pending = signal(false);
  const error = signal<string | null>(null);
  const lastAsset = signal<UploadedAsset | null>(null);

  return {
    pending: pending.asReadonly(),
    error: error.asReadonly(),
    lastAsset: lastAsset.asReadonly(),

    async upload(file, purpose) {
      const validationError = imageFileError(file);
      if (validationError) {
        error.set(validationError);
        return null;
      }

      pending.set(true);
      error.set(null);
      try {
        const asset = await api.upload(file, purpose);
        lastAsset.set(asset);
        return asset;
      } catch (err) {
        error.set(messageOf(err));
        return null;
      } finally {
        pending.set(false);
      }
    },

    clearError() {
      error.set(null);
    },
  };
}
