import { Component, computed } from '@angular/core';
import { AuthService } from '../../../auth/services/auth';
import { SHARED_IMPORTS } from '../../../shared/material-impors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

currentUser!: any;  // Declare but don't assign
  isLoading!: any;
  greeting!: any;
   // Static stats (will be replaced with real data later)
  stats = {
    workoutsThisWeek: 0,
    exercisesLogged: 0,
    volumeThisWeek: 0
  };

  motivationalQuote = "Your only limit is you!";


  constructor(public authService:AuthService){
        // Get user from AuthService signal
  this.currentUser = this.authService.currentUser;
  this.isLoading = this.authService.isLoading;

  // Computed signal for greeting
  this.greeting = computed(() => {
    const user = this.currentUser();
    return user ? `Welcome, ${user.name}!` : 'Welcome!';
  });
  }

    // Placeholder methods (not functional yet)
  addWorkout() {
    console.log('Add workout clicked - coming soon!');
    // TODO: Navigate to add workout page
  }


  logout() {
    console.log('🚪 Logout clicked');
    this.authService.logout();
    // AuthService.logout() already navigates to /login!
  }

   viewAllWorkouts() {
    console.log('View all workouts clicked - coming soon!');
    // TODO: Navigate to workouts list page
  }

}
