import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { SHARED_IMPORTS } from '../material-impors';
import { ChatbotModal } from "../../components/pages/ai-chat/chatbot-modal/chatbot-modal";

@Component({
  selector: 'app-chatbot-icon',
  imports: [SHARED_IMPORTS, ChatbotModal],
  templateUrl: './chatbot-icon.html',
  styleUrl: './chatbot-icon.scss',
})
export class ChatbotIcon {

  isOpen=signal(false);
  message=signal('Coming soon');

  toggleChatbot() {
    this.isOpen.update(val => !val);
  }

  openChatbot(){
    this.isOpen.set(true);
  }
  closeChatbot(){
    this.isOpen.set(false);
  }




}
