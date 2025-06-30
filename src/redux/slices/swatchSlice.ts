import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface FilterSwatchModel{
  id:number;
  title:string;
}
export interface SwatchColor {
  hex: string;
  rgb: string;
  lrv: number; // Light Reflectance Value
}

export interface SwatchApplication {
  recommended_substrates: string[];
  coverage_sqft_per_gal: number;
}

export interface SwatchPricing {
  per_gallon: number;
  per_sqft: number;
}

export interface Swatch {
  _id: string;
  title: string;
  slug: string;
  image_url: string;
  description: string;
  category: string;
  brand: string;
  style: string;
  sku: string;
  color: SwatchColor;
  finish: string;
  coating_type: string;
  dry_time_touch: string;
  dry_time_recoat: string;
  application: SwatchApplication;
  pricing: SwatchPricing;
  container_sizes: string[];
  certifications: string[];
  tags: string[];
  segment_types: string[];
  created_by: string;
  is_favorite?: boolean;
  created_at: string;
  updated_at: string;
}

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

interface SwatchState {
  swatches: Swatch[];
  currentSwatch: Swatch | null;
  favorites: string[]; // swatch IDs
  filters: SwatchFilters;
  categories: FilterSwatchModel[];
  brands: FilterSwatchModel[];
  styles: FilterSwatchModel[];
  finishes: FilterSwatchModel[];
  coating_types: FilterSwatchModel[];
  all_tags: FilterSwatchModel[];
  all_segment_types: FilterSwatchModel[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isImporting: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: SwatchState = {
  swatches: [],
  currentSwatch: null,
  favorites: JSON.parse(localStorage.getItem('swatch_favorites') || '[]'),
  filters: {
    search: '',
    category: null,
    brand: null,
    style: null,
    finish: null,
    coating_type: null,
    tags: [],
    segment_types: [],
    price_range: [0, 200],
    lrv_range: [0, 100],
  },
  categories: [],
  brands: [],
  styles: [],
  finishes: [],
  coating_types: [],
  all_tags: [],
  all_segment_types: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isImporting: false,
  error: null,
  pagination: {
    page: 1,
    limit: 24,
    total: 0,
    totalPages: 0,
  },
};






const swatchSlice = createSlice({
  name: 'swatches',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<SwatchFilters>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },  
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    updateFilterCategory: (state, action: PayloadAction<FilterSwatchModel>) => {
      // Check if the category already exists
      const existingCategoryIndex = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (existingCategoryIndex === -1) {
        state.categories = [ action.payload];
      }
    },

    updateFilterBrand:(state, action: PayloadAction<FilterSwatchModel>) => {
      // Check if the brand already exists
      const existingBrandIndex = state.brands.findIndex(brand => brand.id === action.payload.id);
      if (existingBrandIndex === -1) {
        state.brands = [action.payload];
      }
    },
    updateFilterStyle:(state, action: PayloadAction<FilterSwatchModel>) => {
      // Check if the style already exists
      const existingStyleIndex = state.styles.findIndex(style => style.id === action.payload.id);
      if (existingStyleIndex === -1) {
        state.styles = [action.payload];
      }
    },
    setCurrentSwatch: (state, action: PayloadAction<Swatch | null>) => {
      state.currentSwatch = action.payload;
    },
    clearCurrentSwatch: (state) => {
      state.currentSwatch = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSwatchFilter:()=>{
      return initialState
    }
  },

});

export const {
  setFilters,
  clearFilters,
  setCurrentSwatch,
  clearCurrentSwatch,
  setPage,
  clearError,
  updateFilterCategory,
  updateFilterBrand,
  updateFilterStyle,
  resetSwatchFilter
} = swatchSlice.actions;

export default swatchSlice.reducer;