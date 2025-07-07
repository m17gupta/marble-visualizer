import { useState, useCallback } from 'react';
import { DirectS3UploadService, UploadProgress, UploadResult } from '@/services/uploadImageService/directS3UploadService';

export interface UseS3UploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  onSuccess?: (fileUrl: string, key: string) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: UploadProgress) => void;
}

export interface UseS3UploadReturn {
  upload: (file: File) => Promise<void>;
  uploading: boolean;
  progress: UploadProgress | null;
  result: UploadResult | null;
  reset: () => void;
  validateFile: (file: File) => { valid: boolean; error?: string };
}

export const useS3Upload = (options: UseS3UploadOptions = {}): UseS3UploadReturn => {
  const {
    maxSize = 100 * 1024 * 1024, // Increased to 100MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    onSuccess,
    onError,
    onProgress,
  } = options;

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  const validateFile = useCallback((file: File) => {
    return DirectS3UploadService.validateFile(file, maxSize, allowedTypes);
  }, [maxSize, allowedTypes]);

  const upload = useCallback(async (file: File) => {
    // Validate file first
    const validation = validateFile(file);
    if (!validation.valid) {
      const error = validation.error || 'Invalid file';
      setResult({ success: false, error });
      onError?.(error);
      return;
    }

    // Check if AWS credentials are configured
    if (!DirectS3UploadService.isConfigured()) {
      const error = 'AWS credentials not configured. Please set your environment variables.';
      setResult({ success: false, error });
      onError?.(error);
      return;
    }

    setUploading(true);
    setProgress(null);
    setResult(null);

    try {
      const uploadResult = await DirectS3UploadService.uploadFile(file, undefined, (progressData: UploadProgress) => {
        setProgress(progressData);
        onProgress?.(progressData);
      });

      setResult(uploadResult);

      if (uploadResult.success && uploadResult.fileUrl && uploadResult.key) {
        onSuccess?.(uploadResult.fileUrl, uploadResult.key);
      } else {
        onError?.(uploadResult.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      const errorResult = { success: false, error: errorMessage };
      setResult(errorResult);
      onError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  }, [validateFile, onSuccess, onError, onProgress]);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(null);
    setResult(null);
  }, []);

  return {
    upload,
    uploading,
    progress,
    result,
    reset,
    validateFile,
  };
};

export default useS3Upload;
