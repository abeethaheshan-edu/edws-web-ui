export interface CitizenMember {
  fullName: string;
  nic: string;
  phone: string;
  email: string;
}

export interface CitizenProperty {
  houseNo: string;
  city: string;
  streetAddress1: string;
  streetAddress2: string;
  category: string;
  categoryOther: string;
  province: string;
  district: string;
  latitude: number | null;
  longitude: number | null;
  primary: boolean;
}

export interface CitizenFormValue {
  gnDivision: string;
  gnOfficerName: string;
  province: string;
  district: string;
  fullName: string;
  nic: string;
  phone: string;
  secondaryPhone: string;
  email: string;
  properties: CitizenProperty[];
  members: CitizenMember[];
}

export interface CitizenSummary {
  id: string;
  fullName: string;
  nic: string;
  email: string;
  phone: string;
  city: string;
  gnDivision: string;
  memberCount: number;
  propertyCount: number;
}

export const PROPERTY_CATEGORIES = [
  { value: 'HOUSE', label: 'House' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'OTHER', label: 'Other' },
];

export function toCitizenSummary(json: Record<string, unknown>): CitizenSummary {
  const profile = (json['profile'] as Record<string, unknown>) ?? {};
  const address = (profile['address'] as Record<string, unknown>) ?? {};
  const members = (json['members'] as unknown[]) ?? [];
  const properties = (json['properties'] as unknown[]) ?? [];
  const gnDivision = (json['gnDivision'] as Record<string, unknown>) ?? {};

  return {
    id: (json['id'] as string) ?? '',
    fullName: (profile['fullName'] as string) ?? '',
    nic: (profile['nic'] as string) ?? '',
    email: (json['email'] as string) ?? '',
    phone: (profile['phone'] as string) ?? '',
    city: (address['city'] as string) ?? '',
    gnDivision: (gnDivision['name'] as string) ?? '',
    memberCount: members.length,
    propertyCount: properties.length,
  };
}
