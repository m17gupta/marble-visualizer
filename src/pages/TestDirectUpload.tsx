import React, { useEffect, useState } from 'react';
import { UploadImage } from '@/components/uploadImageS3';
import { debugS3Config, validateS3Config } from '@/config/s3Config';

const TestDirectUpload: React.FC = () => {
  const [configStatus, setConfigStatus] = useState<{ isValid: boolean; errors: string[] }>({ isValid: false, errors: [] });

  useEffect(() => {
    // Debug S3 configuration on component mount
    debugS3Config();
    const validation = validateS3Config();
    setConfigStatus(validation);
  }, []);

  const handleUploadSuccess = (fileUrl: string, key: string) => {
    console.log('✅ Upload successful!');
    console.log('File URL:', fileUrl);
    console.log('S3 Key:', key);
    
    // You can now save this information to your database
    // or use it elsewhere in your application
  };

  const handleUploadError = (error: string) => {
    console.error('❌ Upload failed:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Direct S3 Upload Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          {!configStatus.isValid && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                ⚠️ Configuration Required
              </h3>
              <p className="text-red-700 mb-3">
                Please configure your AWS credentials in <code>.env.local</code>:
              </p>
              <ul className="text-sm text-red-600 space-y-1">
                {configStatus.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
          
          <UploadImage
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            maxSize={10 * 1024 * 1024} // 10MB
            allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
            className="w-full"
            jobImageUpload={(file: File) => {
              console.log('Job image upload:', file);
            }}
          />
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            Setup Instructions:
          </h2>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Update your AWS credentials in <code>.env.local</code></li>
            <li>2. Make sure your S3 bucket has proper CORS configuration</li>
            <li>3. Check the browser console for configuration debug info</li>
            <li>4. Try uploading an image above!</li>
          </ol>
          <div className="mt-3 text-xs text-blue-600">
            <strong>Environment Variables needed:</strong>
            <ul className="mt-1 space-y-1">
              <li>• VITE_AWS_REGION (e.g., us-east-1)</li>
              <li>• VITE_S3_BUCKET_NAME (your bucket name)</li>
              <li>• VITE_AWS_ACCESS_KEY_ID (your access key)</li>
              <li>• VITE_AWS_SECRET_ACCESS_KEY (your secret key)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDirectUpload;
