import { Component, computed, inject } from '@angular/core';
import { AlertDraftStore } from '../../../services/alert-draft.store';
import {
  AlertSeverity,
  AREA_SCOPE_OPTIONS,
  DISASTER_TYPE_LABELS,
  DisasterType,
  SEVERITY_OPTIONS,
} from '../../../models/disaster-alert.model';
import { formatArea, formatPeople } from '../../../models/polygon-geometry';

interface ReviewRow {
  label: string;
  value: string;
}

@Component({
  selector: 'app-review-step',
  standalone: false,
  templateUrl: './review-step.component.html',
  styleUrl: './review-step.component.scss',
})
export class ReviewStepComponent {
  private readonly store = inject(AlertDraftStore);

  protected readonly summary = this.store.areaSummary;

  protected readonly detailRows = computed<ReviewRow[]>(() => {
    const details = this.store.form.controls.details.getRawValue();
    const severity = SEVERITY_OPTIONS.find((option) => option.value === (details.severity as AlertSeverity));

    return [
      { label: 'Alert Title', value: details.title || '—' },
      { label: 'Disaster Type', value: details.type ? DISASTER_TYPE_LABELS[details.type as DisasterType] : '—' },
      { label: 'Severity', value: severity?.label ?? '—' },
      {
        label: 'Supporting Evidence',
        value: details.attachments.length ? `${details.attachments.length} file(s)` : 'None attached',
      },
    ];
  });

  protected readonly areaRows = computed<ReviewRow[]>(() => {
    const area = this.store.form.controls.area.getRawValue();
    const scope = AREA_SCOPE_OPTIONS.find((option) => option.value === area.scope);
    const summary = this.summary();

    return [
      { label: 'Administrative Scope', value: scope?.label ?? '—' },
      { label: 'Specific Area', value: area.areaName || '—' },
      { label: 'Selected Land Area', value: formatArea(summary.landAreaSqKm) },
      { label: 'Boundary Points', value: summary.vertexCount ? `${summary.vertexCount} points` : 'Not drawn' },
    ];
  });

  protected readonly impactRows = computed<ReviewRow[]>(() => {
    const impact = this.store.form.controls.impact.getRawValue();

    return [
      {
        label: 'Estimated Population',
        value: impact.estimatedPopulation === null ? '—' : formatPeople(impact.estimatedPopulation),
      },
      { label: 'Critical Infrastructure', value: this.orDash(impact.criticalInfrastructure) },
      { label: 'Displaced Families', value: this.orDash(impact.displacedFamilies) },
      { label: 'Reported Casualties', value: this.orDash(impact.casualties) },
    ];
  });

  protected readonly description = computed(() => this.store.form.controls.details.controls.description.value);
  protected readonly notes = computed(() => this.store.form.controls.impact.controls.notes.value);

  private orDash(value: number | null): string {
    return value === null ? '—' : String(value);
  }
}
