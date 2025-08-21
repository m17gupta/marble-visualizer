import { JobModel } from "@/models/jobModel/JobModel";
import { HouseSegmentModel, HouseSegmentResponse, ProjectModel } from "@/models/projectModel/ProjectModel";
import { ProjectAPI } from "@/services/projects/projectApi";
import { ProjectService } from "@/services/projects/ProjectsService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface ProjectAccess {
  userId: string;
  email: string;
  role: "admin" | "editor" | "viewer" | "guest" | "user";
  addedAt: string;
  addedBy: string;
}

interface ProjectState {
  list: ProjectModel[];
  currentProject: ProjectModel | null;
  currentUserRole: "admin" | "editor" | "viewer" | null;
  houseSegments?: HouseSegmentResponse|null;
  projectAccess: ProjectAccess[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isLoadingAccess: boolean;
  error: string | null;
  isCreateDialogOpen: boolean;
  isDeleteModalOpen: boolean;
}

const initialState: ProjectState = {
  list: [],
  currentProject: null,
  currentUserRole: null,
  houseSegments: null,
  projectAccess: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isLoadingAccess: false,
  error: null,
  isCreateDialogOpen: false,
  isDeleteModalOpen: false,
};

// Async thunk to fetch projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (user_id: string, { rejectWithValue }) => {
    try {
      const response = await ProjectService.getProjectByUserId(user_id);

      // In a real app, this would be: return await projectsAPI.getAll();
      return (response.data as ProjectModel[]) || [];
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch projects"
      );
    }
  }
);

// Async thunk to create a new project
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData: ProjectModel, { rejectWithValue }) => {
    try {
      const projectResponse = await ProjectService.createProject(projectData);
      if (!projectResponse.success) {
        throw new Error(projectResponse.error || "Failed to create project");
      }
      const newProject = projectResponse.data as ProjectModel;

      // In a real app, this would be: return await projectsAPI.create(projectData);
      return newProject;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to create project"
      );
    }
  }
);

// delete project based on projectId
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
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

// Async thunk to update an existing project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async (
    { id, updates }: { id: number; updates: Partial<ProjectModel> },
    { rejectWithValue }
  ) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, this would be: return await projectsAPI.update(id, updates);
      return {
        id,
        updates: { ...updates, updated_at: new Date().toISOString() },
      };
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to update project"
      );
    }
  }
);

export const updateProjectAnalysis = createAsyncThunk(
  "projects/updateProjectAnalysis",
  async ({ url, id }: { url: string; id: number }, { rejectWithValue }) => {
    try {
      const data = await ProjectAPI.analyseandupdateproject(url);
      const response = await ProjectAPI.save_analysed_data(id, data);
      
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to update project"
      );
    }
  }
);

// create thunk for HouseSegment
export const fetchHouseSegments = createAsyncThunk(
  "projects/fetchHouseSegments",
  async (houseSegData: HouseSegmentModel, { rejectWithValue }) => {
    try {
     await ProjectService.getHouseSegment(houseSegData);
     
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch house segments"
      );
    }
  }
);
// Async thunk to fetch project access list
export const fetchProjectAccess = createAsyncThunk(
  "projects/fetchProjectAccess",
  async (projectId: number, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data for development
      const mockAccessList: ProjectAccess[] = [
        {
          userId: "1",
          email: "admin@example.com",
          role: "admin",
          addedAt: new Date().toISOString(),
          addedBy: "1",
        },
        {
          userId: "2",
          email: "editor@example.com",
          role: "editor",
          addedAt: new Date().toISOString(),
          addedBy: "1",
        },
      ];

      // In a real app, this would be: return await projectsAPI.getAccess(projectId);
      return mockAccessList;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch project access"
      );
    }
  }
);

// Async thunk to invite user to project
export const inviteUserToProject = createAsyncThunk(
  "projects/inviteUserToProject",
  async (
    { email, role }: { projectId: number; email: string; role: string },
    { rejectWithValue, getState }
  ) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const state = getState() as { auth: { user: { id: string } } };
      const currentUser = state.auth.user;

      const newAccess: ProjectAccess = {
        userId: Math.random().toString(36).substr(2, 9), // Generate random ID for demo
        email,
        role: role as "admin" | "editor" | "viewer" | "guest" | "user",
        addedAt: new Date().toISOString(),
        addedBy: currentUser.id,
      };

      // In a real app, this would be: return await projectsAPI.inviteUser(projectId, email, role);
      return newAccess;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to invite user"
      );
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<ProjectModel>) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.currentUserRole = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateIsCreateDialog: (state, action: PayloadAction<boolean>) => {
      state.isCreateDialogOpen = action.payload;
    },
    
    updateNewProjectCreated: (state, action) => {
      // const newProject = state.currentProject;
      // const newJob = action.payload as JobModel;
      // const data: ProjectModel = {
      //   ...newProject,
      //   jobData: [newJob],
      // };
      // state.list = [...state.list, data];
      // state.currentProject = {};
      const newJob = action.payload as JobModel;
      const projectIndex = state.list.findIndex((p) => p.id === newJob.project_id);
      if( projectIndex !== -1) {
        state.list[projectIndex].jobData = [...(state.list[projectIndex].jobData || []), newJob];
      }
    },
    setIsDeleteModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isDeleteModalOpen = action.payload;
    }  
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        // before adding sort based on updated_at
        const allProjects = action.payload as ProjectModel[];
        // Sort projects by updated_at in descending order
        allProjects.sort((a, b) => {
          const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
          const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
          return bTime - aTime;
        });

        state.list = allProjects;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create project
      .addCase(createProject.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isCreating = false;
        state.currentProject = action.payload;

        state.list.unshift(action.payload); // Add to beginning of list
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isUpdating = false;
        const { id, updates } = action.payload;
        const projectIndex = state.list.findIndex((p) => p.id === id);
        if (projectIndex !== -1) {
          state.list[projectIndex] = {
            ...state.list[projectIndex],
            ...updates,
          };
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      //UpdateProjectAnalysisDataa

      .addCase(updateProjectAnalysis.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProjectAnalysis.fulfilled, (state, action) => {
        state.isUpdating = false;
        const { success, data } = action.payload;
        const projectIndex = state.list.findIndex((p) => p.id === data?.id);
        if (projectIndex !== -1) {
          state.list[projectIndex].analysed_data = data?.analysed_data;
        }
      })

      .addCase(updateProjectAnalysis.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })


      // fetch house segments
      .addCase(fetchHouseSegments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHouseSegments.fulfilled, (state, action) => {
        
        state.isLoading = false;
        state.houseSegments = action.payload;
      })
      .addCase(fetchHouseSegments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch project access
      .addCase(fetchProjectAccess.pending, (state) => {
        state.isLoadingAccess = true;
        state.error = null;
      })
      .addCase(fetchProjectAccess.fulfilled, (state, action) => {
        state.isLoadingAccess = false;
        state.projectAccess = action.payload;
      })
      .addCase(fetchProjectAccess.rejected, (state, action) => {
        state.isLoadingAccess = false;
        state.error = action.payload as string;
      })

      // Invite user to project
      .addCase(inviteUserToProject.pending, (state) => {
        state.error = null;
      })
      .addCase(inviteUserToProject.fulfilled, (state, action) => {
        state.projectAccess.push(action.payload);
      })
      .addCase(inviteUserToProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;

        const projectId = action.payload;
        state.list = state.list.filter((project) => project.id !== projectId);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentProject,
  clearCurrentProject,
  clearError,
  updateIsCreateDialog,
  updateNewProjectCreated,
  setIsDeleteModalOpen
} = projectSlice.actions;

export default projectSlice.reducer;
