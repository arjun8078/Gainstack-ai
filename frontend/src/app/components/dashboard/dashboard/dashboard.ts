import { Component, computed, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth';
import { SHARED_IMPORTS } from '../../../shared/material-impors';
import { Workouts } from '../../../auth/services/workouts';
import { Router } from '@angular/router';
import { Navbar } from '../../../shared/navbar/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SHARED_IMPORTS,Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

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


  constructor(public authService:AuthService,private workoutService: Workouts,private router: Router) {
        // Get user from AuthService signal
  this.currentUser = this.authService.currentUser;
  this.isLoading = this.authService.isLoading;

  // Computed signal for greeting
  this.greeting = computed(() => {
    const user = this.currentUser();
    return user ? `Welcome, ${user.name}!` : 'Welcome!';
  });
  }

  ngOnInit(): void {
     this.loadWorkoutStats();
  }

  loadWorkoutStats() {
    console.log('📊 Loading workout stats...');
    this.isLoading.set(true);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    this.workoutService.getWorkouts({
      startDate: weekAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    }).subscribe({
      next: (response) => {
        console.log('✅ Workouts loaded:', response);

        const workouts = response.data.workouts;

        this.stats.workoutsThisWeek = workouts.length;

        let totalExercises = 0;
        let totalVolume = 0;

        workouts.forEach(workout => {
          totalExercises += workout.exercises.length;
          totalVolume += workout.totalVolume || 0;
        });

        this.stats.exercisesLogged = totalExercises;
        this.stats.volumeThisWeek = totalVolume;
        this.isLoading.set(false);

        console.log('📊 Stats calculated:', this.stats);
      },
      error: (error) => {
        console.error('❌ Failed to load workouts:', error);
      }
    });
  }

  // In dashboard.component.ts:
addWorkout() {
  this.router.navigate(['/add-workout']);
}


  logout() {
    console.log('🚪 Logout clicked');
    this.authService.logout();
    // AuthService.logout() already navigates to /login!
  }

  viewAllWorkouts() {
  this.router.navigate(['/workouts']);
}

}
