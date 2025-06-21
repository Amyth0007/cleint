// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../../interfaces/auth.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private readonly API_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password })
      .pipe(
        map(response => {
          if (response.success && response.data.token) {
            // store user details and jwt token in local storage
            const user = {
              ...response.data.user,
              token: response.data.token
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
          return response;
        })
      );
  }

  signup(userData: { username: string; email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.API_URL}/signup`, userData)
      .pipe(
        map(response => {
          if (response.success && response.data.token) {
            // store user details and jwt token in local storage
            const user = {
              ...response.data.user,
              token: response.data.token
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
          return response;
        })
      );
  }

  updateProfile(payload: any): Observable<any> {
    return this.http.put(`${this.API_URL}/update-profile`, payload, {
      headers: {
        Authorization: `Bearer ${this.currentUserValue.token}`
      }
    });
  }


  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  getToken(): string | null {
    const user = this.currentUserValue;
    return user?.token || null;
  }
}
