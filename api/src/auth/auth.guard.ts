import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthStore } from './auth.store';
import { IS_PUBLIC_KEY, ROLES_KEY } from './decorators';
import { UserRole } from './auth.types';

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
    const header = request.headers['authorization'] || request.headers['Authorization'];
    const token = header?.startsWith('Bearer ')
      ? header.slice('Bearer '.length).trim()
      : undefined;
    const user = this.authStore.getUserByToken(token);

    if (user) {
      request.user = user;
    }

    if (isPublic && roles.length === 0) {
      return true;
    }

    if (!user) {
      if (isPublic) return true;
      throw new UnauthorizedException('Sign-in required');
    }

    if (roles.length && !roles.some((role) => user.roles.includes(role))) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
