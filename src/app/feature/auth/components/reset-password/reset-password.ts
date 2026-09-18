import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService } from '../../../../core/auth/auth-api.service';
import { AuthSessionService } from '../../../../core/auth/auth-session.service';
import { ApiError } from '../../../../core/net/api-error.model';
import { PasswordResetMode, PasswordRule, ResetPasswordPayload } from '../../../../shared/models/auth.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);
  private readonly authApi = inject(AuthApiService);
  private readonly session = inject(AuthSessionService);

  protected readonly mode: PasswordResetMode = this.route.snapshot.data['mode'] ?? 'reset-link';
  protected readonly email = this.route.snapshot.queryParamMap.get('email') ?? '';
  private readonly token = this.route.snapshot.queryParamMap.get('token') ?? 'first-login';

  protected readonly passwordVisible = signal(false);
  protected readonly confirmVisible = signal(false);
  protected readonly submitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
      password: ['', [Validators.required, CustomValidators.password(8)]],
      confirmPassword: ['', [Validators.required]],
    },{ validators: CustomValidators.match('password', 'confirmPassword') },
  );

  private readonly passwordValue = toSignal(this.form.controls.password.valueChanges, {
    initialValue: '',
  });

  protected readonly rules = computed<PasswordRule[]>(() => {
    const value = this.passwordValue();
    return [
      { key: 'length', label: 'At least 8 characters', met: value.length >= 8 },
      { key: 'upper', label: 'One uppercase letter', met: /[A-Z]/.test(value) },
      { key: 'lower', label: 'One lowercase letter', met: /[a-z]/.test(value) },
      { key: 'number', label: 'One number', met: /[0-9]/.test(value) },
      { key: 'symbol', label: 'One special character', met: /[^A-Za-z0-9]/.test(value) },
    ];
  });

  protected get isFirstLogin(): boolean {
    return this.mode === 'first-login';
  }

  protected togglePassword(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  protected toggleConfirm(): void {
    this.confirmVisible.update((visible) => !visible);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } = this.form.getRawValue();
    const payload: ResetPasswordPayload = { token: this.token, password, confirmPassword };
    console.log('[SetNewPassword] submit', { mode: this.mode, email: this.email, token: payload.token });

    this.submitting.set(true);

    const request$ = this.isFirstLogin
      ? this.authApi.updatePassword(this.session.getTemporaryPassword(), password, confirmPassword)
      : this.authApi.resetPassword(this.token, password, confirmPassword);

    request$.subscribe({
      next: (message) => {
        this.submitting.set(false);
        this.authApi.logout();
        this.toast.success('Password updated', message);
        void this.router.navigateByUrl('/auth/login');
      },
      error: (error: ApiError) => {
        this.submitting.set(false);
        this.toast.error('Could not update the password', error?.message ?? 'Please try again.');
      },
    });
  }
}
