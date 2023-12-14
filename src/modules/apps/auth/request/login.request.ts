import { IsNotEmpty, IsString } from 'class-validator';

import { ILogin } from '../interfaces/login.interface';

export class LoginRequest implements ILogin {
  @IsNotEmpty()
  @IsString()
    username: string;

  @IsNotEmpty()
  @IsString()
    password: string;
}
