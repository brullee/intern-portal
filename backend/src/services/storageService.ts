import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3Client_Second } from '../config/s3'

const SIGNED_URL_TTL = 3600

function requireBucket(): string {
  const bucketName = process.env.IDRIVE_E2_BUCKET_NAME_SECOND
  if (!bucketName) {
    throw new Error(
      'IDRIVE_E2_BUCKET_NAME_SECOND is not defined in environment variables.'
    )
  }
  return bucketName
}

async function uploadFiletoS3(
  files: Express.Multer.File[]
): Promise<string[]> {
  const bucketName = requireBucket()
  const endpoint = process.env.IDRIVE_E2_ENDPOINT

  return Promise.all(
    files.map(async (file) => {
      const fileName = `${Date.now()}--${file.originalname}`
      await s3Client_Second.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      )
      return `${endpoint}/${bucketName}/${fileName}`
    })
  )
}

async function GetFilefromS3(fileUrlOrKey: string): Promise<string> {
  const bucketName = requireBucket()
  const key = fileUrlOrKey.split('/').pop() || fileUrlOrKey
  return getSignedUrl(
    s3Client_Second,
    new GetObjectCommand({ Bucket: bucketName, Key: key }),
    { expiresIn: SIGNED_URL_TTL }
  )
}

export default {
  uploadFiletoS3,
  GetFilefromS3,
}
