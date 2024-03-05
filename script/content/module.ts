import { Module } from '@nestjs/common';
import { ControllerName } from './controller';
import { ServiceName } from './service';

@Module({
  controllers: [ControllerName],
  providers: [ServiceName],
  exports: [],
})
export class ModuleName {}
