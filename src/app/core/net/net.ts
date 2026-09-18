import { HttpHeaders, HttpParams } from '@angular/common/http';

export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
}

export type NetResponseType = 'json' | 'blob' | 'text';

export class Net {
  method: HttpMethod = HttpMethod.Get;
  url = '';
  body: unknown = null;
  headers: Record<string, string> = {};
  params: Record<string, string | number | boolean> = {};
  files: Record<string, File | File[]> = {};
  responseType: NetResponseType = 'json';
  withCredentials = false;
  skipAuth = false;

  private constructor(method: HttpMethod) {
    this.method = method;
  }

  static get(url = ''): Net {
    return Net.of(HttpMethod.Get, url);
  }

  static post(url = ''): Net {
    return Net.of(HttpMethod.Post, url);
  }

  static put(url = ''): Net {
    return Net.of(HttpMethod.Put, url);
  }

  static patch(url = ''): Net {
    return Net.of(HttpMethod.Patch, url);
  }

  static delete(url = ''): Net {
    return Net.of(HttpMethod.Delete, url);
  }

  private static of(method: HttpMethod, url: string): Net {
    const net = new Net(method);
    net.url = url;
    return net;
  }

  addHeader(name: string, value: string): Net {
    this.headers[name] = value;
    return this;
  }

  addParam(name: string, value: string | number | boolean): Net {
    this.params[name] = value;
    return this;
  }

  addFile(name: string, file: File | File[]): Net {
    this.files[name] = file;
    return this;
  }

  get hasFiles(): boolean {
    return Object.keys(this.files).length > 0;
  }

  buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    for (const [name, value] of Object.entries(this.headers)) {
      headers = headers.set(name, value);
    }
    return headers;
  }

  buildParams(): HttpParams {
    let params = new HttpParams();
    for (const [name, value] of Object.entries(this.params)) {
      params = params.set(name, String(value));
    }
    return params;
  }

  buildBody(): unknown {
    if (!this.hasFiles) {
      return this.body;
    }

    const form = new FormData();

    for (const [name, value] of Object.entries(this.files)) {
      if (Array.isArray(value)) {
        value.forEach((file) => form.append(name, file, file.name));
      } else {
        form.append(name, value, value.name);
      }
    }

    if (this.body instanceof FormData) {
      this.body.forEach((value, key) => form.append(key, value as string | Blob));
      return form;
    }

    if (this.body && typeof this.body === 'object') {
      for (const [key, value] of Object.entries(this.body as Record<string, unknown>)) {
        if (value === null || value === undefined) {
          continue;
        }
        form.append(key, value instanceof Blob ? value : JSON.stringify(value));
      }
    }

    return form;
  }
}
