/* eslint-disable max-classes-per-file */
import { Expose } from 'class-transformer';

export class LoginVm {
  // @example asdasdasd
  @Expose()
    expiresIn: number;

  // @example 50
  @Expose()
    token: string;
}
