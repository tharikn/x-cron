import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

function newRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `xcron-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Attach X-Request-Id and stamp correlationId onto HttpErrorResponse. */
export const correlationInterceptor: HttpInterceptorFn = (req, next) => {
  const id = req.headers.get('X-Request-Id') || newRequestId();
  return next(req.clone({ setHeaders: { 'X-Request-Id': id } })).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const fromHeader = err.headers?.get('X-Request-Id');
        const fromBody =
          err.error &&
          typeof err.error === 'object' &&
          typeof (err.error as { correlationId?: unknown }).correlationId ===
            'string'
            ? (err.error as { correlationId: string }).correlationId
            : null;
        (err as HttpErrorResponse & { correlationId?: string }).correlationId =
          fromBody || fromHeader || id;
      }
      return throwError(() => err);
    }),
  );
};
