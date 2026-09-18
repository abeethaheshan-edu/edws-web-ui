import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AlertQuery, AlertService } from '../../../services/alert.service';
import { PageResponse } from '../../../models/page-response.model';
import { AlertStatus, DisasterAlert, DisasterAlertDraft } from '../models/disaster-alert.model';

@Injectable({ providedIn: 'root' })
export class AlertStore {
  private readonly alertApi = inject(AlertService);

  private readonly items = signal<DisasterAlert[]>([]);
  private readonly total = signal(0);
  private readonly busy = signal(false);

  readonly alerts = this.items.asReadonly();
  readonly totalItems = this.total.asReadonly();
  readonly loading = this.busy.asReadonly();
  readonly count = computed(() => this.items().length);

  load(query: AlertQuery = {}): Observable<PageResponse<DisasterAlert>> {
    this.busy.set(true);

    return this.alertApi.findAll(query).pipe(
      tap({
        next: (page) => {
          this.items.set(page.items);
          this.total.set(page.totalItems);
          this.busy.set(false);
        },
        error: () => this.busy.set(false),
      }),
    );
  }

  getById(alertId: string): Observable<DisasterAlert> {
    return this.alertApi.findById(alertId);
  }

  create(draft: DisasterAlertDraft, status: AlertStatus): Observable<DisasterAlert> {
    return this.alertApi.create(draft, status).pipe(tap((alert) => this.items.update((list) => [alert, ...list])));
  }

  update(alertId: string, draft: DisasterAlertDraft, status: AlertStatus): Observable<DisasterAlert> {
    return this.alertApi
      .update(alertId, draft, status)
      .pipe(tap((alert) => this.items.update((list) => list.map((item) => (item.id === alertId ? alert : item)))));
  }

  publish(alertId: string, note = ''): Observable<DisasterAlert> {
    return this.alertApi
      .changeStatus(alertId, AlertStatus.Published, note)
      .pipe(tap((alert) => this.items.update((list) => list.map((item) => (item.id === alertId ? alert : item)))));
  }

  remove(alertId: string): Observable<void> {
    return this.alertApi
      .delete(alertId)
      .pipe(tap(() => this.items.update((list) => list.filter((item) => item.id !== alertId))));
  }
}
