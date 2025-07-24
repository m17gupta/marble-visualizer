
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { JobModel, JobSegmentModel } from '@/models/jobModel/JobModel';
import { SegmentService } from '@/services/segment/SegmentService';

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

  isDrawing: boolean;
  segmentDrawn: {
    annotation: number[];
    segType: string;
    groupName: string;
    childName: string;
    shortName: string;
  };
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
  selectedSegments: JobSegmentModel | null;

  // Manual annotation states
  isLoadingManualAnnotation: boolean;
  manualAnnotationResult: unknown | null;
  manualAnnotationError: string | null;
}

const initialState: SegmentsState = {
  activeSegment: null,
  selectedSegmentIds: [],

  isDrawing: false,
  // currentPoints: [],
  segmentDrawn: {
    annotation: [],
    segType: '',
    groupName: '',
    childName: '',
    shortName: ''
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
};

// Create segment service instance
const segmentService = new SegmentService();

// Async thunk for getting manual annotation
export const getManualAnnotation = createAsyncThunk(
  'segments/getManualAnnotation',
  async (
    { segmentationInt, segName }: { segmentationInt: number[]; segName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await segmentService.GetManualThroughApi(segmentationInt, segName);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to get manual annotation');
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

    // updateSegmentDrawn: (state, action) => {
    //   state.segmentDrawn = action.payload;
    // },
    updateSegmentDrawn: (
      state,
      action
    ) => {
      state.segmentDrawn.annotation = action.payload;
      state.isAddSegmentModalOpen = true;
    },
    UpdateOtherSegmentDrawn: (
      state,
      action
    ) => {
        const {segType, groupName, childName, shortName} = action.payload;
      state.segmentDrawn.segType = segType; 
      state.segmentDrawn.groupName = groupName;
      state.segmentDrawn.childName = childName;
      state.segmentDrawn.shortName = shortName;
    },

    cancelDrawing: (state) => {
      state.isDrawing = false;
      state.segmentDrawn = {
        annotation: [],
        segType: '',
        groupName: '',
        childName: '',
        shortName: ''
      };
    },

    updateIsAddSegmentModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddSegmentModalOpen = action.payload;
    },

    updateIsMasterDataAnnotationOpen: (state, action: PayloadAction<boolean>) => {
      state.isMasterDataAnnotationOpen = action.payload;
    },

    // Segment management
    selectSegment: (state, action: PayloadAction<string | null>) => {
      state.activeSegment = action.payload;
    },
    selectMultipleSegments: (state, action: PayloadAction<string[]>) => {
      state.selectedSegmentIds = action.payload;
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
  },
});

export const {
  startDrawing,
  updateSegmentDrawn,
  UpdateOtherSegmentDrawn,
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
  updateIsMasterDataAnnotationOpen
} = segmentsSlice.actions;

export default segmentsSlice.reducer;

// Selectors
export const selectSegments = (state: { segments: SegmentsState }) => state.segments;
export const selectActiveSegment = (state: { segments: SegmentsState }) => state.segments.activeSegment;
export const selectSelectedSegmentIds = (state: { segments: SegmentsState }) => state.segments.selectedSegmentIds;
export const selectIsDrawing = (state: { segments: SegmentsState }) => state.segments.isDrawing;
export const selectSegmentDrawn = (state: { segments: SegmentsState }) => state.segments.segmentDrawn;
export const selectCanvasHistory = (state: { segments: SegmentsState }) => state.segments.canvasHistory;
export const selectHistoryIndex = (state: { segments: SegmentsState }) => state.segments.historyIndex;
export const selectSegmentsError = (state: { segments: SegmentsState }) => state.segments.error;
export const selectJobs = (state: { segments: SegmentsState }) => state.segments.jobs;
export const selectSelectedSegments = (state: { segments: SegmentsState }) => state.segments.selectedSegments;

// Manual annotation selectors
export const selectIsLoadingManualAnnotation = (state: { segments: SegmentsState }) => state.segments.isLoadingManualAnnotation;
export const selectManualAnnotationResult = (state: { segments: SegmentsState }) => state.segments.manualAnnotationResult;
export const selectManualAnnotationError = (state: { segments: SegmentsState }) => state.segments.manualAnnotationError;


export const selectIsAddSegmentModalOpen = (state: { segments: SegmentsState }) => state.segments.isAddSegmentModalOpen;
export const selectIsMasterDataAnnotationOpen = (state: { segments: SegmentsState })=> state.segments.isMasterDataAnnotationOpen;