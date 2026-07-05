import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { ChatService } from '../../../../services/shared/chat-service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatbot-modal',
  imports: [CommonModule,FormsModule],
  templateUrl: './chatbot-modal.html',
  styleUrl: './chatbot-modal.scss',
   host: {
    'class': 'flex flex-col flex-1 min-h-0 overflow-hidden'
  }
})
export class ChatbotModal  {

  question=signal('')
  messageLimit=10
  @Output() closeModal = new EventEmitter();



  constructor(public chatservice:ChatService,private router:Router) {

  }



  sendMessage(){
    if(!this.question().trim()) return

    this.chatservice.sendMessage(this.question(),'quick');

    this.question.set('');

  }

  ResetChat(){
    this.chatservice.resetChat();
  }
  isLimitReached() {
    return this.chatservice.getQuickChatAiCount() >= this.messageLimit;
  }

  openFullChat() {
    this.router.navigate(['/ai-chat']);
  }
 closeChat() {
    this.closeModal.emit();  // ← Tell parent to close!
  }

  transferQuickChatToMainChat() {
    this.chatservice.transferQuickChatToMainChat();
    this.router.navigate(['/ai-chat']);
  }

}
