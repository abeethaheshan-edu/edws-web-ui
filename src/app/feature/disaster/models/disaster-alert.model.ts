import { FileAttachment } from '../../../shared/models/file-attachment.model';
import { SelectOption } from '../../../shared/models/user-role.model';

export enum DisasterType {
  Flood = 'FLOOD',
  Landslide = 'LANDSLIDE',
  Cyclone = 'CYCLONE',
  Drought = 'DROUGHT',
  Tsunami = 'TSUNAMI',
  Wildfire = 'WILDFIRE',
}

export enum AlertSeverity {
  Level1To3 = 'LEVEL_1_3',
  Level4 = 'LEVEL_4',
  Level5 = 'LEVEL_5',
}

export enum AlertStatus {
  Draft = 'DRAFT',
  PendingReview = 'PENDING_REVIEW',
  Published = 'PUBLISHED',
  Closed = 'CLOSED',
}

export enum AreaScope {
  Province = 'PROVINCE',
  District = 'DISTRICT',
  Division = 'DIVISION',
  GnDivision = 'GN_DIVISION',
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface AffectedArea {
  scope: AreaScope | '';
  areaName: string;

  boundary: GeoPoint[];
}

export interface ImpactAssessment {
  estimatedPopulation: number | null;
  criticalInfrastructure: number | null;
  displacedFamilies: number | null;
  casualties: number | null;
  notes: string;
}

export interface DisasterAlert {
  id: string;
  referenceCode: string;
  title: string;
  type: DisasterType;
  severity: AlertSeverity;
  status: AlertStatus;
  description: string;

  attachments: FileAttachment[];
  area: AffectedArea;
  impact: ImpactAssessment;
  updatedAt: string;
}

export type DisasterAlertDraft = Omit<DisasterAlert, 'id' | 'referenceCode' | 'status' | 'updatedAt'>;

export const DISASTER_TYPE_OPTIONS: SelectOption<DisasterType>[] = [
  { value: DisasterType.Flood, label: 'Flood' },
  { value: DisasterType.Landslide, label: 'Landslide' },
  { value: DisasterType.Cyclone, label: 'Cyclone' },
  { value: DisasterType.Drought, label: 'Drought' },
  { value: DisasterType.Tsunami, label: 'Tsunami' },
  { value: DisasterType.Wildfire, label: 'Wildfire' },
];

export const DISASTER_TYPE_LABELS: Record<DisasterType, string> = {
  [DisasterType.Flood]: 'Flood',
  [DisasterType.Landslide]: 'Landslide',
  [DisasterType.Cyclone]: 'Cyclone',
  [DisasterType.Drought]: 'Drought',
  [DisasterType.Tsunami]: 'Tsunami',
  [DisasterType.Wildfire]: 'Wildfire',
};

export type SeverityTone = 'yellow' | 'orange' | 'red';

export interface SeverityOption {
  value: AlertSeverity;
  label: string;
  tone: SeverityTone;
}

export const SEVERITY_OPTIONS: SeverityOption[] = [
  { value: AlertSeverity.Level1To3, label: 'Level 1-3 (Yellow)', tone: 'yellow' },
  { value: AlertSeverity.Level4, label: 'Level 4 (Orange)', tone: 'orange' },
  { value: AlertSeverity.Level5, label: 'Level 5 (Red)', tone: 'red' },
];

export const SEVERITY_LABELS: Record<AlertSeverity, string> = {
  [AlertSeverity.Level1To3]: 'Level 1-3',
  [AlertSeverity.Level4]: 'Level 4',
  [AlertSeverity.Level5]: 'Level 5',
};

export const SEVERITY_TONE: Record<AlertSeverity, SeverityTone> = {
  [AlertSeverity.Level1To3]: 'yellow',
  [AlertSeverity.Level4]: 'orange',
  [AlertSeverity.Level5]: 'red',
};

export const AREA_SCOPE_OPTIONS: SelectOption<AreaScope>[] = [
  { value: AreaScope.Province, label: 'Province' },
  { value: AreaScope.District, label: 'District' },
  { value: AreaScope.Division, label: 'Divisional Secretariat' },
  { value: AreaScope.GnDivision, label: 'GN Division' },
];

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  [AlertStatus.Draft]: 'Draft',
  [AlertStatus.PendingReview]: 'Pending Review',
  [AlertStatus.Published]: 'Published',
  [AlertStatus.Closed]: 'Closed',
};

export const ALERT_STATUS_TONE: Record<AlertStatus, 'neutral' | 'warning' | 'success' | 'info'> = {
  [AlertStatus.Draft]: 'neutral',
  [AlertStatus.PendingReview]: 'warning',
  [AlertStatus.Published]: 'success',
  [AlertStatus.Closed]: 'info',
};
