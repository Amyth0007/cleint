import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderData, OrderResponse, OrdersResponse } from '../auth/interfaces/user.interface';



@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/save-intent`;

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
    
    const url = `${environment.apiUrl}/get-intent?userid=${currentUser.id || currentUser.userId}`;
    
    return this.http.get<OrdersResponse>(url, { headers }).pipe(
      tap((response) => console.log('Fetched user intents:', response)),
      catchError(error => {
        console.error('Error fetching user intents:', error);
        return of({ data: [] });
      })
    );
  }
} 