import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../../core/auth/auth-api.service';
import { ApiError } from '../../../../core/net/api-error.model';
import { LoginPayload } from '../../../../shared/models/auth.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly authApi = inject(AuthApiService);

  protected readonly showPassword = signal(false);
  protected readonly submitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, CustomValidators.email()]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberDevice: [false],
  });

  protected togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Check the form', 'Enter your official email and password to continue.');
      return;
    }

    const payload: LoginPayload = this.form.getRawValue();
    console.log('[Login] submit', { email: payload.email, rememberDevice: payload.rememberDevice });

    this.submitting.set(true);

    this.authApi.login(payload.email, payload.password).subscribe({
      next: (user) => {
        this.submitting.set(false);

        if (user.mustChangePassword) {
          this.toast.info('Temporary password detected', 'Set a permanent password to continue.');
          void this.router.navigate(['/auth/set-password'], { queryParams: { email: user.email } });
          return;
        }

        this.toast.success('Signed in', `Welcome back, ${user.fullName}.`);
        void this.router.navigateByUrl('/dashboard');
      },
      error: (error: ApiError) => {
        this.submitting.set(false);
        this.toast.error('Sign in failed', error?.message ?? 'Check your credentials and try again.');
      },
    });
  }
}
