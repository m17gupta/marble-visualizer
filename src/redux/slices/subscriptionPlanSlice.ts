import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SubscriptionPlanModel } from "@/models/subscriptionPlan/SubscriptionPlanModel";
import { SubscriptionPlanService, SubscriptionPlanFilters } from "@/services/subscriptionPlan";

interface SubscriptionPlanState {
  subscriptionalPlans: SubscriptionPlanModel[];
  activePlans: SubscriptionPlanModel[];
  currentPlan: SubscriptionPlanModel | null;
  plansGroupedByType: Record<string, SubscriptionPlanModel[]>;
  isLoading: boolean;
  isLoadingActivePlans: boolean;
  isLoadingCurrentPlan: boolean;
  isLoadingGroupedPlans: boolean;
  error: string | null;
  activeError: string | null;
  currentPlanError: string | null;
  groupedPlansError: string | null;
  lastFetched: number | null;
}

const initialState: SubscriptionPlanState = {
  subscriptionalPlans: [],
  activePlans: [],
  currentPlan: null,
  plansGroupedByType: {},
  isLoading: false,
  isLoadingActivePlans: false,
  isLoadingCurrentPlan: false,
  isLoadingGroupedPlans: false,
  error: null,
  activeError: null,
  currentPlanError: null,
  groupedPlansError: null,
  lastFetched: null,
};

// Async thunk to fetch all subscription plans
export const fetchAllSubscriptionPlans = createAsyncThunk(
  "subscriptionPlan/fetchAllPlans",
  async (filters: SubscriptionPlanFilters | undefined, { rejectWithValue }) => {
    try {
      console.log("Redux fetchAllSubscriptionPlans - Starting with filters:", filters);
      
      const plans = await SubscriptionPlanService.getAllPlans(filters);
      console.log("Redux fetchAllSubscriptionPlans - Fetched plans:", plans.length);
      
      return plans;
    } catch (error) {
      console.error("Redux fetchAllSubscriptionPlans - Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch subscription plans";
      return rejectWithValue(errorMessage);
    }
  }
);


const subscriptionPlanSlice = createSlice({
  name: "subscriptionPlan",
  initialState,
  reducers: {
    // Clear all errors
    clearErrors: (state) => {
      state.error = null;
      state.activeError = null;
      state.currentPlanError = null;
      state.groupedPlansError = null;
    },
    
    // Clear current plan
    clearCurrentPlan: (state) => {
      state.currentPlan = null;
      state.currentPlanError = null;
    },

    // Reset all subscription plan data
    resetSubscriptionPlanState: () => {
      return initialState;
    },

    // Set current plan manually
    setCurrentPlan: (state, action: PayloadAction<SubscriptionPlanModel | null>) => {
      state.currentPlan = action.payload;
      state.currentPlanError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all subscription plans
    builder
      .addCase(fetchAllSubscriptionPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllSubscriptionPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptionalPlans = action.payload;
        state.error = null;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAllSubscriptionPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.subscriptionalPlans = [];
      });

  

  },
});

export const {
  clearErrors,
  clearCurrentPlan,
  resetSubscriptionPlanState,
  setCurrentPlan,
} = subscriptionPlanSlice.actions;

export default subscriptionPlanSlice.reducer;
