import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../../core/auth/auth-api.service';
import { ApiError } from '../../../../core/net/api-error.model';
import { ForgotPasswordPayload } from '../../../../shared/models/auth.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-fogot-password',
  standalone: false,
  templateUrl: './fogot-password.html',
  styleUrl: './fogot-password.scss',
})
export class FogotPassword {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly authApi = inject(AuthApiService);

  protected readonly submitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, CustomValidators.email()]],
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ForgotPasswordPayload = this.form.getRawValue();
    console.log('[ForgotPassword] submit', payload);

    this.submitting.set(true);

    this.authApi.forgotPassword(payload.email).subscribe({
      next: (message) => {
        this.submitting.set(false);
        this.toast.success('Reset link sent', message);
        void this.router.navigate(['/auth/check-email'], { queryParams: { email: payload.email } });
      },
      error: (error: ApiError) => {
        this.submitting.set(false);
        this.toast.error('Could not send the link', error?.message ?? 'Please try again.');
      },
    });
  }
}
