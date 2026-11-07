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
import { moderatorGuard } from './moderator.guard';

type Roles = { signedIn: boolean; employer?: boolean; admin?: boolean; moderator?: boolean };

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
          isModerator: () => !!roles.moderator,
        },
      },
    ],
  });
  return { ensureSession };
}

async function run(guard: CanActivateFn, url = '/protected'): Promise<unknown> {
  return TestBed.runInInjectionContext(() =>
    guard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
  );
}

function redirectOf(result: unknown): string {
  expect(result).toBeInstanceOf(UrlTree);
  return TestBed.inject(Router).serializeUrl(result as UrlTree);
}

describe('employerGuard', () => {
  it('confirms the session via /auth/me before deciding', async () => {
    const { ensureSession } = setup({ signedIn: true, employer: true });
    expect(await run(employerGuard)).toBe(true);
    expect(ensureSession).toHaveBeenCalledOnce();
  });

  it('lets platform admins through', async () => {
    setup({ signedIn: true, admin: true });
    expect(await run(employerGuard)).toBe(true);
  });

  it('bounces seekers to employer sign-in with a returnUrl', async () => {
    setup({ signedIn: true });
    expect(redirectOf(await run(employerGuard, '/post'))).toBe(
      '/sign-in?returnUrl=%2Fpost&mode=employer',
    );
  });

  it('bounces guests', async () => {
    setup({ signedIn: false, employer: true });
    expect(redirectOf(await run(employerGuard))).toContain('mode=employer');
  });
});

describe('adminGuard', () => {
  it('allows signed-in admins only', async () => {
    setup({ signedIn: true, admin: true });
    expect(await run(adminGuard)).toBe(true);
  });

  it('redirects employers and guests to admin sign-in', async () => {
    setup({ signedIn: true, employer: true });
    expect(redirectOf(await run(adminGuard, '/admin/tracking'))).toBe(
      '/sign-in?returnUrl=%2Fadmin%2Ftracking&mode=admin',
    );
  });

  it('does not trust a stale admin flag without a session', async () => {
    setup({ signedIn: false, admin: true });
    expect(redirectOf(await run(adminGuard))).toContain('mode=admin');
  });
});

describe('moderatorGuard', () => {
  it('allows moderators', async () => {
    setup({ signedIn: true, moderator: true });
    expect(await run(moderatorGuard)).toBe(true);
  });

  it('redirects non-moderators to admin sign-in', async () => {
    setup({ signedIn: true, employer: true });
    expect(redirectOf(await run(moderatorGuard, '/admin/trust'))).toBe(
      '/sign-in?returnUrl=%2Fadmin%2Ftrust&mode=admin',
    );
  });
});
