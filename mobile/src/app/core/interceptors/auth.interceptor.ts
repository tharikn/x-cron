import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const AUTH_ENTRY_MARKERS = [
  '/auth/google',
  '/auth/admin/login',
  '/auth/otp/',
  '/auth/refresh',
  '/devices/unlink',
];

function isAuthEntry(url: string): boolean {
  return AUTH_ENTRY_MARKERS.some((marker) => url.includes(marker));
}

/**
 * On 401: try refresh once, retry the request; otherwise drop the local session.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  return next(req).pipe(
    catchError((err: unknown) => {
      if (
        !(err instanceof HttpErrorResponse) ||
        err.status !== 401 ||
        isAuthEntry(req.url) ||
        req.headers.has('X-Retry-After-Refresh')
      ) {
        return throwError(() => err);
      }

      if (!auth.refreshToken()) {
        if (auth.token()) auth.clearSession();
        return throwError(() => err);
      }

      return from(auth.refreshAccessToken()).pipe(
        switchMap((ok) => {
          if (!ok) {
            auth.clearSession();
            return throwError(() => err);
          }
          const token = auth.token();
          return next(
            req.clone({
              setHeaders: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'X-Retry-After-Refresh': '1',
              },
            }),
          );
        }),
      );
    }),
  );
};
