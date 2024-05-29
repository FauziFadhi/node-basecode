import { Global, Logger, Module } from '@nestjs/common';
import { CommonUploaderModule } from './uploader/common.uploader.module';

@Global()
@Module({
  imports: [CommonUploaderModule],
  providers: [Logger],
  exports: [Logger, CommonUploaderModule],
})
export class CommonModule {}
