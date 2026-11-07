import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { AppComponent } from './app/app.component';
import { apiLoadingInterceptor } from './app/core/interceptors/api-loading.interceptor';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { correlationInterceptor } from './app/core/interceptors/correlation.interceptor';
import { AuthService } from './app/core/services/auth.service';
import { xcronNavAnimation } from './app/core/utils/xcron-nav-animation';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ navAnimation: xcronNavAnimation }),
    provideHttpClient(
      withInterceptors([
        correlationInterceptor,
        authInterceptor,
        apiLoadingInterceptor,
      ]),
    ),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const auth = inject(AuthService);
        return () => auth.ensureSession();
      },
    },
  ],
});

