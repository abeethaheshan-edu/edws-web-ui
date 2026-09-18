import { computed, Injectable, signal } from '@angular/core';
import { AuthenticatedUser } from './authenticated-user.model';

const USER_KEY = 'edws.auth.user';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly current = signal<AuthenticatedUser | null>(this.read());
  private temporaryPassword = '';

  readonly user = this.current.asReadonly();
  readonly isSignedIn = computed(() => this.current() !== null);
  readonly mustChangePassword = computed(() => this.current()?.mustChangePassword ?? false);

  setUser(user: AuthenticatedUser): void {
    this.current.set(user);
    this.write(user);
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
    localStorage.removeItem(USER_KEY);
  }

  private read(): AuthenticatedUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? AuthenticatedUser.fromJson(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  }

  private write(user: AuthenticatedUser): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user.toJson()));
    } catch {
      return;
    }
  }
}
