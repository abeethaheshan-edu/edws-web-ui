import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainNavComponent } from './main-layout/main-nav/main-nav.component';
import { SideNavComponent } from './main-layout/side-nav/side-nav.component';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [LayoutComponent, MainLayoutComponent, MainNavComponent, SideNavComponent],
  imports: [SharedModule, RouterModule],
  exports: [LayoutComponent, MainLayoutComponent],
})
export class LayoutModule {}
