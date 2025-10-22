import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DemoMasterModel } from "@/models/demoModel/DemoMaterArrayModel";
import { set } from "date-fns";
import { MaterialModel } from "@/models/swatchBook/material/MaterialModel";
import { update } from "lodash";

interface DemoMasterArrayState {
  demoMasterArray: DemoMasterModel[];
  selectedDemoMasterItem?: DemoMasterModel | null;
  isdemoMasterArrayCreated?: boolean;
  isLoadingPallet: boolean;
  error: string | null;
  isSwatchDetailsOpen?: boolean;
  selectedSwatchInfo?: MaterialModel | null;
}

const initialState: DemoMasterArrayState = {
  demoMasterArray: [],
  selectedDemoMasterItem: null,
  isdemoMasterArrayCreated: false,
  isLoadingPallet: false,
  error: null,
  isSwatchDetailsOpen: false,
  selectedSwatchInfo: null,
};

const demoMasterArraySlice = createSlice({
  name: "demoMasterArray",
  initialState,
  reducers: {
    setDemoMasterArray: (state, action: PayloadAction<DemoMasterModel[]>) => {
      state.demoMasterArray = action.payload;
      state.isdemoMasterArrayCreated = true;
      state.error = null;
    },
    setSelectedDemoMasterItem: (state, action: PayloadAction<DemoMasterModel | null>) => {
      state.selectedDemoMasterItem = action.payload;
    },
    addDemoMasterItem: (state, action: PayloadAction<DemoMasterModel>) => {
      state.demoMasterArray.push(action.payload);
    },
    updateDemoMasterItem: (state, action: PayloadAction<{ id: number; data: Partial<DemoMasterModel> }>) => {
      const { id, data } = action.payload;
      const index = state.demoMasterArray.findIndex(item => item.id === id);
      if (index !== -1) {
        state.demoMasterArray[index] = { ...state.demoMasterArray[index], ...data };
      }
    },
    removeDemoMasterItem: (state, action: PayloadAction<number>) => {
      state.demoMasterArray = state.demoMasterArray.filter(item => item.id !== action.payload);
    },
    setIsLoadingPallet: (state, action: PayloadAction<boolean>) => {
      state.isLoadingPallet = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoadingPallet = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setIsSwatchDetailsOpen: (state, action: PayloadAction<boolean>) => {
      state.isSwatchDetailsOpen = action.payload;
    },
    updateSelectedSwatchInfo: (state, action: PayloadAction<MaterialModel | null>) => {
      state.selectedSwatchInfo = action.payload;
    },

    updateSwatch:(state,action)=>{
      const {pallete,segType}= action.payload;

      const index= state.demoMasterArray.findIndex(item=>item.name===segType);
      debugger
      if(index!==-1){
        state.demoMasterArray[index].overAllSwatch.push(pallete);
      }
      state.selectedDemoMasterItem?.overAllSwatch.push(pallete);
    },
    resetDemoMasterArray: (state) => {
      return initialState;
    },
  },
});

export const {
  setDemoMasterArray,
  setSelectedDemoMasterItem,
  addDemoMasterItem,
  updateDemoMasterItem,
  removeDemoMasterItem,
  setIsLoadingPallet,
  updateSwatch,
  setError,
  clearError,
  setIsSwatchDetailsOpen,
  updateSelectedSwatchInfo,
  resetDemoMasterArray,
} = demoMasterArraySlice.actions;

export default demoMasterArraySlice.reducer;
