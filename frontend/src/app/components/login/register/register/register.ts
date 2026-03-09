import { APP_ID, Component, signal } from '@angular/core';
import { SHARED_IMPORTS } from '../../../../shared/material-impors';
import { getOriginalNode } from 'typescript';
import { AuthService } from '../../../../auth/services/auth';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [SHARED_IMPORTS],
   standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  name=signal('');
  email=signal('');
  password=signal('');

  showErrormessage=signal('');
  isLoading=signal(false);
  showPassword=signal(false);

  constructor(private authService:AuthService,private router:Router){

  }


  register(){

    this.showErrormessage.set('');

    if(!this.name() || !this.email() || !this.password()){
      this.showErrormessage.set('All fields are required');
      this.isLoading.set(false);
      return;
    }

      this.isLoading.set(true);
      this.authService.register(this.name(),this.email(),this.password()).pipe(
      finalize(() => {
        this.isLoading.set(false);
      })
    ).subscribe({
        next:(response)=>{
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error:(error)=>{
          this.isLoading.set(false);
          this.showErrormessage.set(error.error?.message || 'Registration failed');
        }

      })


  }

    togglePasswordVisibility() {
    this.showPassword.update(val => !val);
  }

}


