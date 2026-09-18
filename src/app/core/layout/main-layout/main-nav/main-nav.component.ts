import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthSessionService } from '../../../auth/auth-session.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-main-nav',
  standalone: false,
  templateUrl: './main-nav.component.html',
  styleUrl: './main-nav.component.scss',
})
export class MainNavComponent {
  private readonly toast = inject(ToastService);

  @Output() menuToggle = new EventEmitter<void>();

  private readonly session = inject(AuthSessionService);

  protected readonly currentUser = this.session.user;

  protected readonly unreadCount = 3;

  protected onNotifications(): void {
    console.log('[MainNav] notifications opened');
    this.toast.info('Notifications', `You have ${this.unreadCount} unread alerts.`);
  }
}
