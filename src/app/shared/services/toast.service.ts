import { Injectable, signal } from '@angular/core';
import { ToastMessage, ToastType } from '../models/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private sequence = 0;
  private readonly messages = signal<ToastMessage[]>([]);

  readonly toasts = this.messages.asReadonly();

  success(title: string, description?: string, delay = 4000): void {
    this.show('success', title, description, delay);
  }

  error(title: string, description?: string, delay = 6000): void {
    this.show('error', title, description, delay);
  }

  warning(title: string, description?: string, delay = 5000): void {
    this.show('warning', title, description, delay);
  }

  info(title: string, description?: string, delay = 4000): void {
    this.show('info', title, description, delay);
  }

  dismiss(id: number): void {
    this.messages.update((list) => list.filter((toast) => toast.id !== id));
  }

  clear(): void {
    this.messages.set([]);
  }

  private show(type: ToastType, title: string, description: string | undefined, delay: number): void {
    const toast: ToastMessage = { id: ++this.sequence, type, title, description, delay };
    this.messages.update((list) => [...list, toast]);

    if (delay > 0) {
      setTimeout(() => this.dismiss(toast.id), delay);
    }
  }
}
