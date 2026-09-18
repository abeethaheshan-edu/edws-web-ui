import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomRoutes } from '../../core/models/custom-route.model';
import { CitizenRegisterComponent } from './components/citizen-register/citizen-register.component';

const routes: CustomRoutes = [{ path: '', component: CitizenRegisterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitizenRoutingModule {}
