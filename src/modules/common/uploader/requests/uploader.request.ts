import { EnumUploadType } from 'modules/common/uploader/interfaces/base-upload.interface';
import {
  IsIn, IsNotEmpty, IsNumber, IsOptional, IsString,
  Max,
} from 'class-validator';
import { ONE_MEGABYTE } from '@utils/constant';

export class ImageUploaderRequest {
  @IsNotEmpty()
  @IsIn([...Object.values(EnumUploadType)])
    type: EnumUploadType;

  @IsOptional()
  @IsString()
    oldImageName: string;
}

export class CreateSignedUrlRequest {
  @IsNotEmpty()
  @IsIn([...Object.values(EnumUploadType)])
    type: EnumUploadType;

  @IsNotEmpty()
  @IsString()
    fileName: string;

    @IsNotEmpty()
    @IsNumber()
    @Max(ONE_MEGABYTE * 2)
      bytesLength: number;
}