import { CACHE_TTL_METADATA } from '@nestjs/cache-manager';
import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CACHE_TYPE_METADATA, ECacheType } from '@utils/decorators/cache/cache-type.decorator';
import { FastifyReply } from 'fastify';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ClientCacheInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(tap(() => {
      const reflector = new Reflector();
      let cacheTTL = reflector.get(
        CACHE_TTL_METADATA,
        context.getHandler(),
      );

      const cacheType = reflector.get(
        CACHE_TYPE_METADATA,
        context.getHandler(),
      );

      if (!cacheTTL) {
        cacheTTL = 5;
      }
      const res = context.switchToHttp().getResponse<FastifyReply>();
      const maxAge = ECacheType[cacheType] === ECacheType.browser ? `max-age=${cacheTTL}` : `s-maxage=${cacheTTL}`;
      res.header('Cache-Control', `${ECacheType[cacheType]}, ${maxAge}`);
    }));
  }
}
