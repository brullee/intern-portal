import dotenv from 'dotenv'
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3Client, s3Endpoint } from '../config/s3'

dotenv.config()

const bucketName = process.env.IDRIVE_E2_BUCKET_NAME
const endpoint = s3Endpoint

function requireBucket(): string {
  if (!bucketName) {
    throw new Error(
      'IDRIVE_E2_BUCKET_NAME is not defined in environment variables.'
    )
  }
  return bucketName
}

async function uploadFiletoS3(files: Express.Multer.File[]): Promise<string[]> {
  const bucket = requireBucket()

  const uploadPromise = files.map(async (file) => {
    const fileName = `${Date.now()}--${file.originalname}`
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
    await s3Client.send(command)
    return `${endpoint}/${bucket}/${fileName}`
  })

  return Promise.all(uploadPromise)
}

async function GetFilefromS3(file: string): Promise<string> {
  const bucket = requireBucket()
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: file,
  })
  return getSignedUrl(s3Client, command, { expiresIn: 3600 })
}

export default {
  uploadFiletoS3,
  GetFilefromS3,
}
