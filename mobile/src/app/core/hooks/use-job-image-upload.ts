import { inject, signal, type Signal } from '@angular/core';
import { JobAssetsApiService, type JobAsset } from '../services/job-assets-api.service';
import { imageFileError } from '../utils/image-file-validation';

export type JobImagePurpose = 'company-logo' | 'profile-photo';

export interface JobImageUploadHook {
  readonly pending: Signal<boolean>;
  readonly error: Signal<string | null>;
  readonly lastAsset: Signal<JobAsset | null>;
  upload(file: File, purpose: JobImagePurpose): Promise<JobAsset | null>;
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

/** Image uploads for job-portal assets, kept separate from generic storage. */
export function useJobImageUpload(): JobImageUploadHook {
  const api = inject(JobAssetsApiService);
  const pending = signal(false);
  const error = signal<string | null>(null);
  const lastAsset = signal<JobAsset | null>(null);

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
        const asset = await api.uploadImage(file, purpose);
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
