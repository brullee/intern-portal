import dotenv from 'dotenv'
import { S3Client } from '@aws-sdk/client-s3'

dotenv.config()

// The AWS SDK requires a full URL; tolerate an endpoint configured without one.
function normalizeEndpoint(value: string | undefined): string | undefined {
  if (!value) return value
  return /^https?:\/\//.test(value) ? value : `https://${value}`
}

export const s3Endpoint = normalizeEndpoint(process.env.IDRIVE_E2_ENDPOINT)

// iDrive e2 is S3-compatible but not AWS, so it needs path-style URLs
// (endpoint/bucket/key) rather than virtual-host style (bucket.endpoint).
export const s3Client = new S3Client({
  endpoint: s3Endpoint,
  region: process.env.IDRIVE_E2_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.IDRIVE_E2_KEY_ID ?? '',
    secretAccessKey: process.env.IDRIVE_E2_SECRET_ACCESS_KEY ?? '',
  },
})
