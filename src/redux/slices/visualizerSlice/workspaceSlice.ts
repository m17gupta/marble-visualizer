import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define view types
export type ViewType = 'front' | 'rear' | 'left' | 'right';
export type WorkSpaceType = 'visual' | 'workspace' | 'studio';
// Define the state interface
interface WorkspaceState {
  workspace_type: WorkSpaceType;
 
  jobImage: string; // Assuming this is a string to hold the job image URL
  currentView: {
    view: ViewType; // Current view type
    file: File | null; // File associated with the current view
  }
  isContinue: boolean;
  isUploading: boolean;
  processingState: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  error: string | null;
  isAddIspiration: boolean;
  isGenerated: boolean
}

// Define the initial state
const initialState: WorkspaceState = {
 
  workspace_type: "workspace", // Default workspace type
  currentView: {
    view: 'front', // Default to front view
    file: null,
  },
  jobImage: '', // Assuming this is an empty string by default
  isContinue: false,
  processingState: 'idle',
  error: null,
  isUploading: false,

  isAddIspiration: false, // Initialize to false
  isGenerated: false // Initialize to false

};

// Create the slice
const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
 

 

    addCurrentView: (state, action: PayloadAction<{ view: ViewType; file: File | null }>) => {
      const { view, file } = action.payload;
      state.currentView = { view, file };
    },
  
    setIsContinue: (state, action: PayloadAction<boolean>) => {
      state.isContinue = action.payload;
    },

    // Set uploading state
    setIsUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
    updateJobImage: (state, action) => {
      state.jobImage = action.payload;
    },
    updateWorkspaceType: (state, action: PayloadAction<WorkSpaceType>) => {
      state.workspace_type = action.payload;
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
      

      state.error = null;
    },

  



  
    // Set flag for adding inspiration
    setIsAddInspiration: (state, action: PayloadAction<boolean>) => {
      state.isAddIspiration = action.payload;
    }
    , setIsGenerated: (state, action: PayloadAction<boolean>) => {
      state.isGenerated = action.payload;
    }
  },
});

// Export actions
export const {
 
  updateJobImage,
 
  setProcessingState,
  setError,
  clearError,
  enterWorkspace,
  addCurrentView,
  setIsContinue,
  setIsUploading,
  setIsAddInspiration,
  setIsGenerated,
  updateWorkspaceType
} = workspaceSlice.actions;

// Export reducer
export default workspaceSlice.reducer;

// Export selectors
export const selectWorkspace = (state: { workspace: WorkspaceState }) => state.workspace;

export const selectProcessingState = (state: { workspace: WorkspaceState }) => state.workspace.processingState;
export const selectError = (state: { workspace: WorkspaceState }) => state.workspace.error;


export const getIsAddInspiration = (state: { workspace: WorkspaceState }) => state.workspace.isAddIspiration;

export const getIsGenerated = (state: { workspace: WorkspaceState }) => state.workspace.isGenerated;
export const getWorkSpaceType = (state: { workspace: WorkspaceState }) => state.workspace.workspace_type;