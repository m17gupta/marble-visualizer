import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import {
  s3Config,
  validateS3Config,
  getFileUrl,
  debugS3Config,
} from "@/config/s3Config";

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
        throw new Error(
          `AWS credentials not configured: ${validation.errors.join(", ")}`
        );
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
   * @param userProfileId - Optional user profile ID for organizing files
   * @param onProgress - Optional progress callback
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

      // For most files (under 50MB), use a simpler upload method to avoid streaming issues
      // This approach loads the file into memory, so we limit it to files under 50MB
      const smallFileSizeLimit = 50 * 1024 * 1024; // 50MB

      if (file.size < smallFileSizeLimit) {
        return await this.uploadSmallFile(s3Client, file, key, onProgress);
      }

      // For very large files, warn that this might cause memory issues
      if (file.size > 100 * 1024 * 1024) {
        // Over 100MB
        console.warn(
          `Uploading very large file (${Math.round(
            file.size / (1024 * 1024)
          )}MB). This may cause memory issues in the browser.`
        );
      }

      // For larger files, use multipart upload but first check if we should convert to buffer
      // Files between 50MB-100MB we'll try to convert to buffer first for more reliable uploads
      let fileBuffer: Uint8Array | null = null;

      if (file.size <= 100 * 1024 * 1024) {
        // Under 100MB, still read into memory
        try {
          // Update progress to indicate processing is happening
          if (onProgress) {
            onProgress({
              loaded: Math.floor(file.size * 0.1),
              total: file.size,
              percentage: 10,
            });
          }

          const fileArrayBuffer = await file.arrayBuffer();
          fileBuffer = new Uint8Array(fileArrayBuffer);

          // Update progress after file is processed
          if (onProgress) {
            onProgress({
              loaded: Math.floor(file.size * 0.2),
              total: file.size,
              percentage: 20,
            });
          }
        } catch (bufferError) {
          console.warn(
            "Failed to convert file to buffer, falling back to streaming upload:",
            bufferError
          );
        }
      }

      // Create upload instance with buffer if available, otherwise use the file directly
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: s3Config.bucket,
          Key: key,
          Body: fileBuffer || file, // Use buffer if available, otherwise use the File object
          ContentType: file.type,
          ACL: "public-read" as const, // Use proper type
          Metadata: {
            "original-name": file.name,
            "upload-timestamp": new Date().toISOString(),
          },
        },
        // Configure options for more reliable uploads
        queueSize: 4, // Number of concurrent uploads
        partSize: 5 * 1024 * 1024, // 5MB parts for better handling
        leavePartsOnError: false,
      });

      // Set up progress tracking
      if (onProgress) {
        upload.on("httpUploadProgress", (progress) => {
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
      console.error("Direct S3 upload error:", error);

      // Check for common upload errors and handle them appropriately
      if (
        error instanceof Error &&
        (error.message.includes("checksum") ||
          error.message.includes("crc32") ||
          error.message.includes("getReader") ||
          error.message.includes("stream"))
      ) {
        console.warn(
          "Upload error detected, falling back to single-part upload method:",
          error.message
        );

        // Get a fresh S3 client
        const s3ClientForFallback = this.getS3Client();

        // Attempt to use the single-part upload as a fallback
        try {
          // Re-generate the key for the new upload attempt
          const fallbackKey = this.generateUniqueKey(file.name, userProfileId);
          console.log("Attempting fallback upload with single-part method...");
          return await this.uploadSmallFile(
            s3ClientForFallback,
            file,
            fallbackKey,
            onProgress
          );
        } catch (fallbackError) {
          console.error("Fallback upload also failed:", fallbackError);
          return {
            success: false,
            error:
              "Upload failed even with fallback method. This might be due to file size or network issues. Please try again with a smaller file or check your connection.",
          };
        }
      }

      let errorMessage = "Upload failed";
      if (error instanceof Error) {
        if (error.message.includes("credentials")) {
          errorMessage = "AWS credentials not configured properly";
        } else if (error.message.includes("Access Denied")) {
          errorMessage = "Access denied - check S3 bucket permissions";
        } else if (error.message.includes("NoSuchBucket")) {
          errorMessage = "S3 bucket not found - check bucket name";
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
   * Upload file directly to S3 (for small files)
   * @param s3Client - The S3 client
   * @param file - The file to upload
   * @param key - The S3 key for the file
   * @param onProgress - Optional progress callback
   * @returns Promise with upload result
   */
  private static async uploadSmallFile(
    s3Client: S3Client,
    file: File,
    key: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      // Add size check to prevent memory issues with very large files
      if (file.size > 100 * 1024 * 1024) {
        // 100MB
        throw new Error(
          `File too large for direct upload (${Math.round(
            file.size / (1024 * 1024)
          )}MB). Maximum recommended size is 100MB.`
        );
      }

      // If progress is requested, create a simple progress callback
      if (onProgress) {
        // Start progress at 0%
        onProgress({
          loaded: 0,
          total: file.size,
          percentage: 0,
        });

        // Set 25% progress when starting to read file
        onProgress({
          loaded: Math.floor(file.size * 0.25),
          total: file.size,
          percentage: 25,
        });
      }

      // Update progress to 50% when starting file conversion
      if (onProgress) {
        onProgress({
          loaded: Math.floor(file.size * 0.5),
          total: file.size,
          percentage: 50,
        });
      }

      // Convert File to ArrayBuffer first to avoid readableStream.getReader issues
      const fileArrayBuffer = await file.arrayBuffer();
      // Convert ArrayBuffer to Uint8Array which is compatible with AWS SDK
      const fileBuffer = new Uint8Array(fileArrayBuffer);

      // Update progress to 75% when starting actual upload
      if (onProgress) {
        onProgress({
          loaded: Math.floor(file.size * 0.75),
          total: file.size,
          percentage: 75,
        });
      }

      // Upload the file with PutObjectCommand using the buffer
      await s3Client.send(
        new PutObjectCommand({
          Bucket: s3Config.bucket,
          Key: key,
          Body: fileBuffer, // Use Uint8Array instead of File object
          ContentType: file.type,
          // Use proper type for ACL
          ACL: "public-read" as const,
          Metadata: {
            "original-name": file.name,
            "upload-timestamp": new Date().toISOString(),
          },
        })
      );

      // Complete progress at 100% when done
      if (onProgress) {
        onProgress({
          loaded: file.size,
          total: file.size,
          percentage: 100,
        });
      }

      // Construct file URL using the helper function
      const fileUrl = getFileUrl(key);

      return {
        success: true,
        fileUrl,
        key,
      };
    } catch (error) {
      console.error("Direct S3 small file upload error:", error);
      let errorMessage = "Upload failed";

      if (error instanceof Error) {
        errorMessage = error.message;
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
    maxSize: number = 100 * 1024 * 1024, // Increased to 100MB
    allowedTypes: string[] = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ]
  ): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: "No file selected" };
    }

    // We still keep a maximum size check but with a much higher limit
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${Math.round(
          maxSize / (1024 * 1024)
        )}MB limit`,
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${
          file.type
        } is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
      };
    }

    return { valid: true };
  }

  /**
   * Generate unique S3 key with folder structure using user profile ID
   */
  private static generateUniqueKey(
    fileName: string,
    userProfileId?: number
  ): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = fileName.split(".").pop() || "";
    // Remove extension, then replace spaces with underscores and remove any leading/trailing whitespace
    let nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
    nameWithoutExtension = nameWithoutExtension.trim().replace(/\s+/g, "_");

    // Use user profile ID if provided, otherwise fall back to date-based structure
    if (userProfileId) {
      // return `uploads/images/${userProfileId}/${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`;
      return `uploads/images/${userProfileId}/${nameWithoutExtension}.${extension}`;
    }

    // Fallback to date-based structure if no user profile ID provided
    // const now = new Date();
    // const year = now.getFullYear();
    // const month = String(now.getMonth() + 1).padStart(2, '0');
    // const day = String(now.getDate()).padStart(2, '0');

    return `uploads/images/${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`;
  }

  /**
   * Generate a unique filename (legacy method for compatibility)
   */
  static generateUniqueFilename(
    originalName: string,
    userProfileId?: number
  ): string {
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
