import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface ActivityLog {
  id: string;
  projectId: string;
  type: 'project_created' | 'style_changed' | 'material_applied' | 'segment_added' | 'segment_edited' | 'ai_job_started' | 'ai_job_completed' | 'ai_job_failed' | 'image_uploaded' | 'design_saved';
  action: string;
  detail: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ActivityLogsState {
  logs: Record<string, ActivityLog[]>; // projectId -> logs
  isLoading: boolean;
  error: string | null;
}

const initialState: ActivityLogsState = {
  logs: {},
  isLoading: false,
  error: null,
};

// Async thunk to fetch activity logs
export const fetchActivityLogs = createAsyncThunk(
  'activityLogs/fetchActivityLogs',
  async (projectId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock data - in real app: GET /api/activity-logs?projectId=xxx
      const mockLogs: ActivityLog[] = [
        {
          id: 'log_1',
          projectId,
          type: 'project_created',
          action: 'Project Created',
          detail: 'New project initialized',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: 'log_2',
          projectId,
          type: 'image_uploaded',
          action: 'Image Uploaded',
          detail: 'Background image added to canvas',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: 'log_3',
          projectId,
          type: 'style_changed',
          action: 'Style Changed',
          detail: 'Design style updated to Modern',
          timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
          metadata: { previousStyle: 'classic', newStyle: 'modern' },
        },
      ];
      
      return { projectId, logs: mockLogs };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch activity logs');
    }
  }
);

// Async thunk to save activity log
export const saveActivityLog = createAsyncThunk(
  'activityLogs/saveActivityLog',
  async (log: Omit<ActivityLog, 'id' | 'timestamp'>, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const newLog: ActivityLog = {
        ...log,
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      
      // In real app: POST /api/activity-logs
      return newLog;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save activity log');
    }
  }
);

const activityLogsSlice = createSlice({
  name: 'activityLogs',
  initialState,
  reducers: {
    // Helper action to log activity locally (optimistic update)
    logActivity: (state, action: PayloadAction<Omit<ActivityLog, 'id' | 'timestamp'>>) => {
      const log: ActivityLog = {
        ...action.payload,
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      
      const projectId = log.projectId;
      if (!state.logs[projectId]) {
        state.logs[projectId] = [];
      }
      
      state.logs[projectId].unshift(log); // Add to beginning
    },
    clearLogs: (state, action: PayloadAction<string>) => {
      const projectId = action.payload;
      delete state.logs[projectId];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch activity logs
      .addCase(fetchActivityLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        const { projectId, logs } = action.payload;
        state.logs[projectId] = logs;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Save activity log
      .addCase(saveActivityLog.fulfilled, (state, action) => {
        const log = action.payload;
        const projectId = log.projectId;
        
        if (!state.logs[projectId]) {
          state.logs[projectId] = [];
        }
        
        // Replace optimistic update or add new log
        const existingIndex = state.logs[projectId].findIndex(l => l.id === log.id);
        if (existingIndex !== -1) {
          state.logs[projectId][existingIndex] = log;
        } else {
          state.logs[projectId].unshift(log);
        }
      })
      .addCase(saveActivityLog.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { logActivity, clearLogs, clearError } = activityLogsSlice.actions;
export default activityLogsSlice.reducer;