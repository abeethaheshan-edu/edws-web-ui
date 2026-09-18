import { inject, Injectable, Injector, Type } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable } from 'rxjs';
import { MessagePopupComponent, MessagePopupData } from './components/message-popup/message-popup.component';
import { PopupHostComponent } from './host/popup-host.component';
import { PopupRef } from './popup-ref';
import {
  DEFAULT_POPUP_ACTIONS,
  POPUP_CANCEL,
  POPUP_COMPONENT,
  POPUP_CONFIG,
  POPUP_DATA,
  PopupConfig,
} from './popup.model';

@Injectable({ providedIn: 'root' })
export class PopupService {
  private readonly modal = inject(NgbModal);
  private readonly injector = inject(Injector);

  open<TData = unknown, TResult = unknown>(
    component: Type<unknown>,
    config: PopupConfig<TData> = {},
  ): PopupRef<TResult> {
    const resolved: PopupConfig<TData> = {
      size: 'md',
      variant: 'default',
      showHeader: true,
      showClose: true,
      dismissOnBackdrop: false,
      actions: DEFAULT_POPUP_ACTIONS,
      ...config,
    };

    const popupRef = new PopupRef<TResult>();

    const modalRef = this.modal.open(PopupHostComponent, {
      centered: true,
      size: resolved.size,
      backdrop: resolved.dismissOnBackdrop ? true : 'static',
      windowClass: 'app-popup',
      injector: Injector.create({
        parent: this.injector,
        providers: [
          { provide: POPUP_COMPONENT, useValue: component },
          { provide: POPUP_CONFIG, useValue: resolved },
          { provide: POPUP_DATA, useValue: resolved.data ?? null },
          { provide: PopupRef, useValue: popupRef },
        ],
      }),
    });

    popupRef.attach(modalRef);
    return popupRef;
  }

  showSuccessPopup(message: string, title = 'Success'): PopupRef<boolean> {
    return this.message(message, title, 'success', 'Done');
  }

  showErrorPopup(message: string, title = 'Something went wrong'): PopupRef<boolean> {
    return this.message(message, title, 'error', 'Close');
  }

  showWarningPopup(message: string, title = 'Please check'): PopupRef<boolean> {
    return this.message(message, title, 'warning', 'Close');
  }

  showInfoPopup(message: string, title = 'Information'): PopupRef<boolean> {
    return this.message(message, title, 'info', 'Close');
  }

  confirm(options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'primary' | 'danger';
  }): Observable<boolean> {
    const ref = this.open<MessagePopupData, boolean>(MessagePopupComponent, {
      title: options.title,
      variant: options.variant === 'danger' ? 'error' : 'info',
      size: 'sm',
      data: { message: options.message },
      actions: [
        { id: POPUP_CANCEL, label: options.cancelText ?? 'Cancel', variant: 'outline' },
        {
          id: 'confirm',
          label: options.confirmText ?? 'Confirm',
          variant: options.variant === 'danger' ? 'danger' : 'primary',
          result: true,
        },
      ],
    });

    return ref.afterClosed().pipe(map((result) => result === true));
  }

  closeAll(): void {
    this.modal.dismissAll();
  }

  private message(
    message: string,
    title: string,
    variant: 'success' | 'error' | 'warning' | 'info',
    actionLabel: string,
  ): PopupRef<boolean> {
    return this.open<MessagePopupData, boolean>(MessagePopupComponent, {
      title,
      variant,
      size: 'sm',
      data: { message },
      actions: [{ id: 'ok', label: actionLabel, variant: 'primary', result: true }],
    });
  }
}
