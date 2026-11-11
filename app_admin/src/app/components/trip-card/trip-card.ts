import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../../models/trip';
import { TripData } from '../../services/trip-data';
import { AuthenticationService } from '../../services/authentication';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css'
})
export class TripCard {
  @Input() trip!: Trip;

  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private tripDataService = inject(TripData);

  // Check if a user is currently authenticated
  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Check if the current user has SuperAdmin privileges
  public isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  // Navigate to edit form
  editTrip(trip: Trip): void {
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit']);
  }

  // SuperAdmin-only deletion routine
  deleteTrip(tripCode: string): void {
    if (confirm(`Are you sure you want to delete trip "${this.trip.name}" (${tripCode})?`)) {
      this.tripDataService.deleteTrip(tripCode).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (err: any) => {
          console.error('Error deleting trip:', err);
          alert('Failed to delete trip. You may not have sufficient permissions.');
        }
      });
    }
  }
}
