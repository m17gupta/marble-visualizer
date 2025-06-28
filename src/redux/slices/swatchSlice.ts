import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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
  categories: string[];
  brands: string[];
  styles: string[];
  finishes: string[];
  coating_types: string[];
  all_tags: string[];
  all_segment_types: string[];
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

// Mock data for development
const mockSwatches: Swatch[] = [
  {
    _id: '1',
    title: 'Arctic White',
    slug: 'arctic-white',
    image_url: 'https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    description: 'A crisp, clean white with subtle cool undertones perfect for modern interiors',
    category: 'Interior',
    brand: 'Premium Paints',
    style: 'Modern',
    sku: 'PP-AW-001',
    color: {
      hex: '#F8F9FA',
      rgb: 'rgb(248, 249, 250)',
      lrv: 92,
    },
    finish: 'Eggshell',
    coating_type: 'Latex',
    dry_time_touch: '2 hours',
    dry_time_recoat: '4 hours',
    application: {
      recommended_substrates: ['Drywall', 'Plaster', 'Wood'],
      coverage_sqft_per_gal: 400,
    },
    pricing: {
      per_gallon: 65.99,
      per_sqft: 0.16,
    },
    container_sizes: ['1 Quart', '1 Gallon', '5 Gallon'],
    certifications: ['Low VOC', 'GREENGUARD Gold'],
    tags: ['neutral', 'bright', 'clean'],
    segment_types: ['walls', 'ceiling', 'trim'],
    created_by: 'admin',
    is_favorite: false,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    _id: '2',
    title: 'Ocean Depth',
    slug: 'ocean-depth',
    image_url: 'https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    description: 'Deep navy blue inspired by ocean depths, perfect for accent walls',
    category: 'Interior',
    brand: 'Coastal Colors',
    style: 'Traditional',
    sku: 'CC-OD-002',
    color: {
      hex: '#1E3A8A',
      rgb: 'rgb(30, 58, 138)',
      lrv: 8,
    },
    finish: 'Satin',
    coating_type: 'Latex',
    dry_time_touch: '1 hour',
    dry_time_recoat: '3 hours',
    application: {
      recommended_substrates: ['Drywall', 'Wood', 'Metal'],
      coverage_sqft_per_gal: 350,
    },
    pricing: {
      per_gallon: 72.99,
      per_sqft: 0.21,
    },
    container_sizes: ['1 Quart', '1 Gallon'],
    certifications: ['Low VOC'],
    tags: ['bold', 'dramatic', 'nautical'],
    segment_types: ['walls', 'doors'],
    created_by: 'vendor_1',
    is_favorite: true,
    created_at: '2024-01-14T09:15:00Z',
    updated_at: '2024-01-14T09:15:00Z',
  },
  {
    _id: '3',
    title: 'Sunset Terracotta',
    slug: 'sunset-terracotta',
    image_url: 'https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    description: 'Warm terracotta with sunset hues, bringing earthiness to any space',
    category: 'Exterior',
    brand: 'Earth Tones',
    style: 'Mediterranean',
    sku: 'ET-ST-003',
    color: {
      hex: '#CD853F',
      rgb: 'rgb(205, 133, 63)',
      lrv: 35,
    },
    finish: 'Flat',
    coating_type: 'Acrylic',
    dry_time_touch: '30 minutes',
    dry_time_recoat: '2 hours',
    application: {
      recommended_substrates: ['Stucco', 'Concrete', 'Masonry'],
      coverage_sqft_per_gal: 300,
    },
    pricing: {
      per_gallon: 89.99,
      per_sqft: 0.30,
    },
    container_sizes: ['1 Gallon', '5 Gallon'],
    certifications: ['Weather Resistant', 'Fade Resistant'],
    tags: ['warm', 'earthy', 'rustic'],
    segment_types: ['walls', 'siding'],
    created_by: 'vendor_2',
    is_favorite: false,
    created_at: '2024-01-13T14:20:00Z',
    updated_at: '2024-01-13T14:20:00Z',
  },
  {
    _id: '4',
    title: 'Forest Canopy',
    slug: 'forest-canopy',
    image_url: 'https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    description: 'Rich forest green that brings nature indoors with sophisticated depth',
    category: 'Interior',
    brand: 'Nature\'s Palette',
    style: 'Contemporary',
    sku: 'NP-FC-004',
    color: {
      hex: '#355E3B',
      rgb: 'rgb(53, 94, 59)',
      lrv: 12,
    },
    finish: 'Semi-Gloss',
    coating_type: 'Latex',
    dry_time_touch: '1.5 hours',
    dry_time_recoat: '4 hours',
    application: {
      recommended_substrates: ['Drywall', 'Wood', 'Trim'],
      coverage_sqft_per_gal: 380,
    },
    pricing: {
      per_gallon: 78.99,
      per_sqft: 0.21,
    },
    container_sizes: ['1 Quart', '1 Gallon', '5 Gallon'],
    certifications: ['Low VOC', 'Antimicrobial'],
    tags: ['natural', 'calming', 'sophisticated'],
    segment_types: ['walls', 'cabinets', 'trim'],
    created_by: 'admin',
    is_favorite: true,
    created_at: '2024-01-12T11:45:00Z',
    updated_at: '2024-01-12T11:45:00Z',
  },
];

// Async thunks
export const fetchSwatches = createAsyncThunk(
  'swatches/fetchSwatches',
  async (params: { page?: number; filters?: Partial<SwatchFilters> } = {}, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      let filtered = [...mockSwatches];
      const { filters } = params;

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(swatch =>
          swatch.title.toLowerCase().includes(search) ||
          swatch.description.toLowerCase().includes(search) ||
          swatch.brand.toLowerCase().includes(search) ||
          swatch.tags.some(tag => tag.toLowerCase().includes(search))
        );
      }

      if (filters?.category) {
        filtered = filtered.filter(swatch => swatch.category === filters.category);
      }

      if (filters?.brand) {
        filtered = filtered.filter(swatch => swatch.brand === filters.brand);
      }

      if (filters?.style) {
        filtered = filtered.filter(swatch => swatch.style === filters.style);
      }

      if (filters?.finish) {
        filtered = filtered.filter(swatch => swatch.finish === filters.finish);
      }

      if (filters?.coating_type) {
        filtered = filtered.filter(swatch => swatch.coating_type === filters.coating_type);
      }

      if (filters?.tags && filters.tags.length > 0) {
        filtered = filtered.filter(swatch =>
          filters.tags!.some(tag => swatch.tags.includes(tag))
        );
      }

      if (filters?.segment_types && filters.segment_types.length > 0) {
        filtered = filtered.filter(swatch =>
          filters.segment_types!.some(type => swatch.segment_types.includes(type))
        );
      }

      const page = params.page || 1;
      const limit = 24;
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedSwatches = filtered.slice(startIndex, endIndex);

      return {
        swatches: paginatedSwatches,
        pagination: { page, limit, total, totalPages },
        metadata: {
          categories: [...new Set(mockSwatches.map(s => s.category))],
          brands: [...new Set(mockSwatches.map(s => s.brand))],
          styles: [...new Set(mockSwatches.map(s => s.style))],
          finishes: [...new Set(mockSwatches.map(s => s.finish))],
          coating_types: [...new Set(mockSwatches.map(s => s.coating_type))],
          all_tags: [...new Set(mockSwatches.flatMap(s => s.tags))],
          all_segment_types: [...new Set(mockSwatches.flatMap(s => s.segment_types))],
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch swatches');
    }
  }
);

export const fetchSwatchBySlug = createAsyncThunk(
  'swatches/fetchSwatchBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const swatch = mockSwatches.find(s => s.slug === slug);
      if (!swatch) {
        throw new Error('Swatch not found');
      }

      return swatch;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch swatch');
    }
  }
);

export const createSwatch = createAsyncThunk(
  'swatches/createSwatch',
  async (swatchData: Omit<Swatch, '_id' | 'slug' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newSwatch: Swatch = {
        ...swatchData,
        _id: Date.now().toString(),
        slug: swatchData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return newSwatch;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create swatch');
    }
  }
);

export const bulkImportSwatches = createAsyncThunk(
  'swatches/bulkImportSwatches',
  async (swatchesData: Omit<Swatch, '_id' | 'slug' | 'created_at' | 'updated_at'>[], { rejectWithValue }) => {
    try {
      // Simulate API call with progress
      await new Promise(resolve => setTimeout(resolve, 2000));

      const importedSwatches: Swatch[] = swatchesData.map((swatchData, index) => ({
        ...swatchData,
        _id: `imported_${Date.now()}_${index}`,
        slug: swatchData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      return importedSwatches;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to import swatches');
    }
  }
);

export const updateSwatch = createAsyncThunk(
  'swatches/updateSwatch',
  async ({ id, updates }: { id: string; updates: Partial<Swatch> }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      return { id, updates: { ...updates, updated_at: new Date().toISOString() } };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update swatch');
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'swatches/toggleFavorite',
  async (swatchId: string, { getState }) => {
    const state = getState() as { swatches: SwatchState };
    const isFavorite = state.swatches.favorites.includes(swatchId);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));

    return { swatchId, isFavorite: !isFavorite };
  }
);

const swatchSlice = createSlice({
  name: 'swatches',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<SwatchFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch swatches
      .addCase(fetchSwatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSwatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.swatches = action.payload.swatches;
        state.pagination = action.payload.pagination;
        state.categories = action.payload.metadata.categories;
        state.brands = action.payload.metadata.brands;
        state.styles = action.payload.metadata.styles;
        state.finishes = action.payload.metadata.finishes;
        state.coating_types = action.payload.metadata.coating_types;
        state.all_tags = action.payload.metadata.all_tags;
        state.all_segment_types = action.payload.metadata.all_segment_types;
      })
      .addCase(fetchSwatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch swatch by slug
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

      // Create swatch
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
      })

      // Bulk import swatches
      .addCase(bulkImportSwatches.pending, (state) => {
        state.isImporting = true;
        state.error = null;
      })
      .addCase(bulkImportSwatches.fulfilled, (state, action) => {
        state.isImporting = false;
        // Add imported swatches to the beginning of the list
        state.swatches = [...action.payload, ...state.swatches];
        state.pagination.total += action.payload.length;
      })
      .addCase(bulkImportSwatches.rejected, (state, action) => {
        state.isImporting = false;
        state.error = action.payload as string;
      })

      // Update swatch
      .addCase(updateSwatch.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateSwatch.fulfilled, (state, action) => {
        state.isUpdating = false;
        const { id, updates } = action.payload;
        const index = state.swatches.findIndex(s => s._id === id);
        if (index !== -1) {
          state.swatches[index] = { ...state.swatches[index], ...updates };
        }
        if (state.currentSwatch?._id === id) {
          state.currentSwatch = { ...state.currentSwatch, ...updates };
        }
      })
      .addCase(updateSwatch.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Toggle favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { swatchId, isFavorite } = action.payload;
        if (isFavorite) {
          state.favorites.push(swatchId);
        } else {
          state.favorites = state.favorites.filter(id => id !== swatchId);
        }

        // Update localStorage
        localStorage.setItem('swatch_favorites', JSON.stringify(state.favorites));

        // Update swatch in list
        const swatch = state.swatches.find(s => s._id === swatchId);
        if (swatch) {
          swatch.is_favorite = isFavorite;
        }

        // Update current swatch
        if (state.currentSwatch?._id === swatchId) {
          state.currentSwatch.is_favorite = isFavorite;
        }
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
} = swatchSlice.actions;

export default swatchSlice.reducer;