export interface CitizenFormValue {
  fullName: string;
  nic: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  householder: boolean;
  houseName: string;
  houseNo: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  zipCode: string;
  gnDivision: string;
  latitude: number | null;
  longitude: number | null;
}

export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];
