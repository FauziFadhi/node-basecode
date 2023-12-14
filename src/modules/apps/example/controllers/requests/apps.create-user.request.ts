import {
  IsEmail,
  IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength,
} from 'class-validator';

export class AppsCreateUserReq {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(8)
    username : string;

  @IsNotEmpty()
  @IsString()
    password: string;

  @IsNotEmpty()
  @IsString()
    name: string;

  @IsOptional()
  @IsString()
    phone?: string;

  @IsNotEmpty()
  @IsEmail()
    email: string;

  @IsNotEmpty()
  @IsNumber()
    roleId: number;
}
