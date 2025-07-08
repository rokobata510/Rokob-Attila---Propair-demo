import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { tap, catchError, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth';
  private _isAuthenticated = signal(false);
  
  isAuthenticated = this._isAuthenticated.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    const token = localStorage.getItem('auth_token');
    this._isAuthenticated.set(!!token && this.isTokenValid(token));
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  }

  register(user: { email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        this._isAuthenticated.set(true);
        this.router.navigate(['/tickets']);
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this._isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}