import { AIResponse, AiService } from './../ai-service';
import { Injectable, signal } from '@angular/core';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isError?: boolean;
}

interface QuotaResetInfo {
  resetTime: string;
  hoursUntilReset: number;
  minutesUntilReset: number;
  resetTimeLocal: string;
  resetTimeUTC: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  messages=signal<Message[]>([]);
  isLoading = signal<boolean>(false)
  quotaExceeded=signal<boolean>(false)
  resetInfo=signal<QuotaResetInfo | null>(null)

  constructor(private aiService:AiService){

  }

  sendMessage(question:any){
     this.messages.update(msgs=>[...msgs,{
      text:question,
      isUser:true,
      timestamp:new Date()
     }])

     this.isLoading.set(true);

     this.aiService.askQuestion(question).subscribe({
      next:Response=>{
        this.messages.update(msgs=>[...msgs,{
          text:Response.data.answer,
          isUser:false,
          timestamp:new Date()
        }])

        this.isLoading.set(false);
         // Clear any previous quota errors
      this.quotaExceeded.set(false);
      },
      error:(error)=>{
        console.log('Error occured',error);
          // Check if quota exceeded (HTTP 429)
      if (error.status === 429 && error.error?.quotaExceeded) {
        this.quotaExceeded.set(true);
        this.resetInfo.set(error.error.resetInfo);

        // Add error message to chat
        this.messages.update(msgs => [...msgs, {
          text: `AI quota exceeded. Available again in ${error.error.resetInfo.hoursUntilReset}h ${error.error.resetInfo.minutesUntilReset}m`,
          isUser: false,
          timestamp: new Date(),
          isError: true
        }]);
      } else {
        // Generic error
        this.messages.update(msgs => [...msgs, {
          text: 'Sorry, I encountered an error. Please try again!',
          isUser: false,
          timestamp: new Date(),
          isError: true
        }]);
      }

      // Stop loading
      this.isLoading.set(false);

      }
     })
  }

  clearMessage(){
    this.messages.set([]);
  }

  resetChat(){
    this.clearMessage();
    this.quotaExceeded.set(false);
    this.resetInfo.set(null);
    this.isLoading.set(false);
  }

  getMessageCount(){
    return this.messages().length;
  }

}
