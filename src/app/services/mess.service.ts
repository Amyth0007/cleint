import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Mess } from '../auth/interfaces/mess.interface';

@Injectable({
  providedIn: 'root'
})
export class MessService {
  private apiUrl = 'http://localhost:3000/messes'; // Base API
  private apiUrl1 = `${environment.apiUrl}/history/mess`;
  constructor(private http: HttpClient) { }

  getMessesByLocation(locationId: number): Observable<Mess[]> {
    const url = `${this.apiUrl}?locationId=${locationId}`;
    return this.http.get<Mess[]>(url).pipe(
      tap(() => console.log(`Fetched messes for location ID: ${locationId}`)),
      catchError(error => {
        console.error(`Error fetching messes for location ID ${locationId}:`, error);
        return of([]);
      })
    );
  }

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
    return this.http.post<Mess>(`${this.apiUrl1}/create`, messData).pipe(
      tap((createdMess) => console.log('Created mess:', createdMess)),
      catchError(error => {
        console.error('Error creating mess:', error);
        throw error;
      })
    );
  }

  checkMessExists(userId: string | number): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl1}/exist?userId=${userId}`);
  }
}
