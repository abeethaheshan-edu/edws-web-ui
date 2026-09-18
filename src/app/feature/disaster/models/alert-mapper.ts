import { FileAttachment } from '../../../shared/models/file-attachment.model';
import {
  AlertSeverity,
  AlertStatus,
  AreaScope,
  DisasterAlert,
  DisasterAlertDraft,
  DisasterType,
  GeoPoint,
} from './disaster-alert.model';

export function toAlert(json: Record<string, unknown>): DisasterAlert {
  const boundary = (json['boundary'] as Array<Record<string, number>>) ?? [];
  const attachments = (json['attachments'] as Array<Record<string, unknown>>) ?? [];

  return {
    id: (json['id'] as string) ?? '',
    referenceCode: (json['referenceCode'] as string) ?? '',
    title: (json['title'] as string) ?? '',
    type: (json['type'] as DisasterType) ?? DisasterType.Flood,
    severity: (json['severity'] as AlertSeverity) ?? AlertSeverity.Level1To3,
    status: (json['status'] as AlertStatus) ?? AlertStatus.Draft,
    description: (json['description'] as string) ?? '',
    attachments: attachments.map((item) => ({
      id: (item['id'] as string) ?? '',
      name: (item['name'] as string) ?? '',
      size: Number(item['size'] ?? 0),
      type: (item['type'] as string) ?? '',
    })) as FileAttachment[],
    area: {
      scope: (json['areaScope'] as AreaScope) ?? '',
      areaName: (json['areaName'] as string) ?? '',
      boundary: boundary.map((point) => ({ lat: point['lat'], lng: point['lng'] })) as GeoPoint[],
    },
    impact: {
      estimatedPopulation: numberOrNull(json['estimatedPopulation']),
      criticalInfrastructure: numberOrNull(json['criticalInfrastructure']),
      displacedFamilies: numberOrNull(json['displacedFamilies']),
      casualties: numberOrNull(json['casualties']),
      notes: (json['responseNotes'] as string) ?? '',
    },
    updatedAt: formatDate(json['updatedAt'] as string),
  };
}

export function toAlertRequest(draft: DisasterAlertDraft): Record<string, unknown> {
  return {
    title: draft.title,
    type: draft.type,
    severity: draft.severity,
    description: draft.description,
    attachments: draft.attachments.map((file) => ({
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
    })),
    areaScope: draft.area.scope || null,
    areaName: draft.area.areaName,
    boundary: draft.area.boundary.map((point) => ({ lat: point.lat, lng: point.lng })),
    estimatedPopulation: draft.impact.estimatedPopulation,
    criticalInfrastructure: draft.impact.criticalInfrastructure,
    displacedFamilies: draft.impact.displacedFamilies,
    casualties: draft.impact.casualties,
    responseNotes: draft.impact.notes,
  };
}

function numberOrNull(value: unknown): number | null {
  return value === null || value === undefined ? null : Number(value);
}

function formatDate(value: string): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('en-GB');
}
