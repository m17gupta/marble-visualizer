import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { StyleModel } from '@/models/swatchBook/styleModel/StyleModel';
import { StyleService } from '@/services/material/styleService/StyleService';

// Style State Interface
interface StyleState {
  styles: StyleModel[];
  currentStyle: StyleModel | null;
  activeStyles: StyleModel[]; // Only status: true styles
  stylesByBrand: { [brandId: number]: StyleModel[] };
  
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search: string;
    material_brand_id: number | null;
    status: boolean | null;
    sort_by: 'title' | 'sort_order' | 'created_at';
    sort_order: 'asc' | 'desc';
  };
}

// Initial State
const initialState: StyleState = {
  styles: [],
  currentStyle: null,
  activeStyles: [],
  stylesByBrand: {},
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    material_brand_id: null,
    status: null,
    sort_by: 'sort_order',
    sort_order: 'asc',
  },
};

// Async Thunks

/**
 * Fetch all styles with optional filtering and pagination
 */
export const fetchStyles = createAsyncThunk(
  'styles/fetchStyles',
  async (_, { rejectWithValue }) => {
    try {
      const result = await StyleService.getAllStyles();

      if (result.success && result.data) {
        return {
          styles: result.data,
        };
      }

      throw new Error(result.error || 'Failed to fetch styles');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch styles');
    }
  }
);



// Style Slice
const StyleSlice = createSlice({
  name: 'styles',
  initialState,
  reducers: {
    // Clear current style
    clearCurrentStyle: (state) => {
      state.currentStyle = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Update filters
    updateFilters: (state, action: PayloadAction<Partial<StyleState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Update pagination
    updatePagination: (state, action: PayloadAction<Partial<StyleState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Set current style
    setCurrentStyle: (state, action: PayloadAction<StyleModel | null>) => {
      state.currentStyle = action.payload;
    },

    // Optimistic update for style creation
    addStyleOptimistic: (state, action: PayloadAction<StyleModel>) => {
      state.styles.unshift(action.payload);
      if (action.payload.status) {
        state.activeStyles.unshift(action.payload);
      }
    },

  
  },
  extraReducers: (builder) => {
    // Fetch Styles
    builder
      .addCase(fetchStyles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStyles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.styles = action.payload.styles;
        state.error = null;
      })
      .addCase(fetchStyles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },

});

// Export actions
export const {
  clearCurrentStyle,
  clearError,
  updateFilters,
  resetFilters,
  updatePagination,
  setCurrentStyle,
  addStyleOptimistic,
} = StyleSlice.actions;

// Selectors
export const selectStyleState = (state: { styles: StyleState }) => state.styles;
export const selectAllStyles = (state: { styles: StyleState }) => state.styles.styles;
export const selectActiveStyles = (state: { styles: StyleState }) => state.styles.activeStyles;
export const selectCurrentStyle = (state: { styles: StyleState }) => state.styles.currentStyle;
export const selectStylesByBrand = (brandId: number) => (state: { styles: StyleState }) => 
  state.styles.stylesByBrand[brandId] || [];
export const selectStyleIsLoading = (state: { styles: StyleState }) => state.styles.isLoading;
export const selectStyleIsCreating = (state: { styles: StyleState }) => state.styles.isCreating;
export const selectStyleIsUpdating = (state: { styles: StyleState }) => state.styles.isUpdating;
export const selectStyleIsDeleting = (state: { styles: StyleState }) => state.styles.isDeleting;
export const selectStyleError = (state: { styles: StyleState }) => state.styles.error;
export const selectStylePagination = (state: { styles: StyleState }) => state.styles.pagination;
export const selectStyleFilters = (state: { styles: StyleState }) => state.styles.filters;

// Complex selectors
export const selectStyleById = (id: number) => (state: { styles: StyleState }) =>
  state.styles.styles.find(style => style.id === id);

export const selectStylesByStatus = (status: boolean) => (state: { styles: StyleState }) =>
  state.styles.styles.filter(style => style.status === status);

// Export reducer
export default StyleSlice.reducer;
