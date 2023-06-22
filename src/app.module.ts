import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppsModule } from 'modules/apps/apps.module';

import { CONFIG_MODULES } from 'app.provider';
import { ClsModule } from 'nestjs-cls';
import { BullModule } from '@nestjs/bull';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { QueueProcessor } from 'queue.processor';
import { BullBoardModule } from '@bull-board/nestjs';
import { FastifyAdapter } from '@bull-board/fastify';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './modules/_common/common.module';
import { CmsModule } from './modules/cms/cms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClsModule.forRoot({
      global: true,
    }),
    AppsModule,
    CmsModule,
    BullModule.registerQueue({
      name: 'audio',
    }),
    BullBoardModule.forFeature({
      name: 'audio',
      adapter: BullAdapter, // or use BullAdapter if you're using bull instead of bullMQ
    }),
    CommonModule,
    ...CONFIG_MODULES,
  ],
  controllers: [AppController],
  providers: [AppService, QueueProcessor],
})
export class AppModule {}
