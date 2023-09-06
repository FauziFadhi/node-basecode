import { Global, Logger, Module } from '@nestjs/common';

import { AuthCommonModule } from './auth/auth.module';
import { UploaderModule } from './uploader/uploader.module';

@Global()
@Module({
  imports: [UploaderModule, AuthCommonModule],
  providers: [Logger],
  exports: [UploaderModule, AuthCommonModule, Logger],
})
export class CommonModule {}
