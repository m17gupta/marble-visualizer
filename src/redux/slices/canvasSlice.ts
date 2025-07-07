import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the types for canvas state
export type ZoomMode = 'center' | 'mouse';

// Define the types for mouse coordinates
export interface MouseCoordinates {
  x: number;
  y: number;
}

// Define the state interface
interface CanvasState {
  currentZoom: number;
  zoomMode: ZoomMode;
  mousePosition: MouseCoordinates;
  isCanvasReady: boolean;
  isBusy: boolean;
  error: string | null;
}

// Initial state
const initialState: CanvasState = {
  currentZoom: 1,
  zoomMode: 'center',
  mousePosition: { x: 0, y: 0 },
  isCanvasReady: false,
  isBusy: false,
  error: null,
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

    // Update mouse position
    setMousePosition(state, action: PayloadAction<MouseCoordinates>) {
      state.mousePosition = action.payload;
    },

    // Set busy state (for async operations)
    setCanvasBusy(state, action: PayloadAction<boolean>) {
      state.isBusy = action.payload;
    },

    // Set error state
    setCanvasError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // Reset canvas state to initial values
    resetCanvas(state) {
      state.currentZoom = 1;
      state.isCanvasReady = false;
      state.isBusy = false;
      state.error = null;
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
} = canvasSlice.actions;

// Export reducer
export default canvasSlice.reducer;
