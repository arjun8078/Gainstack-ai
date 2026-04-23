import { Component, OnInit, signal } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/material-impors';
import { Workout, Workouts } from '../../../auth/services/workouts';
import { Router } from '@angular/router';
import { Navbar } from '../../../shared/navbar/navbar';
import { DialogService } from '../../../services/shared/dialog.services';

@Component({
  selector: 'app-workout-list',
  imports: [SHARED_IMPORTS],
  templateUrl: './workout-list.html',
  styleUrl: './workout-list.scss',
})
export class WorkoutList implements OnInit {

workouts = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  activeMenuId = signal<string | null>(null);


  constructor(private workoutService: Workouts,private router: Router, private dialogService: DialogService ) {

  }

  ngOnInit(){
    this.loadWorkouts();
  }
  loadWorkouts() {
    this.isLoading.set(true);
    this.workoutService.getWorkouts().subscribe({
      next: (response) => {
        this.workouts.set(response.data.workouts);
        console.log('this.workouts: ', this.workouts());
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load workouts:', error);
        this.isLoading.set(false);
      }
    });
  }
  calculateTotalSets(workout: any): number {
    if (!workout.exercises) return 0;
    return workout.exercises.reduce((total: number, exercise: any) => {
      return total + (exercise.sets?.length || 0);
    }, 0);
  }

  toggleMenu(workoutId: string) {
    this.activeMenuId.set(
      this.activeMenuId() === workoutId ? null : workoutId
    );
  }

   viewDetails(workoutId: string) {
    this.router.navigate(['/edit-workout', workoutId]);
  }

   deleteWorkout(workout: Workout) {
    // Confirmation dialog
    this.dialogService.confirm(
    'Delete Workout',
    `Are you sure you want to delete this workout?\n\nDate: ${this.formatDate(workout.date)}\nExercises: ${workout.exercises.length}\n\nThis action cannot be undone.`,
    'Delete',
    'Cancel'
  ).subscribe(confirmed => {
    if (!confirmed) return;

    this.workoutService.deleteWorkout(workout._id!).subscribe({
      next: () => {
        this.workouts.update(list => list.filter(w => w._id !== workout._id));
      },
      error: (error) => {
        console.error('❌ Delete failed:', error);
      }
    });
  });
  }

  editWorkout(workout: Workout) {
    // Navigate to add-workout with ID
    this.router.navigate(['/add-workout', workout._id]);
  }

  addNewWorkout() {
    this.router.navigate(['/add-workout']);
  }

  // Helper: Format date
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Helper: Get exercise names
  getExerciseNames(workout: Workout): string {
    return workout.exercises.map(e => e.name).join(', ');
  }

  // Helper: Calculate duration in minutes
  getDurationMinutes(seconds: number): number {
    return Math.round(seconds / 60);
  }
}
