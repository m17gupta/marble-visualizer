// S3 Upload Types
export interface S3PresignedUrlRequest {
  fileName: string;
  fileType: string;
  folder?: string;
}

export interface S3PresignedUrlResponse {
  presignedUrl: string;
  fileUrl: string;
  key: string;
  bucket: string;
  region: string;
}

export interface S3UploadConfirmRequest {
  key: string;
  bucket?: string;
}

export interface S3UploadMetadata {
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  userId?: string;
  tags?: string[];
}

export interface S3FileInfo {
  key: string;
  url: string;
  bucket: string;
  region: string;
  size: number;
  lastModified: string;
  etag: string;
  metadata?: S3UploadMetadata;
}

// Upload Progress Types
export interface UploadProgressEvent {
  loaded: number;
  total: number;
  percentage: number;
  stage: 'preparing' | 'uploading' | 'completing' | 'completed';
}

// Upload Status Types
export type UploadStatus = 'idle' | 'preparing' | 'uploading' | 'success' | 'error' | 'cancelled';

export interface UploadState {
  status: UploadStatus;
  progress: number;
  error?: string;
  fileUrl?: string;
  key?: string;
}

// File Validation Types
export interface FileValidationRule {
  maxSize?: number;
  minSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

// Component Props Types
export interface BaseUploadProps {
  onUploadStart?: (file: File) => void;
  onUploadProgress?: (progress: UploadProgressEvent) => void;
  onUploadSuccess?: (fileUrl: string, key: string, metadata?: S3UploadMetadata) => void;
  onUploadError?: (error: string, file?: File) => void;
  onUploadComplete?: (result: { success: boolean; fileUrl?: string; key?: string; error?: string }) => void;
}

export interface UploadConfigProps {
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
  folder?: string;
  generateUniqueNames?: boolean;
  autoUpload?: boolean;
  multiple?: boolean;
}

export interface UploadUIProps {
  className?: string;
  accept?: string;
  disabled?: boolean;
  dragAndDrop?: boolean;
  showProgress?: boolean;
  showPreview?: boolean;
  previewSize?: 'small' | 'medium' | 'large';
}

// Combined Upload Component Props
export interface UploadImageProps extends BaseUploadProps, UploadConfigProps, UploadUIProps {}

// Upload Service Error Types
export class S3UploadError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'S3UploadError';
  }
}

// Upload Queue Types (for batch uploads)
export interface UploadQueueItem {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  result?: {
    success: boolean;
    fileUrl?: string;
    key?: string;
    error?: string;
  };
  metadata?: S3UploadMetadata;
}

export interface UploadQueueState {
  items: UploadQueueItem[];
  activeUploads: number;
  maxConcurrentUploads: number;
  totalItems: number;
  completedItems: number;
  failedItems: number;
}

// Environment Configuration Types
export interface S3Config {
  region: string;
  bucket: string;
  apiEndpoint: string;
  maxFileSize: number;
  allowedMimeTypes: string[];
  uploadTimeout: number;
  retryAttempts: number;
}

export interface UploadEnvironment {
  development: S3Config;
  staging: S3Config;
  production: S3Config;
}
