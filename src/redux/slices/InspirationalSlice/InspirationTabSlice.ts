import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface
export interface InspirationTabState {
  currentInspTab: string;
 
}

// Define the initial state
const initialState: InspirationTabState = {
  currentInspTab: '',

};

// Create the slice
const inspirationTabSlice = createSlice({
  name: 'inspirationTab',
  initialState,
  reducers: {
    // Set the current inspiration tab
    setCurrentInspTab: (state, action: PayloadAction<string>) => {
      state.currentInspTab = action.payload;
      
    },
    
    // Clear the current inspiration tab
    clearCurrentInspTab: (state) => {
      state.currentInspTab = 'chat';
      
    },
    
  
    
    // Reset the entire state
    resetInspirationTabState: (state) => {
      state.currentInspTab = 'chat';
    },
  },
});

// Export actions
export const {
  setCurrentInspTab,
  clearCurrentInspTab,

  resetInspirationTabState,
} = inspirationTabSlice.actions;

// Export the reducer
export default inspirationTabSlice.reducer;

// Selectors for easy access to state
export const selectCurrentInspTab = (state: { inspirationTab: InspirationTabState }) => 
  state.inspirationTab.currentInspTab;


