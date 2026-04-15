import { Component } from '@angular/core';
import { AuthService } from '../../auth/services/auth';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  standalone: true
})
export class Sidebar {

  showUserMenu = false;


   constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  userInitials(): string {
    const name = this.authService.currentUser()?.name || 'User';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  userName(): string {
    return this.authService.currentUser()?.name || 'User';
  }

  userEmail(): string {
    return this.authService.currentUser()?.email || '';
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
