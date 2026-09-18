import { AreaScope, GeoPoint } from '../models/disaster-alert.model';

export interface AreaLocation extends GeoPoint {
  name: string;
  zoom: number;
}

export const PROVINCE_LOCATIONS: AreaLocation[] = [
  { name: 'Western Province', lat: 6.9, lng: 80.0, zoom: 9 },
  { name: 'Central Province', lat: 7.3, lng: 80.7, zoom: 9 },
  { name: 'Southern Province', lat: 6.1, lng: 80.7, zoom: 9 },
  { name: 'Northern Province', lat: 9.2, lng: 80.4, zoom: 9 },
  { name: 'Eastern Province', lat: 7.8, lng: 81.4, zoom: 8 },
  { name: 'North Western Province', lat: 7.8, lng: 80.0, zoom: 9 },
  { name: 'North Central Province', lat: 8.3, lng: 80.7, zoom: 9 },
  { name: 'Uva Province', lat: 6.9, lng: 81.1, zoom: 9 },
  { name: 'Sabaragamuwa Province', lat: 6.8, lng: 80.4, zoom: 9 },
];

export const DISTRICT_LOCATIONS: AreaLocation[] = [
  { name: 'Colombo', lat: 6.9271, lng: 79.8612, zoom: 11 },
  { name: 'Gampaha', lat: 7.0917, lng: 79.9999, zoom: 11 },
  { name: 'Kalutara', lat: 6.5854, lng: 79.9607, zoom: 11 },
  { name: 'Kandy', lat: 7.2906, lng: 80.6337, zoom: 11 },
  { name: 'Matale', lat: 7.4675, lng: 80.6234, zoom: 11 },
  { name: 'Nuwara Eliya', lat: 6.9497, lng: 80.7891, zoom: 11 },
  { name: 'Galle', lat: 6.0535, lng: 80.221, zoom: 11 },
  { name: 'Matara', lat: 5.9549, lng: 80.555, zoom: 11 },
  { name: 'Hambantota', lat: 6.1241, lng: 81.1185, zoom: 10 },
  { name: 'Jaffna', lat: 9.6615, lng: 80.0255, zoom: 11 },
  { name: 'Kilinochchi', lat: 9.3803, lng: 80.377, zoom: 11 },
  { name: 'Mannar', lat: 8.981, lng: 79.9044, zoom: 11 },
  { name: 'Vavuniya', lat: 8.7514, lng: 80.4971, zoom: 11 },
  { name: 'Mullaitivu', lat: 9.2671, lng: 80.8142, zoom: 11 },
  { name: 'Batticaloa', lat: 7.7102, lng: 81.6924, zoom: 11 },
  { name: 'Ampara', lat: 7.2976, lng: 81.6747, zoom: 10 },
  { name: 'Trincomalee', lat: 8.5874, lng: 81.2152, zoom: 11 },
  { name: 'Kurunegala', lat: 7.4863, lng: 80.3623, zoom: 10 },
  { name: 'Puttalam', lat: 8.0362, lng: 79.8283, zoom: 10 },
  { name: 'Anuradhapura', lat: 8.3114, lng: 80.4037, zoom: 10 },
  { name: 'Polonnaruwa', lat: 7.9403, lng: 81.0188, zoom: 10 },
  { name: 'Badulla', lat: 6.9934, lng: 81.055, zoom: 11 },
  { name: 'Monaragala', lat: 6.8728, lng: 81.351, zoom: 10 },
  { name: 'Ratnapura', lat: 6.6828, lng: 80.3992, zoom: 11 },
  { name: 'Kegalle', lat: 7.2513, lng: 80.3464, zoom: 11 },
];

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+district$/, '').replace(/\s+province$/, '');
}

export function findAreaLocation(scope: AreaScope | '', areaName: string): AreaLocation | null {
  if (!areaName) {
    return null;
  }

  const target = normalise(areaName);
  const pool = scope === AreaScope.Province ? PROVINCE_LOCATIONS : DISTRICT_LOCATIONS;
  const match = pool.find((location) => normalise(location.name) === target);

  if (match) {
    return match;
  }

  return (
    [...PROVINCE_LOCATIONS, ...DISTRICT_LOCATIONS].find((location) => normalise(location.name) === target) ?? null
  );
}
