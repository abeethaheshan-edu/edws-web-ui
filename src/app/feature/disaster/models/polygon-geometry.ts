import { GeoPoint } from './disaster-alert.model';

const EARTH_METRES_PER_DEGREE = 111_320;

export const MIN_POLYGON_VERTICES = 3;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function polygonAreaSqKm(points: GeoPoint[]): number {
  if (points.length < MIN_POLYGON_VERTICES) {
    return 0;
  }

  const meanLat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
  const latScale = EARTH_METRES_PER_DEGREE;
  const lngScale = EARTH_METRES_PER_DEGREE * Math.cos(toRadians(meanLat));

  let twiceArea = 0;
  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    twiceArea += current.lng * lngScale * (next.lat * latScale) - next.lng * lngScale * (current.lat * latScale);
  }

  return Math.abs(twiceArea / 2) / 1_000_000;
}

export function polygonCentroid(points: GeoPoint[]): GeoPoint | null {
  if (!points.length) {
    return null;
  }

  const total = points.reduce(
    (sum, point) => ({ lat: sum.lat + point.lat, lng: sum.lng + point.lng }),
    { lat: 0, lng: 0 },
  );

  return { lat: total.lat / points.length, lng: total.lng / points.length };
}

export function isValidBoundary(points: GeoPoint[]): boolean {
  return points.length >= MIN_POLYGON_VERTICES && polygonAreaSqKm(points) > 0;
}

export function formatArea(areaSqKm: number): string {
  if (areaSqKm >= 100) {
    return `${Math.round(areaSqKm).toLocaleString('en-US')} km²`;
  }
  return `${areaSqKm.toFixed(1)} km²`;
}

export function formatPeople(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${Math.round(count / 1_000)}K`;
  }
  return String(count);
}
