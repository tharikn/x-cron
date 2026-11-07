import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TabSessionService } from '../services/tab-session.service';
import { useApiCredentials } from '../utils/api-credentials';
import { csrfHeaders } from '../utils/csrf';

const AUTH_ENTRY_MARKERS = [
  '/auth/google',
  '/auth/admin/login',
  '/auth/register',
  '/auth/login',
  '/auth/refresh',
  '/devices/unlink',
];

function isAuthEntry(url: string): boolean {
  return AUTH_ENTRY_MARKERS.some((marker) => url.includes(marker));
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const tabs = inject(TabSessionService);
  const withCredentials = useApiCredentials();

  const token = auth.token();
  const secured = req.clone({
    withCredentials,
    setHeaders: {
      ...tabs.headers(),
      ...(withCredentials ? csrfHeaders() : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return next(secured).pipe(
    catchError((err: unknown) => {
      if (
        !(err instanceof HttpErrorResponse) ||
        err.status !== 401 ||
        isAuthEntry(req.url) ||
        req.headers.has('X-Retry-After-Refresh')
      ) {
        return throwError(() => err);
      }

      if (!auth.refreshToken() && !auth.hasCookieSession()) {
        if (auth.token()) auth.clearSession();
        return throwError(() => err);
      }

      return from(auth.refreshAccessToken()).pipe(
        switchMap((ok) => {
          if (!ok) {
            auth.clearSession();
            return throwError(() => err);
          }
          const nextToken = auth.token();
          return next(
            req.clone({
              withCredentials,
              setHeaders: {
                ...tabs.headers(),
                ...(withCredentials ? csrfHeaders() : {}),
                ...(nextToken ? { Authorization: `Bearer ${nextToken}` } : {}),
                'X-Retry-After-Refresh': '1',
              },
            }),
          );
        }),
      );
    }),
  );
};
