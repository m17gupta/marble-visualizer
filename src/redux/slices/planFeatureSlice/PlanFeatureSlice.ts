// crreate pproce slice  to plan_feature
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { PlanFeatureModel } from "@/models/userModel/UserPLanModel";
import { PlanFeaturesService } from "@/services/planFeatures/PlanFeaturesServices";

// Define the initial state using that type
interface PlanFeatureState   {
    isloading: boolean;
    error: string | null;
    planFeatures: PlanFeatureModel[];
}

const initialState:  PlanFeatureState = {
    isloading: false,
    error: null,
    planFeatures: [],
};

export const fetchPlanFeatures = createAsyncThunk(
    'price/fetchPlanFeatures',
    async (_, { rejectWithValue }) => {
        try {
            const response = await PlanFeaturesService.getPlanFeatures();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);  


const planFeatureSlice = createSlice({
    name: 'planFeature',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlanFeatures.pending, (state) => {
                state.isloading = true;
                state.error = null;
            })
            .addCase(fetchPlanFeatures.fulfilled, (state, action) => {
                state.isloading = false;
                state.planFeatures = action.payload;
            })
            .addCase(fetchPlanFeatures.rejected, (state, action) => {
                state.isloading = false;
                state.error = action.payload as string;
            });
    },
});


export default planFeatureSlice.reducer;
