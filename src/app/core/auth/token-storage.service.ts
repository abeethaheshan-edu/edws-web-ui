import { Injectable, signal } from '@angular/core';
import { AuthToken } from './auth-token.model';

const STORAGE_KEY = 'edws.auth.token';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly current = signal<AuthToken>(this.read());

  readonly token = this.current.asReadonly();

  get accessToken(): string {
    return this.current().accessToken;
  }

  get refreshToken(): string {
    return this.current().refreshToken;
  }

  get authorizationHeader(): string {
    return this.current().authorizationHeader;
  }

  get isAuthenticated(): boolean {
    return !this.current().isEmpty;
  }

  save(token: AuthToken): void {
    this.current.set(token);
    this.write(token);
  }

  updateAccessToken(accessToken: string): void {
    const token = this.current();
    token.accessToken = accessToken;
    this.save(token);
  }

  clear(): void {
    this.current.set(new AuthToken());
    localStorage.removeItem(STORAGE_KEY);
  }

  private read(): AuthToken {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? AuthToken.fromJson(JSON.parse(raw)) : new AuthToken();
    } catch {
      return new AuthToken();
    }
  }

  private write(token: AuthToken): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(token.toJson()));
    } catch {
      return;
    }
  }
}
