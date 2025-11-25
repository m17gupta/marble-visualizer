import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AdminProjectService } from "../services/Project/AdminProjectService";
import { JobModel } from "@/models";
import { ProjectService } from "@/services/projects/ProjectsService";

export interface Project {
  id: number;
  name: string;
  user_id: any;
  description: string;
  created_at: string;
  updated_at: string;
  status: string;
  thumbnail: string;
  analysed_data?: string;
  house_segments?: string;
  jobs?: JobModel[];
}

export interface ProjectModal {
  list: Project[];
  currentProject: null | Project;
  isLoading: boolean;
  error: null | string;
  sortfield: string;
  sortorder: string;
  isOpen: boolean;
  currentloading: boolean;
}

const initialState: ProjectModal = {
  list: [],
  currentProject: null,
  isLoading: false,
  error: null,
  sortorder: "asec",
  sortfield: "name",
  isOpen: false,
  currentloading: false,
};

// Async thunk to fetch projects
export const adminFetchProjects = createAsyncThunk(
  "projects/adminFetchProjects",
  async (
    { orderby, order }: { orderby: string; order: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await AdminProjectService.getProjectByPagination(
        orderby,
        order
      );

      if (response.status != false) {
        return response.data as Project[];
      } else {
        return [];
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

export const fetchCurrentProjectJobs = createAsyncThunk(
  "projects/fetchCurrentProjectJobs",
  async (project: Project, { rejectWithValue }) => {
    try {
      const response = await AdminProjectService.getSingleProjectJobs(project);

      if (response.status != false) {
        return response.data as Project;
      } else {
        return project;
      }
      // In a real app, this would be: return await projectsAPI.getAll();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

// change project to demo user
export const changeProjectUserId = createAsyncThunk(
  "projects/changeProjectUserId",
  async (
    { projectId, userId }: { projectId: number; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await AdminProjectService.changeUserId(projectId, userId);
      if (response.status !== false) {
        return response
      } else {
        return null;
      }
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to change project user"
      );
    }
  }
);

// delete project based on projectId
export const deleteProjectById = createAsyncThunk(
  "projects/deleteProjectById",
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await ProjectService.deleteProjectById(projectId);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete project");
      }
      return projectId;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to delete project"
      );
    }
  }
);
const adminProjectSlice = createSlice({
  name: "adminProjectSlice",
  initialState,
  reducers: {
    handlesortingprojects: (state, action) => {
      const sortOrder =
        action.payload.orderby == state.sortfield && state.sortorder == "asec"
          ? "desc"
          : "asec";
      state.sortfield = action.payload.orderby;
      state.sortorder = sortOrder;
    },
    handleSelectViewProject: (state, action) => {
      state.currentProject = action.payload;
      state.isOpen = true;
    },
    handleCloseModal: (state) => {
      state.currentProject = null;
      state.isOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminFetchProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminFetchProjects.fulfilled, (state, action) => {
        state.list = action.payload;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(adminFetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentProjectJobs.pending, (state) => {
        state.currentloading = true;
      })
      .addCase(fetchCurrentProjectJobs.fulfilled, (state, action) => {
        state.currentProject = action.payload;
        state.error = null;
        state.currentloading = false;
      })
      .addCase(fetchCurrentProjectJobs.rejected, (state, action) => {
        state.currentloading = false;
        state.error = action.payload as string;
      })

      // delete project by Id
            .addCase(deleteProjectById.fulfilled, (state, action) => {
              state.isLoading = false;
      
              const projectId = action.payload;
              state.list = state.list.filter((project) => project.id !== projectId);
            })
  },


});

export const {
  handlesortingprojects,
  handleSelectViewProject,
  handleCloseModal,
} = adminProjectSlice.actions;

export default adminProjectSlice.reducer;
