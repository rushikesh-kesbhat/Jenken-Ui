import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';  // Import Router for navigation
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private http: HttpClient,
    private router: Router  // Inject Router for navigation
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Login method: Sends credentials to the backend and stores the token
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>('/api/login', { username, password }).pipe(
      tap({
        next: (response) => this.storeToken(response.token),  // Store token on successful login
        error: (error) => {
          console.error('Login failed:', error);  // Log error to console
          alert('Login failed. Please check your credentials.');
        }
      }),
      map(() => {
        this.router.navigate(['/dashboard']);  // Redirect to dashboard after login
        return true;
      }),  // Return true if login is successful
      catchError(error => throwError(() => new Error(
        error.error?.message || 'Login failed. Please check your credentials.'
      )))
    );
  }

  // Logout method: Clears the stored token and redirects to login
  logout(): void {
    this.clearToken();
    this.router.navigate(['/login']);  // Redirect to login after logout
  }

  // Returns the current token from localStorage (or null if not available)
  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.AUTH_TOKEN_KEY) : null;
  }

  // Checks if the user is logged in by verifying the token's existence and expiration
  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;  // Return false if not on the browser
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);  // Check if token exists and is not expired
  }

  // Stores the token in localStorage
  private storeToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    }
  }

  // Clears the token from localStorage
  private clearToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
    }
  }

  // Checks if the JWT token is expired by decoding it and comparing the expiration date
  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decode the JWT token (base64)
      const expirationDate = new Date(decodedToken.exp * 1000);  // Convert expiration time from seconds to milliseconds
      return expirationDate < new Date();  // Return true if token is expired
    } catch (error) {
      return true;  // If token decoding fails, treat it as expired
    }
  }
}
