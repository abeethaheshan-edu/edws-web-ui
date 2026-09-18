import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { DEPARTMENTS, SCOPE_FIELDS } from '../../../../shared/constants/reference-data';
import {
  ACCESS_ROLE_OPTIONS,
  AdministrativeScope,
  ADMINISTRATIVE_SCOPE_OPTIONS,
  UserRole,
} from '../../../../shared/models/user-role.model';
import { ScopeFieldConfig, SystemUser, UserFormValue } from '../../../../shared/models/user.model';
import { CustomValidators } from '../../../../shared/validators/custom-validators';

export type UserPanelMode = 'create' | 'edit' | 'view';

@Component({
  selector: 'app-user-form-panel',
  standalone: false,
  templateUrl: './user-form-panel.component.html',
  styleUrl: './user-form-panel.component.scss',
})
export class UserFormPanelComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly offcanvas = inject(NgbActiveOffcanvas);

  @Input() mode: UserPanelMode = 'create';
  @Input() user: SystemUser | null = null;

  @Input() admins: SystemUser[] = [];

  protected readonly scopeOptions = ADMINISTRATIVE_SCOPE_OPTIONS;
  protected readonly roleOptions = ACCESS_ROLE_OPTIONS;
  protected readonly departments = DEPARTMENTS;

  protected scopeFields: ScopeFieldConfig[] = [];

  protected readonly form = this.fb.nonNullable.group({
    scope: ['', [Validators.required]],
    fullName: ['', [Validators.required, CustomValidators.lettersOnly()]],
    email: ['', [Validators.required, CustomValidators.email()]],
    telephone: ['', [Validators.required, CustomValidators.phone()]],
    department: ['', [Validators.required]],
    role: ['', [Validators.required]],
    reportsToAdminId: [''],
    officeAddress: ['', [Validators.required, CustomValidators.notBlank()]],
  });

  protected readonly scopeForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.form.controls.scope.valueChanges.subscribe((scope) => {
      this.buildScopeFields(scope as AdministrativeScope | '');
    });

    this.form.controls.role.valueChanges.subscribe((role) => this.syncReportsTo(role as UserRole | ''));

    if (this.user) {
      this.form.patchValue({
        scope: this.user.scope,
        fullName: this.user.fullName,
        email: this.user.email,
        telephone: this.user.telephone,
        department: this.user.department,
        role: this.user.role,
        reportsToAdminId: this.user.reportsToAdminId ?? '',
        officeAddress: this.user.officeAddress,
      });
      this.scopeForm.patchValue(this.user.scopeDetails as Record<string, string>);
    }

    if (this.isReadOnly) {
      this.form.disable();
      this.scopeForm.disable();
    }
  }

  protected get isReadOnly(): boolean {
    return this.mode === 'view';
  }

  protected get title(): string {
    if (this.mode === 'edit') return 'Edit Official';
    if (this.mode === 'view') return 'Official Details';
    return 'Register Official';
  }

  protected get subtitle(): string {
    if (this.mode === 'edit') return 'Update administrative access';
    if (this.mode === 'view') return 'Read only view of this account';
    return 'Provision new administrative access';
  }

  protected get needsReportingAdmin(): boolean {
    const role = this.form.controls.role.value;
    return role === UserRole.Reviewer || role === UserRole.Drawer;
  }

  protected scopeControl(key: string): FormControl<string> {
    return this.scopeForm.get(key) as FormControl<string>;
  }

  protected selectRole(role: UserRole): void {
    if (!this.isReadOnly) {
      this.form.controls.role.setValue(role);
      this.form.controls.role.markAsTouched();
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid || this.scopeForm.invalid) {
      this.form.markAllAsTouched();
      this.scopeForm.markAllAsTouched();
      console.warn('[UserFormPanel] invalid form', {
        common: this.form.errors,
        fields: this.invalidControlNames(),
      });
      return;
    }

    const raw = this.form.getRawValue();
    const value: UserFormValue = {
      ...raw,
      scope: raw.scope as AdministrativeScope,
      role: raw.role as UserRole,
      scopeDetails: this.scopeForm.getRawValue(),
    };

    console.log(`[UserFormPanel] ${this.mode} submit`, value);
    this.offcanvas.close(value);
  }

  private buildScopeFields(scope: AdministrativeScope | ''): void {
    const previous: Record<string, string> = this.scopeForm.getRawValue();

    Object.keys(this.scopeForm.controls).forEach((key) => this.scopeForm.removeControl(key));
    this.scopeFields = scope ? SCOPE_FIELDS[scope] : [];

    for (const field of this.scopeFields) {
      const validators: ValidatorFn[] = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      if (field.type === 'number') {
        validators.push(CustomValidators.numbersOnly(field.length));
      }

      this.scopeForm.addControl(
        field.key,
        new FormControl(previous[field.key] ?? '', { nonNullable: true, validators }),
      );
    }

    if (this.isReadOnly) {
      this.scopeForm.disable();
    }
  }

  private syncReportsTo(role: UserRole | ''): void {
    const control = this.form.controls.reportsToAdminId;

    if (role === UserRole.Reviewer || role === UserRole.Drawer) {
      control.addValidators(Validators.required);
    } else {
      control.removeValidators(Validators.required);
      control.setValue('', { emitEvent: false });
    }
    control.updateValueAndValidity({ emitEvent: false });
  }

  private invalidControlNames(): string[] {
    const names: string[] = [];
    for (const [name, control] of Object.entries({ ...this.form.controls, ...this.scopeForm.controls })) {
      if (control.invalid) {
        names.push(name);
      }
    }
    return names;
  }
}
