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

  console.log('🔐 Authenticated request:', req.url);

  // Just pass through - don't handle 401 errors here!
  // Let individual services decide what to do with errors
  return next(clonedRequest);











};
