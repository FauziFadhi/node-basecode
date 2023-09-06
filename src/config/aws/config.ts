import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  defaultRegion: process.env.AWS_DEFAULT_REGION,
  bucket: process.env.AWS_BUCKET,
  bucketUrl: process.env.AWS_BUCKET_URL,
}));
