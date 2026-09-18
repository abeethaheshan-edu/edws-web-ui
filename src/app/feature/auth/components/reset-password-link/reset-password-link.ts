import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-reset-password-link',
  standalone: false,
  templateUrl: './reset-password-link.html',
  styleUrl: './reset-password-link.scss',
})
export class ResetPasswordLink implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  private countdownId?: ReturnType<typeof setInterval>;

  protected readonly email = signal(this.route.snapshot.queryParamMap.get('email') ?? 'name@dmc.gov.lk');

  protected readonly cooldown = signal(0);

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  protected openEmailApp(): void {
    console.log('[CheckEmail] open email app for', this.email());
    this.router.navigate(['/auth/reset-password'], {
      queryParams: { token: 'demo-reset-token', email: this.email() },
    });
  }

  protected resend(): void {
    if (this.cooldown() > 0) {
      return;
    }

    console.log('[CheckEmail] resend reset link to', this.email());
    this.toast.success('Link sent again', `A new reset link is on its way to ${this.email()}.`);
    this.startCountdown(30);
  }

  private startCountdown(seconds: number): void {
    this.stopCountdown();
    this.cooldown.set(seconds);

    this.countdownId = setInterval(() => {
      this.cooldown.update((value) => value - 1);
      if (this.cooldown() <= 0) {
        this.stopCountdown();
      }
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.countdownId) {
      clearInterval(this.countdownId);
      this.countdownId = undefined;
    }
  }
}
