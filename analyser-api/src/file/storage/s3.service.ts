import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
  GetObjectCommandInput,
  DeleteObjectCommandInput,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';

import { S3ConfigService } from '@configs/s3';
import { FileStorage } from './file-storage';

// errors
import { ServiceError } from '@common/errors';

// types
import { FileType } from '@common/types';

@Injectable()
export class S3Service implements FileStorage {
  private readonly s3Client: S3Client;
  public readonly defaultBucket: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(config: S3ConfigService) {
    this.s3Client = new S3Client({
      region: config.region,
    });
    this.defaultBucket = config.defaultBucketName;
  }

  private readonly mimeTypeMapping: Record<FileType, string> = {
    csv: 'text/csv',
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    png: 'image/png',
    txt: 'text/plain',
  };

  async getObject(
    key: string,
    options?: { bucket?: string },
  ): Promise<Readable> {
    const bucketName = options?.bucket || this.defaultBucket;

    const input: GetObjectCommandInput = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new GetObjectCommand(input);
    try {
      const response = await this.s3Client.send(command);
      if (!response.Body) {
        throw new ServiceError('S3 response did not return a file body.');
      }
      return response.Body as Readable;
    } catch (err) {
      const errorMessage = (err as S3ServiceException).message;
      this.logger.error(errorMessage);
      throw new ServiceError(`S3 error: ${errorMessage}`);
    }
  }

  async getPresignedPostUrl(options: {
    bucket?: string;
    expiresIn?: number;
    fileType: FileType;
  }): Promise<{ signedUrl: string; objectKey: string }> {
    const uniqueKey = randomUUID();
    const bucketName = options.bucket || this.defaultBucket;
    const objectKey = `${bucketName}/${uniqueKey}.${options.fileType}`;
    const expiresIn = options.expiresIn || 120; // 2 minutes
    const contentType = this.mimeTypeMapping[options.fileType];
    if (!contentType) {
      throw new ServiceError(`Unsupported file type: ${options.fileType}`);
    }

    const input: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: objectKey,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(input);
    const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });

    return { signedUrl, objectKey };
  }

  async removeObject(
    key: string,
    options?: { bucket?: string },
  ): Promise<void> {
    const bucketName = options?.bucket || this.defaultBucket;

    const input: DeleteObjectCommandInput = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(input);
    await this.s3Client.send(command);
  }
}
