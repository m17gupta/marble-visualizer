import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define view types
export type ViewType = 'front' | 'rear' | 'left' | 'right';
export type WorkSpaceType = 'renovate' | 'workspace' | 'design-hub' | 'studio';
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
  isGenerated: boolean,
  isGenLoading: boolean;
  activeTab?: string;
  subActiveTab: string; // Default sub-active tab
  breadcrumbs?: string[];
}

// Define the initial state
const initialState: WorkspaceState = {
  isAddIspiration: false,
  isGenerated: false,
  isGenLoading: false,
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
  activeTab: "inspiration",
  subActiveTab: "", // Default active tab
  breadcrumbs: [], // Initialize breadcrumbs as an empty array


};

// Create the slice
const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {


    resetWorkspace: () => {
      return initialState;
    },

    addCurrentView: (state, action: PayloadAction<{ view: ViewType; file: File | null }>) => {
      const { view, file } = action.payload;
      state.currentView = { view, file };
    },

    setIsContinue: (state, action: PayloadAction<boolean>) => {
      state.isContinue = action.payload;
    },
    updateIsGenLoading: (state, action: PayloadAction<boolean>) => {
      state.isGenLoading = action.payload;
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
    updateActiveTab: (state, action: PayloadAction<string | undefined>) => {
      state.activeTab = action.payload;
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
    setSubActiveTab: (state, action: PayloadAction<string>) => {
      state.subActiveTab = action.payload;
    },

    // Set flag for adding inspiration
    setIsAddInspiration: (state, action: PayloadAction<boolean>) => {
      state.isAddIspiration = action.payload;
    }
    , setIsGenerated: (state, action: PayloadAction<boolean>) => {
      state.isGenerated = action.payload;
    },
    addbreadcrumb: (state, action: PayloadAction<string>) => {
      if (!state.breadcrumbs) {
        state.breadcrumbs = [];
      } else if (state.breadcrumbs.length === 0) {
        state.breadcrumbs.push("Projects");
        state.breadcrumbs.push(action.payload);
      } else {
        state.breadcrumbs.push(action.payload);
      }
    },
    clearBreadcrumbs: (state) => {
      state.breadcrumbs = [];
    },
    updateBreadCrumbs: (state, action: PayloadAction<string>) => {
      if (!state.breadcrumbs) {
        state.breadcrumbs = [];
      }

      const breadcrumbValue = action.payload;

      // Special handling for "Projects" - it should always be at index 0
      // if (breadcrumbValue === "Projects") {
      //   state.breadcrumbs = ["Projects"];
      //   return;
      // }

      const index = state.breadcrumbs.indexOf(breadcrumbValue);
     
      if (index !== -1) {
        state.breadcrumbs = state.breadcrumbs.slice(0, index + 1);
      }
      // else {
      //   // Ensure "Projects" is always at index 0 when adding new breadcrumbs
      //   if (state.breadcrumbs.length === 0 || state.breadcrumbs[0] !== "Projects") {
      //     state.breadcrumbs = ["Projects", breadcrumbValue];
      //   } else {
      //     state.breadcrumbs.push(breadcrumbValue);
      //   }
      // }
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
  updateIsGenLoading,
  updateWorkspaceType,
  updateActiveTab,
  setSubActiveTab,
  addbreadcrumb,
  clearBreadcrumbs,
  updateBreadCrumbs,
  resetWorkspace
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