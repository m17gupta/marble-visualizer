import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  MaterialSegmentModel,
  MaterialSegmentFilters
} from '@/models/materialSegment';
import { MaterialSegmentService } from '@/services/materialSegment/MaterialSegmentService';

export interface MaterialSegmentState {
  segments: MaterialSegmentModel[];
  detectedSegments: MaterialSegmentModel[]; // Added to store detected segments
  selectedMaterialSegment: MaterialSegmentModel | null; // Changed to allow null for no selection
  segmentLoading: boolean;
  error: string | null;
  filters: MaterialSegmentFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: MaterialSegmentState = {
  segments: [],
  detectedSegments: [],
  selectedMaterialSegment: null,
  segmentLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchMaterialSegments = createAsyncThunk(
  'materialSegments/fetchAll',
  async (filters: MaterialSegmentFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await MaterialSegmentService.getMaterialSegments();
      if (!response.status) {
        return rejectWithValue(response.error || 'Failed to fetch material segments');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);



const materialSegmentSlice = createSlice({
  name: 'materialSegments',
  initialState,
  reducers: {
    selectMaterialSegment: (state, action) => {

      state.selectedMaterialSegment = action.payload;

    },
    updateDetectedSegments: (state, action: PayloadAction<MaterialSegmentModel[]>) => {
      state.detectedSegments = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<MaterialSegmentFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setPagination: (state, action: PayloadAction<Partial<MaterialSegmentState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    updateSegmentLocally: (state, action: PayloadAction<{ id: number; updates: Partial<MaterialSegmentModel> }>) => {
      const { id, updates } = action.payload;
      const segmentIndex = state.segments.findIndex(segment => segment.id === id);
      if (segmentIndex !== -1) {
        state.segments[segmentIndex] = { ...state.segments[segmentIndex], ...updates };
      }
    },
    addSegmentToGallery: (state, action: PayloadAction<{ id: number; imageUrl: string }>) => {
      const { id, imageUrl } = action.payload;
      const segmentIndex = state.segments.findIndex(segment => segment.id === id);
      if (segmentIndex !== -1) {
        state.segments[segmentIndex].gallery = [...state.segments[segmentIndex].gallery, imageUrl];
      }
    },
    removeSegmentFromGallery: (state, action: PayloadAction<{ id: number; imageUrl: string }>) => {
      const { id, imageUrl } = action.payload;
      const segmentIndex = state.segments.findIndex(segment => segment.id === id);
      if (segmentIndex !== -1) {
        state.segments[segmentIndex].gallery = state.segments[segmentIndex].gallery.filter(
          url => url !== imageUrl
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all segments
      .addCase(fetchMaterialSegments.pending, (state) => {
        state.segmentLoading = true;
        state.error = null;
      })
      .addCase(fetchMaterialSegments.fulfilled, (state, action) => {
        state.segmentLoading = false;
        state.segments = action.payload || [];
        state.error = null;
      })
      .addCase(fetchMaterialSegments.rejected, (state, action) => {
        state.segmentLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : action.error.message || 'Failed to fetch material segments';
      })


  },
});

export const {
  selectMaterialSegment,
  clearError,
  setFilters,
  clearFilters,
  setPagination,
  updateSegmentLocally,
  addSegmentToGallery,
  removeSegmentFromGallery,
  updateDetectedSegments
} = materialSegmentSlice.actions;

export default materialSegmentSlice.reducer;
