import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { BullBoardModule } from '@bull-board/nestjs';
import { FastifyAdapter } from '@bull-board/fastify';
import { BullConfigProvider } from './queue.provider';
import { BullBoardMiddleware } from './bull-board.middleware';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useClass: BullConfigProvider,
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: FastifyAdapter,
      middleware: [BullBoardMiddleware],
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
