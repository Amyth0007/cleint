import { Component, OnInit } from '@angular/core';
import { UserData } from 'src/app/auth/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-mess-owner-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule]
})
export class MessOwnerDashboardComponent implements OnInit {
  userData: UserData | null = null;
  totalIntentsToday = 7;
  intentsByThali = [
    { name: 'Classic Veg Thali', total: 12 },
    { name: 'Deluxe Non-Veg Thali', total: 8 },
    { name: 'Family Combo', total: 5 }
  ];

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