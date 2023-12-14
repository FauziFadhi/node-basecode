import { Module } from '@nestjs/common';
import { CircuitBreaker } from './common.circuit-breaker';
import { SafeRequest } from './common.safe-request.service';

@Module({
  imports: [],
  providers: [CircuitBreaker, SafeRequest],
  exports: [SafeRequest],
})
export class CommonSafeRequestModule {}
