import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobModel } from '@/models/jobModel/JobModel';

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
  materialType: 'texture' | 'color' | 'pattern';
  previewUrl?: string;
  textureUrl?: string;
  color?: string;
  appliedAt: string;
}


interface SegmentsState {
 
  activeSegment: string | null;
  selectedSegmentIds: string[];
  
  isDrawing: boolean;
  segmentDrawn:{
    [key: string]: fabric.Point[];
  };
  // currentPoints: SegmentPoint[];
  canvasHistory: string[];
  historyIndex: number;
  maxHistorySize: number;
  error: string | null;
  jobs:JobModel | null;
}

const initialState: SegmentsState = {

  activeSegment: null,
  selectedSegmentIds: [],
  
  isDrawing: false,
  // currentPoints: [],
  segmentDrawn: {},
  canvasHistory: [],
  historyIndex: -1,
  maxHistorySize: 50,
  error: null,
  jobs: null,
};



const segmentsSlice = createSlice({
  name: 'segments',
  initialState,
  reducers: {
    // Drawing state management
    startDrawing: (state) => {
      state.isDrawing = true;
      
    },
   
    updateSegmentDrawn: (state, action) => {
      state.segmentDrawn = action.payload;
    },
   
    cancelDrawing: (state) => {
      state.isDrawing = false;
      state.segmentDrawn = {}
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
  },
}
  );

export const {
  startDrawing,
  updateSegmentDrawn,
  // finishDrawing,
  cancelDrawing,
  selectMultipleSegments,
 
  undo,
  redo,
  clearHistory,
  clearError,
} = segmentsSlice.actions;

export default segmentsSlice.reducer;