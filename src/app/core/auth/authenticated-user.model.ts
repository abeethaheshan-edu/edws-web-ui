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
  private _gnDivisionName: string;
  private _districtName: string;
  private _provinceName: string;

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
    gnDivisionName = '',
    districtName = '',
    provinceName = '',
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
    this._gnDivisionName = gnDivisionName;
    this._districtName = districtName;
    this._provinceName = provinceName;
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
      (json['gnDivisionName'] as string) ?? '',
      (json['districtName'] as string) ?? '',
      (json['provinceName'] as string) ?? '',
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

  get gnDivisionName(): string {
    return this._gnDivisionName;
  }

  get districtName(): string {
    return this._districtName;
  }

  get provinceName(): string {
    return this._provinceName;
  }

  toJson(): Record<string, unknown> {
    return {
      id: this._id,
      email: this._email,
      fullName: this._fullName,
      role: this._role,
      status: this._status,
      administrativeScope: this._administrativeScope,
      permissions: this._permissions,
      gnDivisionId: this._gnDivisionId,
      mustChangePassword: this._mustChangePassword,
      houseHolder: this._houseHolder,
      gnDivisionName: this._gnDivisionName,
      districtName: this._districtName,
      provinceName: this._provinceName,
    };
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
