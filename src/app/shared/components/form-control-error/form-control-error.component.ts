import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'form-control-error',
  standalone: false,
  templateUrl: './form-control-error.component.html',
  styleUrl: './form-control-error.component.scss',
})
export class FormControlErrorComponent {
  @Input('fieldName') fieldName = 'This field';
  @Input('control') control: FormControl | AbstractControl | null = null;

  @Input() messages: Record<string, string> = {};

  protected get visible(): boolean {
    return !!this.control && this.control.invalid && (this.control.touched || this.control.dirty);
  }

  protected get message(): string {
    const errors: ValidationErrors | null = this.control?.errors ?? null;
    if (!errors) {
      return '';
    }

    const override = Object.keys(errors).find((key) => this.messages[key]);
    if (override) {
      return this.messages[override];
    }

    const field = this.fieldName;

    if (errors['required'] || errors['notBlank']) return `${field} is required.`;
    if (errors['email']) return `Enter a valid email address.`;
    if (errors['officialEmail']) return `Use your official @${errors['officialEmail'].domain} address.`;
    if (errors['numbersOnly']) return `${field} accepts numbers only.`;
    if (errors['lettersOnly']) return `${field} accepts letters only.`;
    if (errors['exactLength']) return `${field} must be exactly ${errors['exactLength'].requiredLength} digits.`;
    if (errors['phone']) return `Enter a valid Sri Lankan number, e.g. +94 71 234 5678.`;
    if (errors['password']) return `Password needs ${errors['password'].unmet.join(', ')}.`;
    if (errors['match']) return `${field} does not match.`;
    if (errors['sameAsPrevious']) return `Choose a password you have not used before.`;
    if (errors['minlength']) return `${field} must be at least ${errors['minlength'].requiredLength} characters.`;
    if (errors['maxlength']) return `${field} must be at most ${errors['maxlength'].requiredLength} characters.`;

    return `${field} is invalid.`;
  }
}
