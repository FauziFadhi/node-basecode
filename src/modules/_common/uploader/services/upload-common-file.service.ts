/* eslint-disable max-len */
import { S3Service } from '@middleware/s3/s3.service';
import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { DateTime } from 'luxon';
import { IBaseUploadRsp } from '../interfaces/base-upload.interface';
import { ImageUploaderRequest } from '../requests/uploader.request';

@Injectable()
export class CommonUploaderService {
  constructor(
    private readonly s3Service: S3Service,
  ) {}

  async upload(imageFile: Express.Multer.File, body: ImageUploaderRequest, temporaryUpload = false): Promise<IBaseUploadRsp> {
    // const pathUpload = CONST.upload.PATH_ID_PHOTO;

    const pathUpload = temporaryUpload ? `/temp/${body.type}` : body.type;
    const fileExt = extname(imageFile.originalname);
    const thisTime = DateTime.now().toFormat('YYYYMMDDHHmmss');
    // const randomString = generateRandomString(10);
    const randomString = 'X1';
    const newFileName = `${thisTime}${randomString}${fileExt}`;
    // const thisTime = createHash(dateNow().format('YYYYMMDDHHmmss'));
    // const randomKey = generateRandomNumber();
    // const newFileName = `${thisTime}-${randomKey}${extname(imageFile.originalname)}`;

    // const uploadPromise = this.s3Service.uploadFile({ file: imageFile, relativePath: pathUpload });

    const uploadPromise = this.s3Service.uploadAndOrRepleaceFile({
      file: imageFile,
      fileName: newFileName,
      relativePath: pathUpload,
      oldFileName: body.oldImageName,
    });

    const upload = await uploadPromise;

    return {
      fileName: upload.fileName,
      type: body.type,
      url: upload.Location,
    };

    // return {
    //   fileName: newFileName,
    //   type: body.type,
    //   url: pathUpload,
    // };
  }
}
