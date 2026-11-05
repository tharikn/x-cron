import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { timingSafeEqual } from 'crypto';
import { readCsrfCookie } from './auth-cookies';
import { ACCESS_COOKIE, CSRF_HEADER } from './security.constants';

const SAFE = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Double-submit CSRF when an access cookie is present.
 * Skip when the client sends Authorization Bearer (Capacitor / cross-origin
 * clients cannot read `xcron_csrf` from another host via document.cookie, but
 * still attach API cookies with credentials — Bearer is not auto-sent on CSRF).
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (SAFE.has(req.method.toUpperCase())) return true;

    if (hasBearerAuthorization(req)) return true;

    const cookies = (req.cookies ?? {}) as Record<string, string | undefined>;
    const accessCookie = cookies[ACCESS_COOKIE]?.trim();
    if (!accessCookie) return true;

    const cookieToken = readCsrfCookie(req);
    const headerRaw = req.headers[CSRF_HEADER];
    const headerToken =
      typeof headerRaw === 'string'
        ? headerRaw.trim()
        : Array.isArray(headerRaw)
          ? headerRaw[0]?.trim()
          : undefined;

    if (!cookieToken || !headerToken || !safeEqual(cookieToken, headerToken)) {
      throw new ForbiddenException('CSRF validation failed');
    }
    return true;
  }
}

function hasBearerAuthorization(req: Request): boolean {
  const header =
    (req.headers['authorization'] as string | undefined) ||
    (req.headers['Authorization'] as string | undefined);
  return !!header?.startsWith('Bearer ') && header.length > 'Bearer '.length;
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
