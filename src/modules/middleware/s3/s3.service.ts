/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-var-requires */
import { AwsConfigService } from '@config/aws/config.provider';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { generateRandomString, isEmpty } from '@utils/helper';
import { S3 } from 'aws-sdk';
import {
  CopyObjectRequest, DeleteObjectRequest, ManagedUpload, PutObjectRequest,
} from 'aws-sdk/clients/s3';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as moment from 'moment';
import { extname } from 'path';
import { UploadAndOrReplaceRequest, UploadRequest } from './interface/upload.interface';

@Injectable()
export class S3Service {
  bucket: string;

  s3: S3;

  constructor(
    private readonly awsConfigService: AwsConfigService,
  ) {
    this.s3 = this.setup();
    this.bucket = awsConfigService.bucket;
  }

  private setup() {
    return new S3({
      // credentials: {
      //   accessKeyId: this.awsConfigService.accessKeyId,
      //   secretAccessKey: this.awsConfigService.secretAccessKey,
      // },
      region: this.awsConfigService.defaultRegion,
    });
  }

  /**
   *
   * @param { filename: string, relativePath: string } oldFile
   * @returns
   */
  async moveFile(
    { filename: oldFilename, relativePath: oldRelativePath }: { filename: string, relativePath: string },
    { relativePath: newRelativePath }: { relativePath: string },
  ): Promise<S3.Types.CopyObjectOutput> {
    const oldFileUrl = `${this.bucket}/${this.getFullPath(oldFilename, oldRelativePath)}`;
    const newFileFullpath = this.getFullPath(oldFilename, newRelativePath);
    const params: CopyObjectRequest = {
      Bucket: this.bucket,
      ACL: 'public-read',
      CopySource: oldFileUrl,
      Key: newFileFullpath,
    };

    const copyFile = await this.s3.copyObject(params)
      .promise()
      .catch((e) => {
        // Log.createError({
        //   detail: '',
        //   title: 'ERROR Move File',
        //   reference: e?.response?.data || e?.response,
        //   statusCode: '500',
        //   request: params,
        //   code: 'AWS500',
        // });
        throw new InternalServerErrorException('Failed to move file at s3.');
      });

    this.removeFile(oldFilename, oldRelativePath);

    return copyFile;
  }

  async signedUrl(filename: string, relativePath?: string): Promise<{
    url: string,
    expireIn: any
  }> {
    const expireTime = 43200 as any; // 12 hours
    const params: PutObjectRequest = {
      Bucket: this.bucket,
      Key: this.getFullPath(filename, relativePath),
      Expires: expireTime,
    };

    const url = await this.s3.getSignedUrl('getObject', params);
    return {
      url,
      expireIn: expireTime,
    };
  }

  async signedUrlWithNotFound(filename: string, relativePath?: string, expireTime = 60): Promise<{
    url: string | any,
    expireIn: any
  }> {
    try {
      const params = {
        Bucket: this.bucket,
        Key: this.getFullPath(filename, relativePath),
        Expires: expireTime,
      };

      await this.s3.headObject({
        Bucket: this.bucket,
        Key: this.getFullPath(filename, relativePath),
      }).promise();

      const url = await this.s3.getSignedUrl('getObject', params);
      return {
        url,
        expireIn: expireTime,
      };
    } catch (error) {
      if (error.name === 'NotFound') { // Note with v3 AWS-SDK use error.code
        // return null;
        return { url: null, expireIn: null };
      }

      // Log.createError({
      //   detail: '',
      //   title: 'ERROR Get File',
      //   reference: error?.response?.data || error?.response,
      //   statusCode: '500',
      //   request: filename,
      //   code: 'AWS500',
      // });

      throw new InternalServerErrorException('Error Get File');
    }
  }

  private async uploadObject(file: Express.Multer.File, fullPath: string, acl: string = 'public-read') {
    const params: PutObjectRequest = {
      Bucket: this.bucket,
      Key: fullPath,
      ContentType: file.mimetype,
      Body: file.buffer,
      ACL: acl,
      // CacheControl: 'max-age=60',
    };

    return this.s3.upload(params).promise()
      .catch((e) => {
        // Log.createError({
        //   detail: '',
        //   title: 'ERROR Upload File',
        //   reference: e?.response?.data,
        //   statusCode: '500',
        //   request: params,
        //   code: 'AWS500',
        // });
        throw new InternalServerErrorException('Failed to upload to s3.');
      });
  }

  /**
   * filename with extension
   * @param fileName
   */
  private async removeObject(fullPath: string) {
    const params: DeleteObjectRequest = {
      Bucket: this.bucket,
      Key: fullPath,
    };

    return this.s3.deleteObject(params).promise();
  }

  getFileName(file: Express.Multer.File, baseName?: string): string {
    const fileExt = extname(file.originalname);
    const dateFileName = moment().format('YYYYMMDDHHmmss');
    const randomString = generateRandomString(10);
    const newFileName = `${dateFileName}${randomString}`;

    return baseName
      ? `${baseName.split('.')[0]}${fileExt}`
      : `${newFileName}${fileExt}`;
    // : `${dateFileName}${fileExt}`;
  }

  getFullPath(fileName: string, relativePath?: string): string {
    return `${this.awsConfigService.directory}/${relativePath!}/${fileName}`;
  }

  /**
   * upload file to S3 based on your bucket with prefixed folder before relative path
   * @param req
   * @returns
   */
  async uploadFile(req: UploadRequest, acl: string = 'public-read'): Promise<ManagedUpload.SendData & { fileName: string }> {
    const fileName = this.getFileName(req.file, req.baseName);
    const fullPath = this.getFullPath(fileName, req.relativePath);
    const uploaded = await this.uploadObject(req.file, fullPath, acl);

    return {
      ...uploaded,
      fileName,
    };
  }

  async uploadFileInvoice(req: UploadRequest, acl: string = 'public-read'): Promise<ManagedUpload.SendData & { fileName: string }> {
    const fileName = req.file.filename;
    const fullPath = this.getFullPath(fileName, req.relativePath);
    const uploaded = await this.uploadObject(req.file, fullPath, acl);
    // const signedUrl = await this.signedUrl(fileName, req.relativePath);
    // uploaded.Location = signedUrl.url;

    return {
      ...uploaded,
      fileName,
    };
  }

  /**
   * remove file from S3
   * @param fileName
   * @param relativePath
   * @returns
   */
  async removeFile(fileName: string, relativePath?: string) {
    const fullPath = this.getFullPath(fileName, relativePath);

    return this.removeObject(fullPath).catch((e) => {
      // Log.createError({
      //   detail: '',
      //   title: 'ERROR Move File',
      //   reference: e?.response?.data || e?.response,
      //   statusCode: '500',
      //   request: fullPath,
      //   code: 'AWS500',
      // });
      throw new InternalServerErrorException('Failed to remove file at s3.');
    });
  }

  /**
   * remove and upload new file, you replace the buffer or remove old file and upload new file to different path
   * @param {UploadRequest} newFile set `relativePath` and `baseName` to null or undefined to use both value from oldFile
   * @param oldFile
   * @returns
   */
  async replaceFile(newFile: UploadRequest, oldFile: { relativePath: string, fileName: string }): Promise<ManagedUpload.SendData & { fileName: string }> {
    await this.removeFile(oldFile.fileName, oldFile.relativePath);

    return this.uploadFile({
      file: newFile.file,
      baseName: newFile.baseName || oldFile.fileName.split('.')[0],
      relativePath: newFile.relativePath || oldFile.relativePath,
    });
  }

  /**
   * get stream file from S3
   * @param path
   * @returns Stream object
   */
  async streamObject(path: string) {
    try {
      const params: DeleteObjectRequest = {
        Bucket: this.bucket,
        Key: path,
      };

      return this.s3.getObject(params).createReadStream();
    } catch (error) {
      throw new Error(error);
    }
  }

  async uploadAndOrRepleaceFile(data: UploadAndOrReplaceRequest) {
    try {
      if (!isEmpty(data.oldFileName)) {
        await this.removeFile(data.oldFileName, data.relativePath);
      }

      const fullPath = this.getFullPath(data.fileName, data.relativePath);

      const uploaded = await this.uploadObject(data.file, fullPath);

      return {
        ...uploaded,
        fileName: data.fileName,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
