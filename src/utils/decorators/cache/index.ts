import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { CacheTTL } from '@nestjs/cache-manager';
import { ClientCacheInterceptor, ServerCacheInterceptor } from '@utils/interceptors';
import { CacheType, ECacheType } from './cache-type.decorator';

export function CacheEndpoint(ttl: number, cacheType: keyof typeof ECacheType = 'browser') {
  return applyDecorators(
    CacheType(cacheType),
    CacheTTL(ttl),
    cacheType === 'server'
      ? UseInterceptors(ServerCacheInterceptor)
      : UseInterceptors(ClientCacheInterceptor),
  );
}
