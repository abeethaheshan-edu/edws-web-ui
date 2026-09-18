import { Type } from '@angular/core';
import { WizardStep } from '../../../shared/models/wizard.model';
import { AreaStepComponent } from '../components/steps/area-step/area-step.component';
import { DetailsStepComponent } from '../components/steps/details-step/details-step.component';
import { ImpactStepComponent } from '../components/steps/impact-step/impact-step.component';
import { ReviewStepComponent } from '../components/steps/review-step/review-step.component';

export interface AlertWizardStep extends WizardStep {

  component: Type<unknown>;
}

export const ALERT_WIZARD_STEPS: AlertWizardStep[] = [
  { id: 'details', label: 'Details', component: DetailsStepComponent },
  { id: 'area', label: 'Area Scoping', component: AreaStepComponent },
  { id: 'impact', label: 'Impact', component: ImpactStepComponent },
  { id: 'review', label: 'Review', component: ReviewStepComponent },
];
