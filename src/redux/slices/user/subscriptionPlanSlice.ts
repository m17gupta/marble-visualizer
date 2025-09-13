import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SubscriptionPlanModel } from "@/models/subscriptionPlan/SubscriptionPlanModel";
import { SubscriptionPlanService } from "@/services/subscriptionPlan";
import { userSubscriptionPlanRespone } from "@/services/subscriptionPlan/SubscriptionPlanApi";

interface SubscriptionPlanState {
  userSubscriptionPlan: SubscriptionPlanModel | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: SubscriptionPlanState = {
  userSubscriptionPlan: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

// Async thunk to fetch user subscription plans
export const fetchUserSubscriptionPlans = createAsyncThunk<
  userSubscriptionPlanRespone,
  { userId: string },
  { rejectValue: string }
>("subscriptionPlan/fetchUserPlans", async ({ userId }  , { rejectWithValue }) => {
  try {
    const response = await SubscriptionPlanService.getUserPlans(userId);
    return response;
  } catch (error) {
    console.error("Redux fetchUserSubscriptionPlans - Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch user subscription plans";
    return rejectWithValue(errorMessage);
  }
});

const subscriptionPlanSlice = createSlice({
  name: "subscriptionPlan",
  initialState,
  reducers: {
    // Clear all errors
    clearErrors: (state) => {
      state.error = null;

    },
    
 

    // Reset all subscription plan data
    resetSubscriptionPlanState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch user subscription plans
    builder
      .addCase(fetchUserSubscriptionPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })  
      .addCase(fetchUserSubscriptionPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Assuming the response contains the subscription plan data
        state.userSubscriptionPlan = action.payload.data || action.payload as any;
        state.lastFetched = Date.now();
      })
      .addCase(fetchUserSubscriptionPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "An unknown error occurred";
        state.userSubscriptionPlan = null;
        state.lastFetched = null;
      });
  },
});

export const {
  clearErrors,

  resetSubscriptionPlanState,

} = subscriptionPlanSlice.actions;

export default subscriptionPlanSlice.reducer;
