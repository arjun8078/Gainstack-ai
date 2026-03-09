import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

 const authservice=inject(AuthService);

 const token =authservice.getToken();

 const publicUrls=['/auth/login','/auth/register'];

 const isPublicUrl=publicUrls.some(url=>req.url.includes(url));

  //  If public URL or no token, continue without modification
  if (isPublicUrl || !token) {
    console.log('🔓 Public request or no token:', req.url);
    return next(req);
  }

  //Clone req
  const clonedRequest=req.clone({
    setHeaders:{
      Authorization:`Bearer ${token}`
    }
  })


   return next(clonedRequest).pipe(
    tap({
      error: (error) => {
        if (error.status === 401) {
          console.log('❌ 401 Unauthorized - Token expired or invalid');
          authservice.logout();  // Auto logout
        }
      }
    })
  );











};
