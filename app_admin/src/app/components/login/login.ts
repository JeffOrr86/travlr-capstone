import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  public loginForm!: FormGroup;
  public errorMessage: string = '';

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthenticationService);

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please provide a valid email and password.';
      return;
    }

    // Trim whitespace to avoid accidental trailing space issues
    const credentials = {
      email: this.loginForm.value.email.trim(),
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.errorMessage = '';
        this.router.navigate(['']);
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message || 'Invalid email or password';
      }
    });
  }
}
