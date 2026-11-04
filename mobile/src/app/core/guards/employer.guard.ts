import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Post / employer tools after `/auth/me` confirms employer or admin. */
export const employerGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ensureSession();

  if (auth.isSignedIn() && auth.isEmployer()) {
    return true;
  }

  return router.createUrlTree(['/tabs/settings'], {
    queryParams: { tab: 'account', returnUrl: state.url, mode: 'employer' },
  });
};
