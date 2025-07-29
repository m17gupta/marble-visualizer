import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectAnalyseState {
  jobUrl: string|null;
  projectId: number|null;
  isAnalyseImage: boolean;
  isAnalyseProcess: boolean;
  isAnalyseFinish: boolean;
}
  
const initialState: ProjectAnalyseState = {
  jobUrl: null  ,
  projectId: null,
  isAnalyseImage: false,
  isAnalyseProcess: false,
  isAnalyseFinish: false,
};

const projectAnalyseSlice = createSlice({
  name: 'projectAnalyse',
  initialState,
  reducers: {
    setJobUrl(state, action: PayloadAction<string|null>) {
      state.jobUrl = action.payload;
    },
    setProjectId(state, action: PayloadAction<number|null>) {
      state.projectId = action.payload;
    },
    setIsAnalyseImage(state, action: PayloadAction<boolean>) {
      state.isAnalyseImage = action.payload;
    },
    setIsAnalyseProcess(state, action: PayloadAction<boolean>) {
      state.isAnalyseProcess = action.payload;
    },
    setIsAnalyseFinish(state, action: PayloadAction<boolean>) {
      state.isAnalyseFinish = action.payload;
    },
    resetProjectAnalyse(state) {
      state.jobUrl = '';
      state.projectId = 0;
      state.isAnalyseImage = false;
      state.isAnalyseProcess = false;
      state.isAnalyseFinish = false;
    },
  },
});

export const {
  setJobUrl,
  setProjectId,
  setIsAnalyseImage,
  setIsAnalyseProcess,
  setIsAnalyseFinish,
  resetProjectAnalyse,
} = projectAnalyseSlice.actions;

export default projectAnalyseSlice.reducer;
