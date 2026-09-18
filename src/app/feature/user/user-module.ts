import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared-module';
import { AssignTeamPanelComponent } from './components/assign-team-panel/assign-team-panel.component';
import { UserFormPanelComponent } from './components/user-form-panel/user-form-panel.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { UserRoutingModule } from './user-routing-module';

@NgModule({
  declarations: [UserManagementComponent, UserFormPanelComponent, AssignTeamPanelComponent],
  imports: [SharedModule, UserRoutingModule],
})
export class UserModule {}
