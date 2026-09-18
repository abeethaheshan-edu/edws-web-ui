import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared-module';
import { AlertListComponent } from './components/alert-list/alert-list.component';
import { AlertWizardComponent } from './components/alert-wizard/alert-wizard.component';
import { PolygonMapComponent } from './components/polygon-map/polygon-map.component';
import { PublishAlertPopupComponent } from './components/publish-alert-popup/publish-alert-popup.component';
import { AreaStepComponent } from './components/steps/area-step/area-step.component';
import { DetailsStepComponent } from './components/steps/details-step/details-step.component';
import { ImpactStepComponent } from './components/steps/impact-step/impact-step.component';
import { ReviewStepComponent } from './components/steps/review-step/review-step.component';
import { DisasterRoutingModule } from './disaster-routing-module';

@NgModule({
  declarations: [
    AlertListComponent,
    AlertWizardComponent,
    PolygonMapComponent,
    PublishAlertPopupComponent,
    DetailsStepComponent,
    AreaStepComponent,
    ImpactStepComponent,
    ReviewStepComponent,
  ],
  imports: [SharedModule, DisasterRoutingModule],
})
export class DisasterModule {}
