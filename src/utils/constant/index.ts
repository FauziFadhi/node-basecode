import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

export { default as AUTH } from './auth.constant';

// ENDPOINT
const configCs = new ConfigService(dotenv.parse(fs.readFileSync('.env')));
export const AWS_BUCKET_URL = configCs.get('AWS_BUCKET_URL');

// UPLOADER TYPE
export const IMAGE_MIME = ['image/jpeg', 'image/jpg', 'image/png'];
// IMAGE FOLDER
export const FOLDER_UPLOADER = 'node-basecode-app/files/';
export const FOLDER_COMMON = 'common';

export const IMAGE_URL = `${AWS_BUCKET_URL}${FOLDER_UPLOADER}`;
