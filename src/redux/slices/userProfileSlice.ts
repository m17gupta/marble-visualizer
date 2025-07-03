import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile, AuthError } from "@/models";
import { AuthAPI } from "@/services/authService/api/authApi";
import { AuthService } from "@/services/authService/authService";

interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  updateError: string | null;
}

const initialState: UserProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  isUpdating: false,
  updateError: null,
};
//create a thunk to create user profile
export const createUserProfile = createAsyncThunk(
  "userProfile/createUserProfile",
  async (profileData: UserProfile, { rejectWithValue }) => {
    try {
      const newProfile = await AuthService.createUserProfile(profileData);
      return newProfile;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to create user profile");
    }
  }
);

// Async thunk to get user profile
export const getUserProfile = createAsyncThunk(
  "userProfile/getUserProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log("Redux getUserProfile - Starting with userId:", userId);
      
      if (!userId || userId.trim() === '') {
        return rejectWithValue("User ID is required");
      }
      
      let profile = await AuthService.getUserProfileByUserId(userId);
   
      // If no profile found, try to get user info and create a profile
      if (!profile) {
        console.log("Redux getUserProfile - No profile found, attempting to create one");
        
        try {
          // Get current user from auth to get email
          const currentUser = await AuthAPI.getCurrentUser();
          if (currentUser && currentUser.user.id === userId) {
            // Try to ensure profile exists
            profile = await AuthAPI.ensureUserProfile(
              userId, 
              currentUser.user.email, 
              currentUser.user.email?.split('@')[0]
            );
            console.log("Redux getUserProfile - Created new profile:", profile);
          }
        } catch (createError) {
          console.error("Redux getUserProfile - Failed to create profile:", createError);
        }
        
        // If still no profile, return error
        if (!profile) {
          return rejectWithValue("User profile not found and could not be created");
        }
      }
      
      return profile;
    } catch (error) {
      console.error("Redux getUserProfile - Error fetching user profile:", error);
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch user profile");
    }
  }
);

// Async thunk to update user profile
export const updateUserProfile = createAsyncThunk(
  "userProfile/updateUserProfile",
  async (
    { userId, updates }: { userId: string; updates: Partial<UserProfile> },
    { rejectWithValue }
  ) => {
    try {
      const updatedProfile = await AuthAPI.updateUserProfile(userId, updates);
      return updatedProfile;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update user profile");
    }
  }
);

// Async thunk to upload profile image
export const uploadProfileImage = createAsyncThunk(
  "userProfile/uploadProfileImage",
  async (
    { userId, imageFile }: { userId: string; imageFile: File },
    { rejectWithValue }
  ) => {
    try {
      const response = await AuthAPI.uploadProfileImage(userId, imageFile);
      return response.imageUrl;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to upload profile image");
    }
  }
);

// Async thunk to delete profile image
export const deleteProfileImage = createAsyncThunk(
  "userProfile/deleteProfileImage",
  async (
    { userId, imageUrl }: { userId: string; imageUrl: string },
    { rejectWithValue }
  ) => {
    try {
      await AuthAPI.deleteProfileImage(userId, imageUrl);
      return null;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to delete profile image");
    }
  }
);

// get userProfile based on sessionId
export const getUserProfileBySessionId = createAsyncThunk(
  "userProfile/getUserProfileBySessionId",
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await AuthAPI.getUserProfileBySessionId(sessionId);
      console.log("Fetched user profile by session ID: slice s", response);
      if(response=== null ) {
        return "No user profile found for session ID";
      }
      if (!response) {
        throw new Error("Failed to fetch user profile");
      }
      return response as UserProfile;
    } catch (error) {
      console.error("Error fetching user profile by session ID:", error);
      return rejectWithValue("Failed to fetch user profile");
    }
  }
);

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.updateError = null;
    },
    updateProfileField: (
      state,
      action: PayloadAction<{ field: keyof UserProfile; value: unknown }>
    ) => {
      if (state.profile) {
        (state.profile as Record<string, unknown>)[action.payload.field] = action.payload.value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user profile cases
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload as UserProfile || {};
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update user profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (state.profile) {
          // Merge the updates with the existing profile
          state.profile = { ...state.profile, ...action.payload };
        } else {
          state.profile = action.payload;
        }
        state.updateError = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      })

      // Upload profile image cases
      .addCase(uploadProfileImage.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (state.profile) {
          state.profile.profile_image = action.payload;
        }
        state.updateError = null;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      })

      // Delete profile image cases
      .addCase(deleteProfileImage.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(deleteProfileImage.fulfilled, (state) => {
        state.isUpdating = false;
        if (state.profile) {
          state.profile.profile_image = undefined;
        }
        state.updateError = null;
      })
      .addCase(deleteProfileImage.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      });
  },
});

export const { 
  clearProfileError, 
  setProfile, 
  clearProfile, 
  updateProfileField 
} = userProfileSlice.actions;

// Selectors
export const selectProfile = (state: { userProfile: UserProfileState }) => state.userProfile.profile;
export const selectProfileLoading = (state: { userProfile: UserProfileState }) => state.userProfile.isLoading;
export const selectProfileError = (state: { userProfile: UserProfileState }) => state.userProfile.error;
export const selectProfileUpdating = (state: { userProfile: UserProfileState }) => state.userProfile.isUpdating;
export const selectProfileUpdateError = (state: { userProfile: UserProfileState }) => state.userProfile.updateError;

export default userProfileSlice.reducer;
