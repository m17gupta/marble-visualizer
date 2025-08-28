import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  GenAiChat,
  GenAiRequest,
  GenAiResponse,
  RequestPaletteModel,
  SubmitGenAiResponseModel,
} from "@/models/genAiModel/GenAiModel";
import genAiService from "@/services/genAi/genAiService";

interface GenAiState {
  genAiImages: GenAiChat[];
  currentGenAiImage?: GenAiChat | null; // Optional field for the currently selected GenAI image
  requests: GenAiRequest;
  inspirationNames: string; // Optional field for storing inspiration names
  responses: Record<string, GenAiResponse>;
  loading: boolean;
  genAiRequestSubmit: SubmitGenAiResponseModel | null;
  isRenameGenAiModal: boolean;
  error: string | null;
  currentRequestId: string | null;
  currentRequestPalette: RequestPaletteModel[];
  isSubmitGenAiFailed?: boolean;
  task_id?: string | null;
  isFetchingGenAiImages: boolean;
  
}

// Initial state
const initialState: GenAiState = {
  genAiImages: [],
  currentGenAiImage: null, // Initialize as null
  inspirationNames: "", // Optional field for storing inspiration names
  requests: {
    houseUrl: [],
    paletteUrl: [],
    referenceImageUrl: [],
    prompt: [],
    imageQuality: "medium", // Assuming 'medium' is a valid default value
    annotationValue: {},
    externalUserId: "dzinly-prod",
    jobId: "", // Assuming jobId is a number, set to 0 as default
  },
  isRenameGenAiModal: false,
  responses: {},
  genAiRequestSubmit: null,
  loading: false,
  error: null,
  currentRequestId: null,
  isSubmitGenAiFailed: false, // Optional field to track if the submission failed
  task_id: null, // Optional field for storing task ID
  isFetchingGenAiImages: false,
  currentRequestPalette: []
};

// Async thunk for submitting a GenAI request
export const submitGenAiRequest = createAsyncThunk(
  "genAi/submitRequest",
  async (request: GenAiRequest, { rejectWithValue }) => {
    try {
      const response = await genAiService.submitRequest(request);

      return response.data;
    } catch (error) {
      console.error("Error submitting GenAI request:", error);
      return rejectWithValue((error as Error).message);
    }
  }
);

// async forfetch all get Ai chat from database
export const fetchGenAiChat = createAsyncThunk(
  "genAi/fetchChat",
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
  "genAi/updateStatus",
  async (payload: GenAiChat, { rejectWithValue }) => {
    try {
      const response = await genAiService.insertGenAiChat(payload);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// delete genAi _chat from table based on id
export const deleteGenAiChat = createAsyncThunk(
  "genAi/deleteChat",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await genAiService.deleteGenAiChat(id);

      if (!response) {
        throw new Error("Failed to delete GenAI chat");
      }

      return response;
    } catch (error) {
      console.error("Error deleting GenAI chat:", error);
      return rejectWithValue((error as Error).message);
    }
  }
);
// update the task id of genAi _chat
export const updateGenAiChatTaskId = createAsyncThunk(
  "genAi/updateTaskId",
  async (updateChatData: GenAiChat, { rejectWithValue }) => {
    try {
      const response = await genAiService.updateGenAiChatId(updateChatData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create the slice
const genAiSlice = createSlice({
  name: "genAi",
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
      const imageValue =
        action.payload instanceof File
          ? URL.createObjectURL(action.payload) // Create a URL for the file
          : action.payload; // Use the existing value if it's already a string

      state.requests.referenceImageUrl = [imageValue];
    },
    setCurrentGenAiImage: (state, action: PayloadAction<GenAiChat | null>) => {
      state.currentGenAiImage = action.payload;
    },
    resetInspirationImage: (state) => {
      // Clear the reference image URL
      state.requests.referenceImageUrl = [];
    },

    addPaletteImage: (state, action) => {
      // state.requests.paletteUrl = [action.payload];
      if (!state.requests.paletteUrl) {
        state.requests.paletteUrl = [];
      }
      state.requests.paletteUrl.push(action.payload);
    },
    removePaletteImage: (state, action) => {
      const palette = action.payload;
      if (state.requests.paletteUrl) {
        state.requests.paletteUrl = state.requests.paletteUrl.filter(
          (url) => url !== palette
        );
      }
    },
    resetPaletteImage: (state) => {
      state.requests.paletteUrl = []; // Reset the palette URL to an empty array
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
    updateMaskIntoRequest: (state, action) => {
      state.requests.annotationValue = action.payload;
    },

    resetMaskIntoRequest: (state) => {
      state.requests.annotationValue = {}; // Reset the annotation value to an empty object
    },
    updateInspirationNames: (state, action: PayloadAction<string>) => {
      state.inspirationNames = action.payload;
    },

    updateRequestJobId: (state, action: PayloadAction<string>) => {
      state.requests.jobId = action.payload;
    },
    updateIsRenameGenAiModal: (state, action: PayloadAction<boolean>) => {
      state.isRenameGenAiModal = action.payload; // Update the modal state
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
      return initialState;
    },

    updateTaskId: (state, action: PayloadAction<string>) => {
      state.task_id = action.payload; // Update the task_id in the state
    },
    addUpdateRequestPalette: (state, action) => {
      const { id, name, segments } = action.payload;
      const existingPalette = state.currentRequestPalette.find((p) => p.id === id);
      if (existingPalette) {
        // delete
        state.currentRequestPalette = state.currentRequestPalette.filter((p) => p.id !== id); 
      } else {
        // Add new palette
        state.currentRequestPalette.push(action.payload);
      }
    },
    updateSegmentIntoRequestPallet:(state,action)=>{
       const segData = action.payload;
         debugger
       const existingPalette = state.currentRequestPalette.find((p) => p.groupName === segData.group_label_system);
      if (existingPalette) {
          const allSegName = existingPalette.segments
          //check segData.short_title if found then deklete else add
          if (allSegName.includes(segData.short_title)) {
            existingPalette.segments = allSegName.filter((name) => name !== segData.short_title);
          } else {
            existingPalette.segments.push(segData.short_title);
          }
      }
    },

    resetRequest: (state) => {
      state.requests = {
        houseUrl: state.requests.houseUrl,
        paletteUrl: [],
        referenceImageUrl: [],
        prompt: [],
        imageQuality: "medium",
        annotationValue: {},
        externalUserId: "dzinly-prod",
        jobId: state.requests.jobId, // Reset jobId to its current value
      };
      state.genAiRequestSubmit = null; // Reset the genAiRequestSubmit to null
      state.isSubmitGenAiFailed = false; // Reset the submission failure flag
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
      .addCase(submitGenAiRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.isSubmitGenAiFailed = false;
        state.genAiRequestSubmit = action.payload;
      })
      .addCase(submitGenAiRequest.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to submit GenAI request";
        state.isSubmitGenAiFailed = true; // Set the flag to true if submission fails
      });

    // Handle GenAiImages from data base
    builder
      .addCase(fetchGenAiChat.pending, (state) => {
        state.isFetchingGenAiImages = true;
        state.error = null;
      })
      .addCase(fetchGenAiChat.fulfilled, (state, action) => {
        state.isFetchingGenAiImages = false;
        const chats = action.payload as GenAiChat[];
        state.genAiImages = chats;
        // set the latest inspiration image from latest chat
        if (chats.length > 0) {
          const latestChat = chats[chats.length - 1];
          state.requests.referenceImageUrl = latestChat.reference_img
            ? [latestChat.reference_img]
            : [];
        }
      })
      .addCase(fetchGenAiChat.rejected, (state, action) => {
        state.isFetchingGenAiImages = false;
        state.error =
          (action.payload as string) || "Failed to fetch GenAI chats";
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
        const chatExists = state.genAiImages.some(
          (chat) => chat.task_id === newChat.task_id
        );

        // Only add the chat if it doesn't already exist
        if (!chatExists) {
          state.genAiImages = [...state.genAiImages, newChat];
        } else {
          console.log(
            "Chat with task_id",
            newChat.task_id,
            "already exists in state, not adding duplicate"
          );
        }
      })
      .addCase(insertGenAiChatData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to insert GenAI chat";
      });

    // Handle deleteGenAiChat
    builder
      .addCase(deleteGenAiChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGenAiChat.fulfilled, (state, action) => {
        state.loading = false;
        const deletedChatId = action.payload.id;

        // Remove the deleted chat from the state
        state.genAiImages = state.genAiImages.filter(
          (chat) => chat.id !== deletedChatId
        );
      })
      .addCase(deleteGenAiChat.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to delete GenAI chat";
      });

    // update genAi _chat based on Id
    builder
      .addCase(updateGenAiChatTaskId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGenAiChatTaskId.fulfilled, (state, action) => {
        state.loading = false;
        const updatedChat = action.payload as GenAiChat;

        // Find the index of the chat to update
        const index = state.genAiImages.findIndex(
          (chat) => chat.id === updatedChat.id
        );

        // If found, update the chat in the state
        if (index !== -1) {
          state.genAiImages[index] = updatedChat;
          // Optionally, you can also update currentGenAiImage if it matches
          if (state.currentGenAiImage?.id === updatedChat.id) {
            state.currentGenAiImage = updatedChat;
          }
        } else {
          console.warn("Chat with id", updatedChat.id, "not found in state");
        }
      })
      .addCase(updateGenAiChatTaskId.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to update GenAI chat";
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
  removePaletteImage,
  resetPaletteImage,
  addPrompt,
  addInspirationImage,
  resetInspirationImage,
  updateInspirationNames,
  resetRequest,
  updateRequestJobId,
  resetGenAiState,
  resetIsGenAiSumitFailed,
  updateIsRenameGenAiModal,
  updateMaskIntoRequest,
  updateTaskId,
  setCurrentGenAiImage,
  resetMaskIntoRequest,
  addUpdateRequestPalette,
  updateSegmentIntoRequestPallet,

} = genAiSlice.actions;

// Export reducer
export default genAiSlice.reducer;
