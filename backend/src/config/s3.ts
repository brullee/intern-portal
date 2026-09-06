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
function makeClient(
  accessKeyId: string | undefined,
  secretAccessKey: string | undefined
): S3Client {
  return new S3Client({
    endpoint: s3Endpoint,
    region: process.env.IDRIVE_E2_REGION,
    forcePathStyle: true,
    credentials: {
      accessKeyId: accessKeyId ?? '',
      secretAccessKey: secretAccessKey ?? '',
    },
  })
}

export interface BucketConfig {
  client: S3Client
  name: string | undefined
}

// Two isolated buckets, each with its own credentials so an intern-facing
// code path can never reach the admin/mentor one:
//  - plansBucket:       admin/mentor-uploaded plan documents
//  - submissionsBucket: intern-uploaded task submission files
export const plansBucket: BucketConfig = {
  client: makeClient(
    process.env.IDRIVE_E2_KEY_ID,
    process.env.IDRIVE_E2_SECRET_ACCESS_KEY
  ),
  name: process.env.IDRIVE_E2_BUCKET_NAME,
}

export const submissionsBucket: BucketConfig = {
  client: makeClient(
    process.env.IDRIVE_E2_KEY_ID_SECOND,
    process.env.IDRIVE_E2_SECRET_ACCESS_KEY_SECOND
  ),
  name: process.env.IDRIVE_E2_BUCKET_NAME_SECOND,
}
