import { getModuleEnv } from '@config/app/config.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeCacheModule } from 'base-repo';
import { CacheConfigModule } from '@config/cache/config.module';
import { Store } from 'cache-manager';
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
          return {
            DB_CONNECTION: con.DB_CONNECTION,
            DB_HOST: con.DB_HOST,
            DB_PORT: con.DB_PORT,
            DB_NAME: con.DB_NAME,
            DB_USERNAME: con.DB_USERNAME,
            DB_PASSWORD: con.DB_PASSWORD,
            DB_READ_HOST: con.DB_READ_HOST,
            DB_READ_PORT: con.DB_READ_PORT,
            DB_READ_NAME: con.DB_READ_NAME,
            DB_READ_USERNAME: con.DB_READ_USERNAME,
            DB_READ_PASSWORD: con.DB_READ_PASSWORD,
          };
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
