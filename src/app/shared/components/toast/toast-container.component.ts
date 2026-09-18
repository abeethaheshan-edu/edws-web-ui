import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { ToastMessage, ToastType } from '../../models/toast.model';

@Component({
  selector: 'app-toast-container',
  standalone: false,
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss',
})
export class ToastContainerComponent {
  private readonly toastService = inject(ToastService);

  protected readonly toasts = this.toastService.toasts;

  private readonly icons: Record<ToastType, string> = {
    success: 'check-circle',
    error: 'alert-triangle',
    warning: 'alert-circle',
    info: 'info',
  };

  protected iconFor(toast: ToastMessage): string {
    return this.icons[toast.type];
  }

  protected dismiss(toast: ToastMessage): void {
    this.toastService.dismiss(toast.id);
  }
}
