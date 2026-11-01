import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthStore } from './auth.store';
import { IS_PUBLIC_KEY, ROLES_KEY } from './decorators';
import { UserRole } from './auth.types';

/**
 * Authentication only. Attaches `request.user` from Bearer token.
 * Role checks live in RolesGuard. Any `@Roles(...)` route requires a session
 * even if `@Public()` is also present (Public never bypasses RBAC).
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

    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string>;
      user?: unknown;
    }>();
    const header =
      request.headers['authorization'] || request.headers['Authorization'];
    const token = header?.startsWith('Bearer ')
      ? header.slice('Bearer '.length).trim()
      : undefined;
    const user = this.authStore.getUserByToken(token);

    if (user) {
      request.user = user;
    }

    const requiresAuth = roles.length > 0 || !isPublic;
    if (requiresAuth && !user) {
      throw new UnauthorizedException('Sign-in required');
    }

    return true;
  }
}
