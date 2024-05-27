/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-var-requires */
import { AwsConfigService } from '@config/aws/config.provider';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { generateRandomString } from '@utils/helper';
import { S3 } from 'aws-sdk';
import { extname } from 'path';
import {
  CopyObjectCommand,
  CopyObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  ObjectCannedACL,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DateTime } from 'luxon';
import { UploadAndOrReplaceRequest, UploadRequest } from './interface/upload.interface';

@Injectable()
export class S3Service {
  bucket: string;

  s3: S3Client;

  constructor(
    private readonly awsConfigService: AwsConfigService,
    private readonly logger: Logger,
  ) {
    this.s3 = this.setup();
    this.bucket = awsConfigService.bucket;
  }

  private setup() {
    return new S3Client({
      credentials: {
        accessKeyId: this.awsConfigService.accessKeyId,
        secretAccessKey: this.awsConfigService.secretAccessKey,
      },

      // more secure use fromInstanceMetadata

      // credentials: fromInstanceMetadata({
      //   // Optional. The connection timeout (in milliseconds) to apply to any remote requests.
      //   // If not specified, a default value of `1000` (one second) is used.
      //   timeout: 5000,
      //   // Optional. The maximum number of times any HTTP connections should be retried. If not
      //   // specified, a default value of `0` will be used.
      //   maxRetries: 0,
      // }),
      region: this.awsConfigService.defaultRegion,
    });
  }

  /**
   *
   * @param { filename: string, relativePath: string } oldFile
   * @returns
   */
  async moveFile(
    // eslint-disable-next-line max-len
    { filename: oldFilename, relativePath: oldRelativePath }: { filename: string, relativePath: string },
    { relativePath: newRelativePath }: { relativePath: string },
  ): Promise<S3.Types.CopyObjectOutput> {
    const oldFileUrl = `${this.bucket}/${this.getFullPath(oldFilename, oldRelativePath)}`;
    const newFileFullpath = this.getFullPath(oldFilename, newRelativePath);
    const params: CopyObjectCommandInput = {
      Bucket: this.bucket,
      ACL: 'public-read',
      CopySource: oldFileUrl,
      Key: newFileFullpath,
    };

    try {
      const command = new CopyObjectCommand(params);

      const copyFile = await this.s3.send(command);

      this.removeFile(oldFilename, oldRelativePath);
      // process data.
      return copyFile;
    } catch (error) {
      throw new InternalServerErrorException('Failed to move file at s3.');
    }
  }

  async signedUrl(filename: string, relativePath?: string): Promise<{
    url: string,
    expireIn: any
  }> {
    const expireTime = 43200 as any; // 12 hours
    const params: GetObjectCommandInput = {
      Bucket: this.bucket,
      Key: this.getFullPath(filename, relativePath),
    };

    try {
      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(this.s3, command, { expiresIn: expireTime });
      return {
        url,
        expireIn: expireTime,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get signed url from s3.');
    }
  }

  private async uploadObject(file: Express.Multer.File, fullPath: string, acl: ObjectCannedACL = 'public-read') {
    const params: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: fullPath,
      ContentType: file.mimetype,
      Body: file.buffer,
      ACL: acl,
      // CacheControl: 'max-age=60',
    };

    try {
      const command = new PutObjectCommand(params);
      const upload = await this.s3.send(command);
      return {
        ...upload,
        Location: `https://${this.bucket}.s3.${this.awsConfigService.defaultRegion}.amazonaws.com/${fullPath}`,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed upload to s3.');
    }
  }

  /**
   * filename with extension
   * @param fileName
   */
  private async removeObject(fullPath: string) {
    const params: DeleteObjectCommandInput = {
      Bucket: this.bucket,
      Key: fullPath,
    };

    try {
      const command = new DeleteObjectCommand(params);
      return await this.s3.send(command);
    } catch (error) {
      throw new InternalServerErrorException('Failed delete object from s3.');
    }
  }

  getFileName(file: Express.Multer.File, baseName?: string): string {
    const fileExt = extname(file.originalname);
    const dateFileName = DateTime.now().toFormat('yyyyMMddHHmmss');
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
  async uploadFile(req: UploadRequest, acl: ObjectCannedACL = 'public-read'): Promise<PutObjectCommandOutput & { fileName: string }> {
    const fileName = this.getFileName(req.file, req.baseName);
    const fullPath = this.getFullPath(fileName, req.relativePath);
    const uploaded = await this.uploadObject(req.file, fullPath, acl);

    return {
      ...uploaded,
      fileName,
    };
  }

  async uploadFileInvoice(req: UploadRequest, acl: ObjectCannedACL = 'public-read'): Promise<PutObjectCommandOutput & { fileName: string }> {
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

    return this.removeObject(fullPath).catch(() => {
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
  // eslint-disable-next-line max-len
  async replaceFile(newFile: UploadRequest, oldFile: { relativePath: string, fileName: string }): Promise<PutObjectCommandOutput & { fileName: string }> {
    await this.removeFile(oldFile.fileName, oldFile.relativePath);

    return this.uploadFile({
      file: newFile.file,
      baseName: newFile.baseName || oldFile.fileName.split('.')[0],
      relativePath: newFile.relativePath || oldFile.relativePath,
    });
  }

  async uploadAndOrRepleaceFile(data: UploadAndOrReplaceRequest) {
    try {
      if (data.oldFileName) {
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

  async generatePresignedUploadUrl(obj: {
    relativePath: string, bytes: number, ACL?: ObjectCannedACL
  }, opts?: { expiresIn?: number }): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        ContentLength: obj.bytes,
        ACL: obj.ACL || 'public-read',
        Key: obj.relativePath,
      });

      return await getSignedUrl(this.s3, command, { expiresIn: opts?.expiresIn || 300 });
    } catch (error) {
      this.logger.error({ message: 'failed to generate upload url.', cause: error.message }, error.stack);
      throw new InternalServerErrorException('failed to generate upload url.');
    }
  }
}
