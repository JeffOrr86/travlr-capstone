import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Trip } from '../../models/trip';
import { TripData } from '../../services/trip-data';
import { TripCard } from '../trip-card/trip-card';
import { AuthenticationService } from '../../services/authentication';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TripCard],
  templateUrl: './trip-list.html',
  styleUrl: './trip-list.css'
})
export class TripList implements OnInit {
  trips: Trip[] = [];
  message: string = '';

  private tripDataService = inject(TripData);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthenticationService);

  ngOnInit(): void {
    this.getTrips();
  }

  // Check if an admin is currently authenticated
  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  private getTrips(): void {
    this.message = 'Searching for trips...';
    this.tripDataService.getTrips().subscribe({
      next: (value: Trip[]) => {
        this.trips = value;
        if (value.length > 0) {
          this.message = '';
        } else {
          this.message = 'No trips found.';
        }
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error fetching trips:', error);
        this.message = 'Error fetching trips from API.';
        this.cdr.markForCheck();
      }
    });
  }
}
