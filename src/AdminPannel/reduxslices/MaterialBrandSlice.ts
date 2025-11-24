import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AdminMaterialBrandService } from "../services/Material/AdminMaterialBrandService";
import {
  MaterialBrand,
  MaterialCategory,
  MaterialSegment,
} from "@/components/swatchBook/interfaces";

export interface StylesModal {
  id?: number;
  product_brand_id?: any;
  title?: string;
  slug?: string;
  description?: string;
  sort_order?: number;
  status?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface Product_Brand_Segment_Modal {
  id?: number;
  category_id?: MaterialCategory | number;
  material_segment_id?: MaterialSegment | number;
  brand_id?: MaterialBrand | number;
}

export interface Product_Brand_Segment_Modal2 {
  id?: number;
  category_id?: number;
  material_segment_id?: number;
  brand_id?: number;
}

export interface ProductBrand {
  id?: number;
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  brand_id?: null | number;
  category_id?: null | number;
  material_segment_id?: null | number;
  product_brand_categories?: null | Product_Brand_Segment_Modal2[];
}

export interface ProductBrandModal {
  list: ProductBrand[];
  currentBrand: null | ProductBrand;
  isLoading: boolean;
  error: null | string;
  sortfield: string;
  sortorder: string;
  isOpen: boolean;
  currentloading: boolean;
  adding: boolean;
  style_arr: StylesModal[];
  currentStyle: null | StylesModal;
}

const initialState: ProductBrandModal = {
  list: [],
  currentBrand: null,
  isLoading: false,
  error: null,
  sortorder: "asec",
  sortfield: "id",
  isOpen: false,
  currentloading: false,
  adding: false,
  style_arr: [],
  currentStyle: null,
};

// Async thunk to fetch projects
export const adminFetchBrands = createAsyncThunk(
  "projects/adminFetchBrands",
  async (
    { orderby, order }: { orderby: string; order: string },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await AdminMaterialBrandService.getMaterialBrandByPagination(
          orderby,
          order
        );

      if (response.status != false) {
        return response.data as ProductBrand[];
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

export const fetchCurrentBrandWithStylesJobs = createAsyncThunk(
  "projects/fetchCurrentBrandWithStylesJobs",
  async (product: ProductBrand, { rejectWithValue }) => {
    try {
      const response = await AdminMaterialBrandService.getMaterialStyles(
        product
      );

      if (response.status != false) {
        return response.data as ProductBrand;
      } else {
        return product;
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

export const addNewBrandInTable = createAsyncThunk(
  "projects/addNewBrandInTable",
  async (product: ProductBrand, { rejectWithValue }) => {
    try {
      const response = await AdminMaterialBrandService.addMaterialBrand(
        product
      );

      if (response.status != false) {
        return response.data as ProductBrand;
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

export const updateBrandInTable = createAsyncThunk(
  "projects/updateBrandInTable",
  async (
    product: { product: ProductBrand; id: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await AdminMaterialBrandService.updateMaterialBrand(
        product
      );

      if (response.status != false) {
        return response.data as ProductBrand;
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

export const updateBrandStyleInTable = createAsyncThunk(
  "projects/updateBrandStyleInTable",
  async (
    product: { product: StylesModal; id: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await AdminMaterialBrandService.updateMaterialBrandStyle(
        product
      );

      if (response.status != false) {
        return response.data as StylesModal;
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

export const adminFetchBrandsStyles = createAsyncThunk(
  "projects/adminFetchBrandsStyles",
  async (
    { orderby, order }: { orderby: string; order: string },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await AdminMaterialBrandService.getMaterialBrandStylesByPagination(
          orderby,
          order
        );

      if (response.status != false) {
        return response.data as StylesModal[];
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
export const addNewBrandStyleInTable = createAsyncThunk(
  "projects/addNewBrandStyleInTable",
  async (product: ProductBrand, { rejectWithValue }) => {
    try {
      const response = await AdminMaterialBrandService.addMaterialBrandStyle(
        product
      );

      if (response.status != false) {
        return response.data as StylesModal;
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

export const deleteBrandById = createAsyncThunk(
  "projects/addNewBrandStyleInTable",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await AdminMaterialBrandService.deletBrandByID(id);

      if (response.status != false) {
        return response;
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

const adminBrandSlice = createSlice({
  name: "adminBrandSlice",
  initialState,
  reducers: {
    handlesortingbrands: (state, action) => {
      const sortOrder =
        action.payload.orderby == state.sortfield && state.sortorder == "asec"
          ? "desc"
          : "asec";
      state.sortfield = action.payload.orderby;
      state.sortorder = sortOrder;
    },
    handleSelectViewBrand: (state, action) => {
      state.currentBrand = action.payload;
      state.isOpen = true;
    },
    handleCloseBrandModal: (state) => {
      state.currentBrand = null;
      state.isOpen = false;
    },
    handleSelectViewBrandStyle: (state, action) => {
      state.currentStyle = action.payload;
      state.isOpen = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminFetchBrands.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminFetchBrands.fulfilled, (state, action) => {
        state.list = action.payload;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(adminFetchBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentBrandWithStylesJobs.pending, (state) => {
        state.currentloading = true;
      })
      .addCase(fetchCurrentBrandWithStylesJobs.fulfilled, (state, action) => {
        state.currentBrand = action.payload;
        state.error = null;
        state.currentloading = false;
      })
      .addCase(fetchCurrentBrandWithStylesJobs.rejected, (state, action) => {
        state.currentloading = false;
        state.error = action.payload as string;
      })
      .addCase(addNewBrandInTable.pending, (state) => {
        state.adding = true;
      })
      .addCase(addNewBrandInTable.fulfilled, (state, action) => {
        const newAddedBrand = action.payload;
        if (newAddedBrand !== undefined || newAddedBrand != null) {
          state.list.push(newAddedBrand);
        }
        state.error = null;
        state.adding = false;
      })
      .addCase(addNewBrandInTable.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload as string;
      })
      .addCase(updateBrandInTable.pending, (state) => {
        state.adding = true;
      })
      .addCase(updateBrandInTable.fulfilled, (state, action) => {
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
      .addCase(updateBrandInTable.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload as string;
      })
      .addCase(adminFetchBrandsStyles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminFetchBrandsStyles.fulfilled, (state, action) => {
        state.style_arr = action.payload;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(adminFetchBrandsStyles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addNewBrandStyleInTable.pending, (state) => {
        state.adding = true;
      })
      // .addCase(addNewBrandStyleInTable.fulfilled, ...) duplicate removed
      .addCase(addNewBrandStyleInTable.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload as string;
      })
      .addCase(updateBrandStyleInTable.pending, (state) => {
        state.adding = true;
      })
      .addCase(updateBrandStyleInTable.fulfilled, (state, action) => {
        const newAddedBrandStyle = action.payload;
        if (newAddedBrandStyle !== undefined && newAddedBrandStyle != null) {
          const index = state.style_arr.findIndex(
            (d) => d.id === newAddedBrandStyle.id
          );
          if (index !== -1) {
            state.style_arr[index] = newAddedBrandStyle;
          } else {
            state.style_arr.push(newAddedBrandStyle); // Add if not already present
          }
        }
        state.error = null;
        state.adding = false;
      })
      .addCase(updateBrandStyleInTable.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBrandById.fulfilled, (state, action) => {
        const brandId = action?.payload?.brandId;
        if (brandId !== undefined) {
          state.list = state.list.filter((brand) => brand.id !== brandId);
        }
      });
  },
});

export const {
  handlesortingbrands,
  handleSelectViewBrand,
  handleCloseBrandModal,
  handleSelectViewBrandStyle,
} = adminBrandSlice.actions;

export default adminBrandSlice.reducer;
