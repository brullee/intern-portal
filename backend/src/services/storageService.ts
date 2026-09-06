import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
  plansBucket,
  submissionsBucket,
  s3Endpoint,
  type BucketConfig,
} from '../config/s3'

const SIGNED_URL_TTL = 3600

function createStorage(bucket: BucketConfig, label: string) {
  function requireBucket(): string {
    if (!bucket.name) {
      throw new Error(
        `${label} bucket name is not defined in environment variables.`
      )
    }
    return bucket.name
  }

  async function upload(files: Express.Multer.File[]): Promise<string[]> {
    const name = requireBucket()

    return Promise.all(
      files.map(async (file) => {
        const fileName = `${Date.now()}--${file.originalname}`
        await bucket.client.send(
          new PutObjectCommand({
            Bucket: name,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
        )
        return `${s3Endpoint}/${name}/${fileName}`
      })
    )
  }

  // Swap a stored URL (or bare key) for a short-lived presigned download URL.
  async function getSignedDownloadUrl(url: string): Promise<string> {
    const name = requireBucket()
    const fileKey = url.split('/').pop() || url
    return getSignedUrl(
      bucket.client,
      new GetObjectCommand({ Bucket: name, Key: fileKey }),
      { expiresIn: SIGNED_URL_TTL }
    )
  }

  return { upload, getSignedDownloadUrl }
}

// Admin/mentor-uploaded plan documents.
export const planStorage = createStorage(plansBucket, 'Plan documents')

// Intern-uploaded task submission files.
export const submissionStorage = createStorage(
  submissionsBucket,
  'Task submissions'
)
