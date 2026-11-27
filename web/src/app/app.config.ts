import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import {
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { apiLoadingInterceptor } from './core/interceptors/api-loading.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { correlationInterceptor } from './core/interceptors/correlation.interceptor';
import { IdlePreloadStrategy } from './core/routing/idle-preload.strategy';
import { AuthService } from './core/services/auth.service';
import { PreferencesService } from './core/services/preferences.service';
import { ThemeService } from './core/services/theme.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withPreloading(IdlePreloadStrategy),
      withViewTransitions({ skipInitialTransition: true }),
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        correlationInterceptor,
        authInterceptor,
        apiLoadingInterceptor,
      ]),
    ),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({
        includePostRequests: false,
      }),
    ),
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      const theme = inject(ThemeService);
      const prefs = inject(PreferencesService);

      // Theme must be applied before the first paint so there is no flash.
      theme.init();

      // Do not block bootstrap on `/auth/me` or `/me/preferences`. Route
      // guards already await `ensureSession()`, so unguarded pages can render
      // immediately and signed-in chrome hydrates a moment later.
      void auth
        .ensureSession()
        .then(() => {
          if (auth.isSignedIn()) {
            void prefs.hydrateFromApi();
          }
        })
        .catch(() => {
          // Session validation is best-effort; guards handle the redirect.
        });
    }),
  ],
};
