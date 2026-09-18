import { ACCESS_ELEMENTS } from './access-policy.model';
import { PermissionService } from './permission.service';

const LANDING_ROUTES: Array<{ element: string; route: string }> = [
  { element: ACCESS_ELEMENTS.navDashboard, route: '/dashboard' },
  { element: ACCESS_ELEMENTS.navDisasterAlerts, route: '/disasters' },
  { element: ACCESS_ELEMENTS.navCitizenRegistry, route: '/citizens' },
  { element: ACCESS_ELEMENTS.navUserManagement, route: '/users' },
  { element: ACCESS_ELEMENTS.navDocumentArchive, route: '/documents' },
  { element: ACCESS_ELEMENTS.navSystemSettings, route: '/settings' },
];

export function landingRoute(permissions: PermissionService): string {
  const match = LANDING_ROUTES.find((entry) => permissions.can(entry.element, 'VIEW'));
  return match ? match.route : '/auth/login';
}
