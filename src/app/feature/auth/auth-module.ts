import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing-module';
import { AuthComponent } from './auth.component';
import { FogotPassword } from './components/fogot-password/fogot-password';
import { Login } from './components/login/login';
import { ResetPassword } from './components/reset-password/reset-password';
import { ResetPasswordLink } from './components/reset-password-link/reset-password-link';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [AuthComponent, Login, FogotPassword, ResetPasswordLink, ResetPassword],
  imports: [SharedModule, AuthRoutingModule],
})
export class AuthModule {}
