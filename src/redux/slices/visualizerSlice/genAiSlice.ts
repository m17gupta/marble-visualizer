import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GenAiChat, GenAiRequest, GenAiResponse } from '@/models/genAiModel/GenAiModel';
import genAiService from '@/services/genAi/genAiService';

interface GenAiState {
  genAiImages: GenAiChat[];
  requests: GenAiRequest;
  inspirationNames: string; // Optional field for storing inspiration names
  responses: Record<string, GenAiResponse>;
  loading: boolean;
  
  error: string | null;
  currentRequestId: string | null;
  generatedImage: string; // Optional field for storing generated image URL
  originalHouseImage: string; // Optional field for storing original house image URL
  isSubmitGenAiFailed?: boolean;
  task_id?: string; // Optional field for storing task ID
  isFetchingGenAiImages: boolean; // Flag to indicate if GenAI images are being fetched
}

// Initial state
const initialState: GenAiState = {
  genAiImages: [],
  inspirationNames: "", // Optional field for storing inspiration names
  requests: {
    houseUrl: [],
    paletteUrl: [],
    referenceImageUrl: [],
    prompt: [],
    imageQuality: 'medium', // Assuming 'medium' is a valid default value
    annotationValue: {},
    externalUserId: "dzinly-prod",
    jobId: "", // Assuming jobId is a number, set to 0 as default

  },
  responses: {},
  loading: false,
  error: null,
  currentRequestId: null,
  generatedImage: "",
  originalHouseImage: "",
  isSubmitGenAiFailed: false, // Optional field to track if the submission failed
  task_id: "", // Optional field for storing task ID
  isFetchingGenAiImages: false, // Flag to indicate if GenAI images are being fetched
};

// Async thunk for submitting a GenAI request
export const submitGenAiRequest = createAsyncThunk(
  'genAi/submitRequest',
  async (request: GenAiRequest, { rejectWithValue }) => {
    try {
      const response = await genAiService.submitRequest(request);
      return response;
    } catch (error) {
      console.error('Error submitting GenAI request:', error);
      return rejectWithValue((error as Error).message);
    }
  }
);

// async forfetch all get Ai chat from database
export const fetchGenAiChat = createAsyncThunk(
  'genAi/fetchChat',
  async (jobId: number, { rejectWithValue }) => {
    try {
      const response = await genAiService.getAllGenAiChats(jobId);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for update the status of a GenAI request
export const insertGenAiChatData = createAsyncThunk(
  'genAi/updateStatus',
  async (payload: GenAiChat, { rejectWithValue }) => {
    try {
      const response = await genAiService.insertGenAiChat(payload);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create the slice
const genAiSlice = createSlice({
  name: 'genAi',
  initialState,
  reducers: {
    // Clear current request
    clearCurrentRequest: (state) => {
      state.currentRequestId = null;
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Add a new request manuall
    addInspirationImage: (state, action) => {
      // state.requests.referenceImageUrl=[action.payload];
      const imageValue = action.payload instanceof File
        ? URL.createObjectURL(action.payload) // Create a URL for the file
        : action.payload; // Use the existing value if it's already a string

      state.requests.referenceImageUrl = [imageValue];

    },
    resetInspirationImage: (state) => {
      // Clear the reference image URL
      state.requests.referenceImageUrl = [];
    },

    addPaletteImage: (state, action) => {
      state.requests.paletteUrl = [action.payload];
    },
    addPrompt: (state, action) => {
      if (!action.payload || action.payload.trim() === "") {
        state.requests.prompt = []; // Do not add empty or whitespace-only prompts
      } else {
        state.requests.prompt = [action.payload];
      }

    },
    addHouseImage: (state, action) => {
      state.requests.houseUrl = [action.payload];
    },
    updateInspirationNames: (state, action: PayloadAction<string>) => {

      state.inspirationNames = action.payload;
    },

    updateGeneratedImage: (state, action: PayloadAction<string>) => {

      state.generatedImage = action.payload;
    },
    updateOriginalHouseImage: (state, action: PayloadAction<string>) => {
      state.originalHouseImage = action.payload;
    },
    updateRequestJobId: (state, action: PayloadAction<string>) => {
      state.requests.jobId = action.payload;
    },
    // Update response manually
    updateResponse: () => {
      // const response = action.payload;
      // state.responses[response.id] = response;
    },
    resetIsGenAiSumitFailed: (state, action) => {
      state.isSubmitGenAiFailed = action.payload; // Reset the flag when needed
    },
    resetGenAiState: () => {
      return initialState
    },

    updateTaskId: (state, action: PayloadAction<string>) => {
      state.task_id = action.payload; // Update the task_id in the state
    },
    resetRequest: (state) => {
      state.requests = {
        houseUrl: state.requests.houseUrl, 
        paletteUrl: [],
        referenceImageUrl: [],
        prompt: [],
        imageQuality: 'medium',
        annotationValue: {},
        externalUserId: "dzinly-prod",
        jobId: state.requests.jobId, // Reset jobId to its current value
      };
    },
   
  },
  extraReducers: (builder) => {
    // Handle submitGenAiRequest
    builder
      .addCase(submitGenAiRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isSubmitGenAiFailed = false; // Reset the flag when starting a new request
      })
      .addCase(submitGenAiRequest.fulfilled, (state) => {
        state.loading = false;
        state.isSubmitGenAiFailed = false; // Reset the flag on successful submission
      })
      .addCase(submitGenAiRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to submit GenAI request';
        state.isSubmitGenAiFailed = true; // Set the flag to true if submission fails
      });

    // Handle checkGenAiStatus
    builder
      .addCase(fetchGenAiChat.pending, (state) => {
        state.isFetchingGenAiImages  = true;
        state.error = null;
      })
      .addCase(fetchGenAiChat.fulfilled, (state, action) => {
        state.isFetchingGenAiImages = false;
        const chats = action.payload as GenAiChat[];
        state.genAiImages = chats;
      })
      .addCase(fetchGenAiChat.rejected, (state, action) => {
        state.isFetchingGenAiImages = false;
        state.error = action.payload as string || 'Failed to fetch GenAI chats';
      });

    // Handle insertGenAiChatData
    builder
      .addCase(insertGenAiChatData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertGenAiChatData.fulfilled, (state, action) => {
        state.loading = false;
        const newChat = action.payload as GenAiChat;

        // Check if the chat with this task_id already exists in the state
        const chatExists = state.genAiImages.some(chat => chat.task_id === newChat.task_id);

        // Only add the chat if it doesn't already exist
        if (!chatExists) {
          state.genAiImages = [...state.genAiImages, newChat];
        } else {
          console.log('Chat with task_id', newChat.task_id, 'already exists in state, not adding duplicate');
        }
      })
      .addCase(insertGenAiChatData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to insert GenAI chat';
      });
  },
});

// Export actions
export const {
  clearCurrentRequest,
  clearError,
  updateResponse,
  addHouseImage,
  addPaletteImage,
  addPrompt,
  addInspirationImage,
  resetInspirationImage,
  updateGeneratedImage,
  updateOriginalHouseImage,
  updateInspirationNames,
  resetRequest,
  updateRequestJobId,
  resetGenAiState,
  resetIsGenAiSumitFailed,
  updateTaskId

} = genAiSlice.actions;

// Export reducer
export default genAiSlice.reducer;
