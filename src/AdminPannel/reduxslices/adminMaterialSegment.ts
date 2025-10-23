import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AdminMaterialBrandService } from "../services/Material/AdminMaterialBrandService";
import {
  MaterialBrand,
  MaterialCategory,
  MaterialSegment,
} from "@/components/swatchBook/interfaces";
import { AdminMaterialSegmentService } from "../services/Material/AdminMaterialSegmentService";

export interface ProductBrandModal {
  list: MaterialSegment[];
  currentSegment: null | MaterialSegment;
  isLoading: boolean;
  error: null | string;
  sortfield: string;
  sortorder: string;
  isOpen: boolean;
  currentloading: boolean;
  adding: boolean;
}

const initialState: ProductBrandModal = {
  list: [],
  currentSegment: null,
  isLoading: false,
  error: null,
  sortorder: "asec",
  sortfield: "id",
  isOpen: false,
  currentloading: false,
  adding: false,
};

// Async thunk to fetch projects
export const adminFetchMaterialSegments = createAsyncThunk(
  "projects/adminFetchMaterialSegments",
  async (
    { orderby, order }: { orderby: string; order: string },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await AdminMaterialSegmentService.getMaterialSegmentByPagination(
          orderby,
          order
        );

      if (response.status != false) {
        return response.data as MaterialSegment[];
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

export const addNewSegmentInTable = createAsyncThunk(
  "projects/addNewSegmentInTable",
  async (product: MaterialSegment, { rejectWithValue }) => {
    try {
      const response = await AdminMaterialSegmentService.addMaterialSegment(
        product
      );

      if (response.status != false) {
        return response.data as MaterialSegment;
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

export const updateSegmentInTable = createAsyncThunk(
  "projects/updateSegmentInTable",
  async (
    product: { product: MaterialSegment; id: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await AdminMaterialSegmentService.updateMaterialSegment(
        product
      );

      if (response.status != false) {
        return response.data as MaterialSegment;
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

const adminMaterialSegmentSlice = createSlice({
  name: "adminMaterialSegmentSlice",
  initialState,
  reducers: {
    handlesortingsegments: (state, action) => {
      const sortOrder =
        action.payload.orderby == state.sortfield && state.sortorder == "asec"
          ? "desc"
          : "asec";
      state.sortfield = action.payload.orderby;
      state.sortorder = sortOrder;
    },
    handleSelectViewSegments: (state, action) => {
      state.currentSegment = action.payload;
      state.isOpen = true;
    },
    handleCloseSegmentModal: (state) => {
      state.currentSegment = null;
      state.isOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminFetchMaterialSegments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminFetchMaterialSegments.fulfilled, (state, action) => {
        state.list = action.payload;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(adminFetchMaterialSegments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addNewSegmentInTable.pending, (state) => {
        state.adding = true;
      })
      .addCase(addNewSegmentInTable.fulfilled, (state, action) => {
        const newAddedBrand = action.payload;
        if (newAddedBrand !== undefined || newAddedBrand != null) {
          state.list.push(newAddedBrand);
        }
        state.error = null;
        state.adding = false;
      })
      .addCase(addNewSegmentInTable.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload as string;
      })
      .addCase(updateSegmentInTable.pending, (state) => {
        state.adding = true;
      })
      .addCase(updateSegmentInTable.fulfilled, (state, action) => {
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
      .addCase(updateSegmentInTable.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  handlesortingsegments,
  handleSelectViewSegments,
  handleCloseSegmentModal,
} = adminMaterialSegmentSlice.actions;

export default adminMaterialSegmentSlice.reducer;
