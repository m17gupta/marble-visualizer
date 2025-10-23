import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role_permission_Model } from '../components/permission/type';
import { RoleService } from '../services/role/RoleService';


interface PermissionState {
  isPermissionLoading: boolean;
  allPermissions: Role_permission_Model[];
  isError: string;
}

const initialState: PermissionState = {
  isPermissionLoading: false,
  allPermissions: [],
  isError: '',
};

// create thuck to fetcch Role Permission data from api

export const fetchRolePermissions = createAsyncThunk('role_permission/fetchRolePermissions', async () => {
  const response = await RoleService.getAllRolePermissions();
  return response;
});

// create thunk to create Role Permission
export const createRolePermission = createAsyncThunk(
  'role_permission/createRolePermission',
  async (permission: Role_permission_Model): Promise<Role_permission_Model[]> => {
    const response = await RoleService.addRolePermission(permission);
    return response ? (response as Role_permission_Model[]) : [];
  }
);

const permissionSlice = createSlice({
  name: 'role_permission',
  initialState,
  reducers: {
    setPermissionLoading(state, action: PayloadAction<boolean>) {
      state.isPermissionLoading = action.payload;
    },
    setAllPermissions(state, action: PayloadAction<Role_permission_Model[]>) {
      state.allPermissions = action.payload;
    },
    setPermissionError(state, action: PayloadAction<string>) {
      state.isError = action.payload;
    },
    resetPermissionState(state) {
      state.isPermissionLoading = false;
      state.allPermissions = [];
      state.isError = '';
    },
  },

  // extra reducers for async thunks
    extraReducers: (builder) => {
    builder
        .addCase(fetchRolePermissions.pending, (state) => {
            state.isPermissionLoading = true;
            state.isError = '';
        })
        .addCase(fetchRolePermissions.fulfilled, (state, action: PayloadAction<Role_permission_Model[]>) => {
            state.isPermissionLoading = false;
            state.allPermissions = action.payload;
        })
        .addCase(fetchRolePermissions.rejected, (state, action) => {
            state.isPermissionLoading = false;
            state.isError = action.error.message || 'Failed to fetch role permissions';
        });

        // createRolePermission cases
        builder
        .addCase(createRolePermission.pending, (state) => { 
            state.isPermissionLoading = true;
            state.isError = '';
        })
    .addCase(createRolePermission.fulfilled, (state, action) => {
      state.isPermissionLoading = false;
      // supabase insert returns array, so push first item if present
      if (Array.isArray(action.payload) && action.payload.length > 0) {
        state.allPermissions.push(action.payload[0]);
      }
    })
        .addCase(createRolePermission.rejected, (state, action) => {
            state.isPermissionLoading = false;
            state.isError = action.error.message || 'Failed to create role permission';
        }); 

    },

});


export const { setPermissionLoading, setAllPermissions, setPermissionError, resetPermissionState } = permissionSlice.actions;
export default permissionSlice.reducer;
