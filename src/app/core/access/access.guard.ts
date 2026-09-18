import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccessAction, RouteAccess } from './access-policy.model';
import { PermissionService } from './permission.service';

export const accessGuard: CanActivateFn = (route) => {
  const permissions = inject(PermissionService);
  const router = inject(Router);

  const access = (route.data ?? {}) as RouteAccess;
  const elements = access.accessControlElements ?? [];

  if (!elements.length) {
    return true;
  }

  const actions: AccessAction[] = access.actions?.length ? access.actions : ['VIEW'];
  const granted = actions.every((action) => permissions.canAny(elements, action));

  return granted ? true : router.createUrlTree(['/dashboard']);
};
