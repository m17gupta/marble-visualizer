# S3 Image Upload Implementation

This implementation provides a complete solution for uploading images to Amazon S3 using presigned URLs. The solution includes both React components and TypeScript services for secure, direct-to-S3 file uploads.

## Features

- ✅ **Presigned URL Upload**: Secure direct uploads to S3 without exposing AWS credentials
- ✅ **Drag & Drop Interface**: Intuitive file selection with drag and drop support
- ✅ **Real-time Progress**: Upload progress tracking with percentage and visual indicators
- ✅ **File Validation**: Configurable file size and type validation
- ✅ **Image Preview**: Preview selected images before upload
- ✅ **Error Handling**: Comprehensive error handling and user feedback
- ✅ **Gallery View**: View and manage uploaded images
- ✅ **Copy URLs**: Easy URL copying for uploaded files
- ✅ **TypeScript Support**: Full TypeScript support with proper typing

## Components

### 1. UploadImage Component

The main upload component that handles single file uploads.

```tsx
import UploadImage from '@/components/uploadImageS3/UploadImage';

const MyComponent = () => {
  const handleUploadSuccess = (fileUrl: string, key: string) => {
    console.log('File uploaded successfully:', { fileUrl, key });
  };

  const handleUploadError = (error: string) => {
    console.error('Upload failed:', error);
  };

  return (
    <UploadImage
      onUploadSuccess={handleUploadSuccess}
      onUploadError={handleUploadError}
      maxSize={10 * 1024 * 1024} // 10MB
      allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
    />
  );
};
```

### 2. UploadImageS3Home Component

A complete upload interface with gallery functionality.

```tsx
import UploadImageS3Home from '@/components/uploadImageS3/UploadImageS3Home';

const UploadPage = () => {
  return (
    <div>
      <UploadImageS3Home />
    </div>
  );
};
```

## Services

### S3UploadService

The core service that handles S3 uploads using presigned URLs.

```typescript
import { S3UploadService } from '@/services/s3UploadService';

// Upload a file
const uploadFile = async (file: File) => {
  const result = await S3UploadService.uploadFile(
    file,
    (progress) => {
      console.log(`Upload progress: ${progress.percentage}%`);
    }
  );

  if (result.success) {
    console.log('Upload successful:', result.fileUrl);
  } else {
    console.error('Upload failed:', result.error);
  }
};

// Validate a file before upload
const validation = S3UploadService.validateFile(file);
if (!validation.valid) {
  console.error('File validation failed:', validation.error);
}
```

## Custom Hook

### useS3Upload Hook

A React hook for managing S3 uploads with state management.

```typescript
import { useS3Upload } from '@/hooks/useS3Upload';

const MyUploadComponent = () => {
  const { upload, uploading, progress, result, reset } = useS3Upload({
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png'],
    onSuccess: (fileUrl, key) => {
      console.log('Upload successful:', { fileUrl, key });
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    },
  });

  const handleFileSelect = (file: File) => {
    upload(file);
  };

  return (
    <div>
      {/* Your upload UI */}
      {uploading && progress && (
        <div>Progress: {progress.percentage}%</div>
      )}
      {result && (
        <div>
          {result.success ? 'Upload successful!' : `Error: ${result.error}`}
        </div>
      )}
    </div>
  );
};
```

## Backend API Requirements

Your backend needs to provide these endpoints:

### 1. Get Presigned URL

```typescript
POST /s3/presigned-url
Content-Type: application/json

{
  "fileName": "image.jpg",
  "fileType": "image/jpeg"
}

Response:
{
  "presignedUrl": "https://s3.amazonaws.com/bucket/...",
  "fileUrl": "https://s3.amazonaws.com/bucket/uploads/image.jpg",
  "key": "uploads/image.jpg"
}
```

### 2. Confirm Upload (Optional)

```typescript
POST /s3/confirm-upload
Content-Type: application/json

{
  "key": "uploads/image.jpg"
}

Response:
{
  "success": true
}
```

## Backend Implementation Example (Node.js/Express)

```javascript
const AWS = require('aws-sdk');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const router = express.Router();

// Generate presigned URL
router.post('/presigned-url', async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    
    // Generate unique filename
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const key = `uploads/${uniqueFileName}`;
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      Expires: 60 * 5, // 5 minutes
    };
    
    const presignedUrl = s3.getSignedUrl('putObject', params);
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    
    res.json({
      presignedUrl,
      fileUrl,
      key,
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
});

// Confirm upload (optional)
router.post('/confirm-upload', async (req, res) => {
  try {
    const { key } = req.body;
    
    // Verify the object exists in S3
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };
    
    const headResult = await s3.headObject(params).promise();
    
    // You can save upload metadata to your database here
    // await saveUploadMetadata({ key, size: headResult.ContentLength, ... });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error confirming upload:', error);
    res.status(500).json({ error: 'Failed to confirm upload' });
  }
});

module.exports = router;
```

## Environment Variables

Make sure to set these environment variables in your backend:

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket-name
```

## S3 Bucket Configuration

### CORS Policy

Add this CORS policy to your S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### Bucket Policy (Optional)

For public read access to uploaded files:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/uploads/*"
    }
  ]
}
```

## Security Considerations

1. **Presigned URL Expiration**: Keep presigned URLs short-lived (5-15 minutes)
2. **File Type Validation**: Validate file types on both client and server
3. **File Size Limits**: Enforce reasonable file size limits
4. **Content-Type Verification**: Verify content type matches file extension
5. **Virus Scanning**: Consider adding virus scanning for uploaded files
6. **Access Control**: Implement proper authentication and authorization

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your S3 bucket has the correct CORS policy
2. **403 Forbidden**: Check your AWS credentials and S3 bucket permissions
3. **File Not Found**: Verify the presigned URL is generated correctly
4. **Upload Timeout**: Increase timeout settings for large files

### Debug Mode

Enable debug logging in the service:

```typescript
// Add to your environment variables or config
const DEBUG_S3_UPLOAD = process.env.NODE_ENV === 'development';

// Use in S3UploadService
if (DEBUG_S3_UPLOAD) {
  console.log('Upload progress:', progress);
  console.log('Presigned URL:', presignedUrl);
}
```

## License

This implementation is part of your application and follows your project's license terms.
