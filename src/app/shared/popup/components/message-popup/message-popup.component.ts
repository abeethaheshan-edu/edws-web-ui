import { Component, inject } from '@angular/core';
import { POPUP_DATA } from '../../popup.model';

export interface MessagePopupData {
  message: string;
  details?: string[];
}

@Component({
  selector: 'app-message-popup',
  standalone: false,
  templateUrl: './message-popup.component.html',
  styleUrl: './message-popup.component.scss',
})
export class MessagePopupComponent {
  protected readonly data = inject<MessagePopupData>(POPUP_DATA);
}
