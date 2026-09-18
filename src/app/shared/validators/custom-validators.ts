import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const DIGITS_ONLY = /^[0-9]+$/;
const LETTERS_AND_SPACES = /^[a-zA-Z\u0D80-\u0DFF\u0B80-\u0BFF\s.'-]+$/;
const PHONE_PATTERN = /^(?:\+94|0)[1-9][0-9]{8}$/;

function isBlank(value: unknown): boolean {
  return value === null || value === undefined || String(value).trim() === '';
}

export class CustomValidators {
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isBlank(control.value)) {
        return null;
      }
      return EMAIL_PATTERN.test(String(control.value).trim()) ? null : { email: true };
    };
  }

  static officialEmail(domain = 'dmc.gov.lk'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isBlank(control.value)) {
        return null;
      }
      const value = String(control.value).trim().toLowerCase();
      if (!EMAIL_PATTERN.test(value)) {
        return { email: true };
      }
      return value.endsWith(`@${domain}`) ? null : { officialEmail: { domain } };
    };
  }

  static numbersOnly(exactLength?: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isBlank(control.value)) {
        return null;
      }
      const value = String(control.value).trim();
      if (!DIGITS_ONLY.test(value)) {
        return { numbersOnly: true };
      }
      if (exactLength && value.length !== exactLength) {
        return { exactLength: { requiredLength: exactLength, actualLength: value.length } };
      }
      return null;
    };
  }

  static lettersOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isBlank(control.value)) {
        return null;
      }
      return LETTERS_AND_SPACES.test(String(control.value)) ? null : { lettersOnly: true };
    };
  }

  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isBlank(control.value)) {
        return null;
      }
      const value = String(control.value).replace(/[\s-]/g, '');
      return PHONE_PATTERN.test(value) ? null : { phone: true };
    };
  }

  static password(minLength = 8): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isBlank(control.value)) {
        return null;
      }
      const value = String(control.value);
      const unmet: string[] = [];

      if (value.length < minLength) unmet.push(`at least ${minLength} characters`);
      if (!/[A-Z]/.test(value)) unmet.push('one uppercase letter');
      if (!/[a-z]/.test(value)) unmet.push('one lowercase letter');
      if (!/[0-9]/.test(value)) unmet.push('one number');
      if (!/[^A-Za-z0-9]/.test(value)) unmet.push('one special character');

      return unmet.length ? { password: { unmet } } : null;
    };
  }

  static notBlank(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null;
      }
      return String(control.value).trim().length ? null : { notBlank: true };
    };
  }

  static match(sourceKey: string, confirmKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const source = group.get(sourceKey);
      const confirm = group.get(confirmKey);

      if (!source || !confirm || isBlank(confirm.value)) {
        return null;
      }

      if (source.value === confirm.value) {
        if (confirm.hasError('match')) {
          const { match, ...rest } = confirm.errors ?? {};
          confirm.setErrors(Object.keys(rest).length ? rest : null);
        }
        return null;
      }

      confirm.setErrors({ ...(confirm.errors ?? {}), match: true });
      return { match: true };
    };
  }

  static different(otherValue: string, errorKey = 'sameAsPrevious'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isBlank(control.value) || isBlank(otherValue)) {
        return null;
      }
      return control.value === otherValue ? { [errorKey]: true } : null;
    };
  }
}
