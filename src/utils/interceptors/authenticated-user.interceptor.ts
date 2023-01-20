import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
// import {
//   set, scope,
// } from 'async-local-storage';

/**
 * used for storing authenticated user that can accessed globally
 * if you want using this interceptor.
 * call function `enable` and `disableLinkedTop` at `main.ts bootstrap`
 */
@Injectable()
export class AuthenticatedUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    /**
     * uncomment these lines
     * scope();
     * set('user', req.user);
     */

    return next
      .handle();
  }
}
