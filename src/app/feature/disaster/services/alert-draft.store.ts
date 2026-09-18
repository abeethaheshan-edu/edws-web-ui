import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FileAttachment } from '../../../shared/models/file-attachment.model';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { estimateInfrastructure, estimatePopulation } from '../data/mock-alerts';
import { AreaSummary } from '../models/area-summary.model';
import {
  AlertSeverity,
  AreaScope,
  DisasterAlert,
  DisasterAlertDraft,
  DisasterType,
  GeoPoint,
} from '../models/disaster-alert.model';
import { isValidBoundary, polygonAreaSqKm } from '../models/polygon-geometry';
import { boundaryRequired } from '../validators/boundary-validator';

@Injectable()
export class AlertDraftStore {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    details: this.fb.nonNullable.group({
      title: ['', [Validators.required, Validators.minLength(6), CustomValidators.notBlank()]],
      type: ['' as DisasterType | '', [Validators.required]],
      severity: ['' as AlertSeverity | '', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(20), CustomValidators.notBlank()]],
      attachments: [[] as FileAttachment[]],
    }),
    area: this.fb.nonNullable.group({
      scope: ['' as AreaScope | '', [Validators.required]],
      areaName: ['', [Validators.required]],
      boundary: [[] as GeoPoint[], [boundaryRequired()]],
    }),
    impact: this.fb.nonNullable.group({
      estimatedPopulation: [null as number | null, [Validators.required, CustomValidators.numbersOnly()]],
      criticalInfrastructure: [null as number | null, [Validators.required, CustomValidators.numbersOnly()]],
      displacedFamilies: [null as number | null, [CustomValidators.numbersOnly()]],
      casualties: [null as number | null, [CustomValidators.numbersOnly()]],
      notes: [''],
    }),
  });

  private readonly boundary = toSignal(this.form.controls.area.controls.boundary.valueChanges, {
    initialValue: this.form.controls.area.controls.boundary.value,
  });

  readonly areaSummary = computed<AreaSummary>(() => {
    const points = this.boundary();
    const landAreaSqKm = polygonAreaSqKm(points);

    return {
      landAreaSqKm,
      estimatedPopulation: estimatePopulation(landAreaSqKm),
      criticalInfrastructure: estimateInfrastructure(landAreaSqKm),
      boundaryValidated: isValidBoundary(points),
      vertexCount: points.length,
    };
  });

  groupFor(stepId: string): FormGroup | null {
    const group = this.form.get(stepId);
    return group instanceof FormGroup ? group : null;
  }

  loadFrom(alert: DisasterAlert): void {
    this.form.patchValue({
      details: {
        title: alert.title,
        type: alert.type,
        severity: alert.severity,
        description: alert.description,
        attachments: [...alert.attachments],
      },
      area: {
        scope: alert.area.scope,
        areaName: alert.area.areaName,
        boundary: [...alert.area.boundary],
      },
      impact: { ...alert.impact },
    });
    this.form.markAsPristine();
  }

  toDraft(): DisasterAlertDraft {
    const { details, area, impact } = this.form.getRawValue();

    return {
      title: details.title.trim(),
      type: details.type as DisasterType,
      severity: details.severity as AlertSeverity,
      description: details.description.trim(),
      attachments: details.attachments,
      area: {
        scope: area.scope,
        areaName: area.areaName,
        boundary: area.boundary,
      },
      impact: {
        estimatedPopulation: impact.estimatedPopulation,
        criticalInfrastructure: impact.criticalInfrastructure,
        displacedFamilies: impact.displacedFamilies,
        casualties: impact.casualties,
        notes: impact.notes,
      },
    };
  }
}
