import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Net } from '../net/net';
import { NetworkService } from '../net/network.service';
import { AccessAction, AccessPolicy } from './access-policy.model';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly api = inject(ApiService);
  private readonly network = inject(NetworkService);

  private readonly current = signal<AccessPolicy | null>(null);
  private allowed = new Map<string, Set<string>>();

  readonly policy = this.current.asReadonly();

  load(): Observable<AccessPolicy | null> {
    const net = Net.get();
    net.url = this.api.getApiUrl('myAccessPolicy');

    return this.network.request<AccessPolicy>(net).pipe(tap((policy) => this.apply(policy)));
  }

  ensureLoaded(): Observable<AccessPolicy | null> {
    return this.current() ? of(this.current()) : this.load().pipe(map((policy) => policy));
  }

  can(element: string, action: AccessAction = 'VIEW'): boolean {
    return this.allowed.get(element)?.has(action) ?? false;
  }

  canAny(elements: string[], action: AccessAction = 'VIEW'): boolean {
    return elements.some((element) => this.can(element, action));
  }

  canAll(elements: string[], action: AccessAction = 'VIEW'): boolean {
    return elements.every((element) => this.can(element, action));
  }

  clear(): void {
    this.current.set(null);
    this.allowed = new Map();
  }

  private apply(policy: AccessPolicy): void {
    this.current.set(policy);
    this.allowed = new Map(
      (policy?.elements ?? []).map((entry) => [entry.element, new Set<string>(entry.actions ?? [])]),
    );
  }
}
