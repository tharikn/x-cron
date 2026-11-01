import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Admin tabs only after backend `/auth/me` confirms admin.
 * Guests / seekers never land on Post / Ads / Import.
 */
export const adminGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ensureSession();

  if (auth.isSignedIn() && auth.isAdmin()) {
    return true;
  }

  return router.createUrlTree(['/tabs/account'], {
    queryParams: { returnUrl: state.url, mode: 'admin' },
  });
};
