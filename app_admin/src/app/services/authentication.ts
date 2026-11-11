import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private http = inject(HttpClient);
  private authUrl = 'http://localhost:3000/api';

  // Save the JWT token to localStorage
  public saveToken(token: string): void {
    localStorage.setItem('travlr-token', token);
  }

  // Get the token from localStorage
  public getToken(): string | null {
    return localStorage.getItem('travlr-token');
  }

  // Log in using credentials and store the returned token
  public login(user: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, user).pipe(
      tap((response: AuthResponse) => {
        if (response && response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  // Register a new user
  public register(user: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/register`, user).pipe(
      tap((response: AuthResponse) => {
        if (response && response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  // Log out by clearing the stored token
  public logout(): void {
    localStorage.removeItem('travlr-token');
  }

  // Check if token exists and has not expired
  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    }
    return false;
  }

  // Get the current logged-in user profile from the token payload
  public getCurrentUser(): User | null {
    if (this.isLoggedIn()) {
      const token = this.getToken();
      if (token) {
        const { email, name } = JSON.parse(atob(token.split('.')[1]));
        return { email, name };
      }
    }
    return null;
  }
}
