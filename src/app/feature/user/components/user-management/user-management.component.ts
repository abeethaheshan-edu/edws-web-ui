import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

import { DISTRICTS, PROVINCES } from '../../../../shared/constants/reference-data';
import { DEFAULT_PAGE_SIZE, PageState, TableColumn } from '../../../../shared/models/table.model';
import {
  ADMINISTRATIVE_SCOPE_LABELS,
  UserRole,
  USER_ROLE_LABELS,
  USER_STATUS_LABELS,
  USER_STATUS_TONE,
  UserStatus,
} from '../../../../shared/models/user-role.model';
import { AdminTeam, SystemUser, UserFilter, UserFormValue } from '../../../../shared/models/user.model';
import { PopupService } from '../../../../shared/popup/popup.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ApiError } from '../../../../core/net/api-error.model';
import { OfficialService } from '../../../../services/official.service';
import { UiLoaderService } from '../../../../shared/ui-loader/ui-loader.service';
import { AssignTeamPanelComponent } from '../assign-team-panel/assign-team-panel.component';
import { UserFormPanelComponent, UserPanelMode } from '../user-form-panel/user-form-panel.component';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  private readonly offcanvas = inject(NgbOffcanvas);
  private readonly popup = inject(PopupService);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(UiLoaderService);
  private readonly officials = inject(OfficialService);

  protected readonly provinces = PROVINCES;
  protected readonly districts = DISTRICTS;
  protected readonly roleLabels = USER_ROLE_LABELS;
  protected readonly scopeLabels = ADMINISTRATIVE_SCOPE_LABELS;
  protected readonly roles = [UserRole.Admin, UserRole.Reviewer, UserRole.Drawer];
  protected readonly statusLabels = USER_STATUS_LABELS;
  protected readonly statusTones = USER_STATUS_TONE;

  protected readonly columns: TableColumn[] = [
    { key: 'official', header: 'Official', width: 'minmax(12rem, 2fr)' },
    { key: 'role', header: 'Access Role', width: 'minmax(8rem, 1fr)' },
    { key: 'area', header: 'Area', width: 'minmax(9rem, 1.2fr)' },
    { key: 'status', header: 'Status', width: 'minmax(6rem, 0.8fr)' },
    { key: 'activity', header: 'Last Active', width: 'minmax(7rem, 1fr)' },
    { key: 'actions', header: '', width: '3rem', align: 'end' },
  ];

  private readonly users = signal<SystemUser[]>([]);
  private readonly total = signal(0);
  protected readonly filter = signal<UserFilter>({ search: '', province: '', district: '', role: '' });
  protected readonly page = signal(1);
  protected readonly loading = signal(false);

  protected readonly admins = computed(() => this.users().filter((user) => user.role === UserRole.Admin));

  protected readonly visibleUsers = computed(() => {
    const { province, district } = this.filter();

    return this.users().filter((user) => {
      const matchesProvince = !province || user.scopeDetails.province === province;
      const matchesDistrict = !district || user.scopeDetails.district === district;
      return matchesProvince && matchesDistrict;
    });
  });

  protected readonly pageState = computed<PageState>(() => ({
    page: this.page(),
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: this.total(),
  }));

  ngOnInit(): void {
    this.fetch();
  }

  protected updateFilter(patch: Partial<UserFilter>): void {
    this.filter.update((current) => ({ ...current, ...patch }));
    this.page.set(1);
    console.log('[UserManagement] filter', this.filter());
    this.fetch();
  }

  protected onPageChange(page: number): void {
    this.page.set(page);
    this.fetch();
  }

  private fetch(): void {
    const { search, role } = this.filter();

    this.loading.set(true);
    this.officials
      .findAll({ search, role, page: this.page(), pageSize: DEFAULT_PAGE_SIZE })
      .subscribe({
        next: (result) => {
          this.users.set(result.items);
          this.total.set(result.totalItems);
          this.loading.set(false);
        },
        error: (error: ApiError) => {
          this.loading.set(false);
          this.toast.error('Could not load officials', error?.message ?? 'Please try again.');
        },
      });
  }

  protected areaOf(user: SystemUser): string {
    return (
      user.scopeDetails.city ||
      user.scopeDetails.gnDivision ||
      user.scopeDetails.district ||
      user.scopeDetails.province ||
      '—'
    );
  }

  protected isAdmin(user: SystemUser): boolean {
    return user.role === UserRole.Admin;
  }

  protected async openCreate(): Promise<void> {
    const value = await this.openUserPanel('create');
    if (!value) {
      return;
    }

    console.log('[UserManagement] create', value);
    this.loader.show('Sending invitation...');

    this.officials.create(value).subscribe({
      next: (created) => {
        this.loader.hide();
        console.log('[UserManagement] created', created);
        this.toast.success('Invitation sent successfully to the official\u2019s email.');
        this.page.set(1);
        this.fetch();
      },
      error: (error: ApiError) => {
        this.loader.hide();
        this.toast.error('Failed to send invitation', error?.message ?? 'Please check the email address and try again.');
      },
    });
  }

  protected async openEdit(user: SystemUser): Promise<void> {
    const value = await this.openUserPanel('edit', user);
    if (!value) {
      return;
    }

    this.loader.show('Saving changes...');

    this.officials.update(user.id, value).subscribe({
      next: (updated) => {
        this.loader.hide();
        console.log('[UserManagement] updated', updated);
        this.toast.success('Official updated', `${updated.fullName}'s details were saved.`);
        this.fetch();
      },
      error: (error: ApiError) => {
        this.loader.hide();
        this.toast.error('Update failed', error?.message ?? 'Please try again.');
      },
    });
  }

  protected async openView(user: SystemUser): Promise<void> {
    await this.openUserPanel('view', user);
  }

  protected async openAssignTeam(admin: SystemUser): Promise<void> {
    const panel = this.offcanvas.open(AssignTeamPanelComponent, this.panelOptions());
    panel.componentInstance.admin = admin;
    panel.componentInstance.reviewers = this.users().filter((user) => user.role === UserRole.Reviewer);
    panel.componentInstance.drawers = this.users().filter((user) => user.role === UserRole.Drawer);

    const team: AdminTeam | undefined = await panel.result.catch(() => undefined);
    if (!team) {
      return;
    }

    console.log('[UserManagement] team saved', team);
    this.loader.show('Saving assignments...');

    this.officials.assignTeam(team).subscribe({
      next: () => {
        this.loader.hide();
        const assigned = team.reviewerIds.length + team.drawerIds.length;
        this.toast.success('Team updated', `${assigned} official(s) now report to ${admin.fullName}.`);
        this.fetch();
      },
      error: (error: ApiError) => {
        this.loader.hide();
        this.toast.error('Could not save assignments', error?.message ?? 'Please try again.');
      },
    });
  }

  protected confirmDelete(user: SystemUser): void {
    this.popup
      .confirm({
        title: 'Remove this official?',
        message: `${user.fullName} will lose access to the console immediately.`,
        confirmText: 'Remove',
        variant: 'danger',
      })
      .subscribe((confirmed) => {
        console.log('[UserManagement] delete confirmed:', confirmed, user.id);
        if (!confirmed) {
          return;
        }

        this.loader.show('Removing official...');
        this.officials.delete(user.id).subscribe({
          next: () => {
            this.loader.hide();
            this.toast.success('Official removed', `${user.fullName} no longer has access.`);
            this.fetch();
          },
          error: (error: ApiError) => {
            this.loader.hide();
            this.toast.error('Remove failed', error?.message ?? 'Please try again.');
          },
        });
      });
  }

  private async openUserPanel(mode: UserPanelMode, user?: SystemUser): Promise<UserFormValue | undefined> {
    const panel = this.offcanvas.open(UserFormPanelComponent, this.panelOptions());
    panel.componentInstance.mode = mode;
    panel.componentInstance.user = user ?? null;
    panel.componentInstance.admins = this.admins().filter((admin) => admin.id !== user?.id);

    return panel.result.catch(() => undefined);
  }

  private panelOptions() {
    return {
      position: 'end' as const,
      panelClass: 'side-panel-offcanvas',
      backdrop: true,
      scroll: false,
    };
  }

}
