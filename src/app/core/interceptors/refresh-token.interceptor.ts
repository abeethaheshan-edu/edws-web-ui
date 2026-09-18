import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthApiService } from '../auth/auth-api.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { SKIP_AUTH } from '../net/net-context';
import { withAuthHeaders } from './auth-token.interceptor';

let refreshing = false;
const refreshedToken = new BehaviorSubject<string | null>(null);

export const refreshTokenInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const storage = inject(TokenStorageService);
  const authApi = inject(AuthApiService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: unknown) => {
      const isAuthError = error instanceof HttpErrorResponse && error.status === 401;
      const canRefresh = !request.context.get(SKIP_AUTH) && !!storage.refreshToken;

      if (!isAuthError || !canRefresh) {
        return throwError(() => error);
      }

      if (refreshing) {
        return refreshedToken.pipe(
          filter((token): token is string => token !== null),
          take(1),
          switchMap((token) => next(withAuthHeaders(request, token, storage.refreshToken))),
        );
      }

      refreshing = true;
      refreshedToken.next(null);

      return authApi.refresh().pipe(
        switchMap((token) => {
          refreshing = false;
          refreshedToken.next(token.authorizationHeader);
          return next(withAuthHeaders(request, token.authorizationHeader, token.refreshToken));
        }),
        catchError((refreshError: unknown) => {
          refreshing = false;
          storage.clear();
          void router.navigateByUrl('/auth/login');
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
