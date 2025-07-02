import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface
interface WorkspaceState {
  isWorkSpace: boolean;
  isVisual: boolean;
  isStepper: boolean;
  currentStep: number;
  uploadedFile: File | null;
  processingState: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  error: string | null;
}

// Define the initial state
const initialState: WorkspaceState = {
  isWorkSpace: false,
  isVisual: false,
  isStepper: false,
  currentStep: 0,
  uploadedFile: null,
  processingState: 'idle',
  error: null,
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
    
    // Toggle stepper mode
    setStepper: (state, action: PayloadAction<boolean>) => {
      state.isStepper = action.payload;
    },
    
    // Set current step in stepper
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    
    // Go to next step
    nextStep: (state) => {
      state.currentStep += 1;
    },
    
    // Go to previous step
    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    
    // Reset to first step
    resetSteps: (state) => {
      state.currentStep = 0;
    },
    
    // Set uploaded file
    setUploadedFile: (state, action: PayloadAction<File | null>) => {
      state.uploadedFile = action.payload;
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
      state.currentStep = 0;
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
      state.currentStep = 0;
    },
    
    // Reset all workspace state
    resetWorkspace: (state) => {
      state.isWorkSpace = false;
      state.isVisual = false;
      state.isStepper = false;
      state.currentStep = 0;
      state.uploadedFile = null;
      state.processingState = 'idle';
      state.error = null;
    },
    
    // Complete workflow (typically called after successful processing)
    completeWorkflow: (state) => {
      state.processingState = 'completed';
      state.isStepper = false;
      state.isVisual = true;
    },
  },
});

// Export actions
export const {
  setWorkSpace,
  setVisual,
  setStepper,
  setCurrentStep,
  nextStep,
  previousStep,
  resetSteps,
  setUploadedFile,
  setProcessingState,
  setError,
  clearError,
  enterWorkspace,
  enterVisualMode,
  enterStepperMode,
  resetWorkspace,
  completeWorkflow,
} = workspaceSlice.actions;

// Export reducer
export default workspaceSlice.reducer;

// Export selectors
export const selectWorkspace = (state: { workspace: WorkspaceState }) => state.workspace;
export const selectIsWorkSpace = (state: { workspace: WorkspaceState }) => state.workspace.isWorkSpace;
export const selectIsVisual = (state: { workspace: WorkspaceState }) => state.workspace.isVisual;
export const selectIsStepper = (state: { workspace: WorkspaceState }) => state.workspace.isStepper;
export const selectCurrentStep = (state: { workspace: WorkspaceState }) => state.workspace.currentStep;
export const selectUploadedFile = (state: { workspace: WorkspaceState }) => state.workspace.uploadedFile;
export const selectProcessingState = (state: { workspace: WorkspaceState }) => state.workspace.processingState;
export const selectError = (state: { workspace: WorkspaceState }) => state.workspace.error;
