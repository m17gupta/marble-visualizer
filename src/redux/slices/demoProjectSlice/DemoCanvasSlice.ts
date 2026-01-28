import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { set } from 'lodash';

interface DemoCanvasState {
  isHover: boolean;
  isMask: boolean;
  isResetCanvas: boolean;
  isOutline: boolean;
  isShowSegmentName: boolean;
  userImage: File | null;
  isMasterSelected: boolean;
  isUpdatePoint: boolean;
}

const initialState: DemoCanvasState = {
  isHover: true,
  isMask: false,
  isResetCanvas: false,
  isShowSegmentName: false,
  userImage: null,
  isMasterSelected: true,
  isOutline: false,
  isUpdatePoint: false
};

const demoCanvasSlice = createSlice({
  name: 'demoCanvas',
  initialState,
  reducers: {
    setIsHover(state, action: PayloadAction<boolean>) {



    },
    setIsMask(state, action: PayloadAction<boolean>) {
      if (action.payload) {
        state.isMask = true;
        state.isHover = false;
        state.isResetCanvas = false;
      } else {
        state.isMask = false;
      }

    },
    setIsResetCanvas(state, action: PayloadAction<boolean>) {
      if (action.payload) {

        state.isResetCanvas = true;
        state.isHover = false;
        state.isMask = false;
      }else{
        state.isResetCanvas = false;
      }
    },
    setIsShowSegmentName(state, action: PayloadAction<boolean>) {
      state.isShowSegmentName = action.payload;
    },

    setUserImage(state, action: PayloadAction<File | null>) {
      state.userImage = action.payload;
    },
    setIsMasterSelected(state, action: PayloadAction<boolean>) {
      state.isMasterSelected = action.payload;
    },

    setIsUpdateOutline(state, action: PayloadAction<boolean>) {
      state.isOutline = action.payload;
    },
    setIsUpdatePoint(state, action: PayloadAction<boolean>) {
      state.isUpdatePoint = action.payload;
    },
    resetDemoCanvasState(state) {
      state.isHover = true;
      state.isMask = false;
      state.isResetCanvas = false;
      state.isShowSegmentName = false;
      state.userImage = null;
      state.isMasterSelected = true;
      state.isOutline = false;
      state.isUpdatePoint = false;
    },
  },
});

export const { setIsHover,
  setIsMask,
  setIsResetCanvas,
  setIsShowSegmentName,
  setUserImage,
  setIsUpdateOutline,
  setIsMasterSelected,
  setIsUpdatePoint,
  resetDemoCanvasState } = demoCanvasSlice.actions;
export default demoCanvasSlice.reducer;
