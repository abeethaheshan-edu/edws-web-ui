import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../core/api/api.service';
import { Net } from '../core/net/net';
import { NetworkService } from '../core/net/network.service';
import { PageResponse } from '../models/page-response.model';
import { AlertStatus, DisasterAlert, DisasterAlertDraft } from '../feature/disaster/models/disaster-alert.model';
import { toAlert, toAlertRequest } from '../feature/disaster/models/alert-mapper';

export interface AlertQuery {
  search?: string;
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly api = inject(ApiService);
  private readonly network = inject(NetworkService);

  findAll(query: AlertQuery = {}): Observable<PageResponse<DisasterAlert>> {
    const net = Net.get();
    net.url = this.api.getApiUrl('alertAll');
    net.params = {
      search: query.search ?? '',
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 10,
    };
    if (query.type) {
      net.addParam('type', query.type);
    }
    if (query.status) {
      net.addParam('status', query.status);
    }

    return this.network
      .unwrap<Record<string, unknown>>(net)
      .pipe(map((data) => PageResponse.fromJson(data, toAlert)));
  }

  findById(alertId: string): Observable<DisasterAlert> {
    const net = Net.get();
    net.url = this.api.getApiUrl('alertDetails', alertId);

    return this.network.unwrap<Record<string, unknown>>(net).pipe(map(toAlert));
  }

  create(draft: DisasterAlertDraft, status: AlertStatus): Observable<DisasterAlert> {
    const net = Net.post();
    net.url = this.api.getApiUrl('alertCreate');
    net.body = toAlertRequest(draft);
    net.addParam('status', status);

    return this.network.unwrap<Record<string, unknown>>(net).pipe(map(toAlert));
  }

  update(alertId: string, draft: DisasterAlertDraft, status: AlertStatus): Observable<DisasterAlert> {
    const net = Net.put();
    net.url = this.api.getApiUrl('alertUpdate', alertId);
    net.body = toAlertRequest(draft);
    net.addParam('status', status);

    return this.network.unwrap<Record<string, unknown>>(net).pipe(map(toAlert));
  }

  changeStatus(alertId: string, status: AlertStatus, note = ''): Observable<DisasterAlert> {
    const net = Net.put();
    net.url = this.api.getApiUrl('alertStatus', alertId);
    net.body = { status, note };

    return this.network.unwrap<Record<string, unknown>>(net).pipe(map(toAlert));
  }

  delete(alertId: string): Observable<void> {
    const net = Net.delete();
    net.url = this.api.getApiUrl('alertDelete', alertId);

    return this.network.unwrap<void>(net);
  }
}
