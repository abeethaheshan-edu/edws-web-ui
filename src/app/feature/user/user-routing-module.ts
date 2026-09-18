import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomRoutes } from '../../core/models/custom-route.model';
import { UserManagementComponent } from './components/user-management/user-management.component';

const routes: CustomRoutes = [{ path: '', component: UserManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
