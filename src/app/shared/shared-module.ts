import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HasAccessDirective } from '../core/access/has-access.directive';
import { AvatarComponent } from './components/avatar/avatar.component';
import { MessagePopupComponent } from './popup/components/message-popup/message-popup.component';
import { PopupHostComponent } from './popup/host/popup-host.component';
import { UiLoaderComponent } from './ui-loader/ui-loader.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DataTableRowComponent } from './components/data-table-row/data-table-row.component';
import { FileDropComponent } from './components/file-drop/file-drop.component';
import { FormControlErrorComponent } from './components/form-control-error/form-control-error.component';
import { IconComponent } from './components/icon/icon.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SearchSelectComponent } from './components/search-select/search-select.component';
import { PlaceholderPageComponent } from './components/placeholder-page/placeholder-page.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { ToastContainerComponent } from './components/toast/toast-container.component';
import { WizardFooterComponent } from './components/wizard-footer/wizard-footer.component';
import { WizardStepperComponent } from './components/wizard-stepper/wizard-stepper.component';

const COMPONENTS = [
  HasAccessDirective,
  AvatarComponent,
  DataTableComponent,
  DataTableRowComponent,
  FileDropComponent,
  FormControlErrorComponent,
  IconComponent,
  PaginationComponent,
  PlaceholderPageComponent,
  SearchSelectComponent,
  SidePanelComponent,
  StatusBadgeComponent,
  ToastContainerComponent,
  WizardFooterComponent,
  WizardStepperComponent,
  PopupHostComponent,
  MessagePopupComponent,
  UiLoaderComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule],
  exports: [...COMPONENTS, CommonModule, FormsModule, ReactiveFormsModule, NgbModule],
})
export class SharedModule {}
