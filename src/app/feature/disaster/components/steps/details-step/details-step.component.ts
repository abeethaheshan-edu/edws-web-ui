import { Component, inject } from '@angular/core';
import { FileAttachment } from '../../../../../shared/models/file-attachment.model';
import {
  AlertSeverity,
  DISASTER_TYPE_OPTIONS,
  SEVERITY_OPTIONS,
} from '../../../models/disaster-alert.model';
import { AlertDraftStore } from '../../../services/alert-draft.store';

@Component({
  selector: 'app-details-step',
  standalone: false,
  templateUrl: './details-step.component.html',
  styleUrl: './details-step.component.scss',
})
export class DetailsStepComponent {
  private readonly store = inject(AlertDraftStore);

  protected readonly form = this.store.form.controls.details;
  protected readonly typeOptions = DISASTER_TYPE_OPTIONS;
  protected readonly severityOptions = SEVERITY_OPTIONS;

  protected selectSeverity(severity: AlertSeverity): void {
    this.form.controls.severity.setValue(severity);
    this.form.controls.severity.markAsDirty();
    this.form.controls.severity.markAsTouched();
  }

  protected onAttachmentsChange(files: FileAttachment[]): void {
    this.form.controls.attachments.setValue(files);
    this.form.controls.attachments.markAsDirty();
    console.log('[DetailsStep] attachments', files);
  }
}
