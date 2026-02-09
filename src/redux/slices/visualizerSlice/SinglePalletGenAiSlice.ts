import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ProjectModel } from "@/models/projectModel/ProjectModel";
import { NewSinglePalletModel, singlePalletApiModeModel, SinglePalletGenAiOutPutModel, SinglePalletGenAiRequestModel } from "@/models/genAiModel/SinglePalletGenAModel";
import { GenAiSinglePalletAPI } from "@/services/genAi/genAi_single_palletApi";
import { generateSinglePalletImage } from "@/services/genAi/SinglePllateGenAiApi";

interface SinglePalletGenAiState {
  isLoading: boolean;
  genAiRequest: Partial<SinglePalletGenAiRequestModel>;
  genAiOutput: SinglePalletGenAiOutPutModel[];
  currentSinglePalletResponce: SinglePalletGenAiOutPutModel | null;
  pendingSinglePalletResponce: SinglePalletGenAiOutPutModel | null;
  enableInput: boolean;
  isFetched: boolean;
  segmentType?: string;
  clientId?: string | null;
  generatedImage?: string | null;
  taskId?: string | null;
}

// Initial state
const initialState: SinglePalletGenAiState = {
  isLoading: false,
  isFetched: false,
  genAiRequest: {},
  genAiOutput: [] as SinglePalletGenAiOutPutModel[],
  currentSinglePalletResponce: null,
  pendingSinglePalletResponce: null,
  enableInput: false,
  clientId: null,
  generatedImage: null,
  taskId: null,

};

// create thunk to genertate image
export const generateSinglePalletImageThunk = createAsyncThunk(
  "singlePalletGenAi/generateSinglePalletImage",
  async (requestData: NewSinglePalletModel, { rejectWithValue }) => {
    try {
      const response = await generateSinglePalletImage(requestData);
      console.log("response", response)
      return response;
    } catch (error) {
      if (error instanceof Error)
        return rejectWithValue("Failed to generate single pallet image");
    }
  }
);

// export const generateSinglePalletRoofImageThunk = createAsyncThunk(
//   "singlePalletGenAi/generateSinglePalletRoofImage",
//   async (requestData: singlePalletApiModeModel, { rejectWithValue }) => {
//     try {
//       const response = await generateSinglePalletRoofImage(requestData);
//       return response;
//     } catch (error) {
//       if (error instanceof Error)
//         return rejectWithValue("Failed to generate single pallet image");
//     }
//   }
// );
// insert single image in to db thunk
export const insertSinglePalletImageInToDBThunk = createAsyncThunk(
  "singlePalletGenAi/updateSinglePalletImageInToDB",
  async (data: SinglePalletGenAiOutPutModel, { rejectWithValue }) => {
    try {
      const response = await GenAiSinglePalletAPI.insertSinglePalletGenAiImages(
        data
      );
      console.log("response data into DB", response)
      return response;
    } catch (error) {
      if (error instanceof Error)
        return rejectWithValue("Failed to update single pallet image in DB");
    }
  }
);

//get all single pallet images from db thunk
export const getAllSinglePalletImagesFromDBThunk = createAsyncThunk(
  "singlePalletGenAi/getAllSinglePalletImagesFromDB",
  async (jobId: number, { rejectWithValue }) => {
    try {
      const response = await GenAiSinglePalletAPI.getAllSinglePalletGenAiImages(
        jobId
      );
      return response;
    } catch (error) {
      if (error instanceof Error)
        return rejectWithValue("Failed to fetch single pallet images from DB");
    }
  }
);

// delete genAi image based on Id
export const deleteSinglePalletImageByIdThunk = createAsyncThunk(
  "singlePalletGenAi/deleteSinglePalletImageById",
  async (imageId: string, { rejectWithValue }) => {
    try {
      const response =
        await GenAiSinglePalletAPI.deleteSinglePalletGenAiImagesId(imageId);
      return imageId;
    } catch (error) {
      if (error instanceof Error)
        return rejectWithValue("Failed to delete single pallet image by ID");
    }
  }
);
// update singlePlalet image data
export const updateSinglePalletImageDataThunk = createAsyncThunk(
  "singlePalletGenAi/updateSinglePalletImageData",
  async (
    { updatedData, projectId }: { updatedData: Partial<SinglePalletGenAiOutPutModel>; projectId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await GenAiSinglePalletAPI.updateSinglePalletGenAiImages(
        { updatedData, projectId }
      );
      console.log("response data into DB", response)
      return response;
    } catch (error) {
      if (error instanceof Error)
        return rejectWithValue("Failed to update single pallet image in DB");
    }
  }
);

// Create slice
const singlePalletGenAiSlice = createSlice({
  name: "singlePalletGenAi",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSegmentType: (state, action) => {
      state.segmentType = action.payload;
    },
    updateClientId: (state, action: PayloadAction<string | null>) => {
      state.clientId = action.payload;
    },
    updateGeneratedImage: (state, action: PayloadAction<string | null>) => {
      state.generatedImage = action.payload;
    },
    updateTaskId: (state, action: PayloadAction<string | null>) => {
      state.taskId = action.payload;
    },
    // Set GenAI request
    setGenAiImageJobIdRequest: (state, action) => {
      const { jobId, imageUrl } = action.payload;
      state.genAiRequest = { jobId, imageUrl };
    },
    setPalletUrlRequest: (state, action) => {
      const { palletUrl } = action.payload;
      state.genAiRequest = { ...state.genAiRequest, palletUrl };
    },
    setAnnotationRequest: (state, action) => {
      const { results } = action.payload;
      state.genAiRequest = { ...state.genAiRequest, results };
    },

    sethollow_results: (state, action) => {
      const { hollow_results } = action.payload;
      state.genAiRequest = { ...state.genAiRequest, hollow_results };
    },
    setCurrentPalletResponce: (
      state,
      action: PayloadAction<SinglePalletGenAiOutPutModel>
    ) => {
      state.currentSinglePalletResponce = action.payload;
    },
    resetCurrentPalletResponce: (state) => {
      state.currentSinglePalletResponce = {};
    },
    setPrompt: (state, action: PayloadAction<string>) => {
      const prompt = action.payload;
      state.genAiRequest = { ...state.genAiRequest, prompt };
    },
    setEnableInput: (state, action: PayloadAction<boolean>) => {
      state.enableInput = action.payload;
    },

    // Clear request
    clearGenAiRequest: (state) => {
      state.genAiRequest = {
        jobId: state.genAiRequest.jobId,
        imageUrl: state.genAiRequest.imageUrl,
        palletUrl: state.genAiRequest.palletUrl,
        prompt: "",
        results: [],
        hollow_results: [],
      };
      state.currentSinglePalletResponce = {} as SinglePalletGenAiOutPutModel;
    },

    // Clear output
    clearGenAiOutput: (state) => {
      state.genAiOutput = [];
    },

    // Reset entire state
    resetSinglePalletGenAi: (state) => {
      state.isLoading = false;
      state.genAiRequest = {};
      state.genAiOutput = [];
      state.currentSinglePalletResponce = {} as SinglePalletGenAiOutPutModel;
      state.enableInput = false;
      state.isFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateSinglePalletImageThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateSinglePalletImageThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.genAiOutput = state.genAiOutput.length
        //   ? [...state.genAiOutput, action.payload]
        //   : [action.payload];
        // state.currentSinglePalletResponce = action.payload;
        state.taskId = action.payload.task_id;
        state.enableInput = true;

      })
      .addCase(generateSinglePalletImageThunk.rejected, (state) => {
        state.isLoading = false;
      });

    builder ///get all single pallet images from db
      .addCase(getAllSinglePalletImagesFromDBThunk.pending, (state) => {
        state.isLoading = true;
        state.isFetched = true;
      })
      .addCase(
        getAllSinglePalletImagesFromDBThunk.fulfilled,
        (state, action) => {
          if (action.payload) {
            state.isLoading = false;
            state.genAiOutput = action.payload;
          }
        }
      )
      .addCase(getAllSinglePalletImagesFromDBThunk.rejected, (state) => {
        state.isLoading = false;
      });

    // delete gen Image based on Id
    builder ///get all single pallet images from db
      .addCase(deleteSinglePalletImageByIdThunk.fulfilled, (state, action) => {
        const id = action.payload as string;
        const index = state.genAiOutput.findIndex((item) => item.id === id);
        if (index !== -1) {
          state.genAiOutput.splice(index, 1);
        }
      })
      .addCase(insertSinglePalletImageInToDBThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload.data) {
          state.genAiOutput = state.genAiOutput.length
            ? [...state.genAiOutput, action.payload.data]
            : [action.payload.data];
          state.currentSinglePalletResponce = action.payload.data;
          state.pendingSinglePalletResponce = action.payload.data;
        }
        state.enableInput = true;
        state.generatedImage = null;
      })

      // update single pallet image in db
      .addCase(updateSinglePalletImageDataThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload) {
          const { image } = action.payload;
          if (image) {
            // Update the existing item in the array instead of adding a new one
            const index = state.genAiOutput.findIndex((item) => item.id === image.id);
            if (index !== -1) {
              state.genAiOutput[index] = image;
            } else {
              // If not found, add it to the array
              state.genAiOutput = [...state.genAiOutput, image];
            }
            state.currentSinglePalletResponce = image;
            state.pendingSinglePalletResponce = image;
          }
          state.enableInput = true;
          state.generatedImage = null;
        }
      })
  },
});

// Export actions
export const {
  setLoading,
  setGenAiImageJobIdRequest,
  setAnnotationRequest,
  setPrompt,
  setPalletUrlRequest,
  clearGenAiRequest,
  clearGenAiOutput,
  resetSinglePalletGenAi,
  setCurrentPalletResponce,
  sethollow_results,
  resetCurrentPalletResponce,
  setSegmentType,
  updateGeneratedImage,
  updateClientId,
  updateTaskId
} = singlePalletGenAiSlice.actions;

// Export reducer
export default singlePalletGenAiSlice.reducer;
