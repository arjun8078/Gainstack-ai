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

  quickChatMessages=signal<Message[]>([]);
  longChatMessages=signal<Message[]>([]);
  quickChatAiCount=signal<number>(0);
  isLoading = signal<boolean>(false)
  quotaExceeded=signal<boolean>(false)
  resetInfo=signal<QuotaResetInfo | null>(null)
  workoutsAnalyzed=signal<number>(0)

  constructor(private aiService:AiService){

  }

  sendMessage(question:any,chatType:'quick'|'long'){
    if(chatType == 'quick'){
         this.quickChatMessages.update(msgs=>[...msgs,{
      text:question,
      isUser:true,
      timestamp:new Date()
     }])
    }
    else{
         this.longChatMessages.update(msgs=>[...msgs,{
      text:question,
      isUser:true,
      timestamp:new Date()
     }])
    }


     this.isLoading.set(true);

     this.aiService.askQuestion(question).subscribe({
      next:Response=>{
      if(chatType == 'quick'){
         this.quickChatMessages.update(msgs=>[...msgs,{
          text:Response.data.answer,
          isUser:false,
          timestamp:new Date()
        }])
        this.quickChatAiCount.update(count=>count+1)
      }
      else{
         this.longChatMessages.update(msgs=>[...msgs,{
          text:Response.data.answer,
          isUser:false,
          timestamp:new Date()
        }])
      }


        this.isLoading.set(false);
         // Clear any previous quota errors
      this.quotaExceeded.set(false);
      this.workoutsAnalyzed.set(Response.data.workoutsAnalyzed);
      },
      error:(error)=>{
        console.log('Error occured',error);
          // Check if quota exceeded (HTTP 429)
      if (error.status === 429 && error.error?.quotaExceeded) {
        this.quotaExceeded.set(true);
        this.resetInfo.set(error.error.resetInfo);

        // Add error message to chat
        if(chatType == 'quick'){
           this.quickChatMessages.update(msgs => [...msgs, {
          text: `AI quota exceeded. Available again in ${error.error.resetInfo.hoursUntilReset}h ${error.error.resetInfo.minutesUntilReset}m`,
          isUser: false,
          timestamp: new Date(),
          isError: true
        }]);
        }
        else{
            this.longChatMessages.update(msgs => [...msgs, {
          text: `AI quota exceeded. Available again in ${error.error.resetInfo.hoursUntilReset}h ${error.error.resetInfo.minutesUntilReset}m`,
          isUser: false,
          timestamp: new Date(),
          isError: true
        }]);
        }

      } else {
        // Generic error
        if(chatType == 'quick'){
           this.quickChatMessages.update(msgs => [...msgs, {
          text: 'Sorry, I encountered an error. Please try again!',
          isUser: false,
          timestamp: new Date(),
          isError: true
        }]);
        }
        else{
            this.longChatMessages.update(msgs => [...msgs, {
          text: 'Sorry, I encountered an error. Please try again!',
          isUser: false,
          timestamp: new Date(),
          isError: true
        }]);
        }

      }

      // Stop loading
      this.isLoading.set(false);

      }
     })
  }

 clearQuickChat(){
  this.quickChatMessages.set([]);
  this.quickChatAiCount.set(0);  // Reset count too!
}

clearMainChat(){
  this.longChatMessages.set([]);
}

 resetChat(){
  this.clearQuickChat();
  this.quotaExceeded.set(false);
  this.resetInfo.set(null);
  this.isLoading.set(false);
}

  getQuickChatAiCount(){
  return this.quickChatAiCount();
}

transferQuickChatToMainChat(){
  const quickMessages = this.quickChatMessages();
  this.longChatMessages.set([...quickMessages]);
  this.clearQuickChat();
}

}
