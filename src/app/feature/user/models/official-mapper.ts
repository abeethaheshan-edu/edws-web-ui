import { AdministrativeScope, UserRole, UserStatus } from '../../../shared/models/user-role.model';
import { SystemUser, UserFormValue } from '../../../shared/models/user.model';

export function toOfficial(json: Record<string, unknown>): SystemUser {
  const profile = (json['profile'] as Record<string, unknown>) ?? {};
  const adminProfile = (json['adminProfile'] as Record<string, unknown>) ?? {};

  return {
    id: (json['id'] as string) ?? '',
    fullName: (json['fullName'] as string) ?? (profile['fullName'] as string) ?? '',
    email: (json['email'] as string) ?? '',
    telephone: (json['telephone'] as string) ?? (profile['phone'] as string) ?? '',
    department: (adminProfile['department'] as string) ?? (json['department'] as string) ?? '',
    role: (json['role'] as UserRole) ?? UserRole.Reviewer,
    scope:
      (adminProfile['administrativeScope'] as AdministrativeScope) ??
      (json['administrativeScope'] as AdministrativeScope) ??
      AdministrativeScope.DistrictHead,
    status: (json['status'] as UserStatus) ?? UserStatus.Pending,
    officeAddress: (adminProfile['officeAddress'] as string) ?? (json['officeAddress'] as string) ?? '',
    scopeDetails: {
      province: (adminProfile['province'] as string) ?? undefined,
      district: (adminProfile['district'] as string) ?? undefined,
      city: (adminProfile['city'] as string) ?? undefined,
      divisionalSecretariat: (adminProfile['divisionalSecretariat'] as string) ?? undefined,
      gnDivision: (adminProfile['gnDivision'] as string) ?? undefined,
      gnCode: (adminProfile['gnCode'] as string) ?? undefined,
      councilName: (adminProfile['councilName'] as string) ?? undefined,
    },
    lastActiveAt: (json['lastActiveAt'] as string) ?? 'Invitation pending',
    lastKnownIp: (json['lastKnownIp'] as string) ?? '-',
    reportsToAdminId: (json['reportsToAdminId'] as string) ?? null,
  };
}

export function toOfficialRequest(value: UserFormValue): Record<string, unknown> {
  return {
    fullName: value.fullName,
    email: value.email,
    telephone: value.telephone,
    department: value.department,
    role: value.role || null,
    administrativeScope: value.scope || null,
    officeAddress: value.officeAddress,
    reportsToAdminId: value.reportsToAdminId || null,
    province: value.scopeDetails.province ?? null,
    district: value.scopeDetails.district ?? null,
    city: value.scopeDetails.city ?? null,
    divisionalSecretariat: value.scopeDetails.divisionalSecretariat ?? null,
    gnDivision: value.scopeDetails.gnDivision ?? null,
    gnCode: value.scopeDetails.gnCode ?? null,
    councilName: value.scopeDetails.councilName ?? null,
  };
}
