# S3 Direct Upload Setup Guide

This guide will help you set up direct S3 uploads for your application.

## Environment Setup

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Update the following values in `.env.local`:

```bash
VITE_AWS_REGION=us-east-1
VITE_S3_BUCKET_NAME=your-actual-bucket-name
VITE_AWS_ACCESS_KEY_ID=your-access-key-id
VITE_AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

**Note:** Vite requires environment variables to be prefixed with `VITE_` to be accessible in the browser.

## AWS Setup

### 1. Create S3 Bucket
```bash
aws s3 mb s3://your-bucket-name --region us-east-1
```

### 2. Set Bucket CORS Policy
Create `cors-policy.json`:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Apply CORS policy:
```bash
aws s3api put-bucket-cors --bucket your-bucket-name --cors-configuration file://cors-policy.json
```

### 3. Set Bucket Policy for Public Read (Optional)
Create `bucket-policy.json`:
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

Apply bucket policy:
```bash
aws s3api put-bucket-policy --bucket your-bucket-name --policy file://bucket-policy.json
```

### 4. Create IAM User and Policy
Create IAM policy `s3-upload-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name"
    }
  ]
}
```

Create IAM user and attach policy:
```bash
aws iam create-user --user-name s3-upload-user
aws iam create-policy --policy-name S3UploadPolicy --policy-document file://s3-upload-policy.json
aws iam attach-user-policy --user-name s3-upload-user --policy-arn arn:aws:iam::YOUR-ACCOUNT-ID:policy/S3UploadPolicy
aws iam create-access-key --user-name s3-upload-user
```

## Security Considerations

⚠️ **WARNING**: Direct upload exposes AWS credentials to the client-side. Consider these security measures:

1. **Use IAM policies** with minimal required permissions
2. **Restrict CORS origins** to your specific domains
3. **Consider presigned URLs** for production environments
4. **Enable S3 bucket logging** to monitor access
5. **Use CloudFront** for better performance and security

## Testing the Setup

1. Start your development server:
```bash
npm run dev
```

2. Navigate to your upload component
3. Try uploading an image
4. Check your S3 bucket for the uploaded file

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Check your bucket CORS configuration
2. **Access Denied**: Verify IAM permissions and bucket policy
3. **Bucket Not Found**: Ensure bucket name is correct and exists
4. **Invalid Credentials**: Check your access key and secret key

### Debug Mode:

Add this to your component to see configuration details:
```javascript
console.log('S3 Config:', DirectS3UploadService.getConfig());
console.log('Is Configured:', DirectS3UploadService.isConfigured());
```

## Production Deployment

For production, consider using:
1. **Presigned URLs** instead of direct upload
2. **CloudFront** for CDN and security
3. **AWS Secrets Manager** for credential management
4. **Environment-specific buckets** (dev, staging, prod)
