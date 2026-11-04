import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const employerGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ensureSession();
  if (auth.isSignedIn() && (auth.isEmployer() || auth.isAdmin())) {
    return true;
  }
  return router.createUrlTree(['/settings/account'], {
    queryParams: { returnUrl: state.url, mode: 'employer' },
  });
};
