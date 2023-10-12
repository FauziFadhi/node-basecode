import { getModuleEnv } from '@config/app/config.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeCacheModule } from 'base-repo';
import { CacheConfigModule } from '@config/cache/config.module';
import config from './config';
import { SequelizeConfigService } from './config.provider';
import schema from './schema';
import { SequelizeCacheConfigService } from './sequelize-cache.provider';

@Module({
  imports: [
    CacheConfigModule,
    getModuleEnv(
      ConfigModule.forRoot({
        load: [config],
        validationSchema: schema,
        validate(con) {
          return con;
        },
        envFilePath: [`.env.${process.env.DB_ENV}`, '.env'],
      }),
    ),
    SequelizeCacheModule.registerAsync({
      imports: [CacheConfigModule],
      useClass: SequelizeCacheConfigService,
    }),
    SequelizeModule.forRootAsync({ useClass: SequelizeConfigService }),
  ],
})
export class DBConfigModule { }
