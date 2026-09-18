import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ACCESS_ELEMENTS } from '../../../access/access-policy.model';
import { PermissionService } from '../../../access/permission.service';
import { AuthApiService } from '../../../auth/auth-api.service';
import { NavItem } from '../../../../shared/models/nav-item.model';
import { PopupService } from '../../../../shared/popup/popup.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-side-nav',
  standalone: false,
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  private readonly router = inject(Router);
  private readonly popup = inject(PopupService);
  private readonly toast = inject(ToastService);
  private readonly permissions = inject(PermissionService);
  private readonly authApi = inject(AuthApiService);

  @Output() closeNav = new EventEmitter<void>();

  private readonly allItems: Array<NavItem & { element: string }> = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', element: ACCESS_ELEMENTS.navDashboard },
    { label: 'Disaster Alerts', icon: 'alert-triangle', route: '/disasters', element: ACCESS_ELEMENTS.navDisasterAlerts },
    { label: 'User Management', icon: 'users', route: '/users', element: ACCESS_ELEMENTS.navUserManagement },
    { label: 'Citizen Registry', icon: 'user-plus', route: '/citizens', element: ACCESS_ELEMENTS.navCitizenRegistry },
    { label: 'Document Archive', icon: 'archive', route: '/documents', element: ACCESS_ELEMENTS.navDocumentArchive },
    { label: 'System Settings', icon: 'gear', route: '/settings', element: ACCESS_ELEMENTS.navSystemSettings },
  ];

  protected readonly emergencyElement = ACCESS_ELEMENTS.emergencyBroadcast;

  protected readonly items = computed(() => {
    this.permissions.policy();
    return this.allItems.filter((item) => this.permissions.can(item.element, 'VIEW'));
  });

  protected onEmergencyAlert(): void {
    this.popup
      .confirm({
        title: 'Broadcast emergency alert?',
        message: 'This sends an immediate alert to every subscribed district officer.',
        confirmText: 'Broadcast now',
        variant: 'danger',
      })
      .subscribe((confirmed) => {
        console.log('[SideNav] emergency alert confirmed:', confirmed);

        if (confirmed) {
          this.toast.warning('Emergency alert queued', 'All district officers are being notified.');
        }
      });
  }

  protected onLogout(): void {
    this.popup
      .confirm({
        title: 'Sign out?',
        message: 'You will need your credentials to access the console again.',
        confirmText: 'Sign out',
      })
      .subscribe((confirmed) => {
        console.log('[SideNav] logout confirmed:', confirmed);

        if (confirmed) {
          this.authApi.logout();
          this.permissions.clear();
          this.toast.info('Signed out', 'Your session has ended.');
          void this.router.navigateByUrl('/auth/login');
        }
      });
  }
}
