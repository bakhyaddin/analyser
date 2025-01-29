import { Test, TestingModule } from '@nestjs/testing';
import { Readable } from 'stream';

import { FileService } from '@file/file.service';
import { FileRepository } from '@file/file.repository';
import { FileStorage } from '@file/storage/file-storage';

// errors
import { ServiceError } from '@common/errors';

describe('FileService', () => {
  let service: FileService;
  const repository = {
    save: jest.fn(),
  };
  const storageService = {
    getObject: jest.fn(),
    getPresignedPostUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        { provide: FileRepository, useValue: repository },
        { provide: FileStorage, useValue: storageService },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should fetch the object and save file metadata', async () => {
      const objectId = 'test-object-id';
      storageService.getObject.mockResolvedValueOnce(Buffer.from('data'));
      repository.save.mockResolvedValueOnce({ objectId });

      const result = await service.create(objectId);

      expect(storageService.getObject).toHaveBeenCalledWith(objectId);
      expect(repository.save).toHaveBeenCalledWith({ objectId });
      expect(result).toEqual({ objectId });
    });
  });

  xdescribe('getCsvFileObject', () => {
    it('should parse a CSV file and return its contents', async () => {
      const objectId = 'test-object-id';
      const readableStream = new Readable({
        read() {
          this.push('name,age\nJohn,30\nJane,25\n');
          this.push(null);
        },
      });

      storageService.getObject.mockResolvedValueOnce(readableStream);

      const result = await service.getCsvFileObject(objectId);

      expect(storageService.getObject).toHaveBeenCalledWith(objectId);
      expect(result).toEqual([
        { name: 'John', age: '30' },
        { name: 'Jane', age: '25' },
      ]);
    });

    it('should handle CSV parsing errors', async () => {
      const objectId = 'test-object-id';

      // Create a readable stream
      const readableStream = new Readable({
        read() {
          // Simulate async error emission
          process.nextTick(() => {
            this.emit('error', new Error('CSV parsing failed'));
          });
        },
      });

      storageService.getObject.mockResolvedValueOnce(readableStream);

      await expect(service.getCsvFileObject(objectId)).rejects.toThrow(
        ServiceError,
      );

      expect(storageService.getObject).toHaveBeenCalledWith(objectId);
    });
  });

  describe('generateUploadUrl', () => {
    it('should return a presigned upload URL', async () => {
      const mockUrl = 'https://example.com/upload';
      storageService.getPresignedPostUrl.mockReturnValueOnce(mockUrl);

      const result = service.generateUploadUrl();

      expect(storageService.getPresignedPostUrl).toHaveBeenCalledWith({
        fileType: 'csv',
      });
      expect(result).toBe(mockUrl);
    });
  });
});
