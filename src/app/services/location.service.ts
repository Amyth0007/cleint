import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { Location } from '../auth/interfaces/location.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = environment.apiUrl; // Replace with real API endpoint

  constructor(private http: HttpClient) { }

  getLocations(): Observable<any> {
    const currentUser : any = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${currentUser["token"]}`);
    
    return this.http.get(`${this.apiUrl}/history/messlocation`, { headers });
  }

}
