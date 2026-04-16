import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginDTO, RegisterDTO, AuthResponse } from '../../shared/models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor() {
    const token = this.getToken();
    this._isLoggedIn.next(!!token);
  }
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private tokenKey = 'qty_token';
  private userKey = 'qty_user';

  private _isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this._isLoggedIn.asObservable();

  private _currentUser = new BehaviorSubject<{ email: string; fullName: string } | null>(
    this.getStoredUser()
  );
  currentUser$ = this._currentUser.asObservable();

  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.tokenKey);

      if (!token) return false;

      // 🔥 check expiry
      if (this.isTokenExpired(token)) {
        this.logout(); // auto logout
        return false;
      }

      return true;
    }
    return false;
  }

  private getStoredUser() {
    if (isPlatformBrowser(this.platformId)) {
      const u = localStorage.getItem(this.userKey);
      return u ? JSON.parse(u) : null;
    }
    return null;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.tokenKey);

      if (token && this.isTokenExpired(token)) {
        this.logout(); // auto logout
        return null;
      }

      return token;
    }
    return null;
  }

  login(dto: LoginDTO): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/Auth/login`, dto).pipe(
      tap((res) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.tokenKey, res.token);
          const user = { email: dto.email, fullName: res.fullName || dto.email };
          localStorage.setItem(this.userKey, JSON.stringify(user));
          this._currentUser.next(user);
        }
        this._isLoggedIn.next(true);
      })
    );
  }

  register(dto: RegisterDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Auth/register`, dto);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this._isLoggedIn.next(false);
    this._currentUser.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this._isLoggedIn.value;
  }
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp; // seconds
      const now = Math.floor(Date.now() / 1000);

      return expiry < now; // true = expired
    } catch (e) {
      return true;
    }
  }
}

