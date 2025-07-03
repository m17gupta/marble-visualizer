import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define view types
export type ViewType = 'front' | 'rear' | 'left' | 'right';

// Define the state interface
interface WorkspaceState {
  isWorkSpace: boolean;
  isVisual: boolean;
  isStepper: boolean;
  currentView: {
    view: ViewType; // Current view type
    file: File | null; // File associated with the current view
  }
  isContinue: boolean;
  isUploading: boolean;
  processingState: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  error: string | null;
  isAddIspiration: boolean; // Flag to indicate if the user is adding inspiration
}

// Define the initial state
const initialState: WorkspaceState = {
  isWorkSpace: true,
  isVisual: false,
  isStepper: false,

  currentView: {
    view: 'front', // Default to front view
    file: null,
  },

  isContinue: false,
  processingState: 'idle',
  error: null,
  isUploading: false,
  
  isAddIspiration: false, // Initialize to false

};

// Create the slice
const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    // Toggle workspace mode
    setWorkSpace: (state, action: PayloadAction<boolean>) => {
      state.isWorkSpace = action.payload;
    },
    
    // Toggle visual mode
    setVisual: (state, action: PayloadAction<boolean>) => {
      state.isVisual = action.payload;
    },

    addCurrentView: (state, action: PayloadAction<{ view: ViewType; file: File | null }>) => {
      const { view, file } = action.payload;
      state.currentView = { view, file };
    },
    // Toggle stepper mode
    setStepper: (state, action: PayloadAction<boolean>) => {
      state.isStepper = action.payload;
    },
    setIsContinue: (state, action: PayloadAction<boolean>) => {
      state.isContinue = action.payload;
    },

    // Set uploading state
    setIsUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },

    // Set processing state
    setProcessingState: (state, action: PayloadAction<WorkspaceState['processingState']>) => {
      state.processingState = action.payload;
    },
    
    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Enter workspace mode (sets multiple states)
    enterWorkspace: (state) => {
      state.isWorkSpace = true;
      state.isVisual = false;
      state.isStepper = false;
    
      state.error = null;
    },
    
    // Enter visual mode
    enterVisualMode: (state) => {
      state.isVisual = true;
      state.isWorkSpace = false;
      state.isStepper = false;
    },
    
    // Enter stepper mode
    enterStepperMode: (state) => {
      state.isStepper = true;
      state.isWorkSpace = false;
      state.isVisual = false;
     
    },
    
    // Reset all workspace state
    resetWorkspace: (state) => {
      state.isWorkSpace = false;
      state.isVisual = false;
      state.isStepper = false;
    
      state.processingState = 'idle';
      state.error = null;
    },
    
    // Complete workflow (typically called after successful processing)
    completeWorkflow: (state) => {
      state.processingState = 'completed';
      state.isStepper = false;
      state.isVisual = true;
    },
    // Set flag for adding inspiration
    setIsAddInspiration: (state, action: PayloadAction<boolean>) => {
      state.isAddIspiration = action.payload;
    }
  },
});

// Export actions
export const {
  setWorkSpace,
  setVisual,
  setStepper,
  setProcessingState,
  setError,
  clearError,
  enterWorkspace,
  enterVisualMode,
  enterStepperMode,
  resetWorkspace,
  completeWorkflow,
  addCurrentView,
  setIsContinue,
  setIsUploading,
  setIsAddInspiration
} = workspaceSlice.actions;

// Export reducer
export default workspaceSlice.reducer;

// Export selectors
export const selectWorkspace = (state: { workspace: WorkspaceState }) => state.workspace;
export const selectIsWorkSpace = (state: { workspace: WorkspaceState }) => state.workspace.isWorkSpace;
export const selectIsVisual = (state: { workspace: WorkspaceState }) => state.workspace.isVisual;
export const selectIsStepper = (state: { workspace: WorkspaceState }) => state.workspace.isStepper;

export const selectProcessingState = (state: { workspace: WorkspaceState }) => state.workspace.processingState;
export const selectError = (state: { workspace: WorkspaceState }) => state.workspace.error;


export const getIsAddInspiration = (state: { workspace: WorkspaceState }) => state.workspace.isAddIspiration;
