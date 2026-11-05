import type { Request } from 'express';
import { ACCESS_COOKIE, REFRESH_COOKIE, TAB_ID_HEADER } from './security.constants';

type CookieBag = Record<string, string | undefined>;

function cookiesOf(req: Request): CookieBag {
  return (req.cookies ?? {}) as CookieBag;
}

/**
 * Prefer Authorization Bearer when present (native / dual-auth clients), then
 * HttpOnly access cookie. Cookie-first caused session_tab_mismatch when a stale
 * API cookie outlived a Capacitor WebView tab id / in-memory Bearer.
 */
export function extractAccessToken(req: Request): string | undefined {
  const header =
    (req.headers['authorization'] as string | undefined) ||
    (req.headers['Authorization'] as string | undefined);
  if (header?.startsWith('Bearer ')) {
    const token = header.slice('Bearer '.length).trim();
    if (token) return token;
  }

  const fromCookie = cookiesOf(req)[ACCESS_COOKIE]?.trim();
  return fromCookie || undefined;
}

/** Prefer JSON body refresh; fall back to HttpOnly refresh cookie. */
export function extractRefreshToken(
  req: Request,
  bodyToken?: string,
): string | undefined {
  const fromBody = bodyToken?.trim();
  if (fromBody) return fromBody;
  return cookiesOf(req)[REFRESH_COOKIE]?.trim() || undefined;
}

export function extractTabId(req: Request): string | undefined {
  const raw = req.headers[TAB_ID_HEADER];
  if (typeof raw === 'string' && raw.trim()) return raw.trim();
  if (Array.isArray(raw) && raw[0]?.trim()) return raw[0].trim();
  return undefined;
}
