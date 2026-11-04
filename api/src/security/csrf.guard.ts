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
 * Bearer-only clients (no access cookie) skip CSRF — native Capacitor path.
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (SAFE.has(req.method.toUpperCase())) return true;

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

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
