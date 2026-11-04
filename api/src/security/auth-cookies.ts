import { randomBytes } from 'crypto';
import type { Request, Response } from 'express';
import {
  ACCESS_COOKIE,
  CSRF_COOKIE,
  REFRESH_COOKIE,
} from './security.constants';

export interface AuthCookieTokens {
  token: string;
  refreshToken: string;
  /** Access cookie Max-Age in seconds. */
  accessMaxAgeSec: number;
  /** Refresh cookie Max-Age in seconds. */
  refreshMaxAgeSec: number;
}

function isProd(): boolean {
  return (process.env.NODE_ENV ?? 'development') === 'production';
}

function sameSite(): 'lax' | 'none' | 'strict' {
  const raw = (process.env.AUTH_COOKIE_SAMESITE ?? '').trim().toLowerCase();
  if (raw === 'none' || raw === 'lax' || raw === 'strict') return raw;
  // Cross-origin web↔API (Render) needs None+Secure; local same-host ports use Lax.
  return isProd() ? 'none' : 'lax';
}

function secureCookies(): boolean {
  if ((process.env.AUTH_COOKIE_SECURE ?? '').trim() === '1') return true;
  if ((process.env.AUTH_COOKIE_SECURE ?? '').trim() === '0') return false;
  return isProd() || sameSite() === 'none';
}

function baseOptions(maxAgeSec: number) {
  return {
    httpOnly: true,
    secure: secureCookies(),
    sameSite: sameSite(),
    path: '/',
    maxAge: Math.max(1, maxAgeSec) * 1000,
  } as const;
}

/** Attach access + refresh HttpOnly cookies and a readable CSRF twin. */
export function setAuthCookies(res: Response, tokens: AuthCookieTokens): string {
  const csrf = randomBytes(24).toString('base64url');
  res.cookie(ACCESS_COOKIE, tokens.token, baseOptions(tokens.accessMaxAgeSec));
  res.cookie(
    REFRESH_COOKIE,
    tokens.refreshToken,
    baseOptions(tokens.refreshMaxAgeSec),
  );
  res.cookie(CSRF_COOKIE, csrf, {
    httpOnly: false,
    secure: secureCookies(),
    sameSite: sameSite(),
    path: '/',
    maxAge: Math.max(1, tokens.refreshMaxAgeSec) * 1000,
  });
  return csrf;
}

export function clearAuthCookies(res: Response): void {
  const cleared = {
    httpOnly: true,
    secure: secureCookies(),
    sameSite: sameSite(),
    path: '/',
    maxAge: 0,
  } as const;
  res.cookie(ACCESS_COOKIE, '', cleared);
  res.cookie(REFRESH_COOKIE, '', cleared);
  res.cookie(CSRF_COOKIE, '', {
    ...cleared,
    httpOnly: false,
  });
}

export function readCsrfCookie(req: Request): string | undefined {
  const cookies = (req.cookies ?? {}) as Record<string, string | undefined>;
  return cookies[CSRF_COOKIE]?.trim() || undefined;
}

export function accessTtlSeconds(): number {
  const raw = Number(process.env.AUTH_ACCESS_TTL_MINUTES ?? '15');
  const minutes =
    Number.isFinite(raw) && raw >= 1 && raw <= 24 * 60 ? raw : 15;
  return minutes * 60;
}

export function refreshTtlSecondsFromDays(days: number): number {
  const safe = Number.isFinite(days) && days >= 1 ? days : 30;
  return safe * 24 * 60 * 60;
}
