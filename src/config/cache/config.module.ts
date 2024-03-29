import { getModuleEnv } from '@config/app/config.module';
import { Inject, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Store } from 'cache-manager';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';

import config from './config';
import { CacheConfigProvider } from './config.provider';
import schema from './schema';

@Module({
  imports: [
    getModuleEnv(ConfigModule.forRoot({
      load: [config],
      validationSchema: schema,
      envFilePath: [`.env.${process.env.CACHE_ENV}`, '.env'],
      validate(con) {
        return con;
      },
    })),
    CacheModule.registerAsync({
      useClass: CacheConfigProvider,
    }),
  ],
  providers: [CacheService],
  exports: [CacheModule, CacheService],
})
export class CacheConfigModule {
  static store: Store;

  constructor(@Inject(CACHE_MANAGER) private store: Store) {
    CacheConfigModule.store = this.store;
  }
}
