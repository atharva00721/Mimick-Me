# Fix: Images Upload But Don't Show

## Problem
After removing `ACL: "public-read"` from the S3 upload commands (to fix 400 Bad Request errors), images now upload successfully but don't display (403 Forbidden).

## Solution
Apply this bucket policy to your S3 bucket to allow public read access:

### 1. Apply Bucket Policy

Go to AWS S3 Console → Your Bucket → Permissions → Bucket Policy and add:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

**Replace `YOUR-BUCKET-NAME` with your actual bucket name from `S3_BUCKET_NAME` env var.**

### 2. Verify CORS Configuration

Ensure your bucket has the CORS policy from `docs/s3-cors-config.json` applied.

### 3. Disable "Block all public access"

In your bucket's Permissions tab, under "Block public access (bucket settings)", ensure:
- "Block all public access" is **OFF**
- Or at minimum, "Block public access to buckets and objects granted through new public bucket or access point policies" is **OFF**

### 4. Test

After applying the policy:
1. Upload a new image through the portfolio editor
2. Copy the public URL
3. Open it in a new browser tab
4. Should load without 403 error

## Why This Works

- **Before**: `ACL: "public-read"` on each object made them individually public
- **Before problem**: ACL in presigned URL caused signature mismatch → 400 errors
- **After**: Bucket policy grants public read to ALL objects
- **After benefit**: No ACL in presigned URL → no signature mismatch → uploads work
- **After requirement**: Bucket policy needed for public access

## Alternative: Private Images with CDN

If you prefer private images, consider:
1. Keep bucket private (no public policy)
2. Generate signed URLs for image access
3. Or use CloudFront with OAI to serve private S3 content
