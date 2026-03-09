import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { guestGuard } from './guards/auth/guards/guest-guard';
import { authGuard } from './guards/auth/guards/auth-guard';
import { Register } from './components/login/register/register/register';
import { Dashboard } from './components/dashboard/dashboard/dashboard';

export const routes: Routes = [
   // Redirect root to login
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  // Login route
  {
    path: 'login',
    component: Login,
     canActivate: [guestGuard]
  },
  { path: 'register', component: Register, canActivate: [guestGuard] },
    {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]   // ← Only for logged in users
  }
];
