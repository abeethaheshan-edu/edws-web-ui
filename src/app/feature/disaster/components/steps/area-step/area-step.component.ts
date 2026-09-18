import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { DISTRICTS, PROVINCES } from '../../../../../shared/constants/reference-data';
import { SelectOption } from '../../../../../shared/models/user-role.model';
import { SRI_LANKA_CENTER } from '../../../data/mock-alerts';
import { AreaLocation, findAreaLocation } from '../../../data/sri-lanka-areas';
import { AREA_SCOPE_OPTIONS, AreaScope, GeoPoint } from '../../../models/disaster-alert.model';
import { formatArea, formatPeople } from '../../../models/polygon-geometry';
import { AlertDraftStore } from '../../../services/alert-draft.store';

@Component({
  selector: 'app-area-step',
  standalone: false,
  templateUrl: './area-step.component.html',
  styleUrl: './area-step.component.scss',
})
export class AreaStepComponent {
  private readonly store = inject(AlertDraftStore);

  protected readonly form = this.store.form.controls.area;
  protected readonly scopeOptions = AREA_SCOPE_OPTIONS;
  protected readonly summary = this.store.areaSummary;
  protected readonly mapCenter = SRI_LANKA_CENTER;

  protected readonly boundary = signal<GeoPoint[]>(this.form.controls.boundary.value);
  protected readonly focus = signal<AreaLocation | null>(
    findAreaLocation(this.form.controls.scope.value, this.form.controls.areaName.value),
  );

  private readonly scope = toSignal(this.form.controls.scope.valueChanges, {
    initialValue: this.form.controls.scope.value,
  });

  protected readonly areaOptions = computed<SelectOption[] | null>(() => {
    switch (this.scope()) {
      case AreaScope.Province:
        return PROVINCES;
      case AreaScope.District:
        return DISTRICTS.map((district) => ({ value: `${district.label} District`, label: `${district.label} District` }));
      default:
        return null;
    }
  });

  protected readonly boundaryMessages = {
    boundaryRequired: 'Draw the affected area on the map before continuing.',
    boundaryIncomplete: 'The boundary needs at least 3 points that enclose an area.',
  };

  protected readonly formatArea = formatArea;
  protected readonly formatPeople = formatPeople;

  protected onBoundaryChange(points: GeoPoint[]): void {
    this.boundary.set(points);
    this.form.controls.boundary.setValue(points);
    this.form.controls.boundary.markAsDirty();
    this.form.controls.boundary.markAsTouched();
    console.log('[AreaStep] boundary updated', points);
  }

  protected onScopeChange(): void {
    this.form.controls.areaName.setValue('');
    this.focus.set(null);
  }

  protected onAreaSelect(areaName: string): void {
    const location = findAreaLocation(this.form.controls.scope.value, areaName);
    this.focus.set(location);
    console.log('[AreaStep] area focus', areaName, location);
  }
}
