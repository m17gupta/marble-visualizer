import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TestCanvasState {
  annotation: number[];
  bbInt: number[];
}

const initialState: TestCanvasState = {
  annotation: [],
  bbInt: [],
};

const testCanvasSlice = createSlice({
  name: "testCanvas",
  initialState,
  reducers: {
    setAnnotation: (state, action: PayloadAction<number[]>) => {
      state.annotation = action.payload;
    },
    setBbInt: (state, action: PayloadAction<number[]>) => {
      state.bbInt = action.payload;
    },
    clearTestCanvas: (state) => {
      state.annotation = [];
      state.bbInt = [];
    },
  },
});

export const { setAnnotation, setBbInt, clearTestCanvas } =
  testCanvasSlice.actions;

export default testCanvasSlice.reducer;
