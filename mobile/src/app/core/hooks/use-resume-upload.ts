import { inject, signal, type Signal } from '@angular/core';
import { JobAssetsApiService, type JobAsset } from '../services/job-assets-api.service';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(['pdf', 'doc', 'docx']);

export interface ResumeUploadHook {
  readonly pending: Signal<boolean>;
  readonly error: Signal<string | null>;
  readonly lastAsset: Signal<JobAsset | null>;
  upload(file: File): Promise<JobAsset | null>;
  clearError(): void;
}

/** Private CV asset upload; apply flow itself remains profile-version based. */
export function useResumeUpload(): ResumeUploadHook {
  const api = inject(JobAssetsApiService);
  const pending = signal(false);
  const error = signal<string | null>(null);
  const lastAsset = signal<JobAsset | null>(null);

  return {
    pending: pending.asReadonly(),
    error: error.asReadonly(),
    lastAsset: lastAsset.asReadonly(),

    async upload(file) {
      const dot = file.name.lastIndexOf('.');
      const ext = dot < 0 ? '' : file.name.slice(dot + 1).toLowerCase();
      if (!ALLOWED.has(ext)) {
        error.set('Only pdf, doc and docx resumes are allowed.');
        return null;
      }
      if (file.size > MAX_BYTES) {
        error.set('Resume must be 5 MB or smaller.');
        return null;
      }

      pending.set(true);
      error.set(null);
      try {
        const asset = await api.uploadResume(file);
        lastAsset.set(asset);
        return asset;
      } catch (err) {
        const candidate = err as { error?: { message?: string }; message?: string };
        error.set(candidate?.error?.message || candidate?.message || 'Upload failed.');
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
