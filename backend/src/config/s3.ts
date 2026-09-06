import dotenv from 'dotenv';
import {S3Client} from '@aws-sdk/client-s3'
dotenv.config()
const endpoint= process.env.IDRIVE_E2_ENDPOINT
const  region = process.env.IDRIVE_E2_REGION
const key_id =  process.env.IDRIVE_E2_KEY_ID
const SecretAccessKey = process.env.IDRIVE_E2_SECRET_ACCESS_KEY
const key_id_second = process.env.IDRIVE_E2_KEY_ID_SECOND 
const  SecretAccessKey_second = process.env.IDRIVE_E2_SECRET_ACCESS_KEY_SECOND

export const s3Client_First = new S3Client({
endpoint,
region,
key_id,
SecretAccessKey
}as any);

export const s3Client_Second = new S3Client({
endpoint,
region,
key_id_second,
SecretAccessKey_second
}as any);


