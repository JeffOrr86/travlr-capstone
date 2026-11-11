import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { AuthenticationService } from './authentication';

@Injectable({
  providedIn: 'root'
})
export class TripData {
  private url = 'http://localhost:3000/api/trips';
  private http = inject(HttpClient);
  private authService = inject(AuthenticationService);

  // Helper method to attach the JWT header
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  public getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.url);
  }

  public getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.url}/${tripCode}`);
  }

  public addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.url, formData, this.getAuthHeaders());
  }

  public updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.url}/${formData.code}`, formData, this.getAuthHeaders());
  }
}
