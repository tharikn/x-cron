/** HttpOnly access cookie (short-lived). */
export const ACCESS_COOKIE = 'xcron_access';
/** HttpOnly refresh cookie (long-lived). */
export const REFRESH_COOKIE = 'xcron_refresh';
/** Readable CSRF twin for double-submit on cookie-authenticated mutating requests. */
export const CSRF_COOKIE = 'xcron_csrf';
/** Client tab binding header (one active tab per browser session). */
export const TAB_ID_HEADER = 'x-tab-id';
/** CSRF request header (must match CSRF_COOKIE). */
export const CSRF_HEADER = 'x-csrf-token';

/** Named Nest throttler (single global tracker; route decorators override). */
export const THROTTLE_DEFAULT = 'default';
