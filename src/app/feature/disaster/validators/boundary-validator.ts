import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { GeoPoint } from '../models/disaster-alert.model';
import { isValidBoundary, MIN_POLYGON_VERTICES } from '../models/polygon-geometry';

export function boundaryRequired(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const points = (control.value ?? []) as GeoPoint[];

    if (!points.length) {
      return { boundaryRequired: true };
    }
    if (!isValidBoundary(points)) {
      return { boundaryIncomplete: { minVertices: MIN_POLYGON_VERTICES } };
    }
    return null;
  };
}
