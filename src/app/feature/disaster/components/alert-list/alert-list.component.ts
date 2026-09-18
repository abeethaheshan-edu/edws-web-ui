import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DEFAULT_PAGE_SIZE, PageState, TableColumn } from '../../../../shared/models/table.model';
import { PopupService } from '../../../../shared/popup/popup.service';
import { UiLoaderService } from '../../../../shared/ui-loader/ui-loader.service';
import {
  PublishAlertData,
  PublishAlertPopupComponent,
  PublishAlertResult,
} from '../publish-alert-popup/publish-alert-popup.component';
import { ToastService } from '../../../../shared/services/toast.service';
import {
  ALERT_STATUS_LABELS,
  ALERT_STATUS_TONE,
  AlertStatus,
  DISASTER_TYPE_LABELS,
  DISASTER_TYPE_OPTIONS,
  DisasterAlert,
  DisasterType,
  SEVERITY_LABELS,
  SEVERITY_TONE,
} from '../../models/disaster-alert.model';
import { formatArea, polygonAreaSqKm } from '../../models/polygon-geometry';
import { AlertStore } from '../../services/alert-store.service';
import { ApiError } from '../../../../core/net/api-error.model';

interface AlertFilter {
  search: string;
  type: DisasterType | '';
  status: AlertStatus | '';
}

@Component({
  selector: 'app-alert-list',
  standalone: false,
  templateUrl: './alert-list.component.html',
  styleUrl: './alert-list.component.scss',
})
export class AlertListComponent implements OnInit {
  private readonly store = inject(AlertStore);
  private readonly router = inject(Router);
  private readonly popup = inject(PopupService);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(UiLoaderService);

  protected readonly typeOptions = DISASTER_TYPE_OPTIONS;
  protected readonly typeLabels = DISASTER_TYPE_LABELS;
  protected readonly severityLabels = SEVERITY_LABELS;
  protected readonly severityTones = SEVERITY_TONE;
  protected readonly statusLabels = ALERT_STATUS_LABELS;
  protected readonly statusTones = ALERT_STATUS_TONE;
  protected readonly statuses = Object.values(AlertStatus);

  protected readonly columns: TableColumn[] = [
    { key: 'alert', header: 'Alert', width: 'minmax(14rem, 2.2fr)' },
    { key: 'type', header: 'Type', width: 'minmax(7rem, 1fr)' },
    { key: 'severity', header: 'Severity', width: 'minmax(7rem, 0.9fr)' },
    { key: 'area', header: 'Affected Area', width: 'minmax(9rem, 1.2fr)' },
    { key: 'status', header: 'Status', width: 'minmax(7rem, 0.9fr)' },
    { key: 'updated', header: 'Updated', width: 'minmax(7rem, 1fr)' },
    { key: 'actions', header: '', width: '3rem', align: 'end' },
  ];

  protected readonly filter = signal<AlertFilter>({ search: '', type: '', status: '' });
  protected readonly page = signal(1);

  protected readonly visibleAlerts = this.store.alerts;
  protected readonly loading = this.store.loading;

  protected readonly pageState = computed<PageState>(() => ({
    page: this.page(),
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: this.store.totalItems(),
  }));

  ngOnInit(): void {
    this.fetch();
  }

  protected updateFilter(patch: Partial<AlertFilter>): void {
    this.filter.update((current) => ({ ...current, ...patch }));
    this.page.set(1);
    console.log('[AlertList] filter', this.filter());
    this.fetch();
  }

  protected onPageChange(page: number): void {
    this.page.set(page);
    this.fetch();
  }

  private fetch(): void {
    const { search, type, status } = this.filter();

    this.store
      .load({ search, type, status, page: this.page(), pageSize: DEFAULT_PAGE_SIZE })
      .subscribe({
        error: (error: ApiError) => this.toast.error('Could not load alerts', error?.message ?? 'Please try again.'),
      });
  }

  protected areaLabel(alert: DisasterAlert): string {
    const area = polygonAreaSqKm(alert.area.boundary);
    return area ? `${alert.area.areaName} · ${formatArea(area)}` : alert.area.areaName || '—';
  }

  protected createAlert(): void {
    void this.router.navigate(['/disasters/new']);
  }

  protected editAlert(alert: DisasterAlert): void {
    void this.router.navigate(['/disasters', alert.id, 'edit']);
  }

  protected publishAlert(alert: DisasterAlert): void {
    this.popup
      .open<PublishAlertData, PublishAlertResult>(PublishAlertPopupComponent, {
        title: 'Publish alert',
        subtitle: 'Send this alert to the public channels',
        data: { referenceCode: alert.referenceCode, title: alert.title },
        actions: [
          { id: 'cancel', label: 'Cancel', variant: 'outline' },
          { id: 'submit', label: 'Publish', variant: 'primary' },
        ],
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }

        console.log('[AlertList] publish', alert.id, result);
        this.loader.show('Publishing alert...');

        this.store.publish(alert.id, result.note).subscribe({
          next: () => {
            this.loader.hide();
            this.toast.success('Alert published', `${alert.referenceCode} is now live.`);
          },
          error: (error: ApiError) => {
            this.loader.hide();
            this.toast.error('Publish failed', error?.message ?? 'Please try again.');
          },
        });
      });
  }

  protected deleteAlert(alert: DisasterAlert): void {
    this.popup
      .confirm({
        title: 'Delete this alert?',
        message: `${alert.referenceCode} — ${alert.title} will be removed permanently.`,
        confirmText: 'Delete',
        variant: 'danger',
      })
      .subscribe((confirmed) => {
        console.log('[AlertList] delete confirmed:', confirmed, alert.id);
        if (!confirmed) {
          return;
        }

        this.loader.show('Deleting alert...');
        this.store.remove(alert.id).subscribe({
          next: () => {
            this.loader.hide();
            this.toast.success('Alert deleted', `${alert.referenceCode} has been removed.`);
            this.fetch();
          },
          error: (error: ApiError) => {
            this.loader.hide();
            this.toast.error('Delete failed', error?.message ?? 'Please try again.');
          },
        });
      });
  }

}
