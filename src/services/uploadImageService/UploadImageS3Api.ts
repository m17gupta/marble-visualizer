import { apiService } from '../ApiService';

export const s3API = {
  getPresignedUrl: (fileName: string, fileType: string) =>
    apiService.post<{ presignedUrl: string; fileUrl: string; key: string }>('/s3/presigned-url', {
      fileName,
      fileType,
    }),
    
  confirmUpload: (key: string) =>
    apiService.post('/s3/confirm-upload', { key }),
};
