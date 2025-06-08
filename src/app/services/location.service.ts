import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { Location } from '../auth/interfaces/location.interface';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'http://localhost:3000/locations'; // Replace with real API endpoint

  constructor(private http: HttpClient) { }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl).pipe(
      tap(() => console.log('Fetched locations successfully')),
      catchError(error => {
        console.error('Failed to fetch locations:', error);
        return of([]); // Return empty array to avoid breaking UI
      })
    );
  }
}
