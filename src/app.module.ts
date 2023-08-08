import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppsModule } from '@apps/apps.module';

import { ClsModule } from 'nestjs-cls';
import { CommonModule } from '@_common/common.module';
import { CmsModule } from '@cms/cms.module';
import { CONFIG_MODULES } from './app.provider';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClsModule.forRoot({
      global: true,
    }),
    AppsModule,
    CmsModule,
    CommonModule,
    ...CONFIG_MODULES,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
