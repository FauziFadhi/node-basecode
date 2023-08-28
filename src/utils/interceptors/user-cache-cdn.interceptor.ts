import { CACHE_TTL_METADATA } from '@nestjs/cache-manager';
import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserCacheCdnType } from '@utils/enum/user-cache-cdn-type.enum';
import { FastifyReply } from 'fastify';
import { Observable, tap } from 'rxjs';

@Injectable()
export class UserCacheCdnInterceptor<T> implements NestInterceptor<T, any> {
  cacheControlType: UserCacheCdnType;

  constructor(cacheControlType: UserCacheCdnType) {
    this.cacheControlType = cacheControlType;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const reflector = new Reflector();
    let cacheTTL = reflector.get(
      CACHE_TTL_METADATA,
      context.getHandler(),
    );

    if (!cacheTTL) {
      cacheTTL = 5;
    }

    return next.handle().pipe(tap(() => {
      const res = context.switchToHttp().getResponse<FastifyReply>();
      res.header('Cache-Control', `${this.cacheControlType}, max-age=${cacheTTL}`);
      console.log(res.getHeaders());
    }));
  }
}
