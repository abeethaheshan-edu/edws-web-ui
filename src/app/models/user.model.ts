export class UserModel {
  private _id: string;
  private _fullName: string;
  private _email: string;
  private _telephone: string;
  private _role: string;
  private _department: string;
  private _active: boolean;

  constructor(
    id = '',
    fullName = '',
    email = '',
    telephone = '',
    role = '',
    department = '',
    active = true,
  ) {
    this._id = id;
    this._fullName = fullName;
    this._email = email;
    this._telephone = telephone;
    this._role = role;
    this._department = department;
    this._active = active;
  }

  static fromJson(json: Record<string, unknown>): UserModel {
    return new UserModel(
      (json['id'] as string) ?? '',
      (json['fullName'] as string) ?? '',
      (json['email'] as string) ?? '',
      (json['telephone'] as string) ?? '',
      (json['role'] as string) ?? '',
      (json['department'] as string) ?? '',
      Boolean(json['active'] ?? true),
    );
  }

  static fromJsonList(list: Record<string, unknown>[]): UserModel[] {
    return (list ?? []).map((item) => UserModel.fromJson(item));
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get fullName(): string {
    return this._fullName;
  }

  set fullName(value: string) {
    this._fullName = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get telephone(): string {
    return this._telephone;
  }

  set telephone(value: string) {
    this._telephone = value;
  }

  get role(): string {
    return this._role;
  }

  set role(value: string) {
    this._role = value;
  }

  get department(): string {
    return this._department;
  }

  set department(value: string) {
    this._department = value;
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }

  get initials(): string {
    const parts = this._fullName.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) {
      return '';
    }
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (parts[0][0] + last).toUpperCase();
  }

  toJson(): Record<string, unknown> {
    return {
      id: this._id,
      fullName: this._fullName,
      email: this._email,
      telephone: this._telephone,
      role: this._role,
      department: this._department,
      active: this._active,
    };
  }
}
