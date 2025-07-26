import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Mess } from '../auth/interfaces/mess.interface';

@Injectable({
  providedIn: 'root'
})
export class MessService {

  private apiUrl = `${environment.apiUrl}/mess`;
  constructor(private http: HttpClient) { }


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
}
