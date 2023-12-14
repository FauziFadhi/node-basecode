import { IsNotEmpty, IsString } from 'class-validator';

export class AppsCreateRoleReq {
  @IsNotEmpty()
  @IsString()
    name: string;
}
