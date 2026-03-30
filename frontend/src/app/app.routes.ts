import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { guestGuard } from './guards/auth/guards/guest-guard';
import { authGuard } from './guards/auth/guards/auth-guard';
import { Register } from './components/login/register/register/register';
import { Dashboard } from './components/dashboard/dashboard/dashboard';
import { AddWorkout } from './components/pages/add-workout/add-workout';
import { WorkoutList } from './components/pages/workout-list/workout-list';

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
  },
  { path: 'add-workout',
    component: AddWorkout,
     canActivate: [authGuard]
  },
  { path: 'add-workout/:id',
    component: AddWorkout,
     canActivate: [authGuard]
  },
  { path: 'workouts', component: WorkoutList, canActivate: [authGuard] },
];
