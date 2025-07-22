import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth-service/auth.service';

@Component({
  selector: 'app-mess-owner-nav',
  templateUrl: './mess-owner-nav.component.html',
  styleUrl: './mess-owner-nav.component.css',
  imports: [CommonModule, RouterLink]
})
export class MessOwnerNavComponent {
   showDropdown = false;

  constructor(private authService: AuthService) {}

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.authService.logout();
  }
}
