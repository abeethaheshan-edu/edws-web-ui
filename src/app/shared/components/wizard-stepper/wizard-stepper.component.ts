import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WizardStep } from '../../models/wizard.model';

@Component({
  selector: 'app-wizard-stepper',
  standalone: false,
  templateUrl: './wizard-stepper.component.html',
  styleUrl: './wizard-stepper.component.scss',
})
export class WizardStepperComponent {
  @Input({ required: true }) steps: WizardStep[] = [];
  @Input() activeIndex = 0;

  @Input() completedIndexes: number[] = [];

  @Input() navigable = true;

  @Output() stepSelect = new EventEmitter<number>();

  protected isCompleted(index: number): boolean {
    return this.completedIndexes.includes(index);
  }

  protected select(index: number): void {
    if (this.navigable && index !== this.activeIndex) {
      this.stepSelect.emit(index);
    }
  }
}
