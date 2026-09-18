export enum UserRole {
  SuperAdmin = 'SUPER_ADMIN',
  Admin = 'ADMIN',
  Reviewer = 'REVIEWER',
  Drawer = 'DRAWER',
  GnOfficer='GN_OFFICER'
}

export enum AdministrativeScope {
  ProvincialHead = 'PROVINCIAL_HEAD',
  DistrictHead = 'DISTRICT_HEAD',
  CityAdmin = 'CITY_ADMIN',
  GramaNiladhari = 'GRAMA_NILADHARI',
}

export enum UserStatus {
  Active = 'ACTIVE',
  Pending = 'PENDING',
  Suspended = 'SUSPENDED',
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
}

export const ACCESS_ROLE_OPTIONS: SelectOption<UserRole>[] = [
  { value: UserRole.Admin, label: 'Admin', description: 'Manage users and settings' },
  { value: UserRole.Reviewer, label: 'Reviewer', description: 'Verify and validate risk data' },
  { value: UserRole.Drawer, label: 'Drawer', description: 'Create polygon and draw the area of disaster' },
  { value: UserRole.GnOfficer, label: 'Gn Officer', description: 'Grama Niladari' },
];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SuperAdmin]: 'Super Administrator',
  [UserRole.Admin]: 'Admin',
  [UserRole.Reviewer]: 'Reviewer',
  [UserRole.Drawer]: 'Drawer',
  [UserRole.GnOfficer]: 'Gn Officer',
};

export const ADMINISTRATIVE_SCOPE_OPTIONS: SelectOption<AdministrativeScope>[] = [
  { value: AdministrativeScope.ProvincialHead, label: 'Provincial Head' },
  { value: AdministrativeScope.DistrictHead, label: 'District Head' },
  { value: AdministrativeScope.CityAdmin, label: 'City Admin' },
  { value: AdministrativeScope.GramaNiladhari, label: 'Grama Niladhari' },
];

export const ADMINISTRATIVE_SCOPE_LABELS: Record<AdministrativeScope, string> = {
  [AdministrativeScope.ProvincialHead]: 'Provincial Head',
  [AdministrativeScope.DistrictHead]: 'District Head',
  [AdministrativeScope.CityAdmin]: 'City Admin',
  [AdministrativeScope.GramaNiladhari]: 'Grama Niladhari',
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  [UserStatus.Active]: 'Active',
  [UserStatus.Pending]: 'Pending',
  [UserStatus.Suspended]: 'Suspended',
};

export const USER_STATUS_TONE: Record<UserStatus, 'success' | 'warning' | 'danger'> = {
  [UserStatus.Active]: 'success',
  [UserStatus.Pending]: 'warning',
  [UserStatus.Suspended]: 'danger',
};
