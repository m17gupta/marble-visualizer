import { CanvasModel } from "@/models/canvasModel/CanvasModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { set } from "date-fns";

// Define the types for canvas state
export type ZoomMode = "mouse";

// Define the types for mouse coordinates
export interface MouseCoordinates {
  x: number;
  y: number;
}
export type CanvasMode =
  | "hover"
  | "draw"
  | "edit"
  | "reannotation"
  | "mask"
  | "comment"
  | "dimension"
  | "hover-default"
  | "measurement"
  | "test-canvas";


  export type activeCanvasType = 
    |"hideSegments"
    |"showSegments"
    |"outline"
    |"compare"
    |"zoom"

  
  // Define the state interface
interface CanvasState {
  currentZoom: number;

  zoomMode: ZoomMode;
  mousePosition: MouseCoordinates;
  isCanvasReady: boolean;
  isBusy: boolean;
  error: string | null;
  canavasActiveTool: string;
  isCanvasModalOpen: boolean;
  masks: CanvasModel[];
  canvasType: CanvasMode;
  deleteMaskId: number | null;
  isGenerateMask: boolean;
  hoverGroup: string[] | null;
  isScreenshotTaken: boolean;
  screenShotUrl: string | null;
  isResetZoom: boolean;
  activeCanvas: string;
  aiTrainImageWidth: number;
  aiTrainImageHeight: number;
}

// Initial state
const initialState: CanvasState = {
  currentZoom: 1,
  zoomMode: "mouse",
  mousePosition: { x: 0, y: 0 },
  isCanvasReady: false,
  isBusy: false,
  error: null,
  canavasActiveTool: "",
  isCanvasModalOpen: false,
  masks: [],
  canvasType: "hover", // Default canvas type
  deleteMaskId: null, // Initialize as null
  isGenerateMask: false,
  hoverGroup: null,
  isScreenshotTaken: false, // Flag to indicate if a screenshot has been taken
  screenShotUrl: null, // URL of the screenshot if taken
  isResetZoom: false, // Flag to indicate if the canvas has been reset
  activeCanvas: "hideSegments",
  aiTrainImageWidth: 800,
  aiTrainImageHeight: 600
};

// Create the canvas slice
const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    // Set the type of canvas (e.g., hover, draw, edit)
    setCanvasType(state, action: PayloadAction<CanvasMode>) {
      state.canvasType = action.payload;
    },

    updateHoverGroup(state, action: PayloadAction<string[] | null>) {
      state.hoverGroup = action.payload; // Update the hoverGroup state
    },
    // Set the current zoom level
    setZoom(state, action: PayloadAction<number>) {
      // Ensure zoom level stays within reasonable bounds
      const zoom = action.payload;
      state.currentZoom = Math.max(1, Math.min(20, zoom));
    },

    // Toggle or set the zoom mode
    setZoomMode(state, action: PayloadAction<ZoomMode>) {
      state.zoomMode = action.payload;
    },

    // Toggle the zoom mode between 'center' and 'mouse'
    toggleZoomMode() {
      // state.zoomMode = state.zoomMode === 'center' ? 'mouse' : 'center';
    },

    // Set canvas readiness state
    setCanvasReady(state, action: PayloadAction<boolean>) {
      state.isCanvasReady = action.payload;
    },
    setCanvasActiveTool(state, action: PayloadAction<string>) {
      state.canavasActiveTool = action.payload;
    },

    // Update mouse position
    setMousePosition(state, action: PayloadAction<MouseCoordinates>) {
      state.mousePosition = action.payload;
    },
    setIsCanvasModalOpen(state, action: PayloadAction<boolean>) {
      state.isCanvasModalOpen = action.payload;
    },
    // Set busy state (for async operations)
    setCanvasBusy(state, action: PayloadAction<boolean>) {
      state.isBusy = action.payload;
    },

    // Set error state
    setCanvasError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    updateMasks(state, action: PayloadAction<CanvasModel>) {
      const updatedMask = action.payload;
      const index = state.masks.findIndex((mask) => mask.id === updatedMask.id);
      if (index !== -1) {
        state.masks[index] = updatedMask;
      } else {
        state.masks.push(updatedMask);
      }
    },
    deleteMask(state, action: PayloadAction<number>) {
      const maskId = action.payload;
      state.masks = state.masks.filter((mask) => mask.id !== maskId);
      state.deleteMaskId = action.payload; // Reset deleteMaskId after deletion
    },
    setDeleteMMaskId(state, action: PayloadAction<number | null>) {
      state.deleteMaskId = action.payload; // Set the ID of the mask to be deleted
    },
    updateIsGenerateMask: (state, action: PayloadAction<boolean>) => {
      state.isGenerateMask = action.payload;
    },
    updateIsScreenShotTaken: (state, action: PayloadAction<boolean>) => {
      state.isScreenshotTaken = action.payload; // Update the screenshot taken flag
    },
    updateScreenShotUrl: (state, action: PayloadAction<string | null>) => {
      state.screenShotUrl = action.payload; // Update the screenshot URL
    },
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeCanvas = action.payload;
    },

    // Reset canvas state to initial values
    resetCanvas(state) {
      state.currentZoom = 1;
      state.isCanvasReady = false;
      state.isBusy = false;
      state.error = null;
      state.masks = [];
      state.canvasType = "hover";
      state.isScreenshotTaken = false; // Reset screenshot taken flag
      state.screenShotUrl = null; // Reset screenshot URL
      state.activeCanvas = "hideSegments";
    },
   setIsResetZoom: (state, action: PayloadAction<boolean>) => {
      state.isResetZoom = action.payload; // Update the reset zoom flag 
  }
}
});

// Export actions
export const {
  setCanvasType,
  updateHoverGroup,
  setZoom,
  setZoomMode,
  toggleZoomMode,
  setCanvasReady,
  setMousePosition,
  setCanvasBusy,
  setCanvasError,
  resetCanvas,
  setIsCanvasModalOpen,
  setCanvasActiveTool,
  updateMasks,
  deleteMask,
  setDeleteMMaskId,
  updateIsGenerateMask,
  updateIsScreenShotTaken,
  updateScreenShotUrl,
  setIsResetZoom,setActiveTab
} = canvasSlice.actions;

// Export reducer
export default canvasSlice.reducer;
