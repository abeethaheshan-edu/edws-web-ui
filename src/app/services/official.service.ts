import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../core/api/api.service';
import { Net } from '../core/net/net';
import { NetworkService } from '../core/net/network.service';
import { PageResponse } from '../models/page-response.model';
import { AdminTeam, SystemUser, UserFormValue } from '../shared/models/user.model';
import { toOfficial, toOfficialRequest } from '../feature/user/models/official-mapper';

export interface OfficialQuery {
  search?: string;
  role?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class OfficialService {
  private readonly api = inject(ApiService);
  private readonly network = inject(NetworkService);

  findAll(query: OfficialQuery = {}): Observable<PageResponse<SystemUser>> {
    const net = Net.get();
    net.url = this.api.getApiUrl('officialAll');
    net.params = {
      search: query.search ?? '',
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 10,
    };
    if (query.role) {
      net.addParam('role', query.role);
    }

    return this.network
      .unwrap<Record<string, unknown>>(net)
      .pipe(map((data) => PageResponse.fromJson(data, toOfficial)));
  }

  findById(userId: string): Observable<SystemUser> {
    const net = Net.get();
    net.url = this.api.getApiUrl('officialById', userId);

    return this.network.unwrap<Record<string, unknown>>(net).pipe(map(toOfficial));
  }

  create(value: UserFormValue): Observable<SystemUser> {
    const net = Net.post();
    net.url = this.api.getApiUrl('officialCreate');
    net.body = toOfficialRequest(value);

    return this.network.unwrap<Record<string, unknown>>(net).pipe(map(toOfficial));
  }

  update(userId: string, value: UserFormValue): Observable<SystemUser> {
    const net = Net.put();
    net.url = this.api.getApiUrl('officialById', userId);
    net.body = toOfficialRequest(value);

    return this.network.unwrap<Record<string, unknown>>(net).pipe(map(toOfficial));
  }

  delete(userId: string): Observable<void> {
    const net = Net.delete();
    net.url = this.api.getApiUrl('officialById', userId);

    return this.network.unwrap<void>(net);
  }

  assignTeam(team: AdminTeam): Observable<SystemUser> {
    const net = Net.put();
    net.url = this.api.getApiUrl('officialTeam', team.adminId);
    net.body = { reviewerIds: team.reviewerIds, drawerIds: team.drawerIds };

    return this.network.unwrap<Record<string, unknown>>(net).pipe(map(toOfficial));
  }
}
