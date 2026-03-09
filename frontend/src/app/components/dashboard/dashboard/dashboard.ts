import { Component, computed } from '@angular/core';
import { AuthService } from '../../../auth/services/auth';
import { SHARED_IMPORTS } from '../../../shared/material-impors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

currentUser!: any;  // Declare but don't assign
  isLoading!: any;
  greeting!: any;


  constructor(public authService:AuthService){
        // Get user from AuthService signal
  this.currentUser = this.authService.currentUser;
  this.isLoading = this.authService.isLoading;

  // Computed signal for greeting
  this.greeting = computed(() => {
    const user = this.currentUser();
    return user ? `Welcome, ${user.name}!` : 'Welcome!';
  });
  }



  logout() {
    console.log('🚪 Logout clicked');
    this.authService.logout();
    // AuthService.logout() already navigates to /login!
  }

}
