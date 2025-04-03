import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { mockUsers } from './mock-data';

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return of(null).pipe(
      mergeMap(() => this.handleRoute(request, next)),
      materialize(),
      delay(500),
      dematerialize()
    );
  }

  private handleRoute(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // Mock login endpoint
    if (url.endsWith('/api/login') && method === 'POST') {
      return this.handleLogin(body);
    }

    // Mock protected user endpoint
    if (url.endsWith('/api/user') && method === 'GET') {
      return this.handleGetUser(headers);
    }

    return next.handle(request);
  }

  private handleLogin(body: any): Observable<HttpEvent<any>> {
    const { username, password } = body;
    const user = mockUsers.find(u => 
      u.username === username && u.password === password
    );

    if (!user) {
      return this.error('Invalid username or password', 401);
    }

    return this.ok({
      id: user.id,
      username: user.username,
      email: user.email,
      token: `fake-jwt-token-${user.id}`
    });
  }

  private handleGetUser(headers: any): Observable<HttpEvent<any>> {
    const authHeader = headers.get('Authorization');
    
    if (!authHeader?.startsWith('Bearer fake-jwt-token-')) {
      return this.error('Unauthorized: Invalid token', 401);
    }

    const userId = parseInt(authHeader.split('-').pop() || '', 10);
    const user = mockUsers.find(u => u.id === userId);

    return user 
      ? this.ok(user)
      : this.error('User not found', 404);
  }

  private ok(body?: any): Observable<HttpResponse<any>> {
    return of(new HttpResponse({ 
      status: 200, 
      body 
    }));
  }

  private error(message: string, status: number): Observable<never> {
    return throwError(() => new HttpErrorResponse({
      status,
      error: { message }
    }));
  }
}