import { ProjectModel } from '@/models/projectModel/ProjectModel';
import { ProjectService } from '@/services/projects/ProjectsService';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface ProjectAccess {
  userId: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer' | 'guest' | 'user';
  addedAt: string;
  addedBy: string;
}

interface ProjectState {
  list: ProjectModel[];
  currentProject: ProjectModel | null;
  currentUserRole: 'admin' | 'editor' | 'viewer' | null;
  projectAccess: ProjectAccess[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isLoadingAccess: boolean;
  error: string | null;
  isCreateDialogOpen: boolean;
}

const initialState: ProjectState = {
  list: [],
  currentProject: null,
  currentUserRole: null,
  projectAccess: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isLoadingAccess: false,
  error: null,
  isCreateDialogOpen: false,
};



// Async thunk to fetch projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (user_id: string, { rejectWithValue }) => {
    try {
      const response = await ProjectService.getProjectByUserId(user_id);

      // In a real app, this would be: return await projectsAPI.getAll();
      return (response.data as ProjectModel[]) || [];
    } catch (error: unknown) {
      return rejectWithValue((error as Error)?.message || 'Failed to fetch projects');
    }
  }
);


// Async thunk to create a new project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: ProjectModel, { rejectWithValue }) => {
    try {

      const projectResponse = await ProjectService.createProject(projectData);
      if (!projectResponse.success) {
        throw new Error(projectResponse.error || 'Failed to create project');
      }
      const newProject = projectResponse.data as ProjectModel;
      
      // In a real app, this would be: return await projectsAPI.create(projectData);
      return newProject;
    } catch (error: unknown) {
      return rejectWithValue((error as Error)?.message || 'Failed to create project');
    }
  }
);

// Async thunk to update an existing project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, updates }: { id: number; updates: Partial<ProjectModel> }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be: return await projectsAPI.update(id, updates);
      return { id, updates: { ...updates, updated_at: new Date().toISOString() } };
    } catch (error: unknown) {
      return rejectWithValue((error as Error)?.message || 'Failed to update project');
    }
  }
);

// Async thunk to fetch project access list
export const fetchProjectAccess = createAsyncThunk(
  'projects/fetchProjectAccess',
  async (projectId: number, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data for development
      const mockAccessList: ProjectAccess[] = [
        {
          userId: '1',
          email: 'admin@example.com',
          role: 'admin',
          addedAt: new Date().toISOString(),
          addedBy: '1',
        },
        {
          userId: '2',
          email: 'editor@example.com',
          role: 'editor',
          addedAt: new Date().toISOString(),
          addedBy: '1',
        },
      ];
      
      // In a real app, this would be: return await projectsAPI.getAccess(projectId);
      return mockAccessList;
    } catch (error: unknown) {
      return rejectWithValue((error as Error)?.message || 'Failed to fetch project access');
    }
  }
);

// Async thunk to invite user to project
export const inviteUserToProject = createAsyncThunk(
  'projects/inviteUserToProject',
  async ({  email, role }: { projectId: number; email: string; role: string }, { rejectWithValue, getState }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const state = getState() as { auth: { user: { id: string } } };
      const currentUser = state.auth.user;
      
      const newAccess: ProjectAccess = {
        userId: Math.random().toString(36).substr(2, 9), // Generate random ID for demo
        email,
        role: role as 'admin' | 'editor' | 'viewer' | 'guest' | 'user',
        addedAt: new Date().toISOString(),
        addedBy: currentUser.id,
      };
      
      // In a real app, this would be: return await projectsAPI.inviteUser(projectId, email, role);
      return newAccess;
    } catch (error: unknown) {
      return rejectWithValue((error as Error)?.message || 'Failed to invite user');
    }
  }
);

// Async thunk to update user role
export const updateUserRole = createAsyncThunk(
  'projects/updateUserRole',
  async ({  userId, role }: { projectId: number; userId: string; role: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be: return await projectsAPI.updateUserRole(projectId, userId, role);
      return { userId, role };
    } catch (error: unknown) {
      return rejectWithValue((error as Error)?.message || 'Failed to update user role');
    }
  }
);

// Async thunk to remove user from project
export const removeUserFromProject = createAsyncThunk(
  'projects/removeUserFromProject',
  async ({  userId }: { projectId: number; userId: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be: return await projectsAPI.removeUser(projectId, userId);
      return userId;
    } catch (error: unknown) {
      return rejectWithValue((error as Error)?.message || 'Failed to remove user from project');
    }
  }
);

// Async thunk to toggle project public status
export const toggleProjectPublic = createAsyncThunk(
  'projects/toggleProjectPublic',
  async ({ projectId, isPublic }: { projectId: number; isPublic: boolean }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const visibility = isPublic ? 'public' : 'private';
      
      // In a real app, this would be: return await projectsAPI.updateVisibility(projectId, visibility);
      return { projectId, visibility, updated_at: new Date().toISOString() };
    } catch (error: unknown) {
      return rejectWithValue((error as Error)?.message || 'Failed to update project visibility');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<ProjectModel>) => {
      state.currentProject = action.payload;
      state.currentUserRole = 'admin'; // Set default role, in real app this would come from the payload
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
        state.list = action.payload as ProjectModel[];
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
        const projectIndex = state.list.findIndex(p => p.id === id);
        if (projectIndex !== -1) {
          state.list[projectIndex] = { ...state.list[projectIndex], ...updates };
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isUpdating = false;
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
      
      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { userId, role } = action.payload;
        const userIndex = state.projectAccess.findIndex(access => access.userId === userId);
        if (userIndex !== -1) {
          state.projectAccess[userIndex].role = role as 'admin' | 'editor' | 'viewer' | 'guest' | 'user';
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Remove user from project
      .addCase(removeUserFromProject.pending, (state) => {
        state.error = null;
      })
      .addCase(removeUserFromProject.fulfilled, (state, action) => {
        const userId = action.payload;
        state.projectAccess = state.projectAccess.filter(access => access.userId !== userId);
      })
      .addCase(removeUserFromProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Toggle project public status
      .addCase(toggleProjectPublic.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(toggleProjectPublic.fulfilled, (state, action) => {
        state.isUpdating = false;
        const { projectId, visibility, updated_at } = action.payload;
        const projectIndex = state.list.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
          state.list[projectIndex].visibility = visibility as 'public' | 'private';
          state.list[projectIndex].updated_at = updated_at;
        }
        if (state.currentProject && state.currentProject.id === projectId) {
          state.currentProject.visibility = visibility as 'public' | 'private';
          state.currentProject.updated_at = updated_at;
        }
      })
      .addCase(toggleProjectPublic.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
  },
});

export const { 
  setCurrentProject, 
  clearCurrentProject, 
  clearError, 
  updateIsCreateDialog
  
} = projectSlice.actions;

export default projectSlice.reducer;