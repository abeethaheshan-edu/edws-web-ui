import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { ApiService } from '../api/api.service';
import { ApiResponse } from '../net/api-response.model';
import { Net } from '../net/net';
import { NetworkService } from '../net/network.service';
import { AuthToken } from './auth-token.model';
import { AuthenticatedUser } from './authenticated-user.model';
import { AuthSessionService } from './auth-session.service';
import { TokenStorageService } from './token-storage.service';
import { PermissionService } from '../access/permission.service';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly api = inject(ApiService);
  private readonly network = inject(NetworkService);
  private readonly storage = inject(TokenStorageService);
  private readonly session = inject(AuthSessionService);
  private readonly permissions = inject(PermissionService);

  login(email: string, password: string): Observable<AuthenticatedUser> {
    const net = Net.post();
    net.url = this.api.getApiUrl('login');
    net.body = { email, password };
    net.skipAuth = true;

    return this.network.unwrapFull<Record<string, unknown>>(net).pipe(
      map((response) => {
        this.storage.save(AuthToken.fromHeaders(response.headers));
        this.permissions.clear();
        const user = AuthenticatedUser.fromJson(response.body?.data ?? {});
        this.session.setUser(user);
        if (user.mustChangePassword) {
          this.session.setTemporaryPassword(password);
        }
        return user;
      }),
    );
  }

  refresh(): Observable<AuthToken> {
    const net = Net.post();
    net.url = this.api.getApiUrl('refreshToken');
    net.skipAuth = true;
    net.addHeader('X-Refresh-Token', this.storage.refreshToken);

    return this.network.unwrapFull<Record<string, unknown>>(net).pipe(
      map((response) => {
        const token = AuthToken.fromHeaders(response.headers);
        this.storage.save(token);
        this.session.setUser(AuthenticatedUser.fromJson(response.body?.data ?? {}));
        return token;
      }),
    );
  }

  me(): Observable<AuthenticatedUser> {
    const net = Net.get();
    net.url = this.api.getApiUrl('me');

    return this.network.unwrap<Record<string, unknown>>(net).pipe(
      map((data) => AuthenticatedUser.fromJson(data)),
      tap((user) => this.session.setUser(user)),
    );
  }

  forgotPassword(email: string): Observable<string> {
    const net = Net.post();
    net.url = this.api.getApiUrl('forgotPassword');
    net.body = { email };
    net.skipAuth = true;

    return this.network.request<ApiResponse<void>>(net).pipe(map((response) => response.message));
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<string> {
    const net = Net.post();
    net.url = this.api.getApiUrl('resetPassword', token);
    net.body = { newPassword, confirmPassword };
    net.skipAuth = true;

    return this.network.request<ApiResponse<void>>(net).pipe(map((response) => response.message));
  }

  updatePassword(currentPassword: string, newPassword: string, confirmPassword: string): Observable<string> {
    const net = Net.post();
    net.url = this.api.getApiUrl('updatePassword');
    net.body = { currentPassword, newPassword, confirmPassword };

    return this.network.request<ApiResponse<void>>(net).pipe(
      map((response) => response.message),
      tap(() => this.session.clearTemporaryPassword()),
    );
  }

  logout(): void {
    this.storage.clear();
    this.session.clear();
    this.permissions.clear();
  }
}
