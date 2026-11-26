import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Portfolio editor routes need a signed-in session. Kept local to the
 * dynamic-portfolios module so the module stays removable without touching the
 * shared guards used by existing features.
 */
export const portfolioGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ensureSession();
  if (auth.isSignedIn()) {
    return true;
  }
  return router.createUrlTree(['/sign-in'], {
    queryParams: { returnUrl: state.url },
  });
};
