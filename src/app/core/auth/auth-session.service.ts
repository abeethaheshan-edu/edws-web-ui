import { computed, Injectable, signal } from '@angular/core';
import { AuthenticatedUser } from './authenticated-user.model';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly current = signal<AuthenticatedUser | null>(null);
  private temporaryPassword = '';

  readonly user = this.current.asReadonly();
  readonly isSignedIn = computed(() => this.current() !== null);
  readonly mustChangePassword = computed(() => this.current()?.mustChangePassword ?? false);

  setUser(user: AuthenticatedUser): void {
    this.current.set(user);
  }

  setTemporaryPassword(password: string): void {
    this.temporaryPassword = password;
  }

  getTemporaryPassword(): string {
    return this.temporaryPassword;
  }

  clearTemporaryPassword(): void {
    this.temporaryPassword = '';
  }

  clear(): void {
    this.current.set(null);
    this.temporaryPassword = '';
  }
}
