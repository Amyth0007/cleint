export interface UserData {
  name: string;
  email: string;
  // add other user properties as needed
}

export enum userRole {
  customer = 'customer',
  mess_owner = 'mess_owner'
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

export interface MessOwnerIntentItem {
  itemName: string;
  quantity: number;
  pricePerUnit: number;
}

export interface MessOwnerIntent {
  orderId: number;
  messId: number;
  userId: number;
  userName: string;
  headCount: number;
  totalAmount: number;
  timestamp: string;
  selectedItems: MessOwnerIntentItem[];
}

export interface MessOwnerIntentsResponse {
  message: string;
  data: MessOwnerIntent[];
}
