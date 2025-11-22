import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Config } from '../auth/interfaces/config.interface';



@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: Config | null = null;

  constructor(private http: HttpClient) {}

  async getGoogleMapsApiKey(): Promise<string> {
    if (this.config?.googleMapsApiKey) {
      return this.config.googleMapsApiKey;
    }

    try {
        const currentUser : any = JSON.parse(localStorage.getItem('currentUser') || '{}');
       const headers = new HttpHeaders().set('Authorization', `Bearer ${currentUser["token"]}`);

      this.config = await firstValueFrom(
        this.http.get<Config>(`${environment.apiUrl}/auth/config`, { headers })
      );

      return this.config.googleMapsApiKey;
    } catch (error) {
      console.error('Failed to fetch Google Maps API key:', error);
      throw error;
    }
  }
}
