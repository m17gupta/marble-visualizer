import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '@/services/authService';
import { User, UserProfile, LoginCredentials, SignUpCredentials, AuthError } from '@/models';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,
  accessToken: null,
  refreshToken: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.signIn(credentials);
      return response;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Login failed. Please check your credentials.');
    }
  }
);

// Async thunk for registration
export const signUpUser = createAsyncThunk(
  'auth/signUpUser',
  async (credentials: SignUpCredentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.signUp(credentials);
      return response;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await AuthService.signOut();
      
      // Force a route change - add this if needed in your setup
      window.location.href = '/login'; // Force full page refresh to ensure clean state
      
      return null;
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if server-side logout fails, we should still clean up locally
      // This is important for UX - users expect to be able to log out regardless
      dispatch(clearAuth()); // Immediately clear the Redux state
      
      // Force a route change regardless of error
      window.location.href = '/login';
      
      if (error instanceof AuthError) {
        // We return the error, but the UI will still show as logged out
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Logout failed, but local session has been cleared');
    }
  }
);

// Async thunk to initialize auth state
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const result = await AuthService.getCurrentUser();
      return result;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to initialize authentication');
    }
  }
);

// Async thunk to get current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const result = await AuthService.getCurrentUser();
      return result;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to get current user');
    }
  }
);

// Async thunk to refresh session
export const refreshSession = createAsyncThunk(
  'auth/refreshSession',
  async (_, { rejectWithValue }) => {
    try {
      const session = await AuthService.refreshSession();
      if (!session) {
        throw new Error('No session returned');
      }
      
      const result = await AuthService.getCurrentUser();
      return result;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Session refresh failed');
    }
  }
);

// // Async thunk to update profile
// export const updateProfile = createAsyncThunk(
//   'auth/updateProfile',
//   async (updates: { name?: string; dob?: string; image?: string; projects?: any }, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as { auth: AuthState };
//       if (!state.auth.user) {
//         throw new Error('No user logged in');
//       }
      
//       const updatedProfile = await AuthService.updateProfile(state.auth.user.id, updates);
//       return updatedProfile;
//     } catch (error) {
//       if (error instanceof AuthError) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue('Failed to update profile');
//     }
//   }
// );

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<{ user: User; profile: UserProfile } | null>) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.profile = null;
        state.isAuthenticated = false;
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;
      state.error = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload) {
          state.user = action.payload.user;
          state.profile = action.payload.profile;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.profile = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
        state.accessToken = action.payload.session.access_token;
        state.refreshToken = action.payload.session.refresh_token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Sign up cases
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
        state.accessToken = action.payload.session.access_token;
        state.refreshToken = action.payload.session.refresh_token;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.profile = null;
        state.isAuthenticated = false;
        state.error = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Even if logout fails on the server, we should clear the state in the client
        // This ensures the user can still "log out" from the UI perspective
        state.user = null;
        state.profile = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
      })
      
      // Get current user cases
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.profile = action.payload.profile;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.profile = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
        state.profile = null;
        state.isAuthenticated = false;
      })
      
      // Refresh session cases
      .addCase(refreshSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.profile = action.payload.profile;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.profile = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(refreshSession.rejected, (state) => {
        state.user = null;
        state.profile = null;
        state.isAuthenticated = false;
      })
      
   
  },
});

export const { clearError, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;