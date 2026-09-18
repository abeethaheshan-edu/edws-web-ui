import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../core/api/api.service';
import { Net } from '../core/net/net';
import { NetworkService } from '../core/net/network.service';
import { PageResponse } from '../models/page-response.model';
import {
  CitizenFormValue,
  CitizenProperty,
  CitizenSummary,
  toCitizenSummary,
} from '../feature/citizen/models/citizen.model';

export interface CitizenQuery {
  search?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class CitizenService {
  private readonly api = inject(ApiService);
  private readonly network = inject(NetworkService);

  findAll(query: CitizenQuery = {}): Observable<PageResponse<CitizenSummary>> {
    const net = Net.get();
    net.url = this.api.getApiUrl('citizenCreate');
    net.params = {
      search: query.search ?? '',
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 10,
    };

    return this.network
      .unwrap<Record<string, unknown>>(net)
      .pipe(map((data) => PageResponse.fromJson(data, toCitizenSummary)));
  }

  register(value: CitizenFormValue): Observable<CitizenSummary> {
    const net = Net.post();
    net.url = this.api.getApiUrl('citizenCreate');
    net.body = this.toRequest(value);

    return this.network.unwrap<Record<string, unknown>>(net).pipe(map(toCitizenSummary));
  }

  private toRequest(value: CitizenFormValue): Record<string, unknown> {
    const [primary, ...others] = value.properties;

    return {
      fullName: value.fullName,
      nic: value.nic,
      email: value.email,
      phone: value.phone,
      secondaryPhone: value.secondaryPhone,
      address: primary ? this.toAddress(primary, true) : null,
      properties: others.map((property) => this.toAddress(property, false)),
      members: value.members
        .filter((member) => member.fullName.trim())
        .map((member) => ({
          fullName: member.fullName,
          nic: member.nic,
          phone: member.phone,
          email: member.email,
        })),
      familyMemberIds: [],
    };
  }

  private toAddress(property: CitizenProperty, primary: boolean): Record<string, unknown> {
    return {
      houseNo: property.houseNo,
      city: property.city,
      streetAddress1: property.streetAddress1,
      streetAddress2: property.streetAddress2,
      category: property.category,
      categoryOther: property.categoryOther,
      province: property.province,
      district: property.district,
      latitude: property.latitude,
      longitude: property.longitude,
      primary,
    };
  }
}
