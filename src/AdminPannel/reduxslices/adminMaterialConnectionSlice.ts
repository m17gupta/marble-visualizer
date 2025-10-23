import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MaterialConnection } from "@/components/swatchBook/interfaces";
import { AdminMaterialConnectionService } from "../services/Material/AdminMaterialConnectionService";
import { stateProperties } from "node_modules/fabric/dist/src/shapes/Object/defaultValues";

export interface ProductBrandModal {
  list: MaterialConnection[];
  currentConnection: null | MaterialConnection;
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
  currentConnection: null,
  isLoading: false,
  error: null,
  sortorder: "asec",
  sortfield: "id",
  isOpen: false,
  currentloading: false,
  adding: false,
};

// Async thunk to fetch projects
export const adminFetchMaterialConnection = createAsyncThunk(
  "projects/adminFetchMaterialConnection",
  async (
    { orderby, order }: { orderby: string; order: string },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await AdminMaterialConnectionService.getMaterialConnectionByPagination(
          orderby,
          order
        );

      if (response.status != false) {
        return response.data as MaterialConnection[];
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

export const addNewConnectionInTable = createAsyncThunk(
  "projects/addNewConnectionInTable",
  async (product: MaterialConnection, { rejectWithValue }) => {
    try {
      const response =
        await AdminMaterialConnectionService.addMaterialConnection(product);

      if (response.status != false) {
        return response.data as MaterialConnection;
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

export const updateConnectionInTable = createAsyncThunk(
  "projects/updateConnectionInTable",
  async (
    product: { product: MaterialConnection; id: number },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await AdminMaterialConnectionService.updateMaterialConnection(product);

      if (response.status != false) {
        return response.data as MaterialConnection;
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

const adminMaterialConnectionSlice = createSlice({
  name: "adminMaterialConnectionSlice",
  initialState,
  reducers: {
    handlesortingConnection: (state, action) => {
      const sortOrder =
        action.payload.orderby == state.sortfield && state.sortorder == "asec"
          ? "desc"
          : "asec";
      state.sortfield = action.payload.orderby;
      state.sortorder = sortOrder;
    },
    handleSelectViewConnection: (state, action) => {
      state.currentConnection = action.payload;
      state.isOpen = true;
    },
    handlecancelconnection: (state) => {
      state.currentConnection = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminFetchMaterialConnection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminFetchMaterialConnection.fulfilled, (state, action) => {
        state.list = action.payload;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(adminFetchMaterialConnection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addNewConnectionInTable.pending, (state) => {
        state.adding = true;
      })
      .addCase(addNewConnectionInTable.fulfilled, (state, action) => {
        const newAddedBrand = action.payload;
        if (newAddedBrand !== undefined || newAddedBrand != null) {
          state.list.push(newAddedBrand);
        }
        state.error = null;
        state.adding = false;
      })
      .addCase(addNewConnectionInTable.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload as string;
      })
      .addCase(updateConnectionInTable.pending, (state) => {
        state.adding = true;
      })
      .addCase(updateConnectionInTable.fulfilled, (state, action) => {
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
      .addCase(updateConnectionInTable.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  handlesortingConnection,
  handlecancelconnection,
  handleSelectViewConnection,
} = adminMaterialConnectionSlice.actions;

export default adminMaterialConnectionSlice.reducer;
