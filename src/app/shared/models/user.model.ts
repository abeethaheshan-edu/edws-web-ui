import { AdministrativeScope, SelectOption, UserRole, UserStatus } from './user-role.model';

export interface ScopeDetails {
  province?: string;
  district?: string;
  city?: string;
  divisionalSecretariat?: string;
  gnDivision?: string;
  gnCode?: string;
  councilName?: string;
}

export interface SystemUser {
  id: string;
  fullName: string;
  email: string;
  telephone: string;
  department: string;
  role: UserRole;
  scope: AdministrativeScope;
  status: UserStatus;
  officeAddress: string;
  scopeDetails: ScopeDetails;
  lastActiveAt: string;
  lastKnownIp: string;

  reportsToAdminId: string | null;
}

export interface UserFormValue {
  scope: AdministrativeScope | '';
  fullName: string;
  email: string;
  telephone: string;
  department: string;
  role: UserRole | '';

  reportsToAdminId: string;
  officeAddress: string;
  scopeDetails: ScopeDetails;
}

export interface UserFilter {
  search: string;
  province: string;
  district: string;
  role: UserRole | '';
}

export interface AdminTeam {
  adminId: string;
  reviewerIds: string[];
  drawerIds: string[];
}

export type ScopeFieldType = 'text' | 'select' | 'number';

export interface ScopeFieldConfig {
  key: keyof ScopeDetails;
  label: string;
  type: ScopeFieldType;
  placeholder: string;
  required: boolean;
  options?: SelectOption[];

  length?: number;
}
