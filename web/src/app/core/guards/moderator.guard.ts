import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Trust desk / Blog Approval — moderator or platform admin after `/auth/me`.
 */
export const moderatorGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ensureSession();

  if (auth.isSignedIn() && auth.isModerator()) {
    return true;
  }

  return router.createUrlTree(['/sign-in'], {
    queryParams: { returnUrl: state.url, mode: 'admin' },
  });
};
