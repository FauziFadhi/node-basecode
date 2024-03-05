// eslint-disable-next-line max-classes-per-file
import { PaginationRequest } from '@utils/base-request/pagination.request';
import {
  IsNotEmpty, IsNumber, IsOptional, IsString,
} from 'class-validator';

export class ListRequestNameQuery extends PaginationRequest {
  @IsOptional()
  @IsString()
    search?: string;
}

export class CreateRequestNameRequest {
  @IsNotEmpty()
  @IsString()
    name: string;

  @IsNotEmpty()
  @IsNumber()
    price: string;
}

export class UpdateRequestNameRequest extends CreateRequestNameRequest {
  @IsOptional()
  @IsString()
  declare name: string;

  @IsNotEmpty()
  @IsNumber()
  declare price: string;
}
