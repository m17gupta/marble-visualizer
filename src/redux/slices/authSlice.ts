import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthService } from "@/services/authService/authService";
import {
  User,
  LoginCredentials,
  SignUpCredentials,
  AuthError,
} from "@/models";
import { UserPlan } from "@/models/userModel/UserPLanModel";

interface AuthState {
  user: User | null;
  userPlan: UserPlan | null;
  isLoading: boolean;
  isSubscriptionLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  userPlan: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,
  accessToken: null,
  refreshToken: null,
  isSubscriptionLoading: false,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.signIn(credentials);
        
      return response;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Login failed. Please check your credentials.");
    }
  }
);

// Async thunk for registration
export const signUpUser = createAsyncThunk(
  "auth/signUpUser",
  async (credentials: SignUpCredentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.signUp(credentials);
        return response;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Registration failed. Please try again.");
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await AuthService.signOut();
    
      return null;
    } catch (error) {
      console.error("Logout error:", error);

      // Even if server-side logout fails, we should still clean up locally
      // This is important for UX - users expect to be able to log out regardless
      dispatch(clearAuth()); // Immediately clear the Redux state

      if (error instanceof AuthError) {
        // We return the error, but the UI will still show as logged out
        return rejectWithValue(error.message);
      }
      return rejectWithValue(
        "Logout failed, but local session has been cleared"
      );
    }
  }
);

// Async thunk to initialize auth state
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue }) => {
    try {
      const result = await AuthService.getCurrentUser();
      return result;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to initialize authentication");
    }
  }
);

// Async thunk to get current user
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const result = await AuthService.getCurrentUser();

      return result;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to get current user");
    }
  }
);

// get UserSunscriptionPlan
export const getUserSubscriptionPlan = createAsyncThunk(  
  "auth/getUserSubscriptionPlan",
  async (userId: string, { rejectWithValue }) => {
    try {
      const userPlan = await AuthService.getUserPlan(userId);
      return userPlan;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to get user subscription plan");
    }
  }
);

// update UserSubscriptionPlan
export const updateUserSubscriptionPlan = createAsyncThunk(
  "auth/updateUserSubscriptionPlan",
  async ({ userId, credits }: { userId: string; credits: number }, { rejectWithValue }) => {
    try {
      const updatedPlan = await AuthService.updateUserPlan(userId, credits);
      console.log("Updated User Plan:", updatedPlan);
      return updatedPlan;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update user subscription plan");
    }
  }
);

// Async thunk to refresh session
export const refreshSession = createAsyncThunk(
  "auth/refreshSession",
  async (_, { rejectWithValue }) => {
    try {
      const session = await AuthService.refreshSession();
      if (!session) {
        throw new Error("No session returned");
      }

      const result = await AuthService.getCurrentUser();
      return result;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Session refresh failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (
      state,
      action: PayloadAction<User | null>
    ) => {
      if (action.payload) {
        state.user = action.payload;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.userPlan = null;
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
          state.userPlan = action.payload.userPlan || null; // Set user plan if available
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.userPlan = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
        
        // Don't set error for "Auth session missing!" as it's a normal condition
        // when user is not logged in
        if (action.payload !== 'Auth session missing!') {
          state.error = action.payload as string;
        }
      })

      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.userPlan = action.payload.userPlan || null;
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
        state.userPlan = action.payload.userPlan || null;
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
        // state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // state.isLoading = false;
        state.user = null;
        state.userPlan = null;
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
        state.userPlan = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
      })

      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.userPlan = action.payload.userPlan || null;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.userPlan = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
        state.userPlan = null;
        state.isAuthenticated = false;
      })

      // Refresh session cases
      .addCase(refreshSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.userPlan = action.payload?.userPlan || null;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.userPlan = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(refreshSession.rejected, (state) => {
        state.user = null;
        state.userPlan = null;
        state.isAuthenticated = false;
      });

      // Get user subscription plan
      builder.addCase(getUserSubscriptionPlan.pending, (state) => { 
        state.isSubscriptionLoading = true;
        state.error = null;
      })
      .addCase(getUserSubscriptionPlan.fulfilled, (state, action) => {
        state.isSubscriptionLoading = false;
        state.userPlan = action.payload;
      })    
      .addCase(getUserSubscriptionPlan.rejected, (state, action) => {
        state.isSubscriptionLoading = false;
        state.error = action.payload as string;
      });
   // update user subscription plan
    builder.addCase(updateUserSubscriptionPlan.pending, (state) => {
      state.isSubscriptionLoading = true;
      state.error = null;
    })
    .addCase(updateUserSubscriptionPlan.fulfilled, (state, action) => {
      state.isSubscriptionLoading = false;
      // state.userPlan?.credits = action.payload?.credits || 0; // Update credits in userPlan
    })
    .addCase(updateUserSubscriptionPlan.rejected, (state, action) => {
      state.isSubscriptionLoading = false;
      state.error = action.payload as string;
    });

  },
});

export const { clearError, setUser, clearAuth } = authSlice.actions;

export const getUserData = (state: { auth: AuthState }) => state.auth.user;
export default authSlice.reducer;
