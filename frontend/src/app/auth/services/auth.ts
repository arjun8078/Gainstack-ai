import { Injectable,signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AuthResponse,LoginRequest, User} from '../models/user.model';
import { environment } from '../../../environment/environment';
import { catchError, finalize, from, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // Add this constant
  private readonly TOKEN_KEY = 'taskflow_auth_token';
  private readonly  apiUrl=environment.apiUrl

   // Signal for current user
  currentUser = signal<User | null>(null);  // ← NEW!
  isLoading = signal(false);  // ← NEW! For loading state


   constructor(private http: HttpClient,private router:Router) {
    console.log('🚀 Auth Service initialized');
  }


  //Save token in local storage
  private saveToken(token:string):void{
    localStorage.setItem(this.TOKEN_KEY, token);

  }

  //Get token from local storage
  public getToken():string|null{
    return localStorage.getItem(this.TOKEN_KEY);
  }

  //Remove token from local storage
  private removeToken():void{
    localStorage.removeItem(this.TOKEN_KEY);
  }

  login(email:string,password:string): Observable<AuthResponse>{
    const loginData={
      email,
      password
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`,loginData).pipe(tap(response=>{
      this.saveToken(response.token);
    }))
  }

  register(name:string,email:string,password:string):Observable<AuthResponse>{
    const registerData={
      name,
      email,
      password
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`,registerData).pipe(tap(response=>{
      this.saveToken(response.token);
    }))
  }

  logout():void{
    this.removeToken();
    this.router.navigate(['/login']);

  }

  isLoggedIn():boolean{
    let token=this.getToken();
     if(!token){
      return false
     }

    return !this.isTokenExpired(token);
  }

  isTokenExpired(token:string):boolean{
    try {
  const decoded=jwtDecode(token);
  const exp=decoded.exp;

  if (!exp) {
    return true;
  }

   const expirationTime = exp * 1000;
   const expirationDate = new Date(expirationTime);

   const currentTime = Date.now();
     const isExpired = currentTime > expirationTime;

    return isExpired;

} catch (error) {
  return true;
}

  }

  getCurrentUser():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/auth/me`).pipe(tap(user=>{
      console.log(user);
      this.currentUser.set(user.data.user);
    }),
  catchError(error=>{
    console.error('❌ Failed to fetch user:', error);
        if (error.status === 401) {
          this.logout();
        }
        return throwError(() => error);
  }),
  finalize(() => this.isLoading.set(false))
)
  }
}
