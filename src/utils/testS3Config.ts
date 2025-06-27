import { debugS3Config, validateS3Config, s3Config } from '@/config/s3Config';

// This function can be called from the browser console to debug S3 configuration
export const testS3Config = () => {
  console.log('🔍 Testing S3 Configuration...');
  
  debugS3Config();
  
  const validation = validateS3Config();
  
  if (validation.isValid) {
    console.log('✅ S3 Configuration is valid!');
    console.log('🚀 Ready to upload files to:', s3Config.bucket);
  } else {
    console.log('❌ S3 Configuration has issues:');
    validation.errors.forEach(error => console.log(`  • ${error}`));
    console.log('\n📝 To fix this, update your .env.local file with:');
    console.log('VITE_AWS_REGION=your-region');
    console.log('VITE_S3_BUCKET_NAME=your-bucket-name');
    console.log('VITE_AWS_ACCESS_KEY_ID=your-access-key');
    console.log('VITE_AWS_SECRET_ACCESS_KEY=your-secret-key');
  }
  
  return validation;
};

// Make it available globally for testing
if (typeof window !== 'undefined') {
  (window as typeof window & { testS3Config: typeof testS3Config }).testS3Config = testS3Config;
}

export default testS3Config;
