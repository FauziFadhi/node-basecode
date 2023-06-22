import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { BullBoardModule } from '@bull-board/nestjs';
import { FastifyAdapter } from '@bull-board/fastify';
import { BullConfigProvider } from './queue.provider';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useClass: BullConfigProvider,
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: FastifyAdapter,
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
