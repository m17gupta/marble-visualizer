// Environment configuration for S3 uploads
// This file provides a centralized way to access environment variables

interface S3Config {
  region: string;
  bucket: string;
  accessKeyId: string | undefined;
  secretAccessKey: string | undefined;
  cloudFrontUrl?: string;
  apiBaseUrl?: string;
}

// Get environment variables with proper fallbacks
const getEnvVar = (key: string, fallback?: string): string | undefined => {
  const value = import.meta.env[key];
  return value || fallback;
};

// S3 Configuration
export const s3Config: S3Config = {
  region: getEnvVar('VITE_AWS_REGION', 'us-east-1')!,
  bucket: getEnvVar('VITE_S3_BUCKET_NAME', 'your-bucket-name')!,
  accessKeyId: getEnvVar('VITE_AWS_ACCESS_KEY_ID'),
  secretAccessKey: getEnvVar('VITE_AWS_SECRET_ACCESS_KEY'),
  cloudFrontUrl: getEnvVar('VITE_CLOUDFRONT_URL'),
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3001/api'),
};

// Configuration validation
export const validateS3Config = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!s3Config.accessKeyId) {
    errors.push('VITE_AWS_ACCESS_KEY_ID is not set');
  }

  if (!s3Config.secretAccessKey) {
    errors.push('VITE_AWS_SECRET_ACCESS_KEY is not set');
  }

  if (s3Config.bucket === 'your-bucket-name') {
    errors.push('VITE_S3_BUCKET_NAME is not properly configured');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Debug function to check configuration
export const debugS3Config = (): void => {
  console.group('🔧 S3 Configuration Debug');
  console.log('Region:', s3Config.region);
  console.log('Bucket:', s3Config.bucket);
  console.log('Has Access Key:', !!s3Config.accessKeyId);
  console.log('Has Secret Key:', !!s3Config.secretAccessKey);
  console.log('CloudFront URL:', s3Config.cloudFrontUrl || 'Not set');
  console.log('API Base URL:', s3Config.apiBaseUrl);
  
  const validation = validateS3Config();
  console.log('Is Valid:', validation.isValid);
  if (!validation.isValid) {
    console.error('Configuration Errors:', validation.errors);
  }
  console.groupEnd();
};

// Check if we're in development mode
export const isDevelopment = import.meta.env.DEV;

// Helper to get the correct file URL based on CloudFront availability
export const getFileUrl = (key: string): string => {
  if (s3Config.cloudFrontUrl) {
    return `${s3Config.cloudFrontUrl}/${key}`;
  }
  return `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${key}`;
};

// Environment info for debugging
export const envInfo = {
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV,
  prod: import.meta.env.PROD,
  baseUrl: import.meta.env.BASE_URL,
};

export default s3Config;
