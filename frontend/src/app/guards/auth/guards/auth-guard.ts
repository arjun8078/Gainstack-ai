import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth';
import { takeUntil } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const authservice=inject(AuthService);
  const router=inject(Router);

  if(authservice.isLoggedIn()){
    return true
  }
  else{
      router.navigate(['/login']);
    return false
  }


};
