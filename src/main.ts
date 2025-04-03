import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Merge providers correctly without duplication issues
bootstrapApplication(AppComponent, {
  ...appConfig,  // Spread appConfig first
  providers: [
    ...(appConfig.providers || []), // Preserve existing providers in appConfig
    provideRouter(routes),  // Provide routing configuration
  ]
})
  .catch((err) => console.error(err));
