import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from '@utils/helper';
import { ResponseInterceptor } from '@utils/interceptors';
import { FastifyFileInterceptor } from '@utils/interceptors/fastify-file.interceptor';
import { FastifyFilesInterceptor } from '@utils/interceptors/fastify-files.interceptor';
import { FastifyFileFieldsInterceptor } from '@utils/interceptors/fastify-file-field.interceptor';
import { ImageUploaderRequest } from '../requests/uploader.request';

import { EnumUploadType } from '../interfaces/base-upload.interface';
import { CommonUploaderService } from '../services/upload-common-file.service';

@Controller({ path: 'uploader', version: '1' })
export class UploadController {
  constructor(
    private readonly commonUploaderService: CommonUploaderService,
  ) { }

  @Post('image')
  @UseInterceptors(
    FastifyFileInterceptor('imageFile', {
      fileFilter: imageFileFilter,
      limits: { fileSize: 3000000 },
    }),
    new ResponseInterceptor(),
  )
  // eslint-disable-next-line max-len
  async uploadImage(@UploadedFile() imageFile: Express.Multer.File, @Body() body: ImageUploaderRequest) {
    // common upload
    return this.commonUploaderService.upload(imageFile, body);
  }

  @Post('upload')
  @UseInterceptors(FastifyFileInterceptor('file', { fileFilter: imageFileFilter }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @Post('uploadx')
  @UseInterceptors(
    FastifyFileFieldsInterceptor([
      {
        name: 'file',
        maxCount: 1,
      },
      {
        name: 'files',
        maxCount: 3,
      },
    ],
    {
      fileFilter: imageFileFilter,
    }),
  )
  uploadFilex(@UploadedFiles() { file, files } : { file: Express.Multer.File, files: Express.Multer.File[] }) {
    console.log(file);
    console.log(files);
  }
}
