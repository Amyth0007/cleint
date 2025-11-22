import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { OrdersResponse, UserOrder } from 'src/app/auth/interfaces/user.interface';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent]
})
export class OrdersComponent implements OnInit {
  orders: UserOrder[] = [];
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.hasError = false;
    
    this.orderService.getUserOrders().subscribe({
      next: (response: OrdersResponse) => {
        this.orders = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load intents:', error);
        this.hasError = true;
        this.errorMessage = 'Failed to load your intents. Please try again.';
        this.isLoading = false;
      }
    });
  }

getOrderDate(timestamp: string): string {
  const date = new Date(timestamp);
  const today = new Date();

  // Normalize both dates to midnight
  const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff > 1 && diff < 7) return `${Math.floor(diff)} days ago`;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}


  getOrderTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTotalItems(order: UserOrder): number {
    return order.selectedItems.reduce((total : any, item: any) => total + item.quantity, 0);
  }

  getOrderId(order: UserOrder): string {
    // Generate a simple ID from timestamp and messId for display
    const date = new Date(order.timestamp);
    const timeStr = date.getTime().toString().slice(-6);
    return `${order.messId}-${timeStr}`;
  }

  retryLoad() {
    this.loadOrders();
  }

  trackByOrderId(index: number, order: UserOrder): string {
    const date = new Date(order.timestamp);
    const timeStr = date.getTime().toString().slice(-6);
    return `${order.messId}-${timeStr}`;
  }

  viewOrderDetails(order: UserOrder) {
    // TODO: Implement intent details view
    alert(`Intent Details for ${order.messName}\nIntent ID: ${this.getOrderId(order)}\nTotal Amount: ₹${order.totalAmount}`);
  }

  cancelOrder(order: UserOrder) {
    // TODO: Implement intent cancellation
    if (confirm(`Are you sure you want to cancel your intent for ${order.messName}?`)) {
      alert('Intent cancellation feature will be implemented soon!');
    }
  }
} 