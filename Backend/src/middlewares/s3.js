import AWS from 'aws-sdk'
import dotenv from 'dotenv'
dotenv.config()

const s3 = new AWS.S3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

export async function uploadFile(buffer, filename, mimetype) {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: buffer,
    Key: `uploads/${Date.now()}_${filename}`, 
    ContentType: mimetype,
  }

  const result = await s3.upload(uploadParams).promise()
  return result.Location 
}
