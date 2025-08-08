import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { JobModel, MasterModel } from "@/models/jobModel/JobModel";
import { SegmentService } from "@/services/segment/SegmentService";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";

export interface SegmentPoint {
  x: number;
  y: number;
}
export interface Segment {
  id: string;
  name: string;
  type?: string; // Added segment type for swatch recommendations
  points: SegmentPoint[];
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
  visible: boolean;
  zIndex: number;
  groupId?: string;
  material?: SegmentMaterial;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentMaterial {
  materialId: string;
  materialName: string;
  materialType: "texture" | "color" | "pattern";
  previewUrl?: string;
  textureUrl?: string;
  color?: string;
  appliedAt: string;
}

interface SegmentsState {
  activeSegment: string | null;
  selectedSegmentIds: string[];
  newSegment: SegmentModal;
  addNewMasterArray: MasterModel | null;
  isDrawing: boolean;
  reAnnotationPoints: number[] | null;
  segmentDrawn: {
    annotation: number[];
    segType: string;
    groupName: string;
    childName: string;
    shortName: string;
    category: string;
  };

  isSegmentEdit: boolean;
  isLoadingSegments: boolean;
  isNewMasterArray: boolean;
  isSegmentLoaded: boolean;
  isLoadingSegmentsError: string | null;
  allSegments: SegmentModal[];
  addSegMessage: string | null;
  isAddSegmentModalOpen: boolean;
  isMasterDataAnnotationOpen: boolean;

  // segmentDrawn: {
  //   [key: string]: fabric.Point[];
  // };
  // currentPoints: SegmentPoint[];
  canvasHistory: string[];
  historyIndex: number;
  maxHistorySize: number;
  error: string | null;
  jobs: JobModel | null;
  selectedSegments: SegmentModal | null;

  // Manual annotation states
  isLoadingManualAnnotation: boolean;
  manualAnnotationResult: unknown | null;
  manualAnnotationError: string | null;

  // loading segmnet
}

const initialState: SegmentsState = {
  activeSegment: null,
  selectedSegmentIds: [],
  addNewMasterArray: null,
  isNewMasterArray: false,
  newSegment: {},
  isDrawing: false,
  isSegmentEdit: false,
  reAnnotationPoints: [],
  segmentDrawn: {
    annotation: [],
    segType: "",
    groupName: "",
    childName: "",
    shortName: "",
    category: "",
  },
  isAddSegmentModalOpen: false,
  isMasterDataAnnotationOpen: false,
  canvasHistory: [],
  historyIndex: -1,
  maxHistorySize: 50,
  error: null,
  jobs: null,
  selectedSegments: null,

  // Manual annotation initial states
  isLoadingManualAnnotation: false,
  manualAnnotationResult: null,
  manualAnnotationError: null,

  // loading segmnet
  isLoadingSegments: false,
  isLoadingSegmentsError: null,
  allSegments: [],
  addSegMessage: "",
  isSegmentLoaded: false,
};

// Create segment service instance
export const segmentService = new SegmentService();

// Async thunk for getting manual annotation
export const getManualAnnotation = createAsyncThunk(
  "segments/getManualAnnotation",
  async (
    {
      segmentationInt,
      segName,
    }: { segmentationInt: number[]; segName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await segmentService.GetManualThroughApi(
        segmentationInt,
        segName
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to get manual annotation");
    }
  }
);

// Create segments slice
export const addSegment = createAsyncThunk(
  "segments/addSegment",
  async (segmentData: SegmentModal, { rejectWithValue }) => {
    try {
      return await segmentService.createSegment(segmentData);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to get manual annotation");
    }
  }
);

// create hunk to get all segmnet based on joBid
export const getSegmentsByJobId = createAsyncThunk(
  "segments/getSegmentsByJobId",
  async (jobId: number, { rejectWithValue }) => {
    try {
      return await segmentService.getSegmentsByJobId(jobId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch segments by job ID");
    }
  }
);

// update segment based on id
export const updateSegmentById = createAsyncThunk(
  "segments/updateSegmentById",
  async (segmentData: SegmentModal, { rejectWithValue }) => {
    try {
      return await segmentService.updateSegmentById(segmentData);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update segment");
    }
  }
);

// delete segment based on id
export const deleteSegmentById = createAsyncThunk(  
  'segments/deleteSegmentById',
  async (segmentId: number, { rejectWithValue }) => {
    try {
      return await segmentService.deleteSegmentById(segmentId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to delete segment');
    }
  }
);

const segmentsSlice = createSlice({
  name: "segments",
  initialState,
  reducers: {
    // Drawing state management
    startDrawing: (state) => {
      state.isDrawing = true;
    },

    updateSegmentDrawn: (state, action) => {
      state.segmentDrawn.annotation = action.payload;
      state.isAddSegmentModalOpen = true;
    },
    UpdateOtherSegmentDrawn: (state, action) => {
      const { segType, groupName, childName, shortName, category } =
        action.payload;
      state.segmentDrawn.segType = segType;
      state.segmentDrawn.groupName = groupName;
      state.segmentDrawn.childName = childName;
      state.segmentDrawn.shortName = shortName;
      state.segmentDrawn.category = category;
    },

    cancelDrawing: (state) => {
      state.isDrawing = false;
      state.segmentDrawn = {
        annotation: [],
        segType: "",
        groupName: "",
        childName: "",
        shortName: "",
        category: "",
      };
    },

    updateIsAddSegmentModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddSegmentModalOpen = action.payload;
    },

    updateIsMasterDataAnnotationOpen: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isMasterDataAnnotationOpen = action.payload;
    },
    updateIsNewMasterArray: (state, action: PayloadAction<boolean>) => {
      state.isNewMasterArray = action.payload;
    },

    selectedNewMasterArray: (state, action) => {
      state.addNewMasterArray = action.payload;
    },

    // Segment management
    selectSegment: (state, action: PayloadAction<string | null>) => {
      state.activeSegment = action.payload;
    },
    selectMultipleSegments: (state, action: PayloadAction<string[]>) => {
      state.selectedSegmentIds = action.payload;
    },
    updateAddSegMessage: (state, action: PayloadAction<string | null>) => {
      state.addSegMessage = action.payload;
    },
    updateNewSegmentDrawn: (state, action) => {
      if (state.allSegments && state.allSegments.length > 0) {
        const newSegment = action.payload;
        state.allSegments.push(newSegment);
      } else {
        state.allSegments = [action.payload];
      }
    },
    updateAreaInToSegment:(state,action)=>{
      state.allSegments=action.payload
    },
    changeGroupSegment: (state, action: PayloadAction<SegmentModal>) => {
      const updatedSegment = action.payload;
      const index = state.allSegments.findIndex(
        (seg) => seg.id === updatedSegment.id
      );
      if (index !== -1) {
        // remove existed and add new segment
        const segArray = state.allSegments.filter(
          (seg) => seg.id !== updatedSegment.id
        );
        state.allSegments = [...segArray, updatedSegment];
      }
    },
    updateIsSegmentEdit: (state, action) => {
      state.isSegmentEdit = action.payload;
    },
    updateReAnnoatationPoints: (state, action: PayloadAction<number[]>) => {
      state.reAnnotationPoints = action.payload;
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.canvasHistory.length - 1) {
        state.historyIndex++;
      }
    },

    clearHistory: (state) => {
      state.canvasHistory = [];
      state.historyIndex = -1;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Manual annotation actions
    clearManualAnnotationError: (state) => {
      state.manualAnnotationError = null;
    },

    clearManualAnnotationResult: (state) => {
      state.manualAnnotationResult = null;
    },
    resetReAnnoatationPoints: (state) => {
      state.reAnnotationPoints = [];
    },
    resetSegmentSlice: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getManualAnnotation thunk
      .addCase(getManualAnnotation.pending, (state) => {
        state.isLoadingManualAnnotation = true;
        state.manualAnnotationError = null;
      })
      .addCase(getManualAnnotation.fulfilled, (state, action) => {
        state.isLoadingManualAnnotation = false;
        state.manualAnnotationResult = action.payload;
        state.manualAnnotationError = null;
      })
      .addCase(getManualAnnotation.rejected, (state, action) => {
        state.isLoadingManualAnnotation = false;
        state.manualAnnotationError = action.payload as string;
      });

    builder
      // Handle addSegment thunk
      .addCase(addSegment.pending, (state) => {
        state.isLoadingManualAnnotation = true;
        state.manualAnnotationError = null;
      })
      .addCase(addSegment.fulfilled, (state) => {
        state.isLoadingManualAnnotation = false;
        // state.newSegment = action.payload;
        state.manualAnnotationError = null;
      })
      .addCase(addSegment.rejected, (state, action) => {
        state.isLoadingManualAnnotation = false;
        state.manualAnnotationError = action.payload as string;
      });

    builder
      // Handle getSegmentsByJobId thunk
      .addCase(getSegmentsByJobId.pending, (state) => {
        state.isLoadingManualAnnotation = true;
        state.manualAnnotationError = null;
      })
      .addCase(getSegmentsByJobId.fulfilled, (state, action) => {
        state.isLoadingManualAnnotation = false;
        state.allSegments = action.payload;
        state.isSegmentLoaded = true;
        state.manualAnnotationError = null;
      })
      .addCase(getSegmentsByJobId.rejected, (state, action) => {
        state.isLoadingManualAnnotation = false;
        state.manualAnnotationError = action.payload as string;
      })

    // Handle deleteSegmentById thunk
    .addCase(deleteSegmentById.pending, (state) => {
      state.isLoadingManualAnnotation = true;
      state.manualAnnotationError = null;
    })
    .addCase(deleteSegmentById.fulfilled, (state, action) => {
      state.isLoadingManualAnnotation = false;
      state.allSegments = state.allSegments.filter(seg => seg.id !== action.payload.data?.id);
      state.manualAnnotationError = null;
    })
    .addCase(deleteSegmentById.rejected, (state, action) => {
      state.isLoadingManualAnnotation = false;
      state.manualAnnotationError = action.payload as string;
    });
  },
});

export const {
  startDrawing,
  updateSegmentDrawn,
  UpdateOtherSegmentDrawn,
  selectedNewMasterArray,
  updateIsNewMasterArray,
  // updateSegmentDrawn,
  // finishDrawing,
  cancelDrawing,
  selectMultipleSegments,
  selectSegment,
  undo,
  redo,
  clearHistory,
  clearError,
  clearManualAnnotationError,
  clearManualAnnotationResult,
  updateIsAddSegmentModalOpen,
  updateIsMasterDataAnnotationOpen,
  resetSegmentSlice,
  updateAddSegMessage,
  updateNewSegmentDrawn,
  updateIsSegmentEdit,
  changeGroupSegment,
  resetReAnnoatationPoints,
  updateReAnnoatationPoints,
  updateAreaInToSegment
} = segmentsSlice.actions;

export default segmentsSlice.reducer;

// Selectors
export const selectSegments = (state: { segments: SegmentsState }) =>
  state.segments;
export const selectActiveSegment = (state: { segments: SegmentsState }) =>
  state.segments.activeSegment;
export const selectSelectedSegmentIds = (state: { segments: SegmentsState }) =>
  state.segments.selectedSegmentIds;
export const selectIsDrawing = (state: { segments: SegmentsState }) =>
  state.segments.isDrawing;
export const selectSegmentDrawn = (state: { segments: SegmentsState }) =>
  state.segments.segmentDrawn;
export const selectCanvasHistory = (state: { segments: SegmentsState }) =>
  state.segments.canvasHistory;
export const selectHistoryIndex = (state: { segments: SegmentsState }) =>
  state.segments.historyIndex;
export const selectSegmentsError = (state: { segments: SegmentsState }) =>
  state.segments.error;
export const selectJobs = (state: { segments: SegmentsState }) =>
  state.segments.jobs;
export const selectSelectedSegments = (state: { segments: SegmentsState }) =>
  state.segments.selectedSegments;

// Manual annotation selectors
export const selectIsLoadingManualAnnotation = (state: {
  segments: SegmentsState;
}) => state.segments.isLoadingManualAnnotation;
export const selectManualAnnotationResult = (state: {
  segments: SegmentsState;
}) => state.segments.manualAnnotationResult;
export const selectManualAnnotationError = (state: {
  segments: SegmentsState;
}) => state.segments.manualAnnotationError;

export const selectIsAddSegmentModalOpen = (state: {
  segments: SegmentsState;
}) => state.segments.isAddSegmentModalOpen;
export const selectIsMasterDataAnnotationOpen = (state: {
  segments: SegmentsState;
}) => state.segments.isMasterDataAnnotationOpen;
export const selectAddSegMessage = (state: { segments: SegmentsState }) =>
  state.segments.addSegMessage;
