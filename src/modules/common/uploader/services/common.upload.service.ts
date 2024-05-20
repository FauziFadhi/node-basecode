/* eslint-disable max-len */
import { S3Service } from '@middleware/s3/s3.service';
import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { DateTime } from 'luxon';
import { IBaseUploadRsp } from '../interfaces/base-upload.interface';
import { CreateSignedUrlRequest, ImageUploaderRequest } from '../requests/uploader.request';

@Injectable()
export class CommonUploadService {
  constructor(
    private readonly s3Service: S3Service,
  ) {}

  async upload(imageFile: Express.Multer.File, body: ImageUploaderRequest, temporaryUpload = false): Promise<IBaseUploadRsp> {
    // const pathUpload = CONST.upload.PATH_ID_PHOTO;

    const pathUpload = temporaryUpload ? `/temp/${body.type}` : body.type;
    const fileExt = extname(imageFile.originalname);
    const thisTime = DateTime.now().toFormat('yyyyMMddHHmmss');
    // const randomString = generateRandomString(10);
    const randomString = 'X1';
    const newFileName = `${thisTime}${randomString}${fileExt}`;
    // const thisTime = createHash(dateNow().format('yyyyMMddHHmmss'));
    // const randomKey = generateRandomNumber();
    // const newFileName = `${thisTime}-${randomKey}${extname(imageFile.originalname)}`;

    // const uploadPromise = this.s3Service.uploadFile({ file: imageFile, relativePath: pathUpload });

    const upload = await this.s3Service.uploadAndOrRepleaceFile({
      file: imageFile,
      fileName: newFileName,
      relativePath: pathUpload,
      oldFileName: body.oldImageName,
    });

    return {
      fileName: upload.fileName,
      type: body.type,
      url: upload.Location,
    };
  }

  async getUploadUrl(body: CreateSignedUrlRequest, temporaryUpload = false) {
    const pathUpload = temporaryUpload ? `/temp/${body.type}` : body.type;
    const fileExt = extname(body.fileName);
    const thisTime = DateTime.now().toFormat('yyyyMMddHHmmss');
    const randomString = 'X1';
    const newFileName = `${pathUpload}/${thisTime}${randomString}${fileExt}`;

    const url = await this.s3Service.generatePresignedUploadUrl(newFileName, body.bytesLength);
    return {
      url
    };
  }
}
