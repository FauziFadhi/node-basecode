import { SetMetadata } from '@nestjs/common';
import { PERMISSION } from '@utils/enum/authorization.enum';

export const PERMISSION_KEY = 'permission';
export const Permissions = (...permissions: PERMISSION[]) => SetMetadata(PERMISSION_KEY, permissions);
