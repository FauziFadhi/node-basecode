import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { projectVersion } from 'main';
import { Observable, tap } from 'rxjs';

@Injectable()
export class GlobalCustomResponseInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    return next.handle().pipe(tap(() => {
      const res = context.switchToHttp().getResponse<FastifyReply>();
      res.header('project-version', projectVersion);
    }));
  }
}
