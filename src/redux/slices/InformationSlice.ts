import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SegmentModal } from '@/models/jobSegmentsModal/JobSegmentModal';

// Define the state interface
interface InformationState {
  segmentType: string;
  multiSelectedSegmentTypes: string[];
  allSegInfo: SegmentModal[];
  selectedSegment: SegmentModal | null;
  multiSelectedSegments: SegmentModal[];
  JsonData?: SegmentModal[];
}

// Define initial state
const initialState: InformationState = {
  segmentType: '',
  multiSelectedSegmentTypes: [],
  allSegInfo: [],
  selectedSegment: null,
  multiSelectedSegments: [],
  JsonData: [],
};

// Create the slice
const informationSlice = createSlice({
  name: 'information',
  initialState,
  reducers: {
    setSegmentType: (state, action: PayloadAction<string>) => {
      state.segmentType = action.payload;
    },
    setMultiSelectedSegmentTypes: (state, action: PayloadAction<string[]>) => {
      state.multiSelectedSegmentTypes = action.payload;
    },
    addMultiSelectedSegmentType: (state, action: PayloadAction<string>) => {
      if (!state.multiSelectedSegmentTypes.includes(action.payload)) {
        state.multiSelectedSegmentTypes.push(action.payload);
      }
    },
    removeMultiSelectedSegmentType: (state, action: PayloadAction<string>) => {
      state.multiSelectedSegmentTypes = state.multiSelectedSegmentTypes.filter(
        type => type !== action.payload
      );
    },
    clearMultiSelectedSegmentTypes: (state) => {
      state.multiSelectedSegmentTypes = [];
    },
    setMultiSelectedSegments: (state, action: PayloadAction<SegmentModal[]>) => {
      state.multiSelectedSegments = action.payload;
    },
    addMultiSelectedSegment: (state, action: PayloadAction<SegmentModal>) => {
      const exists = state.multiSelectedSegments.find(seg => seg.id === action.payload.id);
      if (!exists) {
        state.multiSelectedSegments.push(action.payload);
      }
    },
    removeMultiSelectedSegment: (state, action: PayloadAction<number>) => {
      state.multiSelectedSegments = state.multiSelectedSegments.filter(
        seg => seg.id !== action.payload
      );
    },
    clearMultiSelectedSegments: (state) => {
      state.multiSelectedSegments = [];
    },
    setAllSegInfo: (state, action: PayloadAction<SegmentModal[]>) => {
      state.allSegInfo = action.payload;
    },
    setSelectedSegment: (state, action: PayloadAction<SegmentModal | null>) => {
      state.selectedSegment = action.payload;
    },
    addSegInfo: (state, action: PayloadAction<SegmentModal>) => {
      state.allSegInfo.push(action.payload);
    },
    updateSegInfo: (state, action: PayloadAction<SegmentModal>) => {
      const index = state.allSegInfo.findIndex(seg => seg.id === action.payload.id);
      if (index !== -1) {
        state.allSegInfo[index] = action.payload;
      }
    },
    removeSegInfo: (state, action: PayloadAction<number>) => {
      state.allSegInfo = state.allSegInfo.filter(seg => seg.id !== action.payload);
    },
    updateJsonData: (state, action: PayloadAction<SegmentModal[]>) => {
      state.JsonData = action.payload;
    },
    clearAllSegInfo: (state) => {
      state.allSegInfo = [];
    },
    resetInformationState: (state) => {
      state.segmentType = '';
      state.multiSelectedSegmentTypes = [];
      state.allSegInfo = [];
      state.selectedSegment = null;
      state.multiSelectedSegments = [];
      state.JsonData = [];
    },
  },
});

// Export actions
export const {
  setSegmentType,
  setMultiSelectedSegmentTypes,
  addMultiSelectedSegmentType,
  removeMultiSelectedSegmentType,
  clearMultiSelectedSegmentTypes,
  setMultiSelectedSegments,
  addMultiSelectedSegment,
  removeMultiSelectedSegment,
  clearMultiSelectedSegments,
  setAllSegInfo,
  setSelectedSegment,
  addSegInfo,
  updateSegInfo,
  removeSegInfo,
  clearAllSegInfo,
  updateJsonData,
  resetInformationState,
} = informationSlice.actions;

// Export selectors
export const selectSegmentType = (state: { information: InformationState }) => 
  state.information.segmentType;

export const selectMultiSelectedSegmentTypes = (state: { information: InformationState }) => 
  state.information.multiSelectedSegmentTypes;

export const selectMultiSelectedSegments = (state: { information: InformationState }) => 
  state.information.multiSelectedSegments;

export const selectAllSegInfo = (state: { information: InformationState }) => 
  state.information.allSegInfo;

export const selectSelectedSegment = (state: { information: InformationState }) => 
  state.information.selectedSegment;

// Export reducer
export default informationSlice.reducer;
