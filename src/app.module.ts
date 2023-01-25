import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppsModule } from 'modules/apps/apps.module';

import { CONFIG_MODULES } from 'app.provider';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './modules/_common/common.module';
import { CmsModule } from './modules/cms/cms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AppsModule,
    CmsModule,
    CommonModule,
    ...CONFIG_MODULES,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
