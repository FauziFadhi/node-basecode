import { Module } from '@nestjs/common';
import { UploadController } from './controllers/uploader.controller';
import { CommonUploaderService } from './services/upload-common-file.service';

@Module({
  imports: [],
  providers: [
    CommonUploaderService,
  ],
  controllers: [
    UploadController,
  ],
})
export class UploaderModule {}
