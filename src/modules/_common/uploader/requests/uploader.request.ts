import { EnumUploadType } from '@_common/uploader/interfaces/base-upload.interface';
import {
  IsIn, IsNotEmpty, IsOptional, IsString,
} from 'class-validator';

export class ImageUploaderRequest {
  @IsNotEmpty()
  @IsIn([...Object.values(EnumUploadType)])
    type: EnumUploadType;

  @IsOptional()
  @IsString()
    oldImageName: string;
}
