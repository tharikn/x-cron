import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { AuthUser, UserRole } from './auth.types';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser | undefined => {
    const request = ctx.switchToHttp().getRequest<{ user?: AuthUser }>();
    return request.user;
  },
);

export const AccessToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<{ headers: Record<string, string> }>();
    const header = request.headers['authorization'] || request.headers['Authorization'];
    if (!header?.startsWith('Bearer ')) return undefined;
    return header.slice('Bearer '.length).trim();
  },
);
