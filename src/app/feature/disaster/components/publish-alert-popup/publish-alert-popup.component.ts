import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { POPUP_DATA, PopupContent } from '../../../../shared/popup/popup.model';
import { CustomValidators } from '../../../../shared/validators/custom-validators';

export interface PublishAlertData {
  referenceCode: string;
  title: string;
}

export interface PublishAlertResult {
  note: string;
  notifySubscribers: boolean;
}

@Component({
  selector: 'app-publish-alert-popup',
  standalone: false,
  templateUrl: './publish-alert-popup.component.html',
  styleUrl: './publish-alert-popup.component.scss',
})
export class PublishAlertPopupComponent implements PopupContent<PublishAlertResult> {
  private readonly fb = inject(FormBuilder);

  protected readonly data = inject<PublishAlertData>(POPUP_DATA);

  protected readonly form = this.fb.nonNullable.group({
    note: ['', [Validators.required, Validators.minLength(10), CustomValidators.notBlank()]],
    notifySubscribers: [true],
  });

  submit(): PublishAlertResult | null {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return null;
    }

    return this.form.getRawValue();
  }
}
