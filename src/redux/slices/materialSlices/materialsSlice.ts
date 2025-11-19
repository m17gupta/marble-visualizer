import { MaterialModel } from '@/models/swatchBook/material/MaterialModel';
import { MaterialFilters, MaterialService } from '@/services/material/materialService/MaterialService';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';



interface MaterialsState {
  materials: MaterialModel[];
  isMaterialsLoading:boolean,
  wallMaterials: MaterialModel[];
  doorMaterials: MaterialModel[];
  roofMaterials: MaterialModel[];
  windowMaterials: MaterialModel[];
  trimMaterials: MaterialModel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  categories: string[];
  selectedCategory: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: MaterialsState = {
  materials: [],
  isMaterialsLoading:false,
  wallMaterials: [],
  doorMaterials: [],  
  roofMaterials: [],
  windowMaterials: [],
  trimMaterials: [],  
  pagination: {
    page: 0,
    limit: 0,
    total: 0,
    totalPages: 0,
  },
  categories: [],
  selectedCategory: null,
  searchQuery: '',
  isLoading: false,
  error: null,
};


// Function to reset pagination
// Async thunk to fetch materials
export const fetchMaterials = createAsyncThunk(
  'materials/fetchMaterials',
  async (filters: MaterialFilters = {}, { rejectWithValue }) => {
    try {
      const result = await MaterialService.getMaterials(filters);

      if (result.success && result.data) {
        return {
          materials: result.data.materials,
          pagination: result.data.pagination,
        };
      } else {
        return rejectWithValue(result.error || 'Failed to fetch materials');
      }
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || 'Failed to fetch materials');
    }
  }
);

// Async thunk to search materials
export const searchMaterials = createAsyncThunk(
  'materials/searchMaterials',
  async ({ query, category }: { query: string; category?: string }, { rejectWithValue }) => {
    try {
      const filters: { material_category_id?: number } = {};
      if (category) {
        // Convert category string to material_category_id if needed
        // For now, we'll skip the category filter since we need the proper ID
      }
      const result = await MaterialService.searchMaterials(query, filters);

      if (result.success && result.data) {
        return {
          materials: result.data.materials,
          pagination: result.data.pagination,
        };
      } else {
        return rejectWithValue(result.error || 'Failed to search materials');
      }
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || 'Failed to search materials');
    }
  }
);

// fetch wall meterials
export const fetchWallMaterials = createAsyncThunk(
  'materials/fetchWallMaterials',
  async (filters: MaterialFilters , { rejectWithValue }) => {
    try {
      const result = await MaterialService.getWallMaterials(filters);

      if (result.success && result.data) {
        return {
          materials: result.data,
  
        };
      } else {
        return rejectWithValue(result.error || 'Failed to fetch wall materials');
      }
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || 'Failed to fetch wall materials');
    }
  }
);


// fetch door materials
export const fetchDoorMaterials = createAsyncThunk(
  'materials/fetchDoorMaterials',
  async (filters: MaterialFilters , { rejectWithValue }) => {
    try {
      const result = await MaterialService.getDoorMaterials(filters);

      if (result.success && result.data) {
        return {
          materials: result.data,
  
        };
      } else {
        return rejectWithValue(result.error || 'Failed to fetch door materials');
      }
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || 'Failed to fetch door materials');
    }
  }
);

// fetch roof materials
export const fetchRoofMaterials = createAsyncThunk(
  'materials/fetchRoofMaterials',
  async (filters: MaterialFilters , { rejectWithValue }) => {
    try {
      const result = await MaterialService.getRoofMaterials(filters);

      if (result.success && result.data) {
        return {
          materials: result.data,
  
        };
      } else {
        return rejectWithValue(result.error || 'Failed to fetch roof materials');
      }
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || 'Failed to fetch roof materials');
    }
  }
);

// fetch window materials
export const fetchWindowMaterials = createAsyncThunk(
  'materials/fetchWindowMaterials', 
  async (filters: MaterialFilters , { rejectWithValue }) => {
    try {
      const result = await MaterialService.getWindowMaterials(filters);

      if (result.success && result.data) {
        return {
          materials: result.data,
  
        };
      } else {
        return rejectWithValue(result.error || 'Failed to fetch window materials');
      }
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || 'Failed to fetch window materials');
    }
  }
);

// feetch trim materials
export const fetchTrimMaterials = createAsyncThunk(
  'materials/fetchTrimMaterials',
  async (filters: MaterialFilters , { rejectWithValue }) => {
    try {
      const result = await MaterialService.getTrimMaterials(filters);

      if (result.success && result.data) {
        return {
          materials: result.data,

        };
      } else {
        return rejectWithValue(result.error || 'Failed to fetch trim materials');
      }
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || 'Failed to fetch trim materials');
    }
  }
);

const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.selectedCategory = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    addMaterialPagination: (state, action) => {
      state.pagination.page += action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch materials
      .addCase(fetchMaterials.pending, (state) => {
        state.isMaterialsLoading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        // state.isLoading = false;
        const { materials, pagination } = action.payload;
        state.materials = materials;
        state.pagination = pagination || {
          page: 0,
          limit: 0,
          total: 0,
          totalPages: 0,
        };
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.isMaterialsLoading = false;
        state.error = action.payload as string;
      })

      // Search materials
      .addCase(searchMaterials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        const { materials, pagination } = action.payload;
        state.materials = materials;
        state.pagination = pagination || {
          page: 0,
          limit: 0,
          total: 0,
          totalPages: 0,
        };
      })
      .addCase(searchMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

      // Fetch wall materials
      builder.addCase(fetchWallMaterials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWallMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        const { materials } = action.payload;
        state.wallMaterials = materials;
       
      })
      .addCase(fetchWallMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

      // Fetch door materials
      builder.addCase(fetchDoorMaterials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDoorMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        const { materials } = action.payload;
        state.doorMaterials = materials;
      })
      .addCase(fetchDoorMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

      // Fetch roof materials
      builder.addCase(fetchRoofMaterials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRoofMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        const { materials } = action.payload;
        state.roofMaterials = materials;
      })
      .addCase(fetchRoofMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

      // Fetch window materials
      builder.addCase(fetchWindowMaterials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWindowMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        const { materials } = action.payload;
        state.windowMaterials = materials;
      })
      .addCase(fetchWindowMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

      // Fetch trim materials
      builder.addCase(fetchTrimMaterials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTrimMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        const { materials } = action.payload;
        state.trimMaterials = materials;
      })
      .addCase(fetchTrimMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  clearSearch,
  clearError,
  addMaterialPagination
} = materialsSlice.actions;

export default materialsSlice.reducer;