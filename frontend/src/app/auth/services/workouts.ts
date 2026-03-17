import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';


export interface WorkoutSet {
  setNumber: number;
  reps: number;
  weight: number;
  restTime?: number;
  completed?: boolean;
}

export interface WorkoutExercise {
  exerciseId?: string;
  name: string;
  category: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  _id?: string;
  userId?: string;
  date: string;
  exercises: WorkoutExercise[];
  totalDuration: number;
  totalVolume?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutStats {
  date: string;
  exerciseCount: number;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  duration: number;
  exerciseBreakdown: Array<{
    name: string;
    category: string;
    sets: number;
    totalReps: number;
    volume: number;
  }>;
}

export interface WorkoutResponse {
  status: string;
  data: {
    workout: Workout;
    stats?: WorkoutStats;
  };
}

export interface WorkoutsListResponse {
  status: string;
  results: number;
  total: number;
  page: number;
  pages: number;
  data: {
    workouts: Workout[];
  };
}

@Injectable({
  providedIn: 'root',
})


export class Workouts {

  private readonly API_URL = 'http://localhost:5000/api/workouts';



  constructor(private http: HttpClient) {

  }


   getWorkouts(params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Observable<WorkoutsListResponse> {
    console.log('📡 Fetching workouts with params:', params);

    let url = this.API_URL;

    // Add query parameters if provided
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.http.get<WorkoutsListResponse>(url);
  }

}
