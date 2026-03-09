import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = (route, state) => {

  const authservice=inject(AuthService);
  const router=inject(Router);


  if(!authservice.isLoggedIn()){
    return true
  } else {
    router.navigate(['/dashboard']);
    return false
  }
};
