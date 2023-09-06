import { AwsConfigModule } from '@config/aws/config.module';
import { Global, Module } from '@nestjs/common';

import { S3Service } from './s3.service';

@Global()
@Module({
  imports: [AwsConfigModule],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
