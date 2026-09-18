import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared-module';
import { CitizenRegisterComponent } from './components/citizen-register/citizen-register.component';
import { CitizenRoutingModule } from './citizen-routing-module';

@NgModule({
  declarations: [CitizenRegisterComponent],
  imports: [SharedModule, CitizenRoutingModule],
})
export class CitizenModule {}
