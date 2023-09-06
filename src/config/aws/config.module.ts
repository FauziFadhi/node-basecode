import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from './config';
import { AwsConfigService } from './config.provider';
import schema from './schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      expandVariables: true,
      validationSchema: schema,
    }),
  ],
  providers: [AwsConfigService],
  exports: [AwsConfigService],
})
export class AwsConfigModule { }
