import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Admin-only tabs; otherwise send the user to Account admin password login. */
export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isSignedIn() && auth.isAdmin()) {
    return true;
  }

  return router.createUrlTree(['/tabs/account'], {
    queryParams: { returnUrl: state.url, mode: 'admin' },
  });
};
