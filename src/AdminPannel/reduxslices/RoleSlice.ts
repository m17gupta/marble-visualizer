import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoleModel } from '../components/role/type';
import { RoleService } from '../services/role/RoleService';


interface RoleState {
  isRoleLoading: boolean;
  role: RoleModel[];
  isError: string;
}

const initialState: RoleState = {
  isRoleLoading: false,
  role: [],
  isError: '',
};

// create thuck to fetcch Role data from api

export const fetchRoles = createAsyncThunk('role/fetchRoles', async () => {
  const response = await RoleService.getRoles();
  return response;
});

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRoleLoading(state, action: PayloadAction<boolean>) {
      state.isRoleLoading = action.payload;
    },
    setRole(state, action: PayloadAction<RoleModel[]>) {
      state.role = action.payload;
    },
    setRoleError(state, action: PayloadAction<string>) {
      state.isError = action.payload;
    },
    clearRoleError(state) {
      state.isError = '';
    },
  },

  // extra reducers for async thunks
    extraReducers: (builder) => {
    builder
        .addCase(fetchRoles.pending, (state) => {
            state.isRoleLoading = true;
            state.isError = '';
        })
        .addCase(fetchRoles.fulfilled, (state, action: PayloadAction<RoleModel[]>) => {
            state.isRoleLoading = false;
            state.role = action.payload;
        })
        .addCase(fetchRoles.rejected, (state, action) => {
            state.isRoleLoading = false;
            state.isError = action.error.message || 'Failed to fetch roles';
        });
    },
});

export const { setRoleLoading, setRole, setRoleError, clearRoleError } = roleSlice.actions;
export default roleSlice.reducer;