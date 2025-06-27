export type ViewMode = 'grid' | 'list';
export type LayoutMode = 'compact' | 'detailed';
export type SortOption = 'name' | 'price_low' | 'price_high' | 'lrv_low' | 'lrv_high' | 'newest' | 'popular';

export interface SwatchFilters {
  search: string;
  category: string | null;
  brand: string | null;
  style: string | null;
  finish: string | null;
  coating_type: string | null;
  tags: string[];
  segment_types: string[];
  price_range: [number, number];
  lrv_range: [number, number];
}

export interface Pagination {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export interface SwatchItem {
  _id: string;
  [key: string]: unknown;
}
