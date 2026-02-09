import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DemoMasterModel } from "@/models/demoModel/DemoMaterArrayModel";
import { set } from "date-fns";
import { MaterialModel } from "@/models/swatchBook/material/MaterialModel";
import { update } from "lodash";
import { CheckboxPosition } from "@/components/demoProject/samplePlayBook/demoCanvas/ShowSelectedSegment";

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
      updateAnontationPosition: (state, action: PayloadAction<{ data: CheckboxPosition[] }>) => {
      const { data } = action.payload;

      // Iterate through each checkbox position update
      data.forEach((checkboxPos: CheckboxPosition) => {
        // Find the master item that contains the segment
        const masterIndex = state.demoMasterArray.findIndex(item => {
          const allSeg = item.allSegments;
          return allSeg?.some(seg => seg.short_title === checkboxPos.segmentKey);
        });
     
        if (masterIndex !== -1) {
          const allSeg = state.demoMasterArray[masterIndex].allSegments;
          const segIndex = allSeg?.findIndex(seg => seg.short_title === checkboxPos.segmentKey);

          if (segIndex !== undefined && segIndex !== -1 && allSeg) {
            state.demoMasterArray[masterIndex].allSegments![segIndex].show_annotation_points = checkboxPos;
          }
        }
      });
    },

    removeSelectedSwatch: (state, action) => {
      const { swatchId, groupId } = action.payload;
      if (state.selectedDemoMasterItem) {

        state.selectedDemoMasterItem.overAllSwatch = state.selectedDemoMasterItem.overAllSwatch.filter(
          (swatch) => swatch.id !== swatchId
        );
      }

      const masterIndex = state.demoMasterArray.findIndex(item => item.id === groupId);
      if (masterIndex !== -1) {
        state.demoMasterArray[masterIndex].overAllSwatch = state.demoMasterArray[masterIndex].overAllSwatch.filter(
          (swatch) => swatch.id !== swatchId
        );
      }

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
  updateAnontationPosition,
  removeSelectedSwatch,
} = demoMasterArraySlice.actions;

export default demoMasterArraySlice.reducer;
