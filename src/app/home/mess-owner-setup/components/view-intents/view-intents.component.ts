import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MessOwnerIntent } from '../../../../auth/interfaces/user.interface';
import { OrderService } from '../../../../services/order.service';

@Component({
  selector: 'app-view-intents',
  templateUrl: './view-intents.component.html',
  styleUrls: ['./view-intents.component.css'],
  imports: [CommonModule]
})
export class ViewIntentsComponent implements OnInit {

  intents: MessOwnerIntent[] = [];
  loading = false;
  error: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
      this.loadIntents();
  }

  loadIntents() {
    this.loading = true;
    this.error = null;

    this.orderService.getMessIntents().subscribe(
      (response: any) => {
        this.loading = false;
        
        this.intents = response.data;
        if (response.data.length === 0) {
          this.error = 'No intents found for this mess.';
        }
      },
      (error: any) => {
        this.loading = false;
        this.error = 'Failed to load intents. Please try again.';
        console.error('Error loading intents:', error);
      }
    );
  }

  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  refreshIntents() {
    this.loadIntents();
  }
} 