import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../core/api/api.service';
import { Net } from '../core/net/net';
import { NetworkService } from '../core/net/network.service';
import { CitizenFormValue } from '../feature/citizen/models/citizen.model';

@Injectable({ providedIn: 'root' })
export class CitizenService {
  private readonly api = inject(ApiService);
  private readonly network = inject(NetworkService);

  register(value: CitizenFormValue): Observable<string> {
    const net = Net.post();
    net.url = this.api.getApiUrl('citizenCreate');
    net.body = {
      fullName: value.fullName,
      nic: value.nic,
      email: value.email || null,
      phone: value.phone,
      dateOfBirth: value.dateOfBirth || null,
      gender: value.gender || null,
      householder: value.householder,
      address: {
        houseName: value.houseName || null,
        houseNo: value.houseNo || null,
        streetAddress1: value.streetAddress1 || null,
        streetAddress2: value.streetAddress2 || null,
        city: value.city || null,
        zipCode: value.zipCode || null,
        gnDivision: value.gnDivision || null,
        latitude: value.latitude,
        longitude: value.longitude,
      },
    };

    return this.network
      .unwrap<Record<string, unknown>>(net)
      .pipe(map((data) => (data['id'] as string) ?? ''));
  }

  findByGnDivision(gnDivisionId: string): Observable<Record<string, unknown>[]> {
    const net = Net.get();
    net.url = this.api.getApiUrl('citizensByGnDivision', gnDivisionId);

    return this.network.unwrap<Record<string, unknown>[]>(net);
  }
}
