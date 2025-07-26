import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define tab types
export type TabType = 'studio-segment' | 'design' | 'segments' | 'swatches' | 'history' | 'activity';


// Define the state interface
interface TabControlState {
  activeTab: TabType;
  segmentType: string ;

}

// Define the initial state
const initialState: TabControlState = {
  activeTab: 'studio-segment',
  segmentType: "Wall",


};

// Create the slice
const tabControlSlice = createSlice({
  name: 'tabControl',
  initialState,
  reducers: {
    // Set active tab
    setActiveTab: (state, action: PayloadAction<TabType>) => {
      state.activeTab = action.payload;
    },

   setSegmentType: (state, action: PayloadAction<string >) => {
      state.segmentType = action.payload;
   },

    // Reset tab control state
    resetTabControl: () => {
      return initialState;
    },
  },
});

// Export actions
export const {
  setActiveTab,
  setSegmentType,
  resetTabControl,
} = tabControlSlice.actions;

// Export reducer
export default tabControlSlice.reducer;



