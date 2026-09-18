import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';
import { SKIP_AUTH } from '../net/net-context';

export const authTokenInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const storage = inject(TokenStorageService);

  if (request.context.get(SKIP_AUTH) || !storage.isAuthenticated) {
    return next(request);
  }

  return next(withAuthHeaders(request, storage.authorizationHeader, storage.refreshToken));
};

export function withAuthHeaders(
  request: HttpRequest<unknown>,
  authorization: string,
  refreshToken: string,
): HttpRequest<unknown> {
  let headers = request.headers.set('Authorization', authorization);

  if (refreshToken) {
    headers = headers.set('X-Refresh-Token', refreshToken);
  }
  if (!request.headers.has('Accept')) {
    headers = headers.set('Accept', 'application/json');
  }

  return request.clone({ headers });
};
