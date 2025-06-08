import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  spicyLevel: number; // 1-3
}

@Component({
  selector: 'app-menu-display',
  templateUrl: './menu-display.component.html',
  styleUrls: ['./menu-display.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MenuDisplayComponent {
  @Input() messId: number | null = null;
  @Input() messName: string = '';
  
  defaultImage = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80';

  // Handle image error
  handleImageError(event: any) {
    event.target.src = this.defaultImage;
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