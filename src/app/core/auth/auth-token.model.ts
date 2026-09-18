export class AuthToken {
  private _accessToken: string;
  private _refreshToken: string;
  private _tokenType: string;
  private _expiresIn: number;

  constructor(accessToken = '', refreshToken = '', tokenType = 'Bearer', expiresIn = 0) {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
    this._tokenType = tokenType;
    this._expiresIn = expiresIn;
  }

  static fromHeaders(headers: { get(name: string): string | null }): AuthToken {
    return new AuthToken(
      headers.get('X-Access-Token') ?? '',
      headers.get('X-Refresh-Token') ?? '',
      headers.get('X-Token-Type') ?? 'Bearer',
      Number(headers.get('X-Access-Token-Expires-In') ?? 0),
    );
  }

  static fromJson(json: Record<string, unknown>): AuthToken {
    return new AuthToken(
      (json['accessToken'] as string) ?? '',
      (json['refreshToken'] as string) ?? '',
      (json['tokenType'] as string) ?? 'Bearer',
      Number(json['expiresIn'] ?? 0),
    );
  }

  get accessToken(): string {
    return this._accessToken;
  }

  set accessToken(value: string) {
    this._accessToken = value;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }

  set refreshToken(value: string) {
    this._refreshToken = value;
  }

  get tokenType(): string {
    return this._tokenType;
  }

  set tokenType(value: string) {
    this._tokenType = value;
  }

  get expiresIn(): number {
    return this._expiresIn;
  }

  set expiresIn(value: number) {
    this._expiresIn = value;
  }

  get authorizationHeader(): string {
    return this._accessToken ? `${this._tokenType} ${this._accessToken}` : '';
  }

  get isEmpty(): boolean {
    return !this._accessToken;
  }

  toJson(): Record<string, unknown> {
    return {
      accessToken: this._accessToken,
      refreshToken: this._refreshToken,
      tokenType: this._tokenType,
      expiresIn: this._expiresIn,
    };
  }
}
