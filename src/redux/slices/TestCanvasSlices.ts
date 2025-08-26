import { createSlice, PayloadAction } from "@reduxjs/toolkit";

 export interface PolyModel{
  id: number ;
  name: string;
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
    updateAnnotation: (state, action: PayloadAction<PolyModel>) => {
      const seg = action.payload;
      // check if exists then remove, if not then add
      const existingIndex = state.allPolygon.findIndex(item => item.id === seg.id);
      if (existingIndex !== -1) {
        // remove
        state.allPolygon.splice(existingIndex, 1);
      } else {
        // If it doesn't exist, we can add it
        state.allPolygon.push(seg);
      }
    },
    clearTestCanvas: (state) => {
      state.allPolygon = [];
    },
  },
});

export const { setAnnotation, clearTestCanvas ,updateAnnotation} = testCanvasSlice.actions;

  testCanvasSlice.actions;

export default testCanvasSlice.reducer;
