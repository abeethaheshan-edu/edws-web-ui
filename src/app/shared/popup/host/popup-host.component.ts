import {
  Component,
  inject,
  Injector,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { PopupRef } from '../popup-ref';
import {
  POPUP_CANCEL,
  POPUP_COMPONENT,
  POPUP_CONFIG,
  POPUP_SUBMIT,
  PopupAction,
  PopupConfig,
  PopupContent,
} from '../popup.model';

@Component({
  selector: 'app-popup-host',
  standalone: false,
  templateUrl: './popup-host.component.html',
  styleUrl: './popup-host.component.scss',
})
export class PopupHostComponent implements OnInit {
  private readonly component = inject<Type<unknown>>(POPUP_COMPONENT);
  private readonly injector = inject(Injector);
  private readonly popupRef = inject(PopupRef);

  protected readonly config = inject<PopupConfig>(POPUP_CONFIG);

  @ViewChild('content', { read: ViewContainerRef, static: true })
  private container!: ViewContainerRef;

  private instance: PopupContent | null = null;

  ngOnInit(): void {
    const componentRef = this.container.createComponent(this.component, { injector: this.injector });
    this.instance = componentRef.instance as PopupContent;
  }

  protected get actions(): PopupAction[] {
    return this.config.actions ?? [];
  }

  protected get iconName(): string {
    switch (this.config.variant) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'alert-triangle';
      case 'warning':
        return 'alert-circle';
      case 'info':
        return 'info';
      default:
        return '';
    }
  }

  protected buttonClass(action: PopupAction): string {
    const classes: Record<PopupAction['variant'], string> = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline-secondary',
      danger: 'btn-danger',
    };
    return classes[action.variant];
  }

  protected onAction(action: PopupAction): void {
    if (action.id === POPUP_CANCEL) {
      this.popupRef.dismiss();
      return;
    }

    if (action.id === POPUP_SUBMIT && this.instance?.submit) {
      const result = this.instance.submit();
      if (result === null || result === undefined) {
        return;
      }
      this.popupRef.close(result);
      return;
    }

    this.popupRef.close(action.result ?? action.id);
  }

  protected onClose(): void {
    this.popupRef.dismiss();
  }
}
