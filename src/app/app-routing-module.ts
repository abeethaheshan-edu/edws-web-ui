import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { accessGuard } from './core/access/access.guard';
import { ACCESS_ELEMENTS } from './core/access/access-policy.model';
import { authGuard } from './core/access/auth.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { CustomRoutes } from './core/models/custom-route.model';
import { PlaceholderPageComponent } from './shared/components/placeholder-page/placeholder-page.component';

const routes: CustomRoutes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./feature/auth/auth-module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [accessGuard],
        data: { accessControlElements: [ACCESS_ELEMENTS.navDashboard], actions: ['VIEW'] },
        loadChildren: () => import('./feature/dashboard/dashboard-module').then((m) => m.DashboardModule),
      },
      {
        path: 'disasters',
        canActivate: [accessGuard],
        data: { accessControlElements: [ACCESS_ELEMENTS.navDisasterAlerts], actions: ['VIEW'] },
        loadChildren: () => import('./feature/disaster/disaster-module').then((m) => m.DisasterModule),
      },
      {
        path: 'citizens',
        canActivate: [accessGuard],
        data: { accessControlElements: [ACCESS_ELEMENTS.citizenRegistry], actions: ['CREATE'] },
        loadChildren: () => import('./feature/citizen/citizen-module').then((m) => m.CitizenModule),
      },
      {
        path: 'users',
        canActivate: [accessGuard],
        data: { accessControlElements: [ACCESS_ELEMENTS.navUserManagement], actions: ['VIEW'] },
        loadChildren: () => import('./feature/user/user-module').then((m) => m.UserModule),
      },
      {
        path: 'documents',
        component: PlaceholderPageComponent,
        canActivate: [accessGuard],
        data: {
          title: 'Document Archive',
          icon: 'archive',
          accessControlElements: [ACCESS_ELEMENTS.navDocumentArchive],
          actions: ['VIEW'],
        },
      },
      {
        path: 'settings',
        component: PlaceholderPageComponent,
        canActivate: [accessGuard],
        data: {
          title: 'System Settings',
          icon: 'gear',
          accessControlElements: [ACCESS_ELEMENTS.navSystemSettings],
          actions: ['VIEW'],
        },
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
