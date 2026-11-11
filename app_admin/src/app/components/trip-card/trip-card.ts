import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../../models/trip';
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

  // Check if an admin is currently authenticated
  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  editTrip(trip: Trip): void {
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit']);
  }
}
