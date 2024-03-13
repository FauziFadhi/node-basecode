import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * you might need to use @AuthenticatedUser and CLSService from nestjs-cls
 */
export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (data && request.user) {
    return request.user[data];
  }
  return request.user;
});
