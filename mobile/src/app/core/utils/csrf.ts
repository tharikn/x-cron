const CSRF_COOKIE = 'xcron_csrf';

export function readCsrfCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CSRF_COOKIE}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(CSRF_COOKIE.length + 1)) || null;
}

export function csrfHeaders(): Record<string, string> {
  const token = readCsrfCookie();
  return token ? { 'X-CSRF-Token': token } : {};
}
