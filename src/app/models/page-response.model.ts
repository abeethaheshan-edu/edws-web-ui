export class PageResponse<T> {
  private _items: T[];
  private _page: number;
  private _pageSize: number;
  private _totalItems: number;

  constructor(items: T[] = [], page = 1, pageSize = 0, totalItems = 0) {
    this._items = items;
    this._page = page;
    this._pageSize = pageSize;
    this._totalItems = totalItems;
  }

  static fromJson<T>(json: Record<string, unknown>, mapItem: (item: Record<string, unknown>) => T): PageResponse<T> {
    const content = (json['content'] ?? json['items'] ?? []) as Record<string, unknown>[];

    return new PageResponse<T>(
      content.map(mapItem),
      Number(json['page'] ?? 1),
      Number(json['pageSize'] ?? content.length),
      Number(json['totalItems'] ?? content.length),
    );
  }

  get items(): T[] {
    return this._items;
  }

  set items(value: T[]) {
    this._items = value;
  }

  get page(): number {
    return this._page;
  }

  set page(value: number) {
    this._page = value;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(value: number) {
    this._pageSize = value;
  }

  get totalItems(): number {
    return this._totalItems;
  }

  set totalItems(value: number) {
    this._totalItems = value;
  }

  get totalPages(): number {
    return this._pageSize ? Math.ceil(this._totalItems / this._pageSize) : 1;
  }

  get isEmpty(): boolean {
    return this._items.length === 0;
  }
}
