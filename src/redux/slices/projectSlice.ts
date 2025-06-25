import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface ProjectAccess {
  userId: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  addedAt: string;
  addedBy: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  visibility: 'public' | 'private';
  isPublic: boolean;
  publicSlug?: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  userId: string;
  accessList: ProjectAccess[];
  currentUserRole?: 'admin' | 'editor' | 'viewer';
}

interface ProjectState {
  list: Project[];
  currentProject: Project | null;
  currentUserRole: 'admin' | 'editor' | 'viewer' | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isLoadingAccess: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  list: [],
  currentProject: null,
  currentUserRole: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isLoadingAccess: false,
  error: null,
};

// Mock data for development
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Modern Dashboard',
    description: 'A beautiful dashboard with dark mode support and advanced analytics',
    visibility: 'public',
    isPublic: true,
    publicSlug: 'modern-dashboard-abc123',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    thumbnail: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    progress: 75,
    status: 'active',
    userId: '1',
    accessList: [
      {
        userId: '1',
        email: 'admin@example.com',
        role: 'admin',
        addedAt: '2024-01-15T10:30:00Z',
        addedBy: '1',
      },
      {
        userId: '2',
        email: 'editor@example.com',
        role: 'editor',
        addedAt: '2024-01-16T09:15:00Z',
        addedBy: '1',
      },
      {
        userId: '3',
        email: 'viewer@example.com',
        role: 'viewer',
        addedAt: '2024-01-17T14:20:00Z',
        addedBy: '1',
      },
    ],
    currentUserRole: 'admin',
  },
  {
    id: '2',
    name: 'E-commerce Platform',
    description: 'Full-featured online store with payment integration and inventory management',
    visibility: 'private',
    isPublic: false,
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:20:00Z',
    thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    progress: 45,
    status: 'active',
    userId: '1',
    accessList: [
      {
        userId: '1',
        email: 'admin@example.com',
        role: 'admin',
        addedAt: '2024-01-10T09:15:00Z',
        addedBy: '1',
      },
    ],
    currentUserRole: 'admin',
  },
  {
    id: '3',
    name: 'Portfolio Website',
    description: 'Creative portfolio with smooth animations and responsive design',
    visibility: 'public',
    isPublic: true,
    publicSlug: 'portfolio-website-def456',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-12T13:30:00Z',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    progress: 100,
    status: 'completed',
    userId: '1',
    accessList: [
      {
        userId: '1',
        email: 'admin@example.com',
        role: 'admin',
        addedAt: '2024-01-05T11:00:00Z',
        addedBy: '1',
      },
    ],
    currentUserRole: 'admin',
  },
];

// Async thunk to fetch projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be: return await projectsAPI.getAll();
      return mockProjects;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

// Async thunk to fetch project access list
export const fetchProjectAccess = createAsyncThunk(
  'projects/fetchProjectAccess',
  async (projectId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let project = mockProjects.find(p => p.id === projectId);
      
      // If project not found, use the first project as default to prevent errors
      if (!project) {
        project = mockProjects[0];
      }
      
      // In a real app: GET /api/projects/:id/access
      return { projectId, accessList: project.accessList, currentUserRole: project.currentUserRole };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project access');
    }
  }
);

// Async thunk to invite user to project
export const inviteUserToProject = createAsyncThunk(
  'projects/inviteUser',
  async ({ projectId, email, role }: { projectId: string; email: string; role: 'admin' | 'editor' | 'viewer' }, { rejectWithValue, getState }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const state = getState() as { auth: { user: { id: string } } };
      const currentUserId = state.auth.user.id;
      
      const newAccess: ProjectAccess = {
        userId: Date.now().toString(),
        email,
        role,
        addedAt: new Date().toISOString(),
        addedBy: currentUserId,
      };
      
      // In a real app: POST /api/projects/:id/invite
      return { projectId, access: newAccess };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to invite user');
    }
  }
);

// Async thunk to update user role
export const updateUserRole = createAsyncThunk(
  'projects/updateUserRole',
  async ({ projectId, userId, role }: { projectId: string; userId: string; role: 'admin' | 'editor' | 'viewer' }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app: PATCH /api/projects/:id/access/:userId
      return { projectId, userId, role };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
    }
  }
);

// Async thunk to remove user from project
export const removeUserFromProject = createAsyncThunk(
  'projects/removeUser',
  async ({ projectId, userId }: { projectId: string; userId: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app: DELETE /api/projects/:id/access/:userId
      return { projectId, userId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove user');
    }
  }
);

// Async thunk to toggle project public status
export const toggleProjectPublic = createAsyncThunk(
  'projects/togglePublic',
  async ({ projectId, isPublic }: { projectId: string; isPublic: boolean }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const publicSlug = isPublic ? `project-${projectId}-${Date.now().toString(36)}` : undefined;
      
      // In a real app: PATCH /api/projects/:id
      return { projectId, isPublic, publicSlug };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project visibility');
    }
  }
);

// Async thunk to create a new project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: { name: string; description: string; visibility: 'public' | 'private' }, { rejectWithValue, getState }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const state = getState() as { auth: { user: { id: string; email: string } } };
      const currentUser = state.auth.user;
      
      const newProject: Project = {
        id: Date.now().toString(),
        name: projectData.name,
        description: projectData.description,
        visibility: projectData.visibility,
        isPublic: projectData.visibility === 'public',
        publicSlug: projectData.visibility === 'public' ? `project-${Date.now().toString(36)}` : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: 0,
        status: 'active',
        userId: currentUser.id,
        accessList: [
          {
            userId: currentUser.id,
            email: currentUser.email,
            role: 'admin',
            addedAt: new Date().toISOString(),
            addedBy: currentUser.id,
          },
        ],
        currentUserRole: 'admin',
      };
      
      // In a real app, this would be: return await projectsAPI.create(projectData);
      return newProject;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

// Async thunk to update project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, updates }: { id: string; updates: Partial<Project> }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be: return await projectsAPI.update(id, updates);
      return { id, updates: { ...updates, updatedAt: new Date().toISOString() } };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project');
    }
  }
);

// Async thunk to toggle project visibility
export const toggleProjectVisibility = createAsyncThunk(
  'projects/toggleVisibility',
  async ({ id, visibility }: { id: string; visibility: 'public' | 'private' }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In a real app, this would be: return await projectsAPI.patch(id, { visibility });
      return { id, visibility, updatedAt: new Date().toISOString() };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project visibility');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload;
      state.currentUserRole = action.payload.currentUserRole || null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.currentUserRole = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Optimistic update for visibility toggle
    optimisticToggleVisibility: (state, action: PayloadAction<{ id: string; visibility: 'public' | 'private' }>) => {
      const project = state.list.find(p => p.id === action.payload.id);
      if (project) {
        project.visibility = action.payload.visibility;
        project.updatedAt = new Date().toISOString();
      }
    },
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
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
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
        const { projectId, accessList, currentUserRole } = action.payload;
        
        // Update project in list
        const project = state.list.find(p => p.id === projectId);
        if (project) {
          project.accessList = accessList;
          project.currentUserRole = currentUserRole;
        }
        
        // Update current project
        if (state.currentProject?.id === projectId) {
          state.currentProject.accessList = accessList;
          state.currentProject.currentUserRole = currentUserRole;
          state.currentUserRole = currentUserRole || null;
        }
      })
      .addCase(fetchProjectAccess.rejected, (state, action) => {
        state.isLoadingAccess = false;
        state.error = action.payload as string;
      })
      
      // Invite user
      .addCase(inviteUserToProject.fulfilled, (state, action) => {
        const { projectId, access } = action.payload;
        
        // Update project in list
        const project = state.list.find(p => p.id === projectId);
        if (project) {
          project.accessList.push(access);
        }
        
        // Update current project
        if (state.currentProject?.id === projectId) {
          state.currentProject.accessList.push(access);
        }
      })
      .addCase(inviteUserToProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Update user role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { projectId, userId, role } = action.payload;
        
        // Update project in list
        const project = state.list.find(p => p.id === projectId);
        if (project) {
          const userAccess = project.accessList.find(a => a.userId === userId);
          if (userAccess) {
            userAccess.role = role;
          }
        }
        
        // Update current project
        if (state.currentProject?.id === projectId) {
          const userAccess = state.currentProject.accessList.find(a => a.userId === userId);
          if (userAccess) {
            userAccess.role = role;
          }
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Remove user
      .addCase(removeUserFromProject.fulfilled, (state, action) => {
        const { projectId, userId } = action.payload;
        
        // Update project in list
        const project = state.list.find(p => p.id === projectId);
        if (project) {
          project.accessList = project.accessList.filter(a => a.userId !== userId);
        }
        
        // Update current project
        if (state.currentProject?.id === projectId) {
          state.currentProject.accessList = state.currentProject.accessList.filter(a => a.userId !== userId);
        }
      })
      .addCase(removeUserFromProject.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Toggle public status
      .addCase(toggleProjectPublic.fulfilled, (state, action) => {
        const { projectId, isPublic, publicSlug } = action.payload;
        
        // Update project in list
        const project = state.list.find(p => p.id === projectId);
        if (project) {
          project.isPublic = isPublic;
          project.publicSlug = publicSlug;
          project.updatedAt = new Date().toISOString();
        }
        
        // Update current project
        if (state.currentProject?.id === projectId) {
          state.currentProject.isPublic = isPublic;
          state.currentProject.publicSlug = publicSlug;
          state.currentProject.updatedAt = new Date().toISOString();
        }
      })
      .addCase(toggleProjectPublic.rejected, (state, action) => {
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
      
      // Toggle visibility
      .addCase(toggleProjectVisibility.fulfilled, (state, action) => {
        const { id, visibility, updatedAt } = action.payload;
        const project = state.list.find(p => p.id === id);
        if (project) {
          project.visibility = visibility;
          project.updatedAt = updatedAt;
        }
      })
      .addCase(toggleProjectVisibility.rejected, (state, action) => {
        state.error = action.payload as string;
        // Revert optimistic update on error
        // This would require storing the previous state, but for simplicity we'll refetch
      });
  },
});

export const { 
  setCurrentProject, 
  clearCurrentProject, 
  clearError, 
  optimisticToggleVisibility 
} = projectSlice.actions;

export default projectSlice.reducer;