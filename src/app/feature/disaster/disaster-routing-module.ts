import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomRoutes } from '../../core/models/custom-route.model';
import { AlertListComponent } from './components/alert-list/alert-list.component';
import { AlertWizardComponent } from './components/alert-wizard/alert-wizard.component';

const routes: CustomRoutes = [
  { path: '', component: AlertListComponent },
  { path: 'new', component: AlertWizardComponent },
  { path: ':id/edit', component: AlertWizardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisasterRoutingModule {}
