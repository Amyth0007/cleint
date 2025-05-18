import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-orders',
  template: `
    <div class="dashboard-content">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-orange-700 mb-6">My Orders</h2>
        
        <div class="grid grid-cols-1 gap-6">
          <!-- Sample Orders -->
          <div class="bg-white p-6 rounded-lg shadow-md" *ngFor="let order of orders">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-xl font-semibold text-orange-600">{{ order.date }}</h3>
                <p class="text-gray-600 mt-2">{{ order.items.join(', ') }}</p>
              </div>
              <span [class]="getStatusClass(order.status)">
                {{ order.status }}
              </span>
            </div>
            <div class="mt-4 flex justify-between items-center border-t pt-4">
              <p class="text-gray-600">Total Amount: ₹{{ order.amount }}</p>
              <button 
                class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                *ngIf="order.status === 'Pending'">
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class OrdersComponent {
  orders = [
    {
      date: 'Today',
      items: ['Roti', 'Dal', 'Rice', 'Paneer Curry'],
      status: 'Active',
      amount: 120
    },
    {
      date: 'Tomorrow',
      items: ['Roti', 'Dal', 'Rice', 'Chicken Curry'],
      status: 'Pending',
      amount: 150
    },
    {
      date: 'Yesterday',
      items: ['Roti', 'Dal', 'Rice', 'Mix Veg'],
      status: 'Completed',
      amount: 100
    }
  ];

  getStatusClass(status: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status.toLowerCase()) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'completed':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return baseClasses;
    }
  }
} 