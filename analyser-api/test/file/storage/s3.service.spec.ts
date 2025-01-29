import { Test, TestingModule } from '@nestjs/testing';
import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';

import { S3Service } from '@file/storage/s3.service';
import { S3ConfigService } from '@configs/s3';

//errors
import { ServiceError } from '@common/errors';

// types
import { FileType } from '@common/types';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn(),
}));

describe('S3Service', () => {
  let service: S3Service;
  const s3ClientMock = {
    send: jest.fn(),
  };
  const configMock = {
    region: 'us-east-1',
    defaultBucketName: 'test-bucket',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        { provide: S3ConfigService, useValue: configMock },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
    (service as any).s3Client = s3ClientMock; // injecting mock S3Client
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getObject', () => {
    it('should return a readable stream when an object is found', async () => {
      const mockStream = new Readable();
      s3ClientMock.send.mockResolvedValueOnce({ Body: mockStream });

      const result = await service.getObject('test-key');

      expect(s3ClientMock.send).toHaveBeenCalledWith(
        expect.any(GetObjectCommand),
      );
      expect(result).toBe(mockStream);
    });

    it('should throw ServiceError when S3 does not return a file body', async () => {
      s3ClientMock.send.mockResolvedValueOnce({ Body: undefined });

      await expect(service.getObject('test-key')).rejects.toThrow(
        new ServiceError('S3 response did not return a file body.'),
      );

      expect(s3ClientMock.send).toHaveBeenCalledWith(
        expect.any(GetObjectCommand),
      );
    });

    it('should log and throw ServiceError when S3 call fails', async () => {
      s3ClientMock.send.mockRejectedValueOnce(new Error('S3 error occurred'));

      await expect(service.getObject('test-key')).rejects.toThrow(
        new ServiceError('S3 error occurred'),
      );

      expect(s3ClientMock.send).toHaveBeenCalledWith(
        expect.any(GetObjectCommand),
      );
    });
  });

  describe('getPresignedPostUrl', () => {
    it('should return a signed URL and object key', async () => {
      const mockSignedUrl =
        'https://s3.amazonaws.com/test-bucket/test-file.csv';
      const fileType: FileType = 'csv';
      const generateObjectUUID = 'af7c1fe6-d669-414e-b066-e9733f0de7a8';

      (getSignedUrl as jest.Mock).mockResolvedValueOnce(mockSignedUrl);
      (randomUUID as jest.Mock).mockReturnValue(generateObjectUUID);

      const result = await service.getPresignedPostUrl({ fileType });

      expect(getSignedUrl).toHaveBeenCalledWith(
        s3ClientMock,
        expect.any(PutObjectCommand),
        { expiresIn: 120 },
      );
      expect(result).toEqual({
        signedUrl: mockSignedUrl,
        objectKey: `test-bucket/${generateObjectUUID}.csv`,
      });
    });

    it('should throw ServiceError for unsupported file types', async () => {
      await expect(
        service.getPresignedPostUrl({ fileType: 'unsupported' as FileType }),
      ).rejects.toThrow(new ServiceError('Unsupported file type: unsupported'));
    });
  });

  describe('removeObject', () => {
    it('should send a DeleteObjectCommand to S3', async () => {
      s3ClientMock.send.mockResolvedValueOnce({});

      await service.removeObject('test-key');

      expect(s3ClientMock.send).toHaveBeenCalledWith(
        expect.any(DeleteObjectCommand),
      );
    });

    it('should throw ServiceError if S3 call fails', async () => {
      s3ClientMock.send.mockRejectedValueOnce(new Error('Delete failed'));

      await expect(service.removeObject('test-key')).rejects.toThrow(
        new ServiceError('Delete failed'),
      );

      expect(s3ClientMock.send).toHaveBeenCalledWith(
        expect.any(DeleteObjectCommand),
      );
    });
  });
});
