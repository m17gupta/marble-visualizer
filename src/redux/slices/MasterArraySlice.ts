import { MasterModel } from "@/models";
import { createSlice } from "@reduxjs/toolkit";


interface MasterArrayState {
  masterArray: MasterModel[];
  selectedMasterArray?: MasterModel | null;
}

const initialState: MasterArrayState = {
  masterArray: [],
    selectedMasterArray: null,
};

const masterArraySlice = createSlice({
  name: "masterArray",
  initialState,
  reducers: {
    setMasterArray: (state, action) => {
      state.masterArray = action.payload;
    },
    addSelectedMasterArray: (state, action) => {
        const segName = action.payload
      state.selectedMasterArray = state.masterArray.find(
        (item) => item.name === segName
      ) || null;
    },
    removeFromMasterArray: (state, action) => {
      state.masterArray = state.masterArray.filter(item => item !== action.payload);
    },
    clearMasterArray: () => {
      return initialState
    }
  },
});

export const {
    setMasterArray,
    addSelectedMasterArray,
    removeFromMasterArray,
    clearMasterArray
} = masterArraySlice.actions;

export default masterArraySlice.reducer;
