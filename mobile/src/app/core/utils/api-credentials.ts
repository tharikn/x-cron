import { Capacitor } from '@capacitor/core';

/**
 * Native Capacitor must not attach cross-origin API cookies.
 * Cookies trigger CSRF while `document.cookie` cannot read `xcron_csrf`
 * on another host — after restart Bearer is gone and saves fail with
 * "CSRF validation failed". Browser/`ng serve` keeps cookie dual-auth.
 */
export function useApiCredentials(): boolean {
  return !Capacitor.isNativePlatform();
}
