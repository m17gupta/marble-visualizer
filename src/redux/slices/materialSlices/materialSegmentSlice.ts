import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  MaterialSegmentModel, 
  CreateMaterialSegmentRequest, 
  UpdateMaterialSegmentRequest,
  MaterialSegmentFilters 
} from '@/models/materialSegment';
import { MaterialSegmentService } from '@/services/materialSegment/MaterialSegmentService';

export interface MaterialSegmentState {
  segments: MaterialSegmentModel[];
  selectedSegmentId: number | null;
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
  selectedSegmentId: null,
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
      const response = await MaterialSegmentService.getMaterialSegments(filters);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch material segments');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchMaterialSegmentById = createAsyncThunk(
  'materialSegments/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await MaterialSegmentService.getMaterialSegmentById(id);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch material segment');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const createMaterialSegment = createAsyncThunk(
  'materialSegments/create',
  async (segmentData: CreateMaterialSegmentRequest, { rejectWithValue }) => {
    try {
      const response = await MaterialSegmentService.createMaterialSegment(segmentData);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to create material segment');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateMaterialSegment = createAsyncThunk(
  'materialSegments/update',
  async (segmentData: UpdateMaterialSegmentRequest, { rejectWithValue }) => {
    try {
      const response = await MaterialSegmentService.updateMaterialSegment(segmentData);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to update material segment');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteMaterialSegment = createAsyncThunk(
  'materialSegments/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await MaterialSegmentService.deleteMaterialSegment(id);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to delete material segment');
      }
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const duplicateMaterialSegment = createAsyncThunk(
  'materialSegments/duplicate',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await MaterialSegmentService.duplicateMaterialSegment(id);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to duplicate material segment');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const toggleSegmentVisibility = createAsyncThunk(
  'materialSegments/toggleVisibility',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await MaterialSegmentService.toggleMaterialSegmentVisibility(id);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to toggle segment visibility');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const reorderSegments = createAsyncThunk(
  'materialSegments/reorder',
  async (segmentIds: number[], { rejectWithValue }) => {
    try {
      const response = await MaterialSegmentService.reorderMaterialSegments(segmentIds);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to reorder segments');
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
    selectSegment: (state, action: PayloadAction<number | null>) => {
      state.selectedSegmentId = action.payload;
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
        if (action.payload) {
          if ('segments' in action.payload && 'pagination' in action.payload) {
            // Response has pagination structure
            state.segments = action.payload.segments;
            state.pagination = action.payload.pagination;
          } else if (Array.isArray(action.payload)) {
            // Response is a direct array
            state.segments = action.payload;
          }
        }
        state.error = null;
      })
      .addCase(fetchMaterialSegments.rejected, (state, action) => {
        state.segmentLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : action.error.message || 'Failed to fetch material segments';
      })
      
      // Fetch single segment
      .addCase(fetchMaterialSegmentById.pending, (state) => {
        state.segmentLoading = true;
        state.error = null;
      })
      .addCase(fetchMaterialSegmentById.fulfilled, (state, action) => {
        state.segmentLoading = false;
        if (action.payload) {
          const segmentIndex = state.segments.findIndex(segment => segment.id === action.payload!.id);
          if (segmentIndex !== -1) {
            state.segments[segmentIndex] = action.payload;
          } else {
            state.segments.push(action.payload);
          }
        }
        state.error = null;
      })
      .addCase(fetchMaterialSegmentById.rejected, (state, action) => {
        state.segmentLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : action.error.message || 'Failed to fetch material segment';
      })
      
      // Create segment
      .addCase(createMaterialSegment.pending, (state) => {
        state.segmentLoading = true;
        state.error = null;
      })
      .addCase(createMaterialSegment.fulfilled, (state, action) => {
        state.segmentLoading = false;
        if (action.payload) {
          state.segments.push(action.payload);
        }
        state.error = null;
      })
      .addCase(createMaterialSegment.rejected, (state, action) => {
        state.segmentLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : action.error.message || 'Failed to create material segment';
      })
      
      // Update segment
      .addCase(updateMaterialSegment.pending, (state) => {
        state.segmentLoading = true;
        state.error = null;
      })
      .addCase(updateMaterialSegment.fulfilled, (state, action) => {
        state.segmentLoading = false;
        if (action.payload) {
          const segmentIndex = state.segments.findIndex(segment => segment.id === action.payload!.id);
          if (segmentIndex !== -1) {
            state.segments[segmentIndex] = action.payload;
          }
        }
        state.error = null;
      })
      .addCase(updateMaterialSegment.rejected, (state, action) => {
        state.segmentLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : action.error.message || 'Failed to update material segment';
      })
      
      // Delete segment
      .addCase(deleteMaterialSegment.pending, (state) => {
        state.segmentLoading = true;
        state.error = null;
      })
      .addCase(deleteMaterialSegment.fulfilled, (state, action) => {
        state.segmentLoading = false;
        state.segments = state.segments.filter(segment => segment.id !== action.payload);
        if (state.selectedSegmentId === action.payload) {
          state.selectedSegmentId = null;
        }
        state.error = null;
      })
      .addCase(deleteMaterialSegment.rejected, (state, action) => {
        state.segmentLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : action.error.message || 'Failed to delete material segment';
      })
      
      // Duplicate segment
      .addCase(duplicateMaterialSegment.pending, (state) => {
        state.segmentLoading = true;
        state.error = null;
      })
      .addCase(duplicateMaterialSegment.fulfilled, (state, action) => {
        state.segmentLoading = false;
        if (action.payload) {
          state.segments.push(action.payload);
        }
        state.error = null;
      })
      .addCase(duplicateMaterialSegment.rejected, (state, action) => {
        state.segmentLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : action.error.message || 'Failed to duplicate material segment';
      })
      
      // Toggle visibility
      .addCase(toggleSegmentVisibility.fulfilled, (state, action) => {
        if (action.payload) {
          const segmentIndex = state.segments.findIndex(segment => segment.id === action.payload!.id);
          if (segmentIndex !== -1) {
            state.segments[segmentIndex] = action.payload;
          }
        }
      })
      
      .addCase(reorderSegments.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
          state.segments = action.payload;
        }
      });
  },
});

export const {
  selectSegment,
  clearError,
  setFilters,
  clearFilters,
  setPagination,
  updateSegmentLocally,
  addSegmentToGallery,
  removeSegmentFromGallery,
} = materialSegmentSlice.actions;

export default materialSegmentSlice.reducer;
