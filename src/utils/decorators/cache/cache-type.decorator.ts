import { SetMetadata } from '@nestjs/common';

export enum ECacheType {
  cdn = 'public',
  browser = 'private',
  server = 'server',
}
export const CACHE_TYPE_METADATA = 'x-cache-type';
export const CacheType = (cacheType: keyof typeof CacheType) => SetMetadata(CACHE_TYPE_METADATA, cacheType);
