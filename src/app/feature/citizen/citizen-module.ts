import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared-module';
import { CitizenFormPanelComponent } from './components/citizen-form-panel/citizen-form-panel.component';
import { CitizenListComponent } from './components/citizen-list/citizen-list.component';
import { CitizenRoutingModule } from './citizen-routing-module';

@NgModule({
  declarations: [CitizenListComponent, CitizenFormPanelComponent],
  imports: [SharedModule, CitizenRoutingModule],
})
export class CitizenModule {}
