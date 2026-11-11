import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripData } from '../../services/trip-data';
import { Trip } from '../../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css'
})
export class EditTrip implements OnInit {
  public editForm!: FormGroup;
  protected trip!: Trip;
  protected submitted = false;
  protected message = '';

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private tripDataService = inject(TripData);

  public ngOnInit(): void {
    const tripCode = localStorage.getItem('tripCode');

    if (!tripCode) {
      alert("Something went wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    this.editForm = this.formBuilder.group({
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.tripDataService.getTrip(tripCode).subscribe({
      next: (value: Trip[]) => {
        this.trip = value[0];

        // Format the database date to YYYY-MM-DD so the HTML date input can display it
        const formattedDate = value[0]?.start
          ? new Date(value[0].start).toISOString().slice(0, 10)
          : '';

        this.editForm.patchValue({
          ...value[0],
          start: formattedDate
        });

        if (!value) {
          this.message = 'No trip retrieved!';
        } else {
          this.message = `Trip ${tripCode} retrieved`;
        }

        console.log(this.message);
      },
      error: (error: Error) => {
        console.log('Error', error);
      }
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.editForm.value).subscribe({
        next: (value: unknown) => {
          console.log(value);
          this.router.navigate(['']);
        },
        error: (error: Error) => {
          console.log('Error', error);
        }
      });
    }
  }

  get f() {
    return this.editForm.controls;
  }
}
