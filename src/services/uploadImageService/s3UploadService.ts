import { s3API } from './UploadImageS3Api';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  key?: string;
  error?: string;
}

export class S3UploadService {
  /**
   * Upload a file to S3 using presigned URL
   * @param file - The file to upload
   * @param onProgress - Optional progress callback
   * @returns Promise with upload result
   */
  static async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      // Get presigned URL
      const { presignedUrl, fileUrl, key } = await s3API.getPresignedUrl(
        file.name,
        file.type
      );

      // Upload file to S3 using presigned URL
      const uploadResult = await this.uploadToS3(file, presignedUrl, onProgress);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      // Optional: Confirm upload with backend
      try {
        await s3API.confirmUpload(key);
      } catch (confirmError) {
        console.warn('Failed to confirm upload:', confirmError);
        // Continue anyway as the file was uploaded successfully
      }

      return {
        success: true,
        fileUrl,
        key,
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Upload file directly to S3 using presigned URL
   * @param file - The file to upload
   * @param presignedUrl - The presigned URL from S3
   * @param onProgress - Optional progress callback
   * @returns Promise with upload result
   */
  private static async uploadToS3(
    file: File,
    presignedUrl: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      // Set up progress tracking
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            };
            onProgress(progress);
          }
        });
      }

      // Handle upload completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ success: true });
        } else {
          resolve({
            success: false,
            error: `Upload failed with status: ${xhr.status}`,
          });
        }
      });

      // Handle upload errors
      xhr.addEventListener('error', () => {
        resolve({
          success: false,
          error: 'Network error during upload',
        });
      });

      // Handle upload abort
      xhr.addEventListener('abort', () => {
        resolve({
          success: false,
          error: 'Upload was aborted',
        });
      });

      // Start the upload
      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  /**
   * Validate file before upload
   * @param file - The file to validate
   * @param maxSize - Maximum file size in bytes (default: 10MB)
   * @param allowedTypes - Allowed MIME types (default: images only)
   * @returns Validation result
   */
  static validateFile(
    file: File,
    maxSize: number = 10 * 1024 * 1024, // 10MB
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  ): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`,
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    return { valid: true };
  }

  /**
   * Generate a unique filename
   * @param originalName - Original filename
   * @returns Unique filename with timestamp
   */
  static generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop() || '';
    const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, '');
    
    return `${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`;
  }
}
