import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
// import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { withRouterConfig } from '@angular/router';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, 
      withViewTransitions(),
      withRouterConfig({
        onSameUrlNavigation: 'reload' 
      })
    ),
    provideClientHydration(),
    // provideAnimations(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    )
  ]
};
