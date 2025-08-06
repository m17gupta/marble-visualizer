import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { InspirationImageModel } from '@/models/inspirational/Inspirational';
import { InspirationalImageService } from '@/services/inspirational';

interface InspirationalImageState {
  Inspirational_images: InspirationImageModel[];
  selectedColorFamilyId: number | null;
  isLoading: boolean;
  error: string | null;
  
}

const initialState: InspirationalImageState = {
  Inspirational_images: [],  
  selectedColorFamilyId: null,
  isLoading: false,
  error: null,
};

// Async thunk to fetch inspirational images
export const fetchInspirationalImages = createAsyncThunk(
  'inspirationalImages/fetchImages',
  async (_, { rejectWithValue }) => {
    try {
      const result = await InspirationalImageService.getInspirationImages();

      if (result.success && result.data) {
        return {
          images: result.data,
          message: result.message,
        };
      } else {
        return rejectWithValue(result.error || 'Failed to fetch inspirational images');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);



const inspirationalImageSlice = createSlice({
  name: 'inspirationalImages',
  initialState,
  reducers: {
    
    clearImages: (state) => {
      state.Inspirational_images = [];
      
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch inspirational images
    builder
      .addCase(fetchInspirationalImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInspirationalImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Inspirational_images = action.payload.images;
        state.error = null;
      })
      .addCase(fetchInspirationalImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

  

   
  ;
  },
});

export const {
  clearImages,
  clearError,
  resetState,
} = inspirationalImageSlice.actions;

export default inspirationalImageSlice.reducer;
