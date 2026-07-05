import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, ViewChild,effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ChatService } from '../../../services/shared/chat-service';



@Component({
  selector: 'app-ai-chat',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.scss',
})


export class AiChat {

@ViewChild('messagesContainer') private messagesContainer!: ElementRef;

 chatForm: FormGroup;

  private shouldScroll = false;
  suggestions = [
    { icon: '📊', text: 'Analyze my recent workouts', question: 'Analyze my recent workouts and give me insights' },
    { icon: '📈', text: 'Am I making progress?', question: 'Am I making progress on bench press?' },
    { icon: '🎯', text: 'What should I focus on?', question: 'What should I focus on in my next workout?' },
    { icon: '💪', text: 'Suggest a workout', question: 'Suggest a chest and triceps workout for me' }
  ];
constructor(private fb: FormBuilder,public chatservice:ChatService){

       this.chatForm = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(3)]]
    });
effect(()=>{
  this.chatservice.longChatMessages(); // Subscribe to messages signal
  this.shouldScroll = true; // Set flag to scroll after view updates
})
}




  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  askSuggestion(question: string) {
    this.chatForm.patchValue({ question });
    this.sendMessage();
  }

  dismissQuotaError() {
    this.chatservice.quotaExceeded.set(false);
  }

  sendMessage() {
    if (this.chatForm.invalid || this.chatservice.isLoading()) {
      return;
    }

    const question=this.chatForm.value.question.trim()
    if(!question) return

    this.chatForm.reset();
    this.shouldScroll = true;
     this.chatservice.sendMessage(question,'long');
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

}
