import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-location-permission-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="text-center">
          <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Enable Location Services</h3>
          <p class="text-gray-600 mb-6">
            We need your location to show you the nearest mess locations and provide accurate distance information. This helps you find the best mess options in your area.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button (click)="onAllow()" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Allow Location Access
            </button>
            <button (click)="onDeny()" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LocationPermissionPopupComponent {
  @Output() allow = new EventEmitter<void>();
  @Output() deny = new EventEmitter<void>();

  onAllow() {
    this.allow.emit();
  }

  onDeny() {
    this.deny.emit();
  }
} 