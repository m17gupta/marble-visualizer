import { CanvasModel } from '@/models/canvasModel/CanvasModel';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Define the types for canvas state
export type ZoomMode = 'center' | 'mouse';

// Define the types for mouse coordinates
export interface MouseCoordinates {
  x: number;
  y: number;
}
export type CanvasMode = "mask" | "draw" | "edit" | "reannotation";

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
  canvasType: "mask" | "draw" | "edit" | "reannotation" ;
}

// Initial state
const initialState: CanvasState = {
  currentZoom: 1,
  zoomMode: 'mouse',
  mousePosition: { x: 0, y: 0 },
  isCanvasReady: false,
  isBusy: false,
  error: null,
  canavasActiveTool: "",
  isCanvasModalOpen: false,
  masks: [],
  canvasType:"draw",
};

// Create the canvas slice
const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
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
    toggleZoomMode(state) {
      state.zoomMode = state.zoomMode === 'center' ? 'mouse' : 'center';
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
    setCanvasType(state, action: PayloadAction<"mask" | "draw" | "edit" | "reannotation">) {
      state.canvasType = action.payload;
    },

    updateMasks(state, action: PayloadAction<CanvasModel>) {
      const updatedMask = action.payload;
      const index = state.masks.findIndex(mask => mask.id === updatedMask.id);
      if (index !== -1) {
        state.masks[index] = updatedMask;
      } else {
        state.masks.push(updatedMask);
      }
    },
    deleteMask(state, action: PayloadAction<number>) {
      const maskId = action.payload;
      state.masks = state.masks.filter(mask => mask.id !== maskId);
    },

    // Reset canvas state to initial values
    resetCanvas(state) {
      state.currentZoom = 1;
      state.isCanvasReady = false;
      state.isBusy = false;
      state.error = null;
      state.masks=[];
      // Zoom mode is not reset as it's a user preference
    },
  },
});

// Export actions
export const {
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
  setCanvasType,
  updateMasks,
  deleteMask
} = canvasSlice.actions;

// Export reducer
export default canvasSlice.reducer;
