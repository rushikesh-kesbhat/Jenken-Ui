import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  loginForm = this.fb.nonNullable.group({
    username: ['', [
      Validators.required,
      Validators.minLength(3)
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(8)
    ]]
  });

  errorMessage = '';
  isSubmitting = false;

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.getRawValue();

    this.authService.login(username, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const returnUrl = this.router.url;
          this.router.navigateByUrl(returnUrl || '/dashboard');
        },
        error: (error) => {
          this.errorMessage = error.message || 'Login failed. Please try again.';
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}