/* eslint-disable max-classes-per-file */
import { EGender } from '@utils/enum/user.enum';
import { Expose, Transform, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class RoleVm {
  @Expose()
    id: number;

  @Expose()
    name: string;

  @Transform(({ obj }) => `${obj.name}+${obj.id}`)
  @Expose()
    code: string;
}

export class UserVm {
  @Expose()
    id: number;

  @Expose()
    name: string;

  @Expose()
    code: string;

  /** @example fauzifadhi@gmail.com */
  @Expose()
    email: string;

  @Expose()
    gender: EGender;

  @Transform(({ obj }) => `${obj.name}+${obj.id}`)
  @Expose()
    nationality?: string;

  @Expose()
  @Type(() => RoleVm)
    roles: RoleVm[];
}
