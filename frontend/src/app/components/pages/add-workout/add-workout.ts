import { Component, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Workouts } from '../../../auth/services/workouts';
import { Router } from '@angular/router';
import { MatCard, MatCardHeader } from "@angular/material/card";
import { SHARED_IMPORTS } from '../../../shared/material-impors';
import { Navbar } from '../../../shared/navbar/navbar';

@Component({
  selector: 'app-add-workout',
  imports: [MatCard, MatCardHeader,SHARED_IMPORTS,Navbar],
  templateUrl: './add-workout.html',
  styleUrl: './add-workout.scss',
})
export class AddWorkout {

  workoutForm: FormGroup;
  isLoading = signal<boolean>(false);


  constructor( private fb: FormBuilder,
    private workoutService: Workouts,
    private router: Router){
      this.workoutForm = this.fb.group({
      date: [new Date().toISOString().split('T')[0], Validators.required],  // ← [defaultValue, validators]
      totalDuration: [0],
      notes: [''],
      exercises: this.fb.array([])  // ← Empty FormArray for dynamic exercises
    });
    // Add one exercise by default
    this.addExercise();

  }

   // SYNTAX: Getter to access FormArray easily
  get exercises(): FormArray {
    return this.workoutForm.get('exercises') as FormArray;  // ← Cast to FormArray
  }

   // SYNTAX: Get nested FormArray (sets inside exercise)
  getSets(exerciseIndex: number): FormArray {
    return this.exercises.at(exerciseIndex).get('sets') as FormArray;
  }

  // Add new exercise to FormArray
  addExercise() {
    const exerciseGroup = this.fb.group({
      name: ['', Validators.required],
      category: ['Other', Validators.required],
      notes: [''],
      sets: this.fb.array([])  // ← Nested FormArray for sets
    });

    this.exercises.push(exerciseGroup);  // ← Add to FormArray
    this.addSet(this.exercises.length - 1);  // Add first set automatically
  }

   // Remove exercise from FormArray
  removeExercise(index: number) {
    this.exercises.removeAt(index);  // ← Remove by index
  }

   // Add set to specific exercise
  addSet(exerciseIndex: number) {
    const currentSets = this.getSets(exerciseIndex);

    const setGroup = this.fb.group({
      setNumber: [currentSets.length + 1],  // Auto-increment
      reps: [10, [Validators.required, Validators.min(1)]],
      weight: [0, [Validators.required, Validators.min(0)]]
    });

    currentSets.push(setGroup);  // ← Add to nested FormArray
  }

   // Remove set from specific exercise
  removeSet(exerciseIndex: number, setIndex: number) {
    this.getSets(exerciseIndex).removeAt(setIndex);
  }

  // Submit form
  onSubmit() {
    // SYNTAX: Check form validity
    if (this.workoutForm.invalid) {
      alert('Please fill all required fields!');
      return;
    }

    this.isLoading.set(true);

    // SYNTAX: Get form value
    const workoutData = this.workoutForm.value;

    this.workoutService.createWorkout(workoutData).subscribe({
      next: (response) => {
        console.log('✅ Workout created:', response);
        alert('Workout created! 🎉');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('❌ Error:', error);
        alert('Failed to create workout');
        this.isLoading.set(false);
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

}
