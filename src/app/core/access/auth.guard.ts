import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';
import { PermissionService } from './permission.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const storage = inject(TokenStorageService);
  const permissions = inject(PermissionService);
  const router = inject(Router);

  if (!storage.isAuthenticated) {
    return router.createUrlTree(['/auth/login'], { queryParams: { redirectTo: state.url } });
  }

  return permissions.ensureLoaded().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/auth/login']))),
  );
};
