import dotenv from 'dotenv';
//hani s3 imports 
import  { PutObjectCommand , GetObjectCommand } from '@aws-sdk/client-s3'
import { s3Client_Second } from '../config/s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
dotenv.config();

//hani s3 service upload files
async function uploadFiletoS3(files:Express.Multer.File[]):Promise<string[]>{
const bucketName = process.env.IDRIVE_E2_BUCKET_NAME_SECOND;
const endpoint = process.env.IDRIVE_E2_ENDPOINT;
if(!bucketName){
    throw new Error('IDRIVE_E2_BUCKET_NAME is not defined in environment variables.');
}
const uploadPromise = files.map(async(file) => {
const fileName = `${Date.now()}--${file.originalname}`;
const command = new PutObjectCommand({
    Bucket:bucketName,
    Key : fileName,
    Body: file.buffer,
    ContentType:file.mimetype,
});
await s3Client_Second.send(command);
return `${endpoint}/${bucketName}/${fileName}`;
});
return Promise.all(uploadPromise);
}

//hani s3 service get files
async function GetFilefromS3(file:string):Promise<string>{
const bucketName = process.env.IDRIVE_E2_BUCKET_NAME_SECOND;

if(!bucketName){
    throw new Error('IDRIVE_E2_BUCKET_NAME is not defined in environment variables.');
}
const fileName = file;
const command = new GetObjectCommand({
    Bucket:bucketName,
    Key : fileName,
});
const downloadUrl = await getSignedUrl(s3Client_Second,command,{ expiresIn: 3600 });
return downloadUrl;
}

export default {
uploadFiletoS3,
GetFilefromS3
};

