import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DemoCanvasState {
  isHover: boolean;
  isMask: boolean;
  isResetCanvas: boolean;
  isShowSegmentName: boolean;
  userImage: File | null;
}

const initialState: DemoCanvasState = {
  isHover: true,
  isMask: false,
  isResetCanvas: false,
  isShowSegmentName: false,
  userImage:  null
};

const demoCanvasSlice = createSlice({
  name: 'demoCanvas',
  initialState,
  reducers: {
    setIsHover(state, action: PayloadAction<boolean>) {
    


    },
    setIsMask(state, action: PayloadAction<boolean>) {
      if(action.payload){
        state.isMask = true;
        state.isHover = false;
        state.isResetCanvas = false;
      }else{
        state.isMask = false;
      }
      
    },
    setIsResetCanvas(state, action: PayloadAction<boolean>) {
          if(action.payload){
           
            state.isResetCanvas = true;
            state.isHover = false;
            state.isMask = false;
        }
    },
    setIsShowSegmentName(state, action: PayloadAction<boolean>) {
      state.isShowSegmentName = action.payload;
    },

    setUserImage(state, action: PayloadAction<File | null>) {
      state.userImage = action.payload;
    },
    resetDemoCanvasState(state) {
      state.isHover = true;
      state.isMask = false;
      state.isResetCanvas = false;
      state.isShowSegmentName = false;
      state.userImage = null;
    },
  },
});

export const { setIsHover, 
  setIsMask,
   setIsResetCanvas,
   setIsShowSegmentName,
    setUserImage,
    resetDemoCanvasState } = demoCanvasSlice.actions;
export default demoCanvasSlice.reducer;
