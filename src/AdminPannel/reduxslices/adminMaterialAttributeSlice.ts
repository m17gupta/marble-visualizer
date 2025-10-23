import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MaterialAttributes } from "../../components/swatchBook/interfaces";
import { AdminMaterialAttributesService } from "../services/Material/AdminMaterialAttributesService";

export interface ProductAttributeModal {
  list: MaterialAttributes[];
  currentAttribute: null | MaterialAttributes;
  isLoading: boolean;
  error: null | string;
  sortfield: string;
  sortorder: string;
  isOpen: boolean;
  currentloading: boolean;
  adding: boolean;
}

const initialState: ProductAttributeModal = {
  list: [],
  currentAttribute: null,
  isLoading: false,
  error: null,
  sortorder: "asec",
  sortfield: "id",
  isOpen: false,
  currentloading: false,
  adding: false,
};

// Async thunk to fetch projects
export const adminFetchMaterialAttributes = createAsyncThunk(
  "projects/adminFetchMaterialAttributes",
  async (
    { orderby, order }: { orderby: string; order: string },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await AdminMaterialAttributesService.getMaterialAttributesByPagination(
          orderby,
          order
        );

      if (response.status != false) {
        return response.data as MaterialAttributes[];
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

export const addNewAttributeInTable = createAsyncThunk(
  "projects/addNewAttributeInTable",
  async (product: MaterialAttributes, { rejectWithValue }) => {
    try {
      const response =
        await AdminMaterialAttributesService.addMaterialAttributes(product);

      if (response.status != false) {
        return response.data as MaterialAttributes;
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

export const updateAttributeInTable = createAsyncThunk(
  "projects/updateAttributeInTable",
  async (
    product: { product: MaterialAttributes; id: number },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await AdminMaterialAttributesService.updateMaterialAttributes(product);

      if (response.status != false) {
        return response.data as MaterialAttributes;
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

const adminMaterialAttributesSlice = createSlice({
  name: "adminMaterialAttributesSlice",
  initialState,
  reducers: {
    handlesortingAttribute: (state, action) => {
      const sortOrder =
        action.payload.orderby == state.sortfield && state.sortorder == "asec"
          ? "desc"
          : "asec";
      state.sortfield = action.payload.orderby;
      state.sortorder = sortOrder;
    },
    handleSelectViewAttribute: (state, action) => {
      state.currentAttribute = action.payload;
      state.isOpen = true;
    },
    handlecancelAttribute: (state) => {
      state.currentAttribute = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminFetchMaterialAttributes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminFetchMaterialAttributes.fulfilled, (state, action) => {
        state.list = action.payload;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(adminFetchMaterialAttributes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addNewAttributeInTable.pending, (state) => {
        state.adding = true;
      })
      .addCase(addNewAttributeInTable.fulfilled, (state, action) => {
        const newAddedBrand = action.payload;
        if (newAddedBrand !== undefined || newAddedBrand != null) {
          state.list.push(newAddedBrand);
        }
        state.error = null;
        state.adding = false;
      })
      .addCase(addNewAttributeInTable.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload as string;
      })
      .addCase(updateAttributeInTable.pending, (state) => {
        state.adding = true;
      })
      .addCase(updateAttributeInTable.fulfilled, (state, action) => {
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
      .addCase(updateAttributeInTable.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  handlesortingAttribute,
  handleSelectViewAttribute,
  handlecancelAttribute,
} = adminMaterialAttributesSlice.actions;

export default adminMaterialAttributesSlice.reducer;
