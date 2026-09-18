import { SelectOption } from '../models/user-role.model';
import { AdministrativeScope } from '../models/user-role.model';
import { ScopeFieldConfig } from '../models/user.model';

export const PROVINCES: SelectOption[] = [
  { value: 'Western Province', label: 'Western Province' },
  { value: 'Central Province', label: 'Central Province' },
  { value: 'Southern Province', label: 'Southern Province' },
  { value: 'Northern Province', label: 'Northern Province' },
  { value: 'Eastern Province', label: 'Eastern Province' },
  { value: 'North Western Province', label: 'North Western Province' },
  { value: 'North Central Province', label: 'North Central Province' },
  { value: 'Uva Province', label: 'Uva Province' },
  { value: 'Sabaragamuwa Province', label: 'Sabaragamuwa Province' },
];

export const DISTRICTS: SelectOption[] = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Monaragala',
  'Ratnapura',
  'Kegalle',
].map((name) => ({ value: name, label: name }));

export const DEPARTMENTS: SelectOption[] = [
  { value: 'Disaster Management Centre', label: 'Disaster Management Centre' },
  { value: 'Meteorology Department', label: 'Meteorology Department' },
  { value: 'Irrigation Department', label: 'Irrigation Department' },
  { value: 'District Secretariat', label: 'District Secretariat' },
  { value: 'Divisional Secretariat', label: 'Divisional Secretariat' },
  { value: 'Municipal Council', label: 'Municipal Council' },
  { value: 'Police Emergency Unit', label: 'Police Emergency Unit' },
];

export const SCOPE_FIELDS: Record<AdministrativeScope, ScopeFieldConfig[]> = {
  [AdministrativeScope.ProvincialHead]: [
    {
      key: 'province',
      label: 'Province',
      type: 'select',
      placeholder: 'Select province',
      required: true,
      options: PROVINCES,
    },
    {
      key: 'councilName',
      label: 'Provincial Council',
      type: 'text',
      placeholder: 'e.g. Southern Provincial Council',
      required: true,
    },
  ],
  [AdministrativeScope.DistrictHead]: [
    {
      key: 'province',
      label: 'Province',
      type: 'select',
      placeholder: 'Select province',
      required: true,
      options: PROVINCES,
    },
    {
      key: 'district',
      label: 'District',
      type: 'select',
      placeholder: 'Select district',
      required: true,
      options: DISTRICTS,
    },
    {
      key: 'councilName',
      label: 'District Secretariat',
      type: 'text',
      placeholder: 'e.g. Galle District Secretariat',
      required: true,
    },
  ],
  [AdministrativeScope.CityAdmin]: [
    {
      key: 'province',
      label: 'Province',
      type: 'select',
      placeholder: 'Select province',
      required: true,
      options: PROVINCES,
    },
    {
      key: 'district',
      label: 'District',
      type: 'select',
      placeholder: 'Select district',
      required: true,
      options: DISTRICTS,
    },
    {
      key: 'city',
      label: 'City / Municipality',
      type: 'text',
      placeholder: 'e.g. Galle Municipal Council area',
      required: true,
    },
  ],
  [AdministrativeScope.GramaNiladhari]: [
    {
      key: 'district',
      label: 'District',
      type: 'select',
      placeholder: 'Select district',
      required: true,
      options: DISTRICTS,
    },
    {
      key: 'divisionalSecretariat',
      label: 'Divisional Secretariat',
      type: 'text',
      placeholder: 'e.g. Bope-Poddala',
      required: true,
    },
    {
      key: 'gnDivision',
      label: 'GN Division',
      type: 'text',
      placeholder: 'e.g. Poddala North',
      required: true,
    },
    {
      key: 'gnCode',
      label: 'GN Division Code',
      type: 'number',
      placeholder: '6 digit code',
      required: true,
      length: 6,
    },
  ],
};
