import dotenv from 'dotenv'
import { S3Client } from '@aws-sdk/client-s3'

dotenv.config()

const endpoint = process.env.IDRIVE_E2_ENDPOINT
const region = process.env.IDRIVE_E2_REGION

// iDrive e2 is S3-compatible but not AWS, so it needs path-style URLs
// (endpoint/bucket/key) rather than virtual-host style (bucket.endpoint).
export const s3Client_First = new S3Client({
  endpoint,
  region,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.IDRIVE_E2_KEY_ID ?? '',
    secretAccessKey: process.env.IDRIVE_E2_SECRET_ACCESS_KEY ?? '',
  },
})

export const s3Client_Second = new S3Client({
  endpoint,
  region,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.IDRIVE_E2_KEY_ID_SECOND ?? '',
    secretAccessKey: process.env.IDRIVE_E2_SECRET_ACCESS_KEY_SECOND ?? '',
  },
})
