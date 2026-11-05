import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { extractAccessToken, extractTabId } from '../security/token.util';
import { AuthStore } from './auth.store';
import { IS_PUBLIC_KEY, ROLES_KEY } from './decorators';
import { UserRole } from './auth.types';

/**
 * Authentication only. Attaches `request.user` from HttpOnly access cookie
 * or Authorization Bearer. Role checks live in RolesGuard.
 * `@Public()` never bypasses `@Roles()`.
 *
 * When `AUTH_SINGLE_TAB=1` (default), authenticated calls must send matching
 * `X-Tab-Id` (one active browser tab per session).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authStore: AuthStore,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const roles =
      this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    const request = context.switchToHttp().getRequest<Request & { user?: unknown }>();
    const token = extractAccessToken(request);
    const tabId = extractTabId(request);
    const requiresAuth = roles.length > 0 || !isPublic;

    let user = undefined as ReturnType<AuthStore['getUserByToken']>;
    if (token) {
      try {
        user = this.authStore.getUserByToken(token, {
          tabId,
          enforceTab: true,
        });
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'unauthorized';
        // Public login/register must still run when a stale access cookie is
        // bound to a previous X-Tab-Id (common on Capacitor cold start).
        if (!requiresAuth) {
          user = undefined;
        } else {
          throw new UnauthorizedException(reason);
        }
      }
    }

    if (user) {
      request.user = user;
    }

    if (requiresAuth && !user) {
      throw new UnauthorizedException('Sign-in required');
    }

    return true;
  }
}
