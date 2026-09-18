import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { AuthSessionService } from '../../../../core/auth/auth-session.service';
import { PROVINCES, DISTRICTS } from '../../../../shared/constants/reference-data';
import { ToastService } from '../../../../shared/services/toast.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { CitizenFormValue, PROPERTY_CATEGORIES } from '../../models/citizen.model';

@Component({
  selector: 'app-citizen-form-panel',
  standalone: false,
  templateUrl: './citizen-form-panel.component.html',
  styleUrl: './citizen-form-panel.component.scss',
})
export class CitizenFormPanelComponent {
  private readonly fb = inject(FormBuilder);
  private readonly session = inject(AuthSessionService);
  private readonly toast = inject(ToastService);

  protected readonly offcanvas = inject(NgbActiveOffcanvas);
  protected readonly categories = PROPERTY_CATEGORIES;
  protected readonly provinces = PROVINCES;
  protected readonly districts = DISTRICTS;
  protected readonly locating = signal('');

  protected readonly form = this.fb.nonNullable.group({
    gnDivision: [{ value: this.session.user()?.gnDivisionName ?? '', disabled: true }],
    gnOfficerName: [{ value: this.session.user()?.fullName ?? '', disabled: true }],
    province: [{ value: this.session.user()?.provinceName ?? '', disabled: true }],
    district: [{ value: this.session.user()?.districtName ?? '', disabled: true }],

    fullName: ['', [Validators.required, CustomValidators.lettersOnly()]],
    nic: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]],
    phone: ['', [Validators.required, CustomValidators.phone()]],
    secondaryPhone: ['', [CustomValidators.phone()]],
    email: ['', [Validators.required, CustomValidators.email()]],

    properties: this.fb.array([this.buildProperty()]),
    members: this.fb.array([] as FormGroup[]),
  });

  protected get properties(): FormArray {
    return this.form.controls.properties as FormArray;
  }

  protected get members(): FormArray {
    return this.form.controls.members as FormArray;
  }

  protected propertyAt(index: number): FormGroup {
    return this.properties.at(index) as FormGroup;
  }

  protected memberAt(index: number): FormGroup {
    return this.members.at(index) as FormGroup;
  }

  protected addProperty(): void {
    this.properties.push(this.buildProperty());
  }

  protected removeProperty(index: number): void {
    if (this.properties.length > 1) {
      this.properties.removeAt(index);
    }
  }

  protected addMember(): void {
    this.members.push(
      this.fb.nonNullable.group({
        fullName: ['', [Validators.required, CustomValidators.lettersOnly()]],
        nic: [''],
        phone: ['', [CustomValidators.phone()]],
        email: ['', [CustomValidators.email()]],
      }),
    );
  }

  protected removeMember(index: number): void {
    this.members.removeAt(index);
  }

  protected isOther(index: number): boolean {
    return this.propertyAt(index).controls['category'].value === 'OTHER';
  }

  protected useCurrentLocation(index: number): void {
    if (!navigator.geolocation) {
      this.toast.warning('Location unavailable', 'This browser does not support location access.');
      return;
    }

    this.locating.set(String(index));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.propertyAt(index).patchValue({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        });
        this.locating.set('');
        this.toast.success('Location captured', 'Coordinates added to this property.');
      },
      () => {
        this.locating.set('');
        this.toast.error('Location denied', 'Allow location access, or type the coordinates.');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Check the form', 'Fill in the highlighted fields before submitting.');
      return;
    }

    const value = this.form.getRawValue() as unknown as CitizenFormValue;
    console.log('[CitizenFormPanel] submit', value);
    this.offcanvas.close(value);
  }

  private buildProperty(): FormGroup {
    return this.fb.nonNullable.group({
      houseNo: ['', [Validators.required]],
      city: ['', [Validators.required]],
      streetAddress1: ['', [Validators.required, CustomValidators.notBlank()]],
      streetAddress2: [''],
      category: ['HOUSE', [Validators.required]],
      categoryOther: [''],
      province: [this.session.user()?.provinceName ?? ''],
      district: [this.session.user()?.districtName ?? ''],
      latitude: [null as number | null],
      longitude: [null as number | null],
    });
  }
}
