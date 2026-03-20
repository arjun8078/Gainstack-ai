import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../material-impors';
import { AuthService } from '../../auth/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [SHARED_IMPORTS],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {


  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.logout();
  }
}
