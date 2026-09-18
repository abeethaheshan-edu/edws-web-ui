import { HttpErrorResponse } from '@angular/common/http';

export class ApiError {
  private readonly _status: number;
  private readonly _message: string;
  private readonly _code: string;
  private readonly _fieldErrors: Record<string, string>;

  constructor(status: number, message: string, code = '', fieldErrors: Record<string, string> = {}) {
    this._status = status;
    this._message = message;
    this._code = code;
    this._fieldErrors = fieldErrors;
  }

  static fromHttp(error: HttpErrorResponse): ApiError {
    const payload = (error.error ?? {}) as Record<string, unknown>;
    const message =
      (payload['message'] as string) || error.message || 'Something went wrong. Please try again.';

    return new ApiError(
      error.status,
      message,
      (payload['code'] as string) ?? '',
      (payload['errors'] as Record<string, string>) ?? {},
    );
  }

  get status(): number {
    return this._status;
  }

  get message(): string {
    return this._message;
  }

  get code(): string {
    return this._code;
  }

  get fieldErrors(): Record<string, string> {
    return this._fieldErrors;
  }

  get isUnauthorized(): boolean {
    return this._status === 401;
  }

  get isForbidden(): boolean {
    return this._status === 403;
  }

  get isNetworkError(): boolean {
    return this._status === 0;
  }
}
