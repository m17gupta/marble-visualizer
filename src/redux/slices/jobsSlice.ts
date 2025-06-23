import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { logActivity } from './activityLogsSlice';

export interface JobPayload {
  imageUrl: string;
  style: string;
  level: 1 | 2;
  preserve: string[];
  tone: string;
  intensity: number;
  segments: Array<{
    id: string;
    points: Array<{ x: number; y: number }>;
    materialId?: string;
  }>;
}

export interface JobVariation {
  id: string;
  timestamp: string;
  imageUrl: string;
  style: string;
  settings: JobPayload;
  s3Url?: string;
}

export interface AIJob {
  id: string;
  projectId: string;
  status: 'idle' | 'loading' | 'completed' | 'failed';
  progress: number;
  resultUrl?: string;
  s3Url?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
  payload: JobPayload;
}

interface JobsState {
  currentJob: AIJob | null;
  jobHistory: AIJob[];
  variations: Record<string, JobVariation[]>; // projectId -> variations
  activeVariationId: string | null;
  isPolling: boolean;
  pollingInterval: number;
  error: string | null;
}

const initialState: JobsState = {
  currentJob: null,
  jobHistory: [],
  variations: {},
  activeVariationId: null,
  isPolling: false,
  pollingInterval: 3000,
  error: null,
};

// Async thunk to start AI job
export const startAIJob = createAsyncThunk(
  'jobs/startAIJob',
  async ({ projectId, payload }: { projectId: string; payload: JobPayload }, { rejectWithValue, dispatch }) => {
    try {
      // Simulate API call to start job
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock response - in real app: const response = await fetch('/api/jobs/start', { method: 'POST', body: JSON.stringify({ projectId, ...payload }) });
      const mockJob: AIJob = {
        id: `job_${Date.now()}`,
        projectId,
        status: 'loading',
        progress: 0,
        createdAt: new Date().toISOString(),
        payload,
      };
      
      return mockJob;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start AI job');
    }
  }
);

// Async thunk to poll job status
export const pollJobStatus = createAsyncThunk(
  'jobs/pollJobStatus',
  async (jobId: string, { rejectWithValue, getState, dispatch }) => {
    try {
      // Simulate API call to check job status
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock progressive status updates
      const random = Math.random();
      let status: 'loading' | 'completed' | 'failed' = 'loading';
      let progress = Math.floor(Math.random() * 100);
      let resultUrl: string | undefined;
      let s3Url: string | undefined;
      
      // Simulate job completion after some time
      if (random > 0.7) {
        status = 'completed';
        progress = 100;
        resultUrl = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2';
        s3Url = 'https://example-bucket.s3.amazonaws.com/results/job_' + jobId + '.jpg';
        
        // Log completion activity
        const state = getState() as any;
        const currentJob = state.jobs.currentJob;
        if (currentJob) {
          dispatch(logActivity({
            projectId: currentJob.projectId,
            type: 'ai_job_completed',
            action: 'AI Job Completed',
            detail: `Design generation completed with ${currentJob.payload.style} style`,
            metadata: {
              jobId,
              style: currentJob.payload.style,
              processingTime: Date.now() - new Date(currentJob.createdAt).getTime(),
            },
          }));
        }
      } else if (random < 0.05) {
        status = 'failed';
        
        // Log failure activity
        const state = getState() as any;
        const currentJob = state.jobs.currentJob;
        if (currentJob) {
          dispatch(logActivity({
            projectId: currentJob.projectId,
            type: 'ai_job_failed',
            action: 'AI Job Failed',
            detail: 'Design generation failed due to processing error',
            metadata: { jobId, error: 'Processing timeout' },
          }));
        }
      }
      
      return {
        jobId,
        status,
        progress,
        resultUrl,
        s3Url,
        completedAt: status === 'completed' ? new Date().toISOString() : undefined,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to poll job status');
    }
  }
);

// Async thunk to upload result to S3
export const uploadResultToS3 = createAsyncThunk(
  'jobs/uploadResultToS3',
  async ({ jobId, imageUrl }: { jobId: string; imageUrl: string }, { rejectWithValue }) => {
    try {
      // Simulate getting presigned URL and uploading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock S3 URL - in real app: get presigned URL from backend, then upload
      const s3Url = `https://example-bucket.s3.amazonaws.com/results/${jobId}.jpg`;
      
      return { jobId, s3Url };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload to S3');
    }
  }
);

// Async thunk to save project metadata
export const saveProjectMetadata = createAsyncThunk(
  'jobs/saveProjectMetadata',
  async ({ projectId, s3Url }: { projectId: string; s3Url: string }, { rejectWithValue }) => {
    try {
      // Simulate API call to update project
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock response - in real app: PATCH /api/projects/:id
      return { projectId, s3Url };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save project metadata');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setActiveVariation: (state, action: PayloadAction<string | null>) => {
      state.activeVariationId = action.payload;
    },
    startPolling: (state) => {
      state.isPolling = true;
    },
    stopPolling: (state) => {
      state.isPolling = false;
    },
    setPollingInterval: (state, action: PayloadAction<number>) => {
      state.pollingInterval = action.payload;
    },
    cancelCurrentJob: (state) => {
      if (state.currentJob && state.currentJob.status === 'loading') {
        state.currentJob.status = 'failed';
        state.currentJob.error = 'Job cancelled by user';
        state.currentJob.completedAt = new Date().toISOString();
      }
      state.isPolling = false;
    },
    addVariation: (state, action: PayloadAction<{ projectId: string; variation: JobVariation }>) => {
      const { projectId, variation } = action.payload;
      if (!state.variations[projectId]) {
        state.variations[projectId] = [];
      }
      state.variations[projectId].unshift(variation); // Add to beginning
      state.activeVariationId = variation.id;
    },
    removeVariation: (state, action: PayloadAction<{ projectId: string; variationId: string }>) => {
      const { projectId, variationId } = action.payload;
      if (state.variations[projectId]) {
        state.variations[projectId] = state.variations[projectId].filter(v => v.id !== variationId);
        if (state.activeVariationId === variationId) {
          state.activeVariationId = state.variations[projectId][0]?.id || null;
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearJobHistory: (state) => {
      state.jobHistory = [];
    },
    clearVariations: (state, action: PayloadAction<string>) => {
      const projectId = action.payload;
      delete state.variations[projectId];
      state.activeVariationId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start AI job
      .addCase(startAIJob.pending, (state) => {
        state.error = null;
      })
      .addCase(startAIJob.fulfilled, (state, action) => {
        state.currentJob = action.payload;
        state.jobHistory.unshift(action.payload);
        state.isPolling = true;
      })
      .addCase(startAIJob.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isPolling = false;
      })
      
      // Poll job status
      .addCase(pollJobStatus.fulfilled, (state, action) => {
        const { jobId, status, progress, resultUrl, s3Url, completedAt } = action.payload;
        
        if (state.currentJob && state.currentJob.id === jobId) {
          state.currentJob.status = status;
          state.currentJob.progress = progress;
          state.currentJob.resultUrl = resultUrl;
          state.currentJob.s3Url = s3Url;
          state.currentJob.completedAt = completedAt;
          
          // Stop polling if job is completed or failed
          if (status === 'completed' || status === 'failed') {
            state.isPolling = false;
            
            // Create variation if completed successfully
            if (status === 'completed' && resultUrl) {
              const variation: JobVariation = {
                id: `var_${Date.now()}`,
                timestamp: new Date().toISOString(),
                imageUrl: resultUrl,
                style: state.currentJob.payload.style,
                settings: state.currentJob.payload,
                s3Url,
              };
              
              const projectId = state.currentJob.projectId;
              if (!state.variations[projectId]) {
                state.variations[projectId] = [];
              }
              state.variations[projectId].unshift(variation);
              state.activeVariationId = variation.id;
            }
          }
        }
        
        // Update job in history
        const historyIndex = state.jobHistory.findIndex(job => job.id === jobId);
        if (historyIndex !== -1) {
          state.jobHistory[historyIndex] = { ...state.jobHistory[historyIndex], ...action.payload };
        }
      })
      .addCase(pollJobStatus.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isPolling = false;
      })
      
      // Upload to S3
      .addCase(uploadResultToS3.fulfilled, (state, action) => {
        const { jobId, s3Url } = action.payload;
        
        if (state.currentJob && state.currentJob.id === jobId) {
          state.currentJob.s3Url = s3Url;
        }
        
        // Update variation with S3 URL
        Object.values(state.variations).forEach(variations => {
          variations.forEach(variation => {
            if (variation.id.includes(jobId)) {
              variation.s3Url = s3Url;
            }
          });
        });
      })
      .addCase(uploadResultToS3.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Save project metadata
      .addCase(saveProjectMetadata.fulfilled, (state) => {
        // Project metadata saved successfully
      })
      .addCase(saveProjectMetadata.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setActiveVariation,
  startPolling,
  stopPolling,
  setPollingInterval,
  cancelCurrentJob,
  addVariation,
  removeVariation,
  clearError,
  clearJobHistory,
  clearVariations,
} = jobsSlice.actions;

export default jobsSlice.reducer;