import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { ApiLoadingService } from '../services/api-loading.service';

/** Background / fire-and-forget calls — do not drive the global skeleton overlay. */
const SILENT_PATH_MARKERS = [
  '/ads/',
  '/auth/me',
  '/auth/refresh',
  '/devices',
  '/notifications',
  '/preferences',
  '/i18n',
  '/languages',
  '/feedback',
  '/ai/help',
];

function isSilent(url: string): boolean {
  return SILENT_PATH_MARKERS.some((marker) => url.includes(marker));
}

export const apiLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (isSilent(req.url)) {
    return next(req);
  }

  const loading = inject(ApiLoadingService);
  loading.begin();
  return next(req).pipe(finalize(() => loading.end()));
};
