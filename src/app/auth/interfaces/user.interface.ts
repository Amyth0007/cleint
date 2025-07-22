export interface UserData {
  name: string;
  email: string;
  // add other user properties as needed
}

export interface OrderData {
  messId: number;
  messName: string;
  selectedItems: Array<{
    item: {
      id: number;
      name: string;
      description: string;
      price: number;
      imageUrl: string;
      isVegetarian: boolean;
      spicyLevel: number;
    };
    quantity: number;
  }>;
  headCount: number;
  totalAmount: number;
  timestamp: Date;
  userid?: string; // Optional user ID from backend
}

export interface OrderResponse {
  success: boolean;
  orderId: string;
  message?: string;
}

export interface UserOrder {
  headCount: number;
  messId: number;
  messName: string;
  selectedItems: Array<{
    itemName: string;
    quantity: number;
    pricePerUnit: string;
  }>;
  timestamp: string;
  totalAmount: string;
  userId: string;
}

export interface OrdersResponse {
  data: UserOrder[];
  success?: boolean;
  message?: string;
}
