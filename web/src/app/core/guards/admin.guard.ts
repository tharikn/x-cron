import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Blocks admin routes until `/auth/me` confirms an admin session.
 * Non-admins never reach the page (no “sign in as admin” dead-end UI).
 */
export const adminGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ensureSession();

  if (auth.isSignedIn() && auth.isAdmin()) {
    return true;
  }

  return router.createUrlTree(['/sign-in'], {
    queryParams: { returnUrl: state.url, mode: 'admin' },
  });
};
