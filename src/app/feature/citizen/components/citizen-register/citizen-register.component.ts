import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiError } from '../../../../core/net/api-error.model';
import { CitizenService } from '../../../../services/citizen.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { UiLoaderService } from '../../../../shared/ui-loader/ui-loader.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { GENDER_OPTIONS } from '../../models/citizen.model';

@Component({
  selector: 'app-citizen-register',
  standalone: false,
  templateUrl: './citizen-register.component.html',
  styleUrl: './citizen-register.component.scss',
})
export class CitizenRegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly citizens = inject(CitizenService);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(UiLoaderService);

  protected readonly genders = GENDER_OPTIONS;
  protected readonly submitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, CustomValidators.lettersOnly()]],
    nic: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]],
    email: ['', [CustomValidators.email()]],
    phone: ['', [Validators.required, CustomValidators.phone()]],
    dateOfBirth: [''],
    gender: [''],
    householder: [true],
    houseName: [''],
    houseNo: [''],
    streetAddress1: ['', [Validators.required, CustomValidators.notBlank()]],
    streetAddress2: [''],
    city: ['', [Validators.required]],
    zipCode: ['', [CustomValidators.numbersOnly()]],
    gnDivision: [''],
    latitude: [null as number | null],
    longitude: [null as number | null],
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Check the form', 'Fill in the highlighted fields before submitting.');
      return;
    }

    const value = this.form.getRawValue();
    console.log('[CitizenRegister] submit', value);

    this.submitting.set(true);
    this.loader.show('Registering citizen...');

    this.citizens.register(value).subscribe({
      next: (id) => {
        this.submitting.set(false);
        this.loader.hide();
        this.toast.success('Citizen registered', `Reference ${id || 'created'}.`);
        this.form.reset({ householder: true });
      },
      error: (error: ApiError) => {
        this.submitting.set(false);
        this.loader.hide();
        this.toast.error('Registration failed', error?.message ?? 'Please try again.');
      },
    });
  }
}
