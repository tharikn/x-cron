import { TestBed } from '@angular/core/testing';
import {
  type ActivatedRouteSnapshot,
  type CanActivateFn,
  provideRouter,
  Router,
  type RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { adminGuard } from './admin.guard';
import { employerGuard } from './employer.guard';

type Roles = { signedIn: boolean; employer?: boolean; admin?: boolean };

function setup(roles: Roles): { ensureSession: ReturnType<typeof vi.fn> } {
  const ensureSession = vi.fn().mockResolvedValue(undefined);
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      {
        provide: AuthService,
        useValue: {
          ensureSession,
          isSignedIn: () => roles.signedIn,
          isEmployer: () => !!roles.employer,
          isAdmin: () => !!roles.admin,
        },
      },
    ],
  });
  return { ensureSession };
}

async function run(guard: CanActivateFn, url = '/tabs/post'): Promise<unknown> {
  return TestBed.runInInjectionContext(() =>
    guard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
  );
}

function redirectOf(result: unknown): string {
  expect(result).toBeInstanceOf(UrlTree);
  return TestBed.inject(Router).serializeUrl(result as UrlTree);
}

describe('employerGuard', () => {
  it('confirms the session via /auth/me and admits employers', async () => {
    const { ensureSession } = setup({ signedIn: true, employer: true });
    expect(await run(employerGuard)).toBe(true);
    expect(ensureSession).toHaveBeenCalledOnce();
  });

  it('sends seekers to Account in employer mode with a returnUrl', async () => {
    setup({ signedIn: true });
    expect(redirectOf(await run(employerGuard, '/tabs/post'))).toBe(
      '/tabs/account?returnUrl=%2Ftabs%2Fpost&mode=employer',
    );
  });

  it('does not trust a cached employer flag without a session', async () => {
    setup({ signedIn: false, employer: true });
    expect(redirectOf(await run(employerGuard))).toContain('mode=employer');
  });
});

describe('adminGuard', () => {
  it('admits admins only', async () => {
    setup({ signedIn: true, admin: true });
    expect(await run(adminGuard, '/tabs/import')).toBe(true);
  });

  it('sends employers and guests to Account in admin mode', async () => {
    setup({ signedIn: true, employer: true });
    expect(redirectOf(await run(adminGuard, '/tabs/job-fare'))).toBe(
      '/tabs/account?returnUrl=%2Ftabs%2Fjob-fare&mode=admin',
    );
  });
});
