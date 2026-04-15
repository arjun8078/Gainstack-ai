import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

  export interface AIResponse{
    status:string,
    data: {
    question: string;
    answer: string;
    workoutsAnalyzed: number;
    modelUsed: string;
  };
  }



@Injectable({
  providedIn: 'root',
})
export class AiService {

  private readonly API_URL=environment.apiUrl

  constructor(private http:HttpClient){


  }

  askQuestion(question:string):Observable<AIResponse>{
    console.log(question);
    return this.http.post<AIResponse>(`${this.API_URL}/ai/ask`, { question });
  }


}
