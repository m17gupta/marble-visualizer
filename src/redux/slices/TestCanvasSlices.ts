import { createSlice, PayloadAction } from "@reduxjs/toolkit";

 export interface PolyModel{
  box: number[];
  annotation: number[];
}
interface TestCanvasState {
  allPolygon: PolyModel[];
  
}

const initialState: TestCanvasState = {
  allPolygon: [],
};

const testCanvasSlice = createSlice({
  name: "testCanvas",
  initialState,
  reducers: {
    setAnnotation: (state, action) => {
      state.allPolygon = action.payload;
    },
    
    clearTestCanvas: (state) => {
      state.allPolygon = [];
    },
  },
});

export const { setAnnotation, clearTestCanvas } = testCanvasSlice.actions;

  testCanvasSlice.actions;

export default testCanvasSlice.reducer;
