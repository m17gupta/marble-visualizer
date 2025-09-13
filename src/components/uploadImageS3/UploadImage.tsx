import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DirectS3UploadService, UploadProgress, UploadResult } from '@/services/uploadImageService/directS3UploadService';
import { useSelector } from 'react-redux';
import { selectProfile } from '@/redux/slices/user/userProfileSlice';
import { convertImageFileToWebp } from './ConvertImageFileToWebp';

interface UploadImageProps {
  onUploadSuccess?: (fileUrl: string, key: string) => void;
  onUploadError?: (error: string) => void;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  className?: string;
  accept?: string;
  createdProjectId?: number | null;
  jobImageUpload: (file: File ) => void;

}

interface FileWithPreview extends File {
  preview?: string;
}

const UploadImage: React.FC<UploadImageProps> = ({
  onUploadSuccess,
  onUploadError,
  maxSize = 10 * 1024 * 1024, // 10MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  className = '',
  accept = 'image/*',
  createdProjectId,
  jobImageUpload 
}) => {
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUserProfiles = useSelector(selectProfile);


  useEffect(() => {
     if( createdProjectId && createdProjectId!==null) {
     handleUpload()
     }
  }, [createdProjectId]);

  // Handle file selection


const handleFileSelect = useCallback(async (file: File) => {
  // Validate file using direct S3 upload service
  const validation = DirectS3UploadService.validateFile(file, maxSize, allowedTypes);
  if (!validation.valid) {
    setUploadResult({
      success: false,
      error: validation.error,
    });
    onUploadError?.(validation.error || 'Invalid file');
    return;
  }

  // Convert to WebP
  let webpFile: File;
  try {
    webpFile = await convertImageFileToWebp(file);
  } catch (err) {
    setUploadResult({
      success: false,
      error: 'Failed to convert image to WebP.',
    });
    onUploadError?.('Failed to convert image to WebP.');
    return;
  }

  // Create preview URL
  const fileWithPreview = webpFile as FileWithPreview;
  fileWithPreview.preview = URL.createObjectURL(webpFile);

  setSelectedFile(fileWithPreview);
  setUploadResult(null);
  setUploadProgress(null);
  jobImageUpload(webpFile);
}, [maxSize, allowedTypes, onUploadError, jobImageUpload]);
  // const handleFileSelect = useCallback((file: File) => {
  //   // Validate file using direct S3 upload service
  //   const validation = DirectS3UploadService.validateFile(file, maxSize, allowedTypes);
  //   if (!validation.valid) {
  //     setUploadResult({
  //       success: false,
  //       error: validation.error,
  //     });
  //     onUploadError?.(validation.error || 'Invalid file');
  //     return;
  //   }

  //   // Create preview URL
  //   const fileWithPreview = file as FileWithPreview;
  //   fileWithPreview.preview = URL.createObjectURL(file);
    
  //   setSelectedFile(fileWithPreview);
  //   setUploadResult(null);
  //   setUploadProgress(null);
  // }, [maxSize, allowedTypes, onUploadError]);

  // Handle file input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
       jobImageUpload(file);
    }
   
  };

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Upload file directly to S3
  const handleUpload = async () => {
    if (!selectedFile || !getUserProfiles) return;

    // Check if AWS credentials are configured
    if (!DirectS3UploadService.isConfigured()) {
      const configError = 'AWS credentials not configured. Please set your environment variables.';
      setUploadResult({
        success: false,
        error: configError,
      });
      onUploadError?.(configError);
      return;
    }

    setUploading(true);
    setUploadProgress(null);
    setUploadResult(null);

    try {
      // Use direct S3 upload service
      const result = await DirectS3UploadService.uploadFile(
        selectedFile,
        getUserProfiles.id,
        (progress) => setUploadProgress(progress)
      );

      
      setUploadResult(result);
      
      if (result.success && result.fileUrl && result.key) {
        onUploadSuccess?.(result.fileUrl, result.key);
      } else {
        onUploadError?.(result.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadResult({
        success: false,
        error: errorMessage,
      });
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Clear selection
  const handleClear = () => {
    if (selectedFile?.preview) {
      URL.revokeObjectURL(selectedFile.preview);
    }
    setSelectedFile(null);
    setUploadResult(null);
    setUploadProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${selectedFile ? 'border-green-500 bg-green-50' : ''}
        `}
        onClick={openFileDialog}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="space-y-4">
            {/* Image Preview */}
            {selectedFile.preview && (
              <div className="relative inline-block">
                <img
                  src={selectedFile.preview}
                  alt="Preview"
                  className="max-w-full max-h-48 rounded-lg object-contain"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* File Info */}
            <div className="text-sm text-gray-600">
              <p className="font-medium">{selectedFile.name}</p>
              <p>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                Drop your image here, or click to select
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports: {allowedTypes.join(', ')}
              </p>
              <p className="text-sm text-gray-500">
                Max size: {Math.round(maxSize / (1024 * 1024))}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploadProgress && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Uploading...</span>
            <span>{uploadProgress.percentage}%</span>
          </div>
          <Progress value={uploadProgress.percentage} className="w-full" />
        </div>
      )}

      {/* Upload Result */}
      {uploadResult && (
        <Alert className={`mt-4 ${uploadResult.success ? 'border-green-500' : 'border-red-500'}`}>
          {uploadResult.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={uploadResult.success ? 'text-green-700' : 'text-red-700'}>
            {uploadResult.success ? 'Upload successful!' : uploadResult.error}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        {selectedFile && !uploadResult?.success && (
          <Button 
           // onClick={handleUpload} 
            disabled={uploading}
            className="flex-1"
          >
            {uploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
              
              </>
            )}
          </Button>
        )}
        
        {(selectedFile || uploadResult) && (
          <Button 
            variant="outline" 
            onClick={handleClear}
            disabled={uploading}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default UploadImage;