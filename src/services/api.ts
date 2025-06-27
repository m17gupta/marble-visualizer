import { ProjectModel } from "@/models/projectModel/ProjectModel";
import { apiService } from "./ApiService";


// Authentication API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiService.post('/auth/login', credentials),
    
  logout: () =>
    apiService.post('/auth/logout'),
    
  refresh: (refreshToken: string) =>
    apiService.post('/auth/refresh', { refreshToken }),
    
  me: () =>
    apiService.get('/auth/me'),
    
  verifyToken: () =>
    apiService.get('/auth/verify'),
};

// Projects API endpoints
export const projectsAPI = {
  getAll: () =>
    apiService.get('/projects'),
    
  getById: (id: string) =>
    apiService.get(`/projects/${id}`),
    
  create: (project: ProjectModel) =>
    apiService.post('/projects', project),
    
  update: (id: string, project: ProjectModel) =>
    apiService.put(`/projects/${id}`, project),
    
  delete: (id: string) =>
    apiService.delete(`/projects/${id}`),
};

// Materials API endpoints
export const materialsAPI = {
  getTextures: () =>
    apiService.get('/materials/textures'),
    
  getImages: () =>
    apiService.get('/materials/images'),
    
  getIcons: () =>
    apiService.get('/materials/icons'),
    
  upload: (file: FormData) =>
    apiService.post('/materials/upload', file, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

// Studio API endpoints
export const studioAPI = {
  getTools: () =>
    apiService.get('/studio/tools'),
    
  getTool: (id: string) =>
    apiService.get(`/studio/tools/${id}`),
    
  // createProject: (data: any) =>
  //   apiService.post('/studio/projects', data),
    
  // updateProject: (id: string, data: any) =>
  //   apiService.put(`/studio/projects/${id}`, data),
};

// S3 Upload API endpoints

// Create a comprehensive API client object
const apiClient = {
  auth: authAPI,
  projects: projectsAPI,
  materials: materialsAPI,
  studio: studioAPI,

};

export default apiClient;