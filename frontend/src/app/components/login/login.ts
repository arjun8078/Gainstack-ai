import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';
import { SHARED_IMPORTS } from '../../shared/material-impors';

@Component({
  selector: 'app-login',
  imports: [SHARED_IMPORTS],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {


  email = signal('');
  password = signal('');
  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  constructor(private router:Router,private authService:AuthService, private cdr: ChangeDetectorRef ){

  }

  ngOnInit():void{

  }
onLogin() {
    this.errorMessage.set('');

    if (!this.email() || !this.password()) {
      this.errorMessage.set('Please enter email and password');
      return;
    }

    this.isLoading.set(true);  // Signal automatically updates UI!

    this.authService.login(this.email(), this.password()).subscribe({
      next: (response) => {
        this.isLoading.set(false);  // Auto-updates UI!
        alert('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);  // Auto-updates UI!
        this.errorMessage.set(error.error?.message || 'Login failed');
        // UI updates automatically - NO cdr.detectChanges() needed!
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(val => !val);
  }
}
