import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { landingRoute } from '../../../../core/access/landing-route';
import { PermissionService } from '../../../../core/access/permission.service';
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
  private readonly permissions = inject(PermissionService);

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
        if (user.mustChangePassword) {
          this.submitting.set(false);
          this.toast.info('Temporary password detected', 'Set a permanent password to continue.');
          void this.router.navigate(['/auth/set-password'], { queryParams: { email: user.email } });
          return;
        }

        this.submitting.set(false);

        this.permissions.load().subscribe({
          next: () => {
            this.toast.success('Signed in', `Welcome back, ${user.fullName}.`);
            void this.router.navigateByUrl(landingRoute(this.permissions));
          },
          error: (policyError: ApiError) => {
            this.toast.error('Sign in failed', policyError?.message ?? 'Could not load your access rights.');
            this.authApi.logout();
          },
        });
      },
      error: (error: ApiError) => {
        this.submitting.set(false);
        this.toast.error('Sign in failed', error?.message ?? 'Check your credentials and try again.');
      },
    });
  }
}
