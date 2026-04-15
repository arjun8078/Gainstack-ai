import { Component, computed, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../auth/services/auth';
import { SHARED_IMPORTS } from '../../../shared/material-impors';
import { Workouts } from '../../../auth/services/workouts';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from '../../../shared/navbar/navbar';
import { Sidebar } from "../../../shared/sidebar/sidebar";

interface Stats {
  workoutsThisWeek: number;
  exercisesLogged: number;
  volumeThisWeek: number;
  totalWorkouts: number;
  totalVolume: number;
  totalTime: number;
  avgPerWorkout: number;
  avgDuration: number;
  consistency: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

isLoading = signal<boolean>(true);
  stats = signal<Stats>({
    workoutsThisWeek: 0,
    exercisesLogged: 0,
    volumeThisWeek: 0,
    totalWorkouts: 0,
    totalVolume: 0,
    totalTime: 0,
    avgPerWorkout: 0,
    avgDuration: 0,
    consistency: "Let's go!"
  });

  greeting = computed(() => {
    const hour = new Date().getHours();
    const name = this.authService.currentUser()?.name?.split(' ')[0] || 'Champion';
    if (hour < 12) return `Good Morning, ${name}`;
    if (hour < 18) return `Good Afternoon, ${name}`;
    return `Good Evening, ${name}`;
  });

  motivationalQuotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Success isn't always about greatness. It's about consistency.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Push yourself because no one else is going to do it for you."
  ];

  selectedQuote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];

  constructor(
    public authService: AuthService,
    private workoutService: Workouts,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading.set(true);

    this.workoutService.getWorkouts().subscribe({
      next: (response) => {
        const workouts = response.data.workouts;

        // Calculate stats
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const thisWeekWorkouts = workouts.filter(w =>
          new Date(w.date) >= oneWeekAgo
        );

        const totalExercises = workouts.reduce((sum, w) =>
          sum + w.exercises.length, 0
        );

        const totalVolume = workouts.reduce((sum, w) =>
          sum + (w.totalVolume || 0), 0
        );

        const weekVolume = thisWeekWorkouts.reduce((sum, w) =>
          sum + (w.totalVolume || 0), 0
        );

        const totalTime = workouts.reduce((sum, w) =>
          sum + (w.totalDuration || 0), 0
        );

        this.stats.set({
          workoutsThisWeek: thisWeekWorkouts.length,
          exercisesLogged: totalExercises,
          volumeThisWeek: Math.round(weekVolume),
          totalWorkouts: workouts.length,
          totalVolume: Math.round(totalVolume),
          totalTime: Math.round(totalTime / 60), // Convert to hours
          avgPerWorkout: workouts.length > 0
            ? Math.round(totalExercises / workouts.length)
            : 0,
          avgDuration: workouts.length > 0
            ? Math.round(totalTime / workouts.length)
            : 0,
          consistency: thisWeekWorkouts.length >= 3
            ? "🔥 On Fire!"
            : thisWeekWorkouts.length >= 1
              ? "💪 Keep Going!"
              : "⏰ Time to Start!"
        });

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load dashboard data:', error);
        this.isLoading.set(false);
      }
    });
  }

  addWorkout() {
    this.router.navigate(['/add-workout']);
  }

  viewAllWorkouts() {
    this.router.navigate(['/workouts']);
  }

  openAIChat() {
    this.router.navigate(['/ai-chat']);
  }

}
