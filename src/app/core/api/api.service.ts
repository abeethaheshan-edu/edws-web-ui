import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import API_ENDPOINTS from './api-endpoints.json';

export type ApiEndpointKey = keyof typeof API_ENDPOINTS;
export type PathVariable = string | number;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly endpoints: Record<string, string> = API_ENDPOINTS;

  getApiUrl(key: ApiEndpointKey, pathVariables?: PathVariable | PathVariable[]): string {
    const path = this.endpoints[key];

    if (!path) {
      throw new Error(`Unknown API endpoint: ${key}`);
    }

    return environment.apiBaseUrl + this.resolvePath(path, pathVariables);
  }

  getPath(key: ApiEndpointKey): string {
    return this.endpoints[key] ?? '';
  }

  private resolvePath(path: string, pathVariables?: PathVariable | PathVariable[]): string {
    const placeholders = path.match(/{param\d+}/g);

    if (!placeholders) {
      return path;
    }

    const values = this.toArray(pathVariables);

    if (values.length < placeholders.length) {
      throw new Error(`${path} needs ${placeholders.length} path variable(s), received ${values.length}`);
    }

    return placeholders.reduce(
      (resolved, placeholder, index) => resolved.replace(placeholder, encodeURIComponent(String(values[index]))),
      path,
    );
  }

  private toArray(pathVariables?: PathVariable | PathVariable[]): PathVariable[] {
    if (pathVariables === undefined || pathVariables === null) {
      return [];
    }
    return Array.isArray(pathVariables) ? pathVariables : [pathVariables];
  }
}
