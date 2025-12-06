import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth-service/auth.service';

@Component({
  selector: 'app-mess-owner-nav',
  templateUrl: './mess-owner-nav.component.html',
  styleUrl: './mess-owner-nav.component.css',
  imports: [CommonModule, RouterLink,RouterLinkActive]
})
export class MessOwnerNavComponent {
  showDropdown = false;
  showMenu = false;
  constructor(private authService: AuthService) { }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu(){
    this.showMenu = false;
  }

  logout() {
    this.authService.logout();
  }
}
