import { InjectionToken, Type } from '@angular/core';

export type PopupVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type PopupSize = 'sm' | 'md' | 'lg';

export const POPUP_CANCEL = 'cancel';
export const POPUP_SUBMIT = 'submit';

export interface PopupAction {
  id: string;
  label: string;
  variant: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  result?: unknown;
}

export interface PopupConfig<TData = unknown> {
  title?: string;
  subtitle?: string;
  data?: TData;
  size?: PopupSize;
  variant?: PopupVariant;
  actions?: PopupAction[];
  showHeader?: boolean;
  showClose?: boolean;
  dismissOnBackdrop?: boolean;
}

export interface PopupContent<TResult = unknown> {
  submit?(): TResult | null;
}

export const POPUP_DATA = new InjectionToken<unknown>('POPUP_DATA');
export const POPUP_CONFIG = new InjectionToken<PopupConfig>('POPUP_CONFIG');
export const POPUP_COMPONENT = new InjectionToken<Type<unknown>>('POPUP_COMPONENT');

export const DEFAULT_POPUP_ACTIONS: PopupAction[] = [
  { id: POPUP_CANCEL, label: 'Cancel', variant: 'outline' },
  { id: POPUP_SUBMIT, label: 'Submit', variant: 'primary' },
];
