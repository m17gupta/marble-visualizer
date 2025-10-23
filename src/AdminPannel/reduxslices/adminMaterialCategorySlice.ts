import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AdminMaterialCategoryService } from "../services/Material/AdminMaterialCategoryService";
import { Product_Brand_Segment_Modal } from "./MaterialBrandSlice";

export interface ProductCategory {
  id?: number;
  name?: string;
  icon?: string;
  sort_order?: number;
}

export interface ProductCategoryModal {
  list: ProductCategory[];
  currentCategory: null | ProductCategory;
  isLoading: boolean;
  error: null | string;
  sortfield: string;
  sortorder: string;
  isOpen: boolean;
  currentcategoryloading: boolean;
  adding: boolean;
  brand_id?: null | number;
  category_id?: null | number;
  material_segment_id?: null | number;
}

const initialState: ProductCategoryModal = {
  list: [],
  currentCategory: null,
  isLoading: false,
  error: null,
  sortorder: "asec",
  sortfield: "id",
  isOpen: false,
  currentcategoryloading: false,
  adding: false,
};

// Async thunk to fetch projects
export const adminFetchCategory = createAsyncThunk(
  "projects/adminFetchCategory",
  async (
    { orderby, order }: { orderby: string; order: string },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await AdminMaterialCategoryService.getMaterialCategoriesByPagination(
          orderby,
          order
        );

      if (response.status != false) {
        return response.data as ProductCategory[];
      } else {
        return [];
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

export const addNewCatergoryInTable = createAsyncThunk(
  "projects/addNewBrandInTable",
  async (product: ProductCategory, { rejectWithValue }) => {
    try {
      const response = await AdminMaterialCategoryService.addMaterialCategory(
        product
      );

      if (response.status != false) {
        return response.data as ProductCategory;
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

export const updateCategoryInTable = createAsyncThunk(
  "projects/updateBrandInTable",
  async (
    product: { product: ProductCategory; id: number },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await AdminMaterialCategoryService.updateMaterialCategory(product);

      if (response.status != false) {
        return response.data as ProductCategory;
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

const adminMaterialCategorySlice = createSlice({
  name: "adminBrandSlice",
  initialState,
  reducers: {
    handlesortingcategroies: (state, action) => {
      const sortOrder =
        action.payload.orderby == state.sortfield && state.sortorder == "asec"
          ? "desc"
          : "asec";
      state.sortfield = action.payload.orderby;
      state.sortorder = sortOrder;
    },
    handleSelectViewCategories: (state, action) => {
      state.currentCategory = action.payload;
      state.isOpen = true;
    },
    handleCloseCategoriesModal: (state) => {
      state.currentCategory = null;
      state.isOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminFetchCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminFetchCategory.fulfilled, (state, action) => {
        state.list = action.payload;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(adminFetchCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addNewCatergoryInTable.pending, (state) => {
        state.adding = true;
      })
      .addCase(addNewCatergoryInTable.fulfilled, (state, action) => {
        const newAddedBrand = action.payload;
        if (newAddedBrand !== undefined || newAddedBrand != null) {
          state.list.push(newAddedBrand);
        }
        state.error = null;
        state.adding = false;
      })
      .addCase(addNewCatergoryInTable.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload as string;
      })
      .addCase(updateCategoryInTable.pending, (state) => {
        state.adding = true;
      })
      .addCase(updateCategoryInTable.fulfilled, (state, action) => {
        const newAddedBrand = action.payload;
        if (newAddedBrand !== undefined && newAddedBrand != null) {
          const index = state.list.findIndex((d) => d.id === newAddedBrand.id);
          if (index !== -1) {
            state.list[index] = newAddedBrand;
          } else {
            state.list.push(newAddedBrand); // Add if not already present
          }
        }
        state.error = null;
        state.adding = false;
      })
      .addCase(updateCategoryInTable.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  handlesortingcategroies,
  handleSelectViewCategories,
  handleCloseCategoriesModal,
} = adminMaterialCategorySlice.actions;

export default adminMaterialCategorySlice.reducer;
