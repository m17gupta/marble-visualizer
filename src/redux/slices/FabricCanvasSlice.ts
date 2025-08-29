import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FabricCanvasState {
  hoverEvent: any | null; // fabric.TEvent is not serializable, so store as any or extract serializable data
  isHover: string;
}

const initialState: FabricCanvasState = {
  hoverEvent: null,
  isHover: '',
};

const FabricCanvasSlice = createSlice({
  name: 'fabricCanvas',
  initialState,
  reducers: {
    setHoverEvent(state, action: PayloadAction<any | null>) {
      state.hoverEvent = action.payload;
    },
    setIsHover(state, action: PayloadAction<string>) {
      state.isHover = action.payload;
    },
    clearHover(state) {
      state.hoverEvent = null;
      state.isHover = '';
    },
  },
});

export const { setHoverEvent, setIsHover, clearHover } = FabricCanvasSlice.actions;
export default FabricCanvasSlice.reducer;
