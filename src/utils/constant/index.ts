export { default as AUTH } from './auth.constant';

// ENDPOINT
export const { AWS_BUCKET_URL } = process.env;

// UPLOADER TYPE
export const IMAGE_MIME = ['image/jpeg', 'image/jpg', 'image/png'];

// IMAGE FOLDER
export const FOLDER_UPLOADER = 'node-basecode-app/files/';
export const FOLDER_COMMON = 'common';

export const IMAGE_URL = `${AWS_BUCKET_URL}${FOLDER_UPLOADER}`;

// FILE SIZE
export const ONE_MEGABYTE = 1048576;

// TIME UNIT IN SECOND
export const ONE_HOUR = 3600;
