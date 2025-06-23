import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface DesignSettings {
  style: string;
  level: 1 | 2;
  preserve: string[];
  tone: string;
  intensity: number;
}

export interface StudioJob {
  id: string;
  status: 'idle' | 'loading' | 'completed' | 'error';
  progress: number;
  resultUrl?: string;
  error?: string;
  createdAt: string;
}

interface StudioState {
  currentProjectId: string | null;
  selectedSegmentType: string | null;
  designSettings: DesignSettings;
  currentImageUrl: string | null;
  currentJob: StudioJob | null;
  jobHistory: StudioJob[];
  isUploading: boolean;
  error: string | null;
}

const initialState: StudioState = {
  currentProjectId: null,
  selectedSegmentType: null,
  designSettings: {
    style: 'modern',
    level: 1,
    preserve: ['roof', 'windows'],
    tone: 'warm',
    intensity: 50,
  },
  currentImageUrl: null,
  currentJob: null,
  jobHistory: [],
  isUploading: false,
  error: null,
};

// Async thunk for starting a design job
export const startDesignJob = createAsyncThunk(
  'studio/startDesignJob',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { studio: StudioState };
      const { designSettings, currentImageUrl, currentProjectId } = state.studio;
      
      if (!currentImageUrl) {
        throw new Error('No image uploaded');
      }
      
      // Create job
      const job: StudioJob = {
        id: Date.now().toString(),
        status: 'loading',
        progress: 0,
        createdAt: new Date().toISOString(),
      };
      
      // Simulate API call for design generation
      const jobData = {
        projectId: currentProjectId,
        imageUrl: currentImageUrl,
        settings: designSettings,
      };
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        // This would be handled by the progress update thunk in a real app
      }, 500);
      
      // Simulate job completion after 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      clearInterval(progressInterval);
      
      // Mock result
      const result = {
        ...job,
        status: 'completed' as const,
        progress: 100,
        resultUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      };
      
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start design job');
    }
  }
);

// Async thunk for uploading image
export const uploadImage = createAsyncThunk(
  'studio/uploadImage',
  async (file: File, { rejectWithValue }) => {
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would upload to a server
      // For now, create a local URL
      const imageUrl = URL.createObjectURL(file);
      
      return { imageUrl };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload image');
    }
  }
);

// Async thunk for updating job progress (would be called by websocket/polling)
export const updateJobProgress = createAsyncThunk(
  'studio/updateJobProgress',
  async ({ jobId, progress }: { jobId: string; progress: number }) => {
    return { jobId, progress };
  }
);

const studioSlice = createSlice({
  name: 'studio',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<string>) => {
      state.currentProjectId = action.payload;
    },
    setSelectedSegmentType: (state, action: PayloadAction<string | null>) => {
      state.selectedSegmentType = action.payload;
    },
    updateDesignSettings: (state, action: PayloadAction<Partial<DesignSettings>>) => {
      state.designSettings = { ...state.designSettings, ...action.payload };
    },
    setStyle: (state, action: PayloadAction<string>) => {
      state.designSettings.style = action.payload;
    },
    setLevel: (state, action: PayloadAction<1 | 2>) => {
      state.designSettings.level = action.payload;
    },
    togglePreserveObject: (state, action: PayloadAction<string>) => {
      const object = action.payload;
      const preserve = state.designSettings.preserve;
      if (preserve.includes(object)) {
        state.designSettings.preserve = preserve.filter(item => item !== object);
      } else {
        state.designSettings.preserve = [...preserve, object];
      }
    },
    setTone: (state, action: PayloadAction<string>) => {
      state.designSettings.tone = action.payload;
    },
    setIntensity: (state, action: PayloadAction<number>) => {
      state.designSettings.intensity = action.payload;
    },
    clearCurrentImage: (state) => {
      if (state.currentImageUrl) {
        URL.revokeObjectURL(state.currentImageUrl);
      }
      state.currentImageUrl = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    cancelCurrentJob: (state) => {
      if (state.currentJob && state.currentJob.status === 'loading') {
        state.currentJob.status = 'error';
        state.currentJob.error = 'Job cancelled by user';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload image
      .addCase(uploadImage.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.isUploading = false;
        state.currentImageUrl = action.payload.imageUrl;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      })
      
      // Start design job
      .addCase(startDesignJob.pending, (state) => {
        state.currentJob = {
          id: Date.now().toString(),
          status: 'loading',
          progress: 0,
          createdAt: new Date().toISOString(),
        };
        state.error = null;
      })
      .addCase(startDesignJob.fulfilled, (state, action) => {
        state.currentJob = action.payload;
        state.jobHistory.unshift(action.payload);
      })
      .addCase(startDesignJob.rejected, (state, action) => {
        if (state.currentJob) {
          state.currentJob.status = 'error';
          state.currentJob.error = action.payload as string;
        }
        state.error = action.payload as string;
      })
      
      // Update job progress
      .addCase(updateJobProgress.fulfilled, (state, action) => {
        const { jobId, progress } = action.payload;
        if (state.currentJob && state.currentJob.id === jobId) {
          state.currentJob.progress = progress;
        }
      });
  },
});

export const {
  setCurrentProject,
  setSelectedSegmentType,
  updateDesignSettings,
  setStyle,
  setLevel,
  togglePreserveObject,
  setTone,
  setIntensity,
  clearCurrentImage,
  clearError,
  cancelCurrentJob,
} = studioSlice.actions;

export default studioSlice.reducer;