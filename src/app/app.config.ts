import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { MockBackendInterceptor } from './services/mock/mock.interceptor';
import { provideServerRouting, ServerRoute, RenderMode } from '@angular/ssr';

// Convert routes to ServerRoute[] (Exclude non-component routes)
const serverRoutes: ServerRoute[] = routes
  .filter(route => route.component) // Only include component-based routes
  .map(route => ({
    ...route,
    path: route.path || '/',
    renderMode: RenderMode.Server,
    children: route.children?.filter(child => child.component).map(child => ({
      ...child,
      path: child.path || '',
      renderMode: RenderMode.Server
    })) || []
  }));

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true },
    provideServerRouting(serverRoutes)
  ]
};
