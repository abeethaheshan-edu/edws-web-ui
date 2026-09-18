import { SystemUser } from '../../../shared/models/user.model';
import { AdministrativeScope, UserRole, UserStatus } from '../../../shared/models/user-role.model';

const SEED: Array<Partial<SystemUser> & { fullName: string }> = [
  { fullName: 'Rohan Silva', role: UserRole.Admin, scope: AdministrativeScope.ProvincialHead, scopeDetails: { province: 'Southern Province', councilName: 'Southern Provincial Council' } },
  { fullName: 'Priyantha Kumara', role: UserRole.Reviewer, scope: AdministrativeScope.DistrictHead, scopeDetails: { province: 'Southern Province', district: 'Galle' }, reportsToAdminId: 'USR-001' },
  { fullName: 'Nadeesha Perera', role: UserRole.Drawer, scope: AdministrativeScope.CityAdmin, scopeDetails: { province: 'Western Province', district: 'Colombo', city: 'Dehiwala' }, reportsToAdminId: 'USR-001' },
  { fullName: 'Chaminda Fernando', role: UserRole.Admin, scope: AdministrativeScope.DistrictHead, scopeDetails: { province: 'Central Province', district: 'Kandy', councilName: 'Kandy District Secretariat' }, status: UserStatus.Pending },
  { fullName: 'Ishara Jayasinghe', role: UserRole.Reviewer, scope: AdministrativeScope.GramaNiladhari, scopeDetails: { district: 'Matara', divisionalSecretariat: 'Weligama', gnDivision: 'Kapparatota', gnCode: '412030' }, reportsToAdminId: 'USR-004' },
  { fullName: 'Sanduni Ratnayake', role: UserRole.Drawer, scope: AdministrativeScope.DistrictHead, scopeDetails: { province: 'Northern Province', district: 'Jaffna' }, reportsToAdminId: 'USR-004' },
  { fullName: 'Tharindu Bandara', role: UserRole.Admin, scope: AdministrativeScope.CityAdmin, scopeDetails: { province: 'Western Province', district: 'Gampaha', city: 'Negombo' } },
  { fullName: 'Kavindi Wijesuriya', role: UserRole.Reviewer, scope: AdministrativeScope.ProvincialHead, scopeDetails: { province: 'Uva Province', councilName: 'Uva Provincial Council' }, reportsToAdminId: 'USR-007' },
  { fullName: 'Dinesh Abeywardena', role: UserRole.Drawer, scope: AdministrativeScope.GramaNiladhari, scopeDetails: { district: 'Ratnapura', divisionalSecretariat: 'Eheliyagoda', gnDivision: 'Kiriporuwa', gnCode: '620145' }, reportsToAdminId: 'USR-007' },
  { fullName: 'Hasitha Gunawardena', role: UserRole.Admin, scope: AdministrativeScope.DistrictHead, scopeDetails: { province: 'Eastern Province', district: 'Batticaloa', councilName: 'Batticaloa District Secretariat' } },
  { fullName: 'Malsha Dissanayake', role: UserRole.Reviewer, scope: AdministrativeScope.CityAdmin, scopeDetails: { province: 'North Western Province', district: 'Kurunegala', city: 'Kuliyapitiya' }, reportsToAdminId: 'USR-010', status: UserStatus.Suspended },
  { fullName: 'Ruwan Ekanayake', role: UserRole.Drawer, scope: AdministrativeScope.DistrictHead, scopeDetails: { province: 'North Central Province', district: 'Anuradhapura' }, reportsToAdminId: 'USR-010' },
  { fullName: 'Amali Senanayake', role: UserRole.Admin, scope: AdministrativeScope.ProvincialHead, scopeDetails: { province: 'Sabaragamuwa Province', councilName: 'Sabaragamuwa Provincial Council' } },
  { fullName: 'Nuwan Karunaratne', role: UserRole.Reviewer, scope: AdministrativeScope.DistrictHead, scopeDetails: { province: 'Southern Province', district: 'Hambantota' }, reportsToAdminId: 'USR-013' },
  { fullName: 'Shanika Rajapaksha', role: UserRole.Drawer, scope: AdministrativeScope.GramaNiladhari, scopeDetails: { district: 'Galle', divisionalSecretariat: 'Bope-Poddala', gnDivision: 'Poddala North', gnCode: '381020' }, reportsToAdminId: 'USR-001' },
  { fullName: 'Lakmal Weerasinghe', role: UserRole.Reviewer, scope: AdministrativeScope.CityAdmin, scopeDetails: { province: 'Central Province', district: 'Matale', city: 'Dambulla' }, reportsToAdminId: 'USR-004', status: UserStatus.Pending },
  { fullName: 'Dilrukshi Herath', role: UserRole.Drawer, scope: AdministrativeScope.ProvincialHead, scopeDetails: { province: 'Eastern Province', councilName: 'Eastern Provincial Council' }, reportsToAdminId: 'USR-010' },
  { fullName: 'Asanka Pathirana', role: UserRole.Admin, scope: AdministrativeScope.GramaNiladhari, scopeDetails: { district: 'Puttalam', divisionalSecretariat: 'Chilaw', gnDivision: 'Bangadeniya', gnCode: '553011' } },
  { fullName: 'Chathurika Mendis', role: UserRole.Reviewer, scope: AdministrativeScope.DistrictHead, scopeDetails: { province: 'Uva Province', district: 'Badulla' }, reportsToAdminId: 'USR-018' },
  { fullName: 'Janaka Samarasinghe', role: UserRole.Drawer, scope: AdministrativeScope.CityAdmin, scopeDetails: { province: 'Western Province', district: 'Kalutara', city: 'Panadura' }, reportsToAdminId: 'USR-018' },
  { fullName: 'Upeksha Liyanage', role: UserRole.Reviewer, scope: AdministrativeScope.DistrictHead, scopeDetails: { province: 'Northern Province', district: 'Vavuniya' }, reportsToAdminId: 'USR-013' },
  { fullName: 'Buddhika Alwis', role: UserRole.Drawer, scope: AdministrativeScope.DistrictHead, scopeDetails: { province: 'Central Province', district: 'Nuwara Eliya' }, reportsToAdminId: 'USR-004' },
  { fullName: 'Nilanthi Wickramasinghe', role: UserRole.Admin, scope: AdministrativeScope.CityAdmin, scopeDetails: { province: 'Southern Province', district: 'Matara', city: 'Matara' } },
];

const DEPARTMENT_BY_ROLE: Record<string, string> = {
  [UserRole.Admin]: 'District Secretariat',
  [UserRole.Reviewer]: 'Disaster Management Centre',
  [UserRole.Drawer]: 'Irrigation Department',
};

function emailFor(name: string): string {
  const [first, ...rest] = name.toLowerCase().split(' ');
  const last = rest.length ? rest[rest.length - 1][0] : '';
  return `${first}.${last}@dmc.gov.lk`;
}

export const MOCK_USERS: SystemUser[] = SEED.map((seed, index) => {
  const id = `USR-${String(index + 1).padStart(3, '0')}`;
  const role = seed.role ?? UserRole.Reviewer;

  return {
    id,
    fullName: seed.fullName,
    email: emailFor(seed.fullName),
    telephone: `+9471${String(2000000 + index * 13457).slice(0, 7)}`,
    department: DEPARTMENT_BY_ROLE[role] ?? 'Disaster Management Centre',
    role,
    scope: seed.scope ?? AdministrativeScope.DistrictHead,
    status: seed.status ?? UserStatus.Active,
    officeAddress: `No ${12 + index}, Station Road, ${seed.scopeDetails?.district ?? 'Colombo'}`,
    scopeDetails: seed.scopeDetails ?? {},
    lastActiveAt: `Today, ${String(8 + (index % 9)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')} AM`,
    lastKnownIp: `192.168.1.${20 + index}`,
    reportsToAdminId: seed.reportsToAdminId ?? null,
  };
});
