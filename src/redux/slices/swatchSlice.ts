import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface FilterSwatchModel {
  id: number;
  title: string;
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
  favorites: JSON.parse(localStorage.getItem("swatch_favorites") || "[]"),
  filters: {
    search: "",
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

// Async thunks
export const fetchSwatchBySlug = createAsyncThunk(
  "swatches/fetchBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/swatches/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch swatch");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  "swatches/toggleFavorite",
  async (swatchId: string, { getState, rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const state = getState() as { swatches: SwatchState };
      const isFavorite = state.swatches.favorites.includes(swatchId);

      const response = await fetch(`/api/swatches/${swatchId}/favorite`, {
        method: isFavorite ? "DELETE" : "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle favorite");
      }

      return { swatchId, isFavorite: !isFavorite };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// export const toggleFavoriteinLocal = createAsyncThunk(
//   "swatches/toggleFavorite",
//   async (swatchId: number, { getState, rejectWithValue }) => {
//     try {
//       // TODO: Replace with actual API call
//       const getAllFavorite = JSON.parse(localStorage.getItem("fav_swatch")!);
//       getAllFavorite.push(swatchId)
//       const addInFavorite = JSON.stringify(localStorage.setItem("fav_swatch", getAllFavorite))
//       return "Swatch ID added"
//     } catch (error) {
//       return rejectWithValue(
//         error instanceof Error ? error.message : "Unknown error"
//       );
//     }
//   }
// );

export const createSwatch = createAsyncThunk(
  "swatches/create",
  async (
    swatchData: Omit<Swatch, "_id" | "created_at" | "updated_at">,
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/swatches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(swatchData),
      });

      if (!response.ok) {
        throw new Error("Failed to create swatch");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const swatchSlice = createSlice({
  name: "swatches",
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
      const existingCategoryIndex = state.categories.findIndex(
        (cat) => cat.id === action.payload.id
      );
      if (existingCategoryIndex === -1) {
        state.categories = [action.payload];
      }
    },

    updateFilterBrand: (state, action: PayloadAction<FilterSwatchModel>) => {
      // Check if the brand already exists
      const existingBrandIndex = state.brands.findIndex(
        (brand) => brand.id === action.payload.id
      );
      if (existingBrandIndex === -1) {
        state.brands = [action.payload];
      }
    },
    updateFilterStyle: (state, action: PayloadAction<FilterSwatchModel>) => {
      // Check if the style already exists
      const existingStyleIndex = state.styles.findIndex(
        (style) => style.id === action.payload.id
      );
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
    resetSwatchFilter: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSwatchBySlug
      .addCase(fetchSwatchBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSwatchBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSwatch = action.payload;
      })
      .addCase(fetchSwatchBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // toggleFavorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { swatchId, isFavorite } = action.payload;
        if (isFavorite) {
          state.favorites.push(swatchId);
        } else {
          state.favorites = state.favorites.filter((id) => id !== swatchId);
        }
        localStorage.setItem(
          "swatch_favorites",
          JSON.stringify(state.favorites)
        );
      })
      // createSwatch
      .addCase(createSwatch.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createSwatch.fulfilled, (state, action) => {
        state.isCreating = false;
        state.swatches.unshift(action.payload);
      })
      .addCase(createSwatch.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });
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
  resetSwatchFilter,
} = swatchSlice.actions;

export default swatchSlice.reducer;
