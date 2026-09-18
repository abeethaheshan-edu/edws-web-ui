import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomRoutes } from '../../core/models/custom-route.model';
import { AuthComponent } from './auth.component';
import { FogotPassword } from './components/fogot-password/fogot-password';
import { Login } from './components/login/login';
import { ResetPassword } from './components/reset-password/reset-password';
import { ResetPasswordLink } from './components/reset-password-link/reset-password-link';

const routes: CustomRoutes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
      { path: 'forgot-password', component: FogotPassword },
      { path: 'check-email', component: ResetPasswordLink },

      { path: 'reset-password', component: ResetPassword, data: { mode: 'reset-link' } },

      { path: 'set-password', component: ResetPassword, data: { mode: 'first-login' } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
