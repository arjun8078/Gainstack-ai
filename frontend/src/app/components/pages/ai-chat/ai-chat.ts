import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Navbar } from '../../../shared/navbar/navbar';
import { AiService } from '../../../services/ai-service';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  modelUsed?: string; // Optional field to store the model used for AI responses
  isError?: boolean;
}
interface QuotaResetInfo {
  resetTime: string;
  hoursUntilReset: number;
  minutesUntilReset: number;
  resetTimeLocal: string;
  resetTimeUTC: string;
}

@Component({
  selector: 'app-ai-chat',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.scss',
})


export class AiChat {

@ViewChild('messagesContainer') private messagesContainer!: ElementRef;

 chatForm: FormGroup;
  messages = signal<Message[]>([]);
  isLoading = signal<boolean>(false);
  workoutsAnalyzed = signal<number>(0);
  quotaExceeded = signal<boolean>(false);
  resetInfo = signal<QuotaResetInfo | null>(null);
  private shouldScroll = false;
  suggestions = [
    { icon: '📊', text: 'Analyze my recent workouts', question: 'Analyze my recent workouts and give me insights' },
    { icon: '📈', text: 'Am I making progress?', question: 'Am I making progress on bench press?' },
    { icon: '🎯', text: 'What should I focus on?', question: 'What should I focus on in my next workout?' },
    { icon: '💪', text: 'Suggest a workout', question: 'Suggest a chest and triceps workout for me' }
  ];
constructor(private fb: FormBuilder,
    private aiService: AiService){

       this.chatForm = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(3)]]
    });

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
    this.quotaExceeded.set(false);
  }

  sendMessage() {
    if (this.chatForm.invalid || this.isLoading()) return;

    const question = this.chatForm.value.question.trim();
    if (!question) return;

    // Add user message
    this.messages.update(msgs => [...msgs, {
      text: question,
      isUser: true,
      timestamp: new Date()
    }]);

    this.chatForm.reset();
    this.shouldScroll = true;
    this.isLoading.set(true);

    this.aiService.askQuestion(question).subscribe({
      next: (response) => {
        this.messages.update(msgs => [...msgs, {
          text: response.data.answer,
          isUser: false,
          timestamp: new Date()
        }]);

        this.workoutsAnalyzed.set(response.data.workoutsAnalyzed);
        this.isLoading.set(false);
        this.shouldScroll = true;

        // Clear quota error if it was showing
        this.quotaExceeded.set(false);
      },
      error: (error) => {
        console.error('❌ AI error:', error);

        // Check if quota exceeded
        if (error.status === 429 && error.error?.quotaExceeded) {
          this.quotaExceeded.set(true);
          this.resetInfo.set(error.error.resetInfo);

          this.messages.update(msgs => [...msgs, {
            text: `AI quota exceeded. The service will be available again in ${error.error.resetInfo.hoursUntilReset}h ${error.error.resetInfo.minutesUntilReset}m.\n\nQuota resets at: ${error.error.resetInfo.resetTimeLocal}`,
            isUser: false,
            timestamp: new Date(),
            isError: true
          }]);
        } else {
          this.messages.update(msgs => [...msgs, {
            text: 'Sorry, I encountered an error. Please try again. Make sure you have workouts logged!',
            isUser: false,
            timestamp: new Date(),
            isError: true
          }]);
        }

        this.isLoading.set(false);
        this.shouldScroll = true;
      }
    });
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

}
