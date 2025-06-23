import { apiClient } from '@/middlewares/authMiddleware';
import { AxiosRequestConfig } from 'axios';

// Generic API service functions
export const apiService = {
  // Generic CRUD operations
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get(url, config).then(response => response.data),
    
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post(url, data, config).then(response => response.data),
    
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put(url, data, config).then(response => response.data),
    
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch(url, data, config).then(response => response.data),
    
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete(url, config).then(response => response.data),
};

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
    
  create: (project: any) =>
    apiService.post('/projects', project),
    
  update: (id: string, project: any) =>
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
    
  createProject: (data: any) =>
    apiService.post('/studio/projects', data),
    
  updateProject: (id: string, data: any) =>
    apiService.put(`/studio/projects/${id}`, data),
};

export default apiClient;
</btml:action>