import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { Mess } from '../auth/interfaces/mess.interface';

@Injectable({
  providedIn: 'root'
})
export class MessService {
  private apiUrl = 'http://localhost:3000/messes'; // Base API

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
}
