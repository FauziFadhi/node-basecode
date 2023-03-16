import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @deprecated you might need to use @AuthenticatedUser and CLSService from nestjs-cls
 */
export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
