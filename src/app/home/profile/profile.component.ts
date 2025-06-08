import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/services/auth-service/auth.service";

@Component({
  selector: 'app-profile',
  template: `
    <div class="dashboard-content">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-orange-700 mb-6">My Profile</h2>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center space-x-4 mb-6">
            <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <span class="text-2xl text-orange-500">{{ getInitials() }}</span>
            </div>
            <div>
              <h3 class="text-xl font-semibold">{{ currentUser?.name || 'User' }}</h3>
              <p class="text-gray-600">{{ currentUser?.email }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="border-t pt-4">
              <h4 class="text-lg font-medium text-orange-600 mb-2">Account Details</h4>
              <p class="text-gray-600">Member since: {{ currentUser?.createdAt | date }}</p>
            </div>

            <div class="border-t pt-4">
              <h4 class="text-lg font-medium text-orange-600 mb-2">Preferences</h4>
              <p class="text-gray-600">Meal Plan: Standard</p>
              <p class="text-gray-600">Dietary Restrictions: None</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
  }

  getInitials(): string {
    if (!this.currentUser?.name) return 'U';
    return this.currentUser.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  }
}
