import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Observable, tap } from 'rxjs';

@Injectable()
export class GlobalCustomResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(tap(() => {
      const res = context.switchToHttp().getResponse<FastifyReply>();
      // console.log('process.env.npm_package_version');
      // console.log(`${process.env.npm_package_version}`);
      res.header('project-version', `${process.env.npm_package_version}`);
      // console.log(res.getHeaders());
    }));
  }
}
