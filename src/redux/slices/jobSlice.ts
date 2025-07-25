import { JobModel } from "@/models/jobModel/JobModel";
import { UpdateJobRequest } from "@/services/jobService/JobApi";
import { JobService } from "@/services/jobService/JobService";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface JobState {
  list: JobModel[];
  currentJob: JobModel | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  isSidebarHeaderCollapsed?: boolean;
}

const initialState: JobState = {
  list: [],
  currentJob: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  isSidebarHeaderCollapsed: true,
};

// Async thunk to fetch jobs by project ID
export const fetchJobsByProject = createAsyncThunk(
  "jobs/fetchJobsByProject",
  async (project_id: number, { rejectWithValue }) => {
    try {
      const response = await JobService.getJobsByProjectId(project_id);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch jobs");
      }

      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch jobs"
      );
    }
  }
);

// Async thunk to fetch all jobs
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await JobService.getAllJobs();

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch jobs");
      }

      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch jobs"
      );
    }
  }
);

// Async thunk to fetch a single job by ID
export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await JobService.getJobById(id);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Job not found");
      }

      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch job"
      );
    }
  }
);

//
// Async thunk to create a new job
export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData: JobModel, { rejectWithValue }) => {
    try {
      const response = await JobService.createJob(jobData);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create job");
      }

      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to create job"
      );
    }
  }
);

// Async thunk to update an existing job
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async (
    { id, updates }: { id: number; updates: UpdateJobRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await JobService.updateJob(id, updates);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update job");
      }

      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to update job"
      );
    }
  }
);

// Async thunk to delete a job
export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await JobService.deleteJob(id);

      if (!response.success) {
        throw new Error(response.error || "Failed to delete job");
      }

      return id;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to delete job"
      );
    }
  }
);

// Async thunk to update job segments
export const updateJobSegments = createAsyncThunk(
  "jobs/updateJobSegments",
  async (
    { id, segments }: { id: number; segments: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await JobService.updateJobSegments(id, segments);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update job segments");
      }

      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to update job segments"
      );
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setCurrentJob: (state, action: PayloadAction<JobModel>) => {
      state.currentJob = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearError: (state) => {
      state.error = null;
    },

    updateSidebarHeaderCollapse: (state, action: PayloadAction<boolean>) => {
      state.isSidebarHeaderCollapsed = action.payload;
    },
    updateCurrentJobSegments: (state, action: PayloadAction<string>) => {
      if (state.currentJob) {
        // state.currentJob.segements = action.payload;
        // state.currentJob.updated_at = new Date().toISOString();
      }
    },
    resetJobSlice: (state) => {
      state.list = [];
      state.currentJob = null;
      state.isLoading = false;
      state.isCreating = false;
      state.isUpdating = false;
      state.isDeleting = false;
      state.error = null;
      state.isSidebarHeaderCollapsed = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs by project
      .addCase(fetchJobsByProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobsByProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchJobsByProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch all jobs
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create job
      .addCase(createJob.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isCreating = false;
        state.currentJob = action.payload;
        state.list = [action.payload, ...state.list]; // Add to beginning of list
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })

      // Update job
      .addCase(updateJob.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedJob = action.payload;
        const jobIndex = state.list.findIndex((j) => j.id === updatedJob.id);
        if (jobIndex !== -1) {
          state.list[jobIndex] = updatedJob;
        }
        if (state.currentJob && state.currentJob.id === updatedJob.id) {
          state.currentJob = updatedJob;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedId = action.payload;
        state.list = state.list.filter((j) => j.id !== deletedId);
        if (state.currentJob && state.currentJob.id === deletedId) {
          state.currentJob = null;
        }
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      })

      // Update job segments
      .addCase(updateJobSegments.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateJobSegments.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedJob = action.payload;
        const jobIndex = state.list.findIndex((j) => j.id === updatedJob.id);
        if (jobIndex !== -1) {
          state.list[jobIndex] = updatedJob;
        }
        if (state.currentJob && state.currentJob.id === updatedJob.id) {
          state.currentJob = updatedJob;
        }
      })
      .addCase(updateJobSegments.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentJob,
  clearCurrentJob,
  clearError,
  updateCurrentJobSegments,
  updateSidebarHeaderCollapse,
  resetJobSlice,
} = jobSlice.actions;

export const getAllJobs = (state: { jobs: JobState }) => state.jobs.list;
export const getIsSideBarHeader = (state: { jobs: JobState }) =>
  state.jobs.isSidebarHeaderCollapsed;

export default jobSlice.reducer;
