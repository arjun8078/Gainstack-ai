import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth';
import { jwtDecode } from 'jwt-decode';
import { ToastComponent } from './shared/toast/toast';
import { ChatbotIcon } from './shared/chatbot-icon/chatbot-icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ToastComponent,ChatbotIcon],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('frontend');


  constructor(public authService:AuthService,private router:Router) {
     this.authService.loadUserFromToken();

  }

  isOnChatPage(){
  return this.router.url.includes('/ai-chat') ||
         this.router.url.includes('/login') ||
         this.router.url.includes('/register');
}



}
