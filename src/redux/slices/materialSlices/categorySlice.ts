import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CategoryModel } from '@/models/swatchBook/category/CategoryModel';
import { categoryService } from '@/services/material/categoryService';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '@/services/material/categoryService';

// Category State Interface
interface CategoryState {
  categories: CategoryModel[];
  iscategoriesLoading:boolean;
  currentCategory: CategoryModel | null;
  activeCategories: CategoryModel[]; // Only status: true categories
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
    status: boolean | null;
    sort_by: 'title' | 'sort_order' | 'created_at';
    sort_order: 'asc' | 'desc';
  };
}

// Initial State
const initialState: CategoryState = {
  categories: [],
  iscategoriesLoading:false,
  currentCategory: null,
  activeCategories: [],
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
    status: null,
    sort_by: 'sort_order',
    sort_order: 'asc',
  },
};

// Async Thunks

/**
 * Fetch all categories with optional filtering and pagination
 */
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const result = await categoryService.getAllCategories();

      if (result.success && result.data) {
        return {
          categories: result.data,
        
        };
      }
      
      throw new Error(result.error || 'Failed to fetch categories');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  }
);

/**
 * Fetch active categories only
 */
export const fetchActiveCategories = createAsyncThunk(
  'categories/fetchActiveCategories',
  async (_, { rejectWithValue }) => {
    try {
      const result = await categoryService.getActiveCategories();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.error || 'Failed to fetch active categories');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch active categories');
    }
  }
);

/**
 * Fetch category by ID
 */
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id: number, { rejectWithValue }) => {
    try {
      const result = await categoryService.getCategoryById(id);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.error || 'Category not found');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch category');
    }
  }
);

/**
 * Fetch category by title
 */
export const fetchCategoryByTitle = createAsyncThunk(
  'categories/fetchCategoryByTitle',
  async (title: string, { rejectWithValue }) => {
   
    try {
      const result = await categoryService.getCategoryByName([title]);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.error || 'Category not found');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch category by title');
    }
  }
);

/**
 * Fetch category by slug
 */
export const fetchCategoryBySlug = createAsyncThunk(
  'categories/fetchCategoryBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      // const result = await categoryService.getCategoryByName(slug, 'slug');
      
      // if (result.success && result.data) {
      //   return result.data;
      // }
      
      //throw new Error(result.error || 'Category not found');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch category by slug');
    }
  }
);

/**
 * Create a new category
 */
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: CreateCategoryRequest, { rejectWithValue }) => {
    try {
      const result = await categoryService.createCategory(categoryData);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.error || 'Failed to create category');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create category');
    }
  }
);

/**
 * Update an existing category
 */
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, updates }: { id: number; updates: UpdateCategoryRequest }, { rejectWithValue }) => {
    try {
      const result = await categoryService.updateCategory(id, updates);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.error || 'Failed to update category');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update category');
    }
  }
);

/**
 * Delete a category
 */
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      const result = await categoryService.deleteCategory(id);
      
      if (result.success) {
        return { id, message: result.message };
      }
      
      throw new Error(result.error || 'Failed to delete category');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete category');
    }
  }
);

/**
 * Bulk delete categories
 */
export const bulkDeleteCategories = createAsyncThunk(
  'categories/bulkDeleteCategories',
  async (ids: number[], { rejectWithValue }) => {
    try {
      const result = await categoryService.bulkDeleteCategories(ids);
      
      if (result.success) {
        return { ids, message: result.message };
      }
      
      throw new Error(result.error || 'Failed to delete categories');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete categories');
    }
  }
);

/**
 * Update category status
 */
export const updateCategoryStatus = createAsyncThunk(
  'categories/updateCategoryStatus',
  async ({ id, status }: { id: number; status: boolean }, { rejectWithValue }) => {
    try {
      const result = await categoryService.updateCategoryStatus(id, status);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.error || 'Failed to update category status');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update category status');
    }
  }
);

/**
 * Reorder categories
 */
export const reorderCategories = createAsyncThunk(
  'categories/reorderCategories',
  async (categoryOrders: Array<{ id: number; sort_order: number }>, { rejectWithValue }) => {
    try {
      const result = await categoryService.reorderCategories(categoryOrders);
      
      if (result.success) {
        return { categoryOrders, message: result.message };
      }
      
      throw new Error(result.error || 'Failed to reorder categories');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to reorder categories');
    }
  }
);

/**
 * Search categories
 */
export const searchCategories = createAsyncThunk(
  'categories/searchCategories',
  async (searchTerm: string, { rejectWithValue }) => {
    try {
      const result = await categoryService.searchCategories(searchTerm);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      throw new Error(result.error || 'Failed to search categories');
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to search categories');
    }
  }
);

// Category Slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // Set current category
    setCurrentCategory: (state, action: PayloadAction<CategoryModel | null>) => {
      state.currentCategory = action.payload;
    },

    // Clear current category
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<Partial<CategoryState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Set pagination
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },

    // Set page limit
    setPageLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1; // Reset to first page when changing limit
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Manually add category to state (for optimistic updates)
    addCategoryToState: (state, action: PayloadAction<CategoryModel>) => {
      state.categories.unshift(action.payload);
      if (action.payload.status) {
        state.activeCategories.unshift(action.payload);
      }
    },

    // Manually update category in state
    updateCategoryInState: (state, action: PayloadAction<CategoryModel>) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }

      const activeIndex = state.activeCategories.findIndex(cat => cat.id === action.payload.id);
      if (action.payload.status) {
        if (activeIndex === -1) {
          state.activeCategories.push(action.payload);
        } else {
          state.activeCategories[activeIndex] = action.payload;
        }
      } else if (activeIndex !== -1) {
        state.activeCategories.splice(activeIndex, 1);
      }

      if (state.currentCategory?.id === action.payload.id) {
        state.currentCategory = action.payload;
      }
    },

    // Manually remove category from state
    removeCategoryFromState: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.categories = state.categories.filter(cat => cat.id !== id);
      state.activeCategories = state.activeCategories.filter(cat => cat.id !== id);
      
      if (state.currentCategory?.id === id) {
        state.currentCategory = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.iscategoriesLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.categories = action.payload.categories;
        // state.pagination = action.payload.pagination;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch active categories
      .addCase(fetchActiveCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeCategories = action.payload;
      })
      .addCase(fetchActiveCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch category by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch category by title
      .addCase(fetchCategoryByTitle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryByTitle.fulfilled, (state) => {
        state.isLoading = false;
       // state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryByTitle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch category by slug
      .addCase(fetchCategoryBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload || null;
      })
      .addCase(fetchCategoryBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create category
      .addCase(createCategory.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isCreating = false;
        state.categories.unshift(action.payload);
        if (action.payload.status) {
          state.activeCategories.unshift(action.payload);
        }
        state.pagination.total += 1;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })

      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedCategory = action.payload;
        
        // Update in categories array
        const index = state.categories.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }

        // Update in active categories array
        const activeIndex = state.activeCategories.findIndex(cat => cat.id === updatedCategory.id);
        if (updatedCategory.status) {
          if (activeIndex === -1) {
            state.activeCategories.push(updatedCategory);
          } else {
            state.activeCategories[activeIndex] = updatedCategory;
          }
        } else if (activeIndex !== -1) {
          state.activeCategories.splice(activeIndex, 1);
        }

        // Update current category if it's the same one
        if (state.currentCategory?.id === updatedCategory.id) {
          state.currentCategory = updatedCategory;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isDeleting = false;
        const { id } = action.payload;
        
        // Remove from categories array
        state.categories = state.categories.filter(cat => cat.id !== id);
        
        // Remove from active categories array
        state.activeCategories = state.activeCategories.filter(cat => cat.id !== id);
        
        // Clear current category if it was deleted
        if (state.currentCategory?.id === id) {
          state.currentCategory = null;
        }
        
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      })

      // Bulk delete categories
      .addCase(bulkDeleteCategories.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(bulkDeleteCategories.fulfilled, (state, action) => {
        state.isDeleting = false;
        const { ids } = action.payload;
        
        // Remove from categories array
        state.categories = state.categories.filter(cat => !ids.includes(cat.id));
        
        // Remove from active categories array
        state.activeCategories = state.activeCategories.filter(cat => !ids.includes(cat.id));
        
        // Clear current category if it was deleted
        if (state.currentCategory && ids.includes(state.currentCategory.id)) {
          state.currentCategory = null;
        }
        
        state.pagination.total = Math.max(0, state.pagination.total - ids.length);
      })
      .addCase(bulkDeleteCategories.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      })

      // Update category status
      .addCase(updateCategoryStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateCategoryStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedCategory = action.payload;
        
        // Update in categories array
        const index = state.categories.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }

        // Update in active categories array
        const activeIndex = state.activeCategories.findIndex(cat => cat.id === updatedCategory.id);
        if (updatedCategory.status) {
          if (activeIndex === -1) {
            state.activeCategories.push(updatedCategory);
          } else {
            state.activeCategories[activeIndex] = updatedCategory;
          }
        } else if (activeIndex !== -1) {
          state.activeCategories.splice(activeIndex, 1);
        }

        // Update current category if it's the same one
        if (state.currentCategory?.id === updatedCategory.id) {
          state.currentCategory = updatedCategory;
        }
      })
      .addCase(updateCategoryStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Reorder categories
      .addCase(reorderCategories.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(reorderCategories.fulfilled, (state, action) => {
        state.isUpdating = false;
        const { categoryOrders } = action.payload;
        
        // Update sort_order for each category in the state
        categoryOrders.forEach(({ id, sort_order }) => {
          const categoryIndex = state.categories.findIndex(cat => cat.id === id);
          if (categoryIndex !== -1) {
            state.categories[categoryIndex].sort_order = sort_order;
          }
          
          const activeCategoryIndex = state.activeCategories.findIndex(cat => cat.id === id);
          if (activeCategoryIndex !== -1) {
            state.activeCategories[activeCategoryIndex].sort_order = sort_order;
          }
        });
        
        // Re-sort arrays by sort_order
        state.categories.sort((a, b) => a.sort_order - b.sort_order);
        state.activeCategories.sort((a, b) => a.sort_order - b.sort_order);
      })
      .addCase(reorderCategories.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Search categories
      .addCase(searchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setCurrentCategory,
  clearCurrentCategory,
  setFilters,
  clearFilters,
  setPage,
  setPageLimit,
  clearError,
  addCategoryToState,
  updateCategoryInState,
  removeCategoryFromState,
} = categorySlice.actions;

// Export reducer
export default categorySlice.reducer;

// Selectors
export const selectCategories = (state: { categories: CategoryState }) => state.categories.categories;
export const selectActiveCategories = (state: { categories: CategoryState }) => state.categories.activeCategories;
export const selectCurrentCategory = (state: { categories: CategoryState }) => state.categories.currentCategory;
export const selectCategoriesLoading = (state: { categories: CategoryState }) => state.categories.isLoading;
export const selectCategoriesError = (state: { categories: CategoryState }) => state.categories.error;
export const selectCategoriesPagination = (state: { categories: CategoryState }) => state.categories.pagination;
export const selectCategoriesFilters = (state: { categories: CategoryState }) => state.categories.filters;
