import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { InspirationImageModel } from '@/models/inspirational/Inspirational';
import { InspirationalImageService, InspirationImageFilters } from '@/services/inspirational';

interface InspirationalImageState {
  Inspirational_images: InspirationImageModel[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  searchQuery: string;
  selectedImageId: number | null;
  selectedColorFamilyId: number | null;
  statusFilter: number;
  isLoading: boolean;
  error: string | null;
  imageCountByColorFamily: Record<number, number>;
}

const initialState: InspirationalImageState = {
  Inspirational_images: [],
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
    hasMore: false,
  },
  searchQuery: '',
  selectedImageId: null,
  selectedColorFamilyId: null,
  statusFilter: 1, // Default to active images
  isLoading: false,
  error: null,
  imageCountByColorFamily: {},
};

// Async thunk to fetch inspirational images
export const fetchInspirationalImages = createAsyncThunk(
  'inspirationalImages/fetchImages',
  async (filters: InspirationImageFilters = {}, { rejectWithValue }) => {
    try {
      const result = await InspirationalImageService.getInspirationImages(filters);

      if (result.success && result.data) {
        return {
          images: result.data,
          message: result.message,
        };
      } else {
        return rejectWithValue(result.error || 'Failed to fetch inspirational images');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

// Async thunk to fetch inspirational images with pagination
export const fetchInspirationalImagesPaginated = createAsyncThunk(
  'inspirationalImages/fetchImagesPaginated',
  async (
    params: { page?: number; pageSize?: number; filters?: Omit<InspirationImageFilters, 'limit' | 'offset'> },
    { rejectWithValue }
  ) => {
    try {
      const { page = 1, pageSize = 20, filters = {} } = params;
      
      const result = await InspirationalImageService.getInspirationImagesPaginated(
        page,
        pageSize,
        filters
      );

      if (result.success && result.data) {
        return {
          images: result.data.data,
          pagination: {
            page: result.data.currentPage,
            pageSize,
            total: result.data.count,
            totalPages: result.data.totalPages,
            hasMore: result.data.hasMore,
          },
          message: result.message,
        };
      } else {
        return rejectWithValue(result.error || 'Failed to fetch inspirational images');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);



const inspirationalImageSlice = createSlice({
  name: 'inspirationalImages',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedImageId: (state, action: PayloadAction<number | null>) => {
      state.selectedImageId = action.payload;
    },
    setSelectedColorFamilyId: (state, action: PayloadAction<number | null>) => {
      state.selectedColorFamilyId = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<number>) => {
      state.statusFilter = action.payload;
    },
    clearImages: (state) => {
      state.Inspirational_images = [];
      state.pagination = initialState.pagination;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch inspirational images
    builder
      .addCase(fetchInspirationalImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInspirationalImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Inspirational_images = action.payload.images;
        state.error = null;
      })
      .addCase(fetchInspirationalImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

  

   
  ;
  },
});

export const {
  setSearchQuery,
  setSelectedImageId,
  setSelectedColorFamilyId,
  setStatusFilter,
  clearImages,
  clearError,
  resetState,
} = inspirationalImageSlice.actions;

export default inspirationalImageSlice.reducer;
