import { AppConfigModule } from '@config/app/config.module';
import { AuthConfigModule } from '@config/auth/config.module';
import { AwsConfigModule } from '@config/aws/config.module';
import { CacheConfigModule } from '@config/cache/config.module';
import { DBConfigModule } from '@config/database/config.module';
import { MiddlewareS3Module } from '@middleware/s3/middleware.s3.module';

export const CONFIG_MODULES = [
  AppConfigModule,
  CacheConfigModule,
  DBConfigModule,
  AuthConfigModule,
  AwsConfigModule,
];

export const MIDDLEWARE_MODULES = [
  MiddlewareS3Module,
];
