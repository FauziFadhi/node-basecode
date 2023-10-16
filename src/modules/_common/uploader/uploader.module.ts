import { Module } from '@nestjs/common';
import { S3Module } from '@middleware/s3/s3.module';
import { UploadController } from './controllers/uploader.controller';
import { CommonUploaderService } from './services/upload-common-file.service';

@Module({
  imports: [S3Module],
  providers: [
    CommonUploaderService,
  ],
  controllers: [
    UploadController,
  ],
})
export class UploaderModule {}
