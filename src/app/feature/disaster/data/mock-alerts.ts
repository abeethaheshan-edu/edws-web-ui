import {
  AlertSeverity,
  AlertStatus,
  AreaScope,
  DisasterAlert,
  DisasterType,
  GeoPoint,
} from '../models/disaster-alert.model';

export const SRI_LANKA_CENTER: GeoPoint = { lat: 7.6, lng: 80.7 };
export const DEFAULT_MAP_ZOOM = 7;

const POPULATION_DENSITY_PER_SQ_KM = 730;
const INFRASTRUCTURE_PER_SQ_KM = 0.026;

export function estimatePopulation(areaSqKm: number): number {
  return Math.round(areaSqKm * POPULATION_DENSITY_PER_SQ_KM);
}

export function estimateInfrastructure(areaSqKm: number): number {
  return Math.round(areaSqKm * INFRASTRUCTURE_PER_SQ_KM);
}

const GALLE_BOUNDARY: GeoPoint[] = [
  { lat: 6.13, lng: 80.14 },
  { lat: 6.18, lng: 80.28 },
  { lat: 6.06, lng: 80.36 },
  { lat: 5.99, lng: 80.24 },
  { lat: 6.03, lng: 80.13 },
];

const RATNAPURA_BOUNDARY: GeoPoint[] = [
  { lat: 6.72, lng: 80.32 },
  { lat: 6.78, lng: 80.48 },
  { lat: 6.64, lng: 80.54 },
  { lat: 6.58, lng: 80.38 },
];

const BADULLA_BOUNDARY: GeoPoint[] = [
  { lat: 6.99, lng: 81.02 },
  { lat: 7.06, lng: 81.16 },
  { lat: 6.93, lng: 81.21 },
  { lat: 6.88, lng: 81.07 },
];

export const MOCK_ALERTS: DisasterAlert[] = [
  {
    id: 'ALR-001',
    referenceCode: 'DMC/2026/FL/0142',
    title: 'Southern coastal flooding — Galle',
    type: DisasterType.Flood,
    severity: AlertSeverity.Level4,
    status: AlertStatus.Published,
    description:
      'Continuous rainfall over the Gin Ganga basin has pushed water levels above the minor flood stage. Low lying wards are being evacuated.',
    attachments: [],
    area: { scope: AreaScope.District, areaName: 'Galle District', boundary: GALLE_BOUNDARY },
    impact: {
      estimatedPopulation: 1_200_000,
      criticalInfrastructure: 42,
      displacedFamilies: 860,
      casualties: 3,
      notes: 'Two main access roads submerged. Relief camps opened in four schools.',
    },
    updatedAt: 'Today, 09:42 AM',
  },
  {
    id: 'ALR-002',
    referenceCode: 'DMC/2026/LS/0088',
    title: 'Landslide risk — Ratnapura hill slopes',
    type: DisasterType.Landslide,
    severity: AlertSeverity.Level1To3,
    status: AlertStatus.PendingReview,
    description: 'Saturated slopes flagged by the NBRO after 210 mm of rain in 24 hours.',
    attachments: [],
    area: { scope: AreaScope.District, areaName: 'Ratnapura District', boundary: RATNAPURA_BOUNDARY },
    impact: {
      estimatedPopulation: 48_000,
      criticalInfrastructure: 7,
      displacedFamilies: 120,
      casualties: 0,
      notes: 'Three GN divisions on standby for evacuation.',
    },
    updatedAt: 'Today, 07:15 AM',
  },
  {
    id: 'ALR-003',
    referenceCode: 'DMC/2026/DR/0031',
    title: 'Prolonged dry spell — Badulla',
    type: DisasterType.Drought,
    severity: AlertSeverity.Level1To3,
    status: AlertStatus.Draft,
    description: 'Reservoir storage below 30 percent for the fourth consecutive week.',
    attachments: [],
    area: { scope: AreaScope.District, areaName: 'Badulla District', boundary: BADULLA_BOUNDARY },
    impact: {
      estimatedPopulation: 96_000,
      criticalInfrastructure: 11,
      displacedFamilies: 0,
      casualties: 0,
      notes: 'Bowser distribution scheduled for the worst affected divisions.',
    },
    updatedAt: 'Yesterday, 04:20 PM',
  },
  {
    id: 'ALR-004',
    referenceCode: 'DMC/2026/CY/0012',
    title: 'Cyclone watch — Eastern seaboard',
    type: DisasterType.Cyclone,
    severity: AlertSeverity.Level5,
    status: AlertStatus.Closed,
    description: 'System weakened to a depression after landfall. Alert kept for record.',
    attachments: [],
    area: { scope: AreaScope.Province, areaName: 'Eastern Province', boundary: [] },
    impact: {
      estimatedPopulation: 310_000,
      criticalInfrastructure: 26,
      displacedFamilies: 1_450,
      casualties: 6,
      notes: 'Closed after the all clear from the Meteorology Department.',
    },
    updatedAt: '28 Aug 2026',
  },
];
