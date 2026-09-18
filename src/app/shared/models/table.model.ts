export type TableAlign = 'start' | 'center' | 'end';

export interface TableColumn {
  key: string;
  header: string;

  width?: string;
  align?: TableAlign;
}

export interface PageState {

  page: number;
  pageSize: number;
  totalItems: number;
}

export const DEFAULT_PAGE_SIZE = 7;
