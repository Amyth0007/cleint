import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserData } from '../../../auth/interfaces/user.interface';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-mess-owner-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class MessOwnerDashboardComponent implements OnInit {
  userData: UserData | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserData().subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }
} 