import { ILoggedUser } from '@apps/auth/interface/logged-user.interface';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '@utils/decorators';
import { PERMISSION } from '@utils/enum/authorization.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<PERMISSION[]>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions) {
      return true;
    }
    const { user }: { user: ILoggedUser } = context.switchToHttp().getRequest();
    return requiredPermissions.some((permission) => user?.permissions?.includes(permission));
  }
}
