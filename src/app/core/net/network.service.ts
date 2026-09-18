import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from './api-response.model';
import { skipAuthContext } from './net-context';
import { Net } from './net';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  private readonly http = inject(HttpClient);

  request<T>(net: Net): Observable<T> {
    return this.http.request<T>(net.method, net.url, this.options(net));
  }

  requestFull<T>(net: Net): Observable<HttpResponse<T>> {
    return this.http.request<T>(net.method, net.url, { ...this.options(net), observe: 'response' });
  }

  unwrap<T>(net: Net): Observable<T> {
    return this.request<ApiResponse<T>>(net).pipe(map((response) => response.data));
  }

  unwrapFull<T>(net: Net): Observable<HttpResponse<ApiResponse<T>>> {
    return this.requestFull<ApiResponse<T>>(net);
  }

  private options(net: Net) {
    return {
      body: net.buildBody(),
      headers: net.buildHeaders(),
      params: net.buildParams(),
      withCredentials: net.withCredentials,
      responseType: net.responseType as 'json',
      context: net.skipAuth ? skipAuthContext() : undefined,
    };
  }
}
