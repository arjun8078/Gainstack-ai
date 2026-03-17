import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, LoginRequest, User } from '../models/user.model';
import { environment } from '../../../environment/environment';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Constants
  private readonly TOKEN_KEY = 'taskflow_auth_token';
  private readonly apiUrl = environment.apiUrl;

  // Signals
  currentUser = signal<User | null>(null);
  isLoading = signal(false);

  constructor(private http: HttpClient, private router: Router) {
    console.log('🚀 Auth Service initialized');
    console.log('🚀 Auth Service initialized');
  console.log('🔍 Initial token check:', localStorage.getItem(this.TOKEN_KEY)?.substring(0, 20));
    // this.loadUserFromToken();  // Load user on app start
 setTimeout(() => {
    this.loadUserFromToken();
  }, 0);
  }

  // Load user data if token exists (called on app start)
 public loadUserFromToken() {
  const token = this.getToken();
  console.log('🔄 loadUserFromToken - Token exists?', !!token);

  if (token && !this.isTokenExpired(token)) {
    console.log('✅ Valid token found, loading user...');
    this.getCurrentUser().subscribe({
      next: (response) => {
        console.log('✅ User loaded on init:', response.data.user);
      },
      error: (error) => {
        console.error('❌ Failed to load user on init:', error);
        console.log('⚠️ Calling logout due to error');
        // Token might be invalid, logout
        // this.logout();  // ← THIS might be the problem!
      }
    });
  } else {
    console.log('ℹ️ No valid token found');
    if (token) {
      console.log('⚠️ Token exists but is expired, clearing...');
      this.removeToken();
    }
  }
}


  // Get current user from backend
  getCurrentUser(): Observable<any> {
    this.isLoading.set(true);
    console.log('📡 Fetching current user from /me API');

    return this.http.get<any>(`${this.apiUrl}/auth/me`).pipe(
      tap(response => {
        console.log('✅ Current user fetched:', response.data.user);
        this.currentUser.set(response.data.user);
      }),
      catchError(error => {
        console.error('❌ Failed to fetch user:', error);
        // if (error.status === 401) {
        //   this.logout();
        // }
        return throwError(() => error);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  // Login
  login(email: string, password: string): Observable<AuthResponse> {
    this.isLoading.set(true);
    const loginData = { email, password };

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, loginData).pipe(
      tap(response => {
        console.log('✅ Login successful');
        this.saveToken(response.token);
        // Set user from login response if available
        if (response.data?.user) {
          this.currentUser.set(response.data.user);
        }
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  // Register
  register(name: string, email: string, password: string): Observable<AuthResponse> {
    this.isLoading.set(true);
    const registerData = { name, email, password };

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, registerData).pipe(
      tap(response => {
        console.log('✅ Registration successful');
        this.saveToken(response.token);
        // Set user from register response if available
        if (response.data?.user) {
          this.currentUser.set(response.data.user);
        }
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  // Logout
  logout(): void {
     console.log('🚪 LOGOUT CALLED');
  console.trace('Called from:');  // Shows who called logout
  this.removeToken();
  this.currentUser.set(null);
  this.router.navigate(['/login']);
  }

  // Token management
  private saveToken(token: string): void {
   console.log('💾 SAVING TOKEN:', token.substring(0, 20) + '...');
  console.trace('Called from:');  // Shows where it was called from
  localStorage.setItem(this.TOKEN_KEY, token);
  console.log('✅ Token saved, verify:', localStorage.getItem(this.TOKEN_KEY)?.substring(0, 20));
  }

  public getToken(): string | null {
      const token = localStorage.getItem(this.TOKEN_KEY);
  console.log('🔍 GETTING TOKEN:', token ? token.substring(0, 20) + '...' : 'NULL');
  return token;
  }

  private removeToken(): void {
    console.log('🗑️ REMOVING TOKEN');
  console.trace('Called from:');  // Shows where it was called from
  localStorage.removeItem(this.TOKEN_KEY);
  }

  // Check if logged in
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }

  // Check if token expired
  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp;

      if (!exp) {
        return true;
      }

      const expirationTime = exp * 1000;
      const currentTime = Date.now();
      const isExpired = currentTime > expirationTime;

      return isExpired;
    } catch (error) {
      return true;
    }
  }
}
