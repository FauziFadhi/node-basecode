import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ServerCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const { user } = context.switchToHttp().getRequest();
    const key = super.trackBy(context);
    if (!user?.userId || !key) {
      return key;
    }
    return `${user.userId}:${key}`;
  }
}
