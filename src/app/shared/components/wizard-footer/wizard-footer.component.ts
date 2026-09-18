import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WizardAction, WIZARD_ACTION_CLASS } from '../../models/wizard.model';

@Component({
  selector: 'app-wizard-footer',
  standalone: false,
  templateUrl: './wizard-footer.component.html',
  styleUrl: './wizard-footer.component.scss',
})
export class WizardFooterComponent {
  @Input() actions: WizardAction[] = [];

  @Output() action = new EventEmitter<string>();

  protected get startActions(): WizardAction[] {
    return this.actions.filter((item) => item.alignEnd === false);
  }

  protected get endActions(): WizardAction[] {
    return this.actions.filter((item) => item.alignEnd !== false);
  }

  protected classFor(item: WizardAction): string {
    return WIZARD_ACTION_CLASS[item.variant];
  }
}
