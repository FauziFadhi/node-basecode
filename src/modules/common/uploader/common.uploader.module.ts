import { Module } from '@nestjs/common';
import { MiddlewareS3Module } from '@middleware/s3/middleware.s3.module';
import { CommonUploadController } from './controllers/common.upload.controller';
import { CommonUploadService } from './services/common.upload.service';

@Module({
  imports: [MiddlewareS3Module],
  providers: [
    CommonUploadService,
  ],
  controllers: [
    CommonUploadController,
  ],
})
export class CommonUploaderModule {}
