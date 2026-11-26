import { environment } from '../../../environments/environment';

/**
 * True only for requests to our own API (relative paths or environment.apiUrl).
 *
 * Third-party calls (e.g. GitHub Releases used by the APK CTAs) must not receive
 * session cookies, auth/CSRF headers or a custom X-Request-Id: GitHub answers
 * preflights with `Access-Control-Allow-Origin: *`, which browsers reject when
 * the request uses `credentials: include`.
 */
export function isAppApiRequest(url: string): boolean {
  if (!url || url.startsWith('//')) return false;
  if (url.startsWith('/')) return true;

  let base: URL;
  let target: URL;
  try {
    base = new URL(environment.apiUrl, 'http://localhost');
    target = new URL(url, base);
  } catch {
    return false;
  }

  if (target.origin !== base.origin) return false;
  const prefix = base.pathname.replace(/\/+$/, '');
  return target.pathname === prefix || target.pathname.startsWith(`${prefix}/`);
}
