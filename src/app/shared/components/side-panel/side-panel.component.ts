import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-side-panel',
  standalone: false,
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss',
})
export class SidePanelComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() submitText = 'Save';
  @Input() cancelText = 'Cancel';
  @Input() submitting = false;
  @Input() showFooter = true;

  @Output() dismissed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();
}
