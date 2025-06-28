import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderData, OrderResponse, OrderService } from '../../../services/order.service';
import { SuccessPopupComponent, SuccessPopupData } from '../../../shared/success-popup/success-popup.component';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  spicyLevel: number; // 1-3
}

interface SelectedItem {
  item: MenuItem;
  quantity: number;
}

interface UserIntent {
  messId: number;
  messName: string;
  selectedItems: SelectedItem[];
  headCount: number;
  totalAmount: number;
  timestamp: Date;
}

@Component({
  selector: 'app-menu-display',
  templateUrl: './menu-display.component.html',
  styleUrls: ['./menu-display.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, SuccessPopupComponent]
})
export class MenuDisplayComponent {
  @Input() messId: number | null = null;
  @Input() messName: string = '';
  
  defaultImage = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80';
  headCount: number = 1;
  selectedItems: Map<number, number> = new Map(); // itemId -> quantity
  isSharingIntent: boolean = false;
  
  // Success popup properties
  showSuccessPopup: boolean = false;
  successPopupData: SuccessPopupData = {
    title: 'Intent Shared Successfully!',
    message: 'Your intent has been shared with the mess owner.',
    showOrderId: false
  };

  constructor(private orderService: OrderService) {}

  // Handle image error
  handleImageError(event: any) {
    event.target.src = this.defaultImage;
  }

  // Get quantity for an item
  getItemQuantity(itemId: number): number {
    return this.selectedItems.get(itemId) || 0;
  }

  // Update item quantity
  updateItemQuantity(itemId: number, quantity: number) {
    if (quantity <= 0) {
      this.selectedItems.delete(itemId);
    } else {
      this.selectedItems.set(itemId, quantity);
    }
  }

  // Get selected items with details
  getSelectedItemsWithDetails(): SelectedItem[] {
    const selectedItems: SelectedItem[] = [];
    this.selectedItems.forEach((quantity, itemId) => {
      const item = this.menuItems.find(menuItem => menuItem.id === itemId);
      if (item) {
        selectedItems.push({ item, quantity });
      }
    });
    return selectedItems;
  }

  // Calculate total amount
  getTotalAmount(): number {
    let total = 0;
    this.selectedItems.forEach((quantity, itemId) => {
      const item = this.menuItems.find(menuItem => menuItem.id === itemId);
      if (item) {
        total += item.price * quantity;
      }
    });
    return total;
  }

  // Check if any items are selected
  hasSelectedItems(): boolean {
    return this.selectedItems.size > 0;
  }

  // Increase head count
  increaseHeadCount() {
    this.headCount = Math.min(20, this.headCount + 1);
  }

  // Decrease head count
  decreaseHeadCount() {
    this.headCount = Math.max(1, this.headCount - 1);
  }

  // Show success popup
  showSuccessPopupWithData(response: OrderResponse) {
    const selectedItemsDetails = this.getSelectedItemsWithDetails();
    const details = [
      `Mess: ${this.messName}`,
      `Head Count: ${this.headCount} person(s)`,
      `Total Amount: ₹${this.getTotalAmount()}`,
      `Items Selected: ${selectedItemsDetails.length}`
    ];

    this.successPopupData = {
      title: 'Intent Shared Successfully! 🎉',
      message: 'Your intent has been shared with the mess owner. They will be notified about your visit!',
      orderId: response.orderId,
      details: details,
      showOrderId: true
    };
    
    this.showSuccessPopup = true;
  }

  // Close success popup
  closeSuccessPopup() {
    this.showSuccessPopup = false;
    // Clear the form after successful submission
    this.selectedItems.clear();
    this.headCount = 1;
  }

  // Share intent with mess owner
  shareIntent() {
    if (this.isSharingIntent) return; // Prevent multiple calls
    
    this.isSharingIntent = true;
    
    const orderData: OrderData = {
      messId: this.messId || 0,
      messName: this.messName,
      selectedItems: this.getSelectedItemsWithDetails(),
      headCount: this.headCount,
      totalAmount: this.getTotalAmount(),
      timestamp: new Date()
    };
    console.log("before api call");
    

    this.orderService.shareIntent(orderData).subscribe({
      next: (response: OrderResponse) => {
        console.log('API Response:', response);
        this.isSharingIntent = false;
        
        if (response.success) {
          this.showSuccessPopupWithData(response);
        } else {
          alert('Failed to share intent. Please try again.');
        }
      },
      error: (error) => {
        console.error('Failed to share intent:', error);
        alert('Failed to share intent. Please try again.');
        this.isSharingIntent = false;
      }
    });
  }
  
  // Dummy menu data
  menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Maharashtrian Thali",
      description: "Complete meal with bhaji, dal, rice, roti, and accompaniments",
      price: 120,
      imageUrl: "https://images.unsplash.com/photo-1624374053855-39a5a1a41402?w=800&q=80",
      isVegetarian: true,
      spicyLevel: 2
    },
    {
      id: 2,
      name: "Misal Pav",
      description: "Spicy curry made with sprouted moth beans, served with pav bread",
      price: 60,
      imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
      isVegetarian: true,
      spicyLevel: 3
    },
    {
      id: 3,
      name: "Chicken Thali",
      description: "Complete meal with chicken curry, dal, rice, and roti",
      price: 150,
      imageUrl: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80",
      isVegetarian: false,
      spicyLevel: 2
    },
    {
      id: 4,
      name: "Veg Pulao",
      description: "Fragrant rice cooked with mixed vegetables and spices",
      price: 90,
      imageUrl: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&q=80",
      isVegetarian: true,
      spicyLevel: 1
    },
    {
      id: 5,
      name: "Masala Dosa",
      description: "Crispy rice crepe filled with spiced potato filling",
      price: 80,
      imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80",
      isVegetarian: true,
      spicyLevel: 2
    },
    {
      id: 6,
      name: "Butter Chicken",
      description: "Creamy tomato-based curry with tender chicken pieces",
      price: 180,
      imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80",
      isVegetarian: false,
      spicyLevel: 1
    }
  ];

  // Helper method to generate spicy indicators
  getSpicyIndicators(level: number): number[] {
    return Array(level).fill(0);
  }
} 