import dotenv from 'dotenv'
import { S3Client } from '@aws-sdk/client-s3'

dotenv.config({ quiet: true })

function normalizeEndpoint(value: string | undefined): string | undefined {
  if (!value) return value
  return /^https?:\/\//.test(value) ? value : `https://${value}`
}

const endpoint = normalizeEndpoint(process.env.IDRIVE_E2_ENDPOINT)
const region = process.env.IDRIVE_E2_REGION

function makeClient(
  accessKeyId: string | undefined,
  secretAccessKey: string | undefined
): S3Client {
  return new S3Client({
    endpoint,
    region,
    forcePathStyle: true,
    credentials: {
      accessKeyId: accessKeyId ?? '',
      secretAccessKey: secretAccessKey ?? '',
    },
  })
}

export const s3Client_First = makeClient(
  process.env.IDRIVE_E2_KEY_ID,
  process.env.IDRIVE_E2_SECRET_ACCESS_KEY
)

export const s3Client_Second = makeClient(
  process.env.IDRIVE_E2_KEY_ID_SECOND,
  process.env.IDRIVE_E2_SECRET_ACCESS_KEY_SECOND
)
