import { Inject, Injectable } from '@nestjs/common';
import { SequelizeCacheModuleOptions } from 'base-repo';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Store } from 'cache-manager';

@Injectable()
export class SequelizeCacheConfigService {
  constructor(
    @Inject(CACHE_MANAGER) private store: Store,
  ) {

  }

  SequelizeConfigOptions(): SequelizeCacheModuleOptions {
    return {
      defaultTTL: 5, // DEFINE TTL FOR ALL PROJECT seconds
      // DEFINE HOW TO GET CACHE FROM GIVEN KEY
      callbackGet: async ({ key }) => this.store.get(key),
      // DEFINE HOW TO INVALIDATE CACHE FROM GIVEN KEY
      callbackInvalidate: ({ key }) => (this.store?.del?.(key) || null),
      // DEFINE HOW TO SET CACHE FROM GIVEN KEY VALUE AND TTL
      callbackSet: async ({ key, value, ttl }) => this.store.set(key, value, { ttl }),
      callbackGetKey: async ({ keyPattern }) => this.store.keys?.(`${process.env.CACHE_PREFIX}${keyPattern}`) || [],
    };
  }
}
