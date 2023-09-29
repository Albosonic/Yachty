import { S3Client } from "@aws-sdk/client-s3";
const region = "us-west-1";

const s3Client = new S3Client({ 
    region: region,
    credentials: {
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
    }
});

export { s3Client };
export const IMG_BUCKET = process.env.NEXT_PUBLIC_IMG_BUCKET;
