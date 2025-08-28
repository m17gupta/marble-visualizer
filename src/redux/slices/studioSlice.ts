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
  
  currentImageUrl: string | null;
  currentInspirationTab:string
}

const initialState: StudioState = {
  currentTabContent: 'home',
  currentImageUrl: null,
  currentInspirationTab:"chat"

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

      updateCurrentInspirationTab: (state, action: PayloadAction<string>) => {
          state.currentInspirationTab = action.payload;
      },
        clearCurrentImage: () => {
      return initialState
    },
  },
  
});

export const {
  setCurrentTabContent,
  setCurrentImageUrl,
  clearCurrentImage,
  updateCurrentInspirationTab
} = studioSlice.actions;

export default studioSlice.reducer;