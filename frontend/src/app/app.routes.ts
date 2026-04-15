import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { guestGuard } from './guards/auth/guards/guest-guard';
import { authGuard } from './guards/auth/guards/auth-guard';
import { Register } from './components/login/register/register/register';
import { Dashboard } from './components/dashboard/dashboard/dashboard';
import { AddWorkout } from './components/pages/add-workout/add-workout';
import { WorkoutList } from './components/pages/workout-list/workout-list';
import { AiChat } from './components/pages/ai-chat/ai-chat';
import { DashboardLayout } from './components/pages/dashboard-layout/dashboard-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },

  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'workouts', component: WorkoutList },
      { path: 'add-workout', component: AddWorkout },
      { path: 'add-workout/:id', component: AddWorkout },
      { path: 'ai-chat', component: AiChat },
    ]
  },

  { path: '**', redirectTo: 'login' }
];
