import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { InspirationColorModel } from '@/models/inspirational/Inspirational';
import { InspirationalColorService, InspirationColorFilters } from '@/services/inspirational';

interface InspirationalColorState {
  inspirational_colors: InspirationColorModel[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  searchQuery: string;
  selectedColorId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: InspirationalColorState = {
  inspirational_colors: [],
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
    hasMore: false,
  },
  searchQuery: '',
  selectedColorId: null,
  isLoading: false,
  error: null,
};

// Async thunk to fetch inspirational colors
export const fetchInspirationalColors = createAsyncThunk(
  'inspirationalColors/fetchColors',
  async (filters: InspirationColorFilters = {}, { rejectWithValue }) => {
    try {
      const result = await InspirationalColorService.getInspirationColors(filters);

      if (result.success && result.data) {
        return {
          colors: result.data,
          message: result.message,
        };
      } else {
        return rejectWithValue(result.error || 'Failed to fetch inspirational colors');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);



const inspirationalColorSlice = createSlice({
  name: 'inspirationalColors',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedColorId: (state, action: PayloadAction<string | null>) => {
      state.selectedColorId = action.payload;
    },
    clearColors: (state) => {
      state.inspirational_colors = [];
      state.pagination = initialState.pagination;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch inspirational colors
    builder
      .addCase(fetchInspirationalColors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInspirationalColors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inspirational_colors = action.payload.colors;
        state.error = null;
      })
      .addCase(fetchInspirationalColors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    
  
  },
});

export const {
  setSearchQuery,
  setSelectedColorId,
  clearColors,
  clearError,
  resetState,
} = inspirationalColorSlice.actions;

export default inspirationalColorSlice.reducer;
