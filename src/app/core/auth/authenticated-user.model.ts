export class AuthenticatedUser {
  private _id: string;
  private _email: string;
  private _fullName: string;
  private _role: string;
  private _status: string;
  private _administrativeScope: string;
  private _permissions: string[];
  private _gnDivisionId: string;
  private _mustChangePassword: boolean;
  private _houseHolder: boolean;

  constructor(
    id = '',
    email = '',
    fullName = '',
    role = '',
    status = '',
    administrativeScope = '',
    permissions: string[] = [],
    gnDivisionId = '',
    mustChangePassword = false,
    houseHolder = false,
  ) {
    this._id = id;
    this._email = email;
    this._fullName = fullName;
    this._role = role;
    this._status = status;
    this._administrativeScope = administrativeScope;
    this._permissions = permissions;
    this._gnDivisionId = gnDivisionId;
    this._mustChangePassword = mustChangePassword;
    this._houseHolder = houseHolder;
  }

  static fromJson(json: Record<string, unknown>): AuthenticatedUser {
    return new AuthenticatedUser(
      (json['id'] as string) ?? '',
      (json['email'] as string) ?? '',
      (json['fullName'] as string) ?? '',
      (json['role'] as string) ?? '',
      (json['status'] as string) ?? '',
      (json['administrativeScope'] as string) ?? '',
      (json['permissions'] as string[]) ?? [],
      (json['gnDivisionId'] as string) ?? '',
      Boolean(json['mustChangePassword']),
      Boolean(json['houseHolder']),
    );
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get fullName(): string {
    return this._fullName || this._email;
  }

  get role(): string {
    return this._role;
  }

  get status(): string {
    return this._status;
  }

  get administrativeScope(): string {
    return this._administrativeScope;
  }

  get permissions(): string[] {
    return this._permissions;
  }

  get gnDivisionId(): string {
    return this._gnDivisionId;
  }

  get mustChangePassword(): boolean {
    return this._mustChangePassword;
  }

  get houseHolder(): boolean {
    return this._houseHolder;
  }

  get initials(): string {
    const parts = this.fullName.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) {
      return '';
    }
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (parts[0][0] + last).toUpperCase();
  }
}
