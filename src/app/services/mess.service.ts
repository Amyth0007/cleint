import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Mess } from '../auth/interfaces/mess.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MessService {

  private apiUrl = `${environment.apiUrl}/mess`;
  constructor(private http: HttpClient) { }
  private readonly API_URL = `${environment.apiUrl}/auth`;


  createMess(messData: {
    name: string;
    description: string;
    type: string;
    city: string;
    address: string;
    latitude: number;
    longitude: number;
    ownerId: string | number;
  }): Observable<Mess> {
    return this.http.post<Mess>(`${this.apiUrl}/create`, messData).pipe(
      tap((createdMess) => console.log('Created mess:', createdMess)),
      catchError(error => {
        console.error('Error creating mess:', error);
        throw error;
      })
    );
  }

  checkMessExists(userId: string | number): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/exist?userId=${userId}`);
  }

  updateMess(data: any){
    
    const currentUser : any = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${currentUser["token"]}`);
    return this.http.put(`${this.API_URL}/update-mess`, data, 
      { headers }
    );
  }


  getMessDetails(){
    const currentUser : any = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${currentUser["token"]}`);
    return this.http.get(`${this.apiUrl}/mess-details`, { headers });
  }
}
