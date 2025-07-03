import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GenAiChat, GenAiRequest, GenAiResponse } from '@/models/genAiModel/GenAiModel';
import genAiService from '@/services/genAi/genAiService';

interface GenAiState {
  genAiImages: GenAiChat[];
  requests: Record<string, GenAiRequest>;
  responses: Record<string, GenAiResponse>;
  loading: boolean;
  error: string | null;
  currentRequestId: string | null;
}

// Initial state
const initialState: GenAiState = {
  genAiImages: [],
  requests: {},
  responses: {},
  loading: false,
  error: null,
  currentRequestId: null,
};

// Async thunk for submitting a GenAI request
export const submitGenAiRequest = createAsyncThunk(
  'genAi/submitRequest',
  async (request: GenAiRequest, { rejectWithValue }) => {
    try {
      const response = await genAiService.submitRequest(request);
      return response;
    } catch (error) {
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
    // Add a new request manually
    addRequest: (state, action: PayloadAction<{ id: string; request: GenAiRequest }>) => {
      const { id, request } = action.payload;
      state.requests[id] = request;
      state.currentRequestId = id;
    },
    // Update response manually
    updateResponse: (state, action: PayloadAction<GenAiResponse>) => {
      const response = action.payload;
      state.responses[response.id] = response;
    },
  },
  extraReducers: (builder) => {
    // Handle submitGenAiRequest
    // builder
    //   .addCase(submitGenAiRequest.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(submitGenAiRequest.fulfilled, (state, action) => {
    //     state.loading = false;
    //     if(state.genAiImages.length === 0) {
    //       state.genAiImages = [action.payload as GenAiChat];
    //     } else {
    //       state.genAiImages = [...state.genAiImages, action.payload as GenAiChat];
    //     }
    //   })
    //   .addCase(submitGenAiRequest.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string || 'Failed to submit GenAI request';
    //   });

    // Handle checkGenAiStatus
    builder
      .addCase(fetchGenAiChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenAiChat.fulfilled, (state, action) => {
        state.loading = false;
        const chats = action.payload as GenAiChat[];
        state.genAiImages = chats;
      })
      .addCase(fetchGenAiChat.rejected, (state, action) => {
        state.loading = false;
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
        state.genAiImages = [...state.genAiImages, newChat];
      })
      .addCase(insertGenAiChatData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to insert GenAI chat';
      });
  },
});

// Export actions
export const { clearCurrentRequest, clearError, addRequest, updateResponse } = genAiSlice.actions;

// Export reducer
export default genAiSlice.reducer;
