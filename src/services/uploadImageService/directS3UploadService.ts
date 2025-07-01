import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { s3Config, validateS3Config, getFileUrl, debugS3Config } from '@/config/s3Config';

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

// S3 Configuration is now imported from config file

export class DirectS3UploadService {
  private static s3Client: S3Client | null = null;

  private static getS3Client(): S3Client {
    if (!this.s3Client) {
      const validation = validateS3Config();
      if (!validation.isValid) {
        debugS3Config(); // Show debug info when credentials are missing
        throw new Error(`AWS credentials not configured: ${validation.errors.join(', ')}`);
      }

      this.s3Client = new S3Client({
        region: s3Config.region,
        credentials: {
          accessKeyId: s3Config.accessKeyId!,
          secretAccessKey: s3Config.secretAccessKey!,
        },
      });
    }
    return this.s3Client;
  }

  /**
   * Upload file directly to S3
   * @param file - The file to upload
   * @param onProgress - Optional progress callback
   * @param userProfileId - Optional user profile ID for organizing files
   * @returns Promise with upload result
   */
  static async uploadFile(
    file: File,
    userProfileId?: number,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Generate unique key
      const key = this.generateUniqueKey(file.name, userProfileId);
      
      // Create S3 client
      const s3Client = this.getS3Client();

      // Create upload instance
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: s3Config.bucket,
          Key: key,
          Body: file,
          ContentType: file.type,
          ACL: 'public-read', // or 'private' depending on your needs
          Metadata: {
            'original-name': file.name,
            'upload-timestamp': new Date().toISOString(),
          },
        },
      });

      // Set up progress tracking
      if (onProgress) {
        upload.on('httpUploadProgress', (progress) => {
          if (progress.loaded && progress.total) {
            const uploadProgress: UploadProgress = {
              loaded: progress.loaded,
              total: progress.total,
              percentage: Math.round((progress.loaded / progress.total) * 100),
            };
            onProgress(uploadProgress);
          }
        });
      }

      // Execute upload
      await upload.done();
      
      // Construct file URL using the helper function
      const fileUrl = getFileUrl(key);
      
      return {
        success: true,
        fileUrl,
        key,
      };
    } catch (error) {
      console.error('Direct S3 upload error:', error);
      
      let errorMessage = 'Upload failed';
      if (error instanceof Error) {
        if (error.message.includes('credentials')) {
          errorMessage = 'AWS credentials not configured properly';
        } else if (error.message.includes('Access Denied')) {
          errorMessage = 'Access denied - check S3 bucket permissions';
        } else if (error.message.includes('NoSuchBucket')) {
          errorMessage = 'S3 bucket not found - check bucket name';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Validate file before upload
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
   * Generate unique S3 key with folder structure using user profile ID
   */
  private static generateUniqueKey(fileName: string, userProfileId?: number): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = fileName.split('.').pop() || '';
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    
    // Use user profile ID if provided, otherwise fall back to date-based structure
    if (userProfileId) {
      return `uploads/images/${userProfileId}/${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`;
    }
    
    // Fallback to date-based structure if no user profile ID provided
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return `uploads/images/${year}/${month}/${day}/${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`;
  }

  /**
   * Generate a unique filename (legacy method for compatibility)
   */
  static generateUniqueFilename(originalName: string, userProfileId?: number): string {
    return this.generateUniqueKey(originalName, userProfileId);
  }

  /**
   * Check if AWS credentials are configured
   */
  static isConfigured(): boolean {
    const validation = validateS3Config();
    return validation.isValid;
  }

  /**
   * Get S3 configuration (for debugging)
   */
  static getConfig() {
    return {
      region: s3Config.region,
      bucket: s3Config.bucket,
      hasCredentials: !!(s3Config.accessKeyId && s3Config.secretAccessKey),
    };
  }
}
