import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

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

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/history/save-intent`;

  constructor(private http: HttpClient) { }

  shareIntent(orderData: OrderData): Observable<OrderResponse> {
    console.log(orderData);
    
    const currentUser: any = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${currentUser.token}`);

    // Prepare the data for backend (matching the destructuring pattern)
    const requestData = {
      messId: orderData.messId,
      headCount: orderData.headCount,
      totalAmount: orderData.totalAmount,
      selectedItems: orderData.selectedItems,
      timestamp: orderData.timestamp,
      userid: currentUser.id || currentUser.userId // Add user ID if available
    };

    return this.http.post<OrderResponse>(this.apiUrl, requestData, { headers }).pipe(
      tap((response) => console.log('Intent shared successfully:', response)),
      catchError(error => {
        console.error('Error sharing intent:', error);
        throw error;
      })
    );
  }

  getUserOrders(): Observable<OrdersResponse> {
    const currentUser: any = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${currentUser.token}`);
    
    const url = `${environment.apiUrl}/history/get-intent?userid=${currentUser.id || currentUser.userId}`;
    
    return this.http.get<OrdersResponse>(url, { headers }).pipe(
      tap((response) => console.log('Fetched user intents:', response)),
      catchError(error => {
        console.error('Error fetching user intents:', error);
        return of({ data: [] });
      })
    );
  }
} 