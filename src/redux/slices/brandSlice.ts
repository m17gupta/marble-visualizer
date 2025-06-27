import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BrandModel } from '@/models/swatchBook/brand/BrandModel';
import { brandService } from '@/services/material/brandService';
import type { CreateBrandRequest, UpdateBrandRequest } from '@/services/material/brandService';

// Brand State Interface
interface BrandState {
  brands: BrandModel[];
  currentBrand: BrandModel | null;
  activeBrands: BrandModel[]; // Only status: true brands
  brandsByCategory: Record<number, BrandModel[]>; // Brands grouped by category ID
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
    material_category_id: number | null;
    status: boolean | null;
    sort_by: 'title' | 'sort_order' | 'created_at';
    sort_order: 'asc' | 'desc';
  };
}

// Initial State
const initialState: BrandState = {
  brands: [],
  currentBrand: null,
  activeBrands: [],
  brandsByCategory: {},
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
    material_category_id: null,
    status: null,
    sort_by: 'sort_order',
    sort_order: 'asc',
  },
};

// Async Thunks

/**
 * Fetch all brands with optional filtering and pagination
 */
export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const result = await brandService.getAllBrands();

      if (result.success && result.data) {
        return {
          brands: result.data,
        };
      }
      
      throw new Error(result.error || 'Failed to fetch brands');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch brands');
    }
  }
);

/**
 * Fetch active brands only
 */
export const fetchActiveBrands = createAsyncThunk(
  'brands/fetchActiveBrands',
  async (params: { categoryId?: number } = {}, { rejectWithValue }) => {
    try {
      const result = await brandService.getActiveBrands(params.categoryId);
      
      if (result.success && result.data) {
        return {
          brands: result.data,
          categoryId: params.categoryId,
        };
      }
      
      throw new Error(result.error || 'Failed to fetch active brands');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch active brands');
    }
  }
);

/**
 * Fetch brands by category
 */
export const fetchBrandsByCategory = createAsyncThunk(
  'brands/fetchBrandsByCategory',
  async ({ categoryId, includeInactive = false }: { categoryId: number; includeInactive?: boolean }, { rejectWithValue }) => {
    try {
      const result = await brandService.getBrandsByCategory(categoryId, includeInactive);
      
      if (result.success && result.data) {
        return {
          categoryId,
          brands: result.data,
        };
      }
      
      throw new Error(result.error || 'Failed to fetch brands by category');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch brands by category');
    }
  }
);

/**
 * Fetch brand by ID
 */
export const fetchBrandById = createAsyncThunk(
  'brands/fetchBrandById',
  async (id: number, { rejectWithValue }) => {
    try {
      const result = await brandService.getBrandById(id);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.error || 'Brand not found');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch brand');
    }
  }
);

/**
 * Fetch brand by title
 */
export const fetchBrandByTitle = createAsyncThunk(
  'brands/fetchBrandByTitle',
  async (title: string, { rejectWithValue }) => {
    try {
      const result = await brandService.getBrandByTitle(title);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.error || 'Brand not found');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch brand by title');
    }
  }
);

/**
 * Fetch brand by slug
 */
export const fetchBrandBySlug = createAsyncThunk(
  'brands/fetchBrandBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const result = await brandService.getBrandBySlug(slug);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.error || 'Brand not found');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch brand by slug');
    }
  }
);

/**
 * Search brands
 */
export const searchBrands = createAsyncThunk(
  'brands/searchBrands',
  async ({ 
    searchTerm, 
    categoryId, 
    activeOnly = true 
  }: { 
    searchTerm: string; 
    categoryId?: number; 
    activeOnly?: boolean;
  }, { rejectWithValue }) => {
    try {
      const result = await brandService.searchBrands(searchTerm, categoryId, activeOnly);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.error || 'Failed to search brands');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to search brands');
    }
  }
);

/**
 * Create a new brand
 */
export const createBrand = createAsyncThunk(
  'brands/createBrand',
  async (brandData: CreateBrandRequest, { rejectWithValue }) => {
    try {
      const result = await brandService.createBrand(brandData);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.error || 'Failed to create brand');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create brand');
    }
  }
);

/**
 * Update an existing brand
 */
export const updateBrand = createAsyncThunk(
  'brands/updateBrand',
  async (brandData: UpdateBrandRequest, { rejectWithValue }) => {
    try {
      const result = await brandService.updateBrand(brandData);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.error || 'Failed to update brand');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update brand');
    }
  }
);

/**
 * Delete a brand
 */
export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (id: number, { rejectWithValue }) => {
    try {
      const result = await brandService.deleteBrand(id);
      
      if (result.success) {
        return id;
      }
      
      throw new Error(result.error || 'Failed to delete brand');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete brand');
    }
  }
);

/**
 * Delete multiple brands
 */
export const deleteBrands = createAsyncThunk(
  'brands/deleteBrands',
  async (ids: number[], { rejectWithValue }) => {
    try {
      const result = await brandService.deleteBrands(ids);
      
      if (result.success) {
        return ids;
      }
      
      throw new Error(result.error || 'Failed to delete brands');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete brands');
    }
  }
);

/**
 * Toggle brand status
 */
export const toggleBrandStatus = createAsyncThunk(
  'brands/toggleBrandStatus',
  async (id: number, { rejectWithValue }) => {
    try {
      const result = await brandService.toggleBrandStatus(id);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.error || 'Failed to toggle brand status');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to toggle brand status');
    }
  }
);

/**
 * Update brand status
 */
export const updateBrandStatus = createAsyncThunk(
  'brands/updateBrandStatus',
  async ({ id, status }: { id: number; status: boolean }, { rejectWithValue }) => {
    try {
      const result = await brandService.updateBrandStatus(id, status);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.error || 'Failed to update brand status');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update brand status');
    }
  }
);

/**
 * Reorder brands
 */
export const reorderBrands = createAsyncThunk(
  'brands/reorderBrands',
  async (brandOrders: { id: number; sort_order: number }[], { rejectWithValue }) => {
    try {
      const result = await brandService.reorderBrands(brandOrders);
      
      if (result.success) {
        return brandOrders;
      }
      
      throw new Error(result.error || 'Failed to reorder brands');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to reorder brands');
    }
  }
);

/**
 * Fetch brands with pagination
 */
// export const fetchBrandsWithPagination = createAsyncThunk(
//   'brands/fetchBrandsWithPagination',
//   async ({ 
//     page = 1, 
//     limit = 20, 
//     filters = {} 
//   }: { 
//     page?: number; 
//     limit?: number; 
//     filters?: {
//       search?: string;
//       material_category_id?: number;
//       status?: boolean;
//       sort_by?: 'title' | 'sort_order' | 'created_at';
//       sort_order?: 'asc' | 'desc';
//     };
//   }, { rejectWithValue }) => {
//     try {
//       const result = await brandService.getBrandsWithPagination(page, limit, filters);
      
//       if (result.success && result.data) {
//         return result.data;
//       }
      
//       throw new Error(result.error || 'Failed to fetch brands with pagination');
//     } catch (error: unknown) {
//       return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch brands with pagination');
//     }
//   }
// );

// Brand Slice
const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    // Clear current brand
    clearCurrentBrand: (state) => {
      state.currentBrand = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Update filters
    updateFilters: (state, action: PayloadAction<Partial<BrandState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Update pagination
    updatePagination: (state, action: PayloadAction<Partial<BrandState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Set current brand
    setCurrentBrand: (state, action: PayloadAction<BrandModel | null>) => {
      state.currentBrand = action.payload;
    },

    // Optimistic update for brand creation
    addBrandOptimistic: (state, action: PayloadAction<BrandModel>) => {
      state.brands.unshift(action.payload);
      if (action.payload.status) {
        state.activeBrands.unshift(action.payload);
      }
    },

    // Optimistic update for brand update
    updateBrandOptimistic: (state, action: PayloadAction<BrandModel>) => {
      const index = state.brands.findIndex(brand => brand.id === action.payload.id);
      if (index !== -1) {
        state.brands[index] = action.payload;
      }

      const activeIndex = state.activeBrands.findIndex(brand => brand.id === action.payload.id);
      if (action.payload.status) {
        if (activeIndex === -1) {
          state.activeBrands.push(action.payload);
        } else {
          state.activeBrands[activeIndex] = action.payload;
        }
      } else if (activeIndex !== -1) {
        state.activeBrands.splice(activeIndex, 1);
      }

      // Update current brand if it's the same
      if (state.currentBrand?.id === action.payload.id) {
        state.currentBrand = action.payload;
      }
    },

    // Optimistic update for brand deletion
    removeBrandOptimistic: (state, action: PayloadAction<number>) => {
      state.brands = state.brands.filter(brand => brand.id !== action.payload);
      state.activeBrands = state.activeBrands.filter(brand => brand.id !== action.payload);
      
      if (state.currentBrand?.id === action.payload) {
        state.currentBrand = null;
      }
    },

    // Clear brands by category
    clearBrandsByCategory: (state, action: PayloadAction<number>) => {
      delete state.brandsByCategory[action.payload];
    },

    // Clear all brands
    clearAllBrands: (state) => {
      state.brands = [];
      state.activeBrands = [];
      state.brandsByCategory = {};
      state.currentBrand = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Brands
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = action.payload.brands;
        state.error = null;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Active Brands
    builder
      .addCase(fetchActiveBrands.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeBrands = action.payload.brands;
        
        // If categoryId is provided, also store in brandsByCategory
        if (action.payload.categoryId !== undefined) {
          state.brandsByCategory[action.payload.categoryId] = action.payload.brands;
        }
        
        state.error = null;
      })
      .addCase(fetchActiveBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Brands by Category
    builder
      .addCase(fetchBrandsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrandsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brandsByCategory[action.payload.categoryId] = action.payload.brands;
        state.error = null;
      })
      .addCase(fetchBrandsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Brand by ID
    builder
      .addCase(fetchBrandById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrandById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBrand = action.payload;
        state.error = null;
      })
      .addCase(fetchBrandById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Brand by Title
    builder
      .addCase(fetchBrandByTitle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrandByTitle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBrand = action.payload;
        state.error = null;
      })
      .addCase(fetchBrandByTitle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Brand by Slug
    builder
      .addCase(fetchBrandBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrandBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBrand = action.payload;
        state.error = null;
      })
      .addCase(fetchBrandBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search Brands
    builder
      .addCase(searchBrands.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = action.payload;
        state.error = null;
      })
      .addCase(searchBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Brand
    builder
      .addCase(createBrand.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.isCreating = false;
        state.brands.unshift(action.payload);
        
        if (action.payload.status) {
          state.activeBrands.unshift(action.payload);
        }

        // Add to category-specific brands if applicable
        const categoryId = action.payload.material_category_id;
        if (state.brandsByCategory[categoryId]) {
          state.brandsByCategory[categoryId].unshift(action.payload);
        }
        
        state.error = null;
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Update Brand
    builder
      .addCase(updateBrand.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.isUpdating = false;
        
        // Update in main brands array
        const index = state.brands.findIndex(brand => brand.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }

        // Update in active brands
        const activeIndex = state.activeBrands.findIndex(brand => brand.id === action.payload.id);
        if (action.payload.status) {
          if (activeIndex === -1) {
            state.activeBrands.push(action.payload);
          } else {
            state.activeBrands[activeIndex] = action.payload;
          }
        } else if (activeIndex !== -1) {
          state.activeBrands.splice(activeIndex, 1);
        }

        // Update in category-specific brands
        const categoryId = action.payload.material_category_id;
        if (state.brandsByCategory[categoryId]) {
          const categoryIndex = state.brandsByCategory[categoryId].findIndex(
            brand => brand.id === action.payload.id
          );
          if (categoryIndex !== -1) {
            state.brandsByCategory[categoryId][categoryIndex] = action.payload;
          }
        }

        // Update current brand if it's the same
        if (state.currentBrand?.id === action.payload.id) {
          state.currentBrand = action.payload;
        }
        
        state.error = null;
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete Brand
    builder
      .addCase(deleteBrand.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.isDeleting = false;
        const brandId = action.payload;
        
        // Remove from main brands array
        state.brands = state.brands.filter(brand => brand.id !== brandId);
        
        // Remove from active brands
        state.activeBrands = state.activeBrands.filter(brand => brand.id !== brandId);
        
        // Remove from category-specific brands
        Object.keys(state.brandsByCategory).forEach(categoryId => {
          state.brandsByCategory[parseInt(categoryId)] = state.brandsByCategory[parseInt(categoryId)].filter(
            brand => brand.id !== brandId
          );
        });

        // Clear current brand if it's the deleted one
        if (state.currentBrand?.id === brandId) {
          state.currentBrand = null;
        }
        
        state.error = null;
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });

    // Delete Brands (Bulk)
    builder
      .addCase(deleteBrands.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteBrands.fulfilled, (state, action) => {
        state.isDeleting = false;
        const brandIds = action.payload;
        
        // Remove from main brands array
        state.brands = state.brands.filter(brand => !brandIds.includes(brand.id));
        
        // Remove from active brands
        state.activeBrands = state.activeBrands.filter(brand => !brandIds.includes(brand.id));
        
        // Remove from category-specific brands
        Object.keys(state.brandsByCategory).forEach(categoryId => {
          state.brandsByCategory[parseInt(categoryId)] = state.brandsByCategory[parseInt(categoryId)].filter(
            brand => !brandIds.includes(brand.id)
          );
        });

        // Clear current brand if it's one of the deleted ones
        if (state.currentBrand && brandIds.includes(state.currentBrand.id)) {
          state.currentBrand = null;
        }
        
        state.error = null;
      })
      .addCase(deleteBrands.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });

    // Toggle Brand Status
    builder
      .addCase(toggleBrandStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(toggleBrandStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        
        // Update brand in all arrays (same logic as updateBrand)
        const index = state.brands.findIndex(brand => brand.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }

        const activeIndex = state.activeBrands.findIndex(brand => brand.id === action.payload.id);
        if (action.payload.status) {
          if (activeIndex === -1) {
            state.activeBrands.push(action.payload);
          } else {
            state.activeBrands[activeIndex] = action.payload;
          }
        } else if (activeIndex !== -1) {
          state.activeBrands.splice(activeIndex, 1);
        }

        const categoryId = action.payload.material_category_id;
        if (state.brandsByCategory[categoryId]) {
          const categoryIndex = state.brandsByCategory[categoryId].findIndex(
            brand => brand.id === action.payload.id
          );
          if (categoryIndex !== -1) {
            state.brandsByCategory[categoryId][categoryIndex] = action.payload;
          }
        }

        if (state.currentBrand?.id === action.payload.id) {
          state.currentBrand = action.payload;
        }
        
        state.error = null;
      })
      .addCase(toggleBrandStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Update Brand Status
    builder
      .addCase(updateBrandStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateBrandStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        
        // Same logic as toggleBrandStatus
        const index = state.brands.findIndex(brand => brand.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }

        const activeIndex = state.activeBrands.findIndex(brand => brand.id === action.payload.id);
        if (action.payload.status) {
          if (activeIndex === -1) {
            state.activeBrands.push(action.payload);
          } else {
            state.activeBrands[activeIndex] = action.payload;
          }
        } else if (activeIndex !== -1) {
          state.activeBrands.splice(activeIndex, 1);
        }

        const categoryId = action.payload.material_category_id;
        if (state.brandsByCategory[categoryId]) {
          const categoryIndex = state.brandsByCategory[categoryId].findIndex(
            brand => brand.id === action.payload.id
          );
          if (categoryIndex !== -1) {
            state.brandsByCategory[categoryId][categoryIndex] = action.payload;
          }
        }

        if (state.currentBrand?.id === action.payload.id) {
          state.currentBrand = action.payload;
        }
        
        state.error = null;
      })
      .addCase(updateBrandStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Reorder Brands
    builder
      .addCase(reorderBrands.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(reorderBrands.fulfilled, (state, action) => {
        state.isUpdating = false;
        
        // Update sort orders in all brand arrays
        action.payload.forEach(({ id, sort_order }) => {
          // Update in main brands
          const brandIndex = state.brands.findIndex(brand => brand.id === id);
          if (brandIndex !== -1) {
            state.brands[brandIndex].sort_order = sort_order;
          }

          // Update in active brands
          const activeBrandIndex = state.activeBrands.findIndex(brand => brand.id === id);
          if (activeBrandIndex !== -1) {
            state.activeBrands[activeBrandIndex].sort_order = sort_order;
          }

          // Update in category-specific brands
          Object.keys(state.brandsByCategory).forEach(categoryId => {
            const categoryBrandIndex = state.brandsByCategory[parseInt(categoryId)].findIndex(
              brand => brand.id === id
            );
            if (categoryBrandIndex !== -1) {
              state.brandsByCategory[parseInt(categoryId)][categoryBrandIndex].sort_order = sort_order;
            }
          });

          // Update current brand if it matches
          if (state.currentBrand?.id === id) {
            state.currentBrand.sort_order = sort_order;
          }
        });

        // Re-sort all arrays by sort_order
        const sortBySortOrder = (a: BrandModel, b: BrandModel) => a.sort_order - b.sort_order;
        state.brands.sort(sortBySortOrder);
        state.activeBrands.sort(sortBySortOrder);
        Object.keys(state.brandsByCategory).forEach(categoryId => {
          state.brandsByCategory[parseInt(categoryId)].sort(sortBySortOrder);
        });
        
        state.error = null;
      })
      .addCase(reorderBrands.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Fetch Brands with Pagination
    // builder
    //   .addCase(fetchBrandsWithPagination.pending, (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchBrandsWithPagination.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     state.brands = action.payload.brands;
    //     state.pagination = action.payload.pagination;
    //     state.error = null;
    //   })
    //   .addCase(fetchBrandsWithPagination.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.payload as string;
    //   });
  },
});

// Export actions
export const {
  clearCurrentBrand,
  clearError,
  updateFilters,
  resetFilters,
  updatePagination,
  setCurrentBrand,
  addBrandOptimistic,
  updateBrandOptimistic,
  removeBrandOptimistic,
  clearBrandsByCategory,
  clearAllBrands,
} = brandSlice.actions;

// Selectors
export const selectBrandState = (state: { brands: BrandState }) => state.brands;
export const selectAllBrands = (state: { brands: BrandState }) => state.brands.brands;
export const selectActiveBrands = (state: { brands: BrandState }) => state.brands.activeBrands;
export const selectCurrentBrand = (state: { brands: BrandState }) => state.brands.currentBrand;
export const selectBrandsByCategory = (categoryId: number) => (state: { brands: BrandState }) => 
  state.brands.brandsByCategory[categoryId] || [];
export const selectBrandIsLoading = (state: { brands: BrandState }) => state.brands.isLoading;
export const selectBrandIsCreating = (state: { brands: BrandState }) => state.brands.isCreating;
export const selectBrandIsUpdating = (state: { brands: BrandState }) => state.brands.isUpdating;
export const selectBrandIsDeleting = (state: { brands: BrandState }) => state.brands.isDeleting;
export const selectBrandError = (state: { brands: BrandState }) => state.brands.error;
export const selectBrandPagination = (state: { brands: BrandState }) => state.brands.pagination;
export const selectBrandFilters = (state: { brands: BrandState }) => state.brands.filters;

// Complex selectors
export const selectBrandById = (id: number) => (state: { brands: BrandState }) =>
  state.brands.brands.find(brand => brand.id === id);

export const selectBrandsByStatus = (status: boolean) => (state: { brands: BrandState }) =>
  state.brands.brands.filter(brand => brand.status === status);

export const selectFilteredBrands = (state: { brands: BrandState }) => {
  const { brands, filters } = state.brands;
  
  return brands.filter(brand => {
    if (filters.search && !brand.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.material_category_id !== null && brand.material_category_id !== filters.material_category_id) {
      return false;
    }
    if (filters.status !== null && brand.status !== filters.status) {
      return false;
    }
    return true;
  });
};

export const selectBrandsByTitlePrefix = (prefix: string) => (state: { brands: BrandState }) =>
  state.brands.brands.filter(brand => 
    brand.title.toLowerCase().startsWith(prefix.toLowerCase())
  );

// Export reducer
export default brandSlice.reducer;
