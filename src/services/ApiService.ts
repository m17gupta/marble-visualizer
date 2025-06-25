import { apiClient } from '@/middlewares/authMiddleware';
import { AxiosRequestConfig } from 'axios';

// Generic API service functions
export const apiService = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get(url, config).then(response => response.data),

  post: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post(url, data, config).then(response => response.data),

  put: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put(url, data, config).then(response => response.data),

  patch: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch(url, data, config).then(response => response.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete(url, config).then(response => response.data),
};
