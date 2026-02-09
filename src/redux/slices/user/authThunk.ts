import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "@/services/authService/authService";
import {
    LoginCredentials,
    SignUpCredentials,
    AuthError,
} from "@/models";

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
    async (_, { rejectWithValue }) => {
        try {
            await AuthService.signOut();

            return null;
        } catch (error) {
            console.error("Logout error:", error);

            // We don't dispatch clearAuth() here to avoid circular dependency.
            // The state clearing is handled in the authSlice's extraReducers (both fulfilled and rejected cases).

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
            // console.log("Auth initialized with user:", result);
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

// Async thunk for reset password
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (email: string, { rejectWithValue }) => {
        try {
            await AuthService.resetPassword(email);
            return { email }; // Return the email for success handling
        } catch (error) {
            if (error instanceof AuthError) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("Failed to send reset password email. Please try again.");
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

            console.log(session)

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

// create a thunk to user token
export const getUserToken = createAsyncThunk(
    "auth/getUserToken",
    async (_, { rejectWithValue }) => {
        try {
          const token = await AuthService.getUserToken();
            return token;
        } catch (error) {
            if (error instanceof AuthError) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("Failed to get user token");
        }
    }
);