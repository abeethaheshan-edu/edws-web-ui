export type AccessAction = 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'APPROVE';

export interface AccessElement {
  element: string;
  actions: AccessAction[];
}

export interface AccessPolicy {
  role: string;
  elements: AccessElement[];
}

export interface RouteAccess {
  accessControlElements?: string[];
  actions?: AccessAction[];
}

export const ACCESS_ELEMENTS = {
  navDashboard: 'NAV_DASHBOARD',
  navDisasterAlerts: 'NAV_DISASTER_ALERTS',
  navUserManagement: 'NAV_USER_MANAGEMENT',
  navDocumentArchive: 'NAV_DOCUMENT_ARCHIVE',
  navSystemSettings: 'NAV_SYSTEM_SETTINGS',
  userManagement: 'USER_MANAGEMENT',
  officialInvite: 'OFFICIAL_INVITE',
  teamAssignment: 'TEAM_ASSIGNMENT',
  disasterAlert: 'DISASTER_ALERT',
  navCitizenRegistry: 'NAV_CITIZEN_REGISTRY',
  citizenRegistry: 'CITIZEN_REGISTRY',
  emergencyBroadcast: 'EMERGENCY_BROADCAST',
} as const;
