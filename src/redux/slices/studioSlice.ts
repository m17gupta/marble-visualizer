import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface DesignSettings {
  style: string;
  level: 1 | 2;
  preserve: string[];
  tone: string;
  intensity: number;
}

// export interface StudioJob {
//   id: string;
//   status: 'idle' | 'loading' | 'completed' | 'error';
//   progress: number;
//   resultUrl?: string;
//   error?: string;
//   createdAt: string;
// }

type inspirationTabContent = 'home' | 'compare' | 'canvas';

interface StudioState {

  currentTabContent: inspirationTabContent;
  // currentProjectId: string | null;
  // selectedSegmentType: string | null;
  // designSettings: DesignSettings;
  currentImageUrl: string | null;
  // currentJob: StudioJob | null;
  // jobHistory: StudioJob[];
  // isUploading: boolean;
  // error: string | null;
}

const initialState: StudioState = {
  currentTabContent: 'home',
  currentImageUrl: null,

};



const studioSlice = createSlice({
  name: 'studio',
  initialState,
  reducers: {
      setCurrentTabContent: (state, action: PayloadAction<inspirationTabContent>) => {
          state.currentTabContent = action.payload;
      },

      setCurrentImageUrl: (state, action: PayloadAction<string | null>) => {
          state.currentImageUrl = action.payload;
      },
       clearCurrentImage: (state) => {
      if (state.currentImageUrl) {
        URL.revokeObjectURL(state.currentImageUrl);
      }
      state.currentImageUrl = null;
    },
  },
  
});

export const {
  setCurrentTabContent,
  setCurrentImageUrl,
  clearCurrentImage
} = studioSlice.actions;

export default studioSlice.reducer;