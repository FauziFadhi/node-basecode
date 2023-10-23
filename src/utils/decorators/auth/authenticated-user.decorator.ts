import {
  applyDecorators, UseInterceptors,
} from '@nestjs/common';
import { AuthenticatedUserInterceptor } from '@utils/interceptors';
import { ClsInterceptor } from 'nestjs-cls';

export function AuthenticatedUser() {
  return applyDecorators(
    UseInterceptors(ClsInterceptor, AuthenticatedUserInterceptor),
  );
}
